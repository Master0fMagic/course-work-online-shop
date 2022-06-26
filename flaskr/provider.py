from abc import ABC, abstractmethod
import dto
import sqlite3
import converter
import time


class SqliteDatabaseProvider:
    def execute_select(self, query: str):
        connection = sqlite3.connect('./shop.db')
        cursor = connection.cursor()
        cursor.execute(query)
        records = cursor.fetchall()
        cursor.close()
        connection.close()
        return records

    def execute_update(self, query):
        connection = sqlite3.connect('./shop.db')
        cursor = connection.cursor()
        cursor.execute(query)
        res = cursor.fetchall()
        connection.commit()
        cursor.close()
        connection.close()
        return res


class AbstractClientProvider(ABC):
    @abstractmethod
    def is_login_exist(self, login: str) -> bool:
        pass

    @abstractmethod
    def check_password(self, login: str, password: str) -> bool:
        pass

    @abstractmethod
    def get_client(self, login: str) -> dto.Client:
        pass

    @abstractmethod
    def register_new_user(self, firstname: str, lastname: str, phone_number: str, password: str, email: str):
        pass

    @abstractmethod
    def get_client_discount(self, client_id):
        pass

    @abstractmethod
    def update_client_loyality_level(self, client_id):
        pass


class AbstractDeliveryProvider(ABC):
    @abstractmethod
    def save_delivery(self, service_id, address) -> int:
        pass

    @abstractmethod
    def get_services(self):
        pass


class AbstractOrderProvider(ABC):
    @abstractmethod
    def save_order(self, items: list[dto.CreateOrderItemDto], delivery_id: int, client_id: int):
        pass

    @abstractmethod
    def get_categories(self):
        pass

    @abstractmethod
    def get_products(self):
        pass

    @abstractmethod
    def get_client_orders(self, client_id: int) -> list[dto.Order]:
        pass

    @abstractmethod
    def get_products_by_order(self, order_id) -> list[dto.OrderProductInfo]:
        pass


class SqliteDataProvider(AbstractClientProvider, AbstractDeliveryProvider, AbstractOrderProvider):
    _provider = None

    def __init__(self):
        self._db = SqliteDatabaseProvider()

    def return_list(self, sql: str, c: converter.AbstractConverter):
        return [c.convert(data=item) for item in self._db.execute_select(sql)]

    @classmethod
    def get_provider(cls):
        if not cls._provider:
            cls._provider = SqliteDataProvider()
        return cls._provider

    #   region ClientService
    def update_client_loyality_level(self, client_id):
        sql = f'''SELECT l.id
from loyality l
where l.requiredsum < (
SELECT sum(ord.ordsum - ord.ordsum*ord.discount)
FROM (SELECT SUM(o2.amount * p.price) as ordsum, o.discount 
from "order" o 
join orderitem o2 ON o2.orderid = o.id 
join product p on p.id  = o2.productid 
where o.clientid = {client_id}
group by o.id) as ord
)
order by l.requiredsum DESC 
limit 1;'''

        new_level = int(self._db.execute_select(sql)[0][0])

        sql = f'''SELECT c.loyalitylevel 
from client c 
where c.id = {client_id}'''

        current_level = int(self._db.execute_select(sql)[0][0])

        if current_level != new_level:
            sql = f'update client set loyalitylevel =   {new_level} where id = {client_id}'
            self._db.execute_update(sql)

    def is_login_exist(self, login: str) -> bool:
        sql = f'''
        SELECT EXISTS (
	SELECT c.id
	from client c 
	where c.email = '{login}'
		or c.phone = '{login}'
);
        '''
        res = self._db.execute_select(sql)
        return bool(int(res[0][0]))

    def check_password(self, login: str, password: str) -> bool:
        sql = f'''SELECT c.password = '{password}'
FROM client c 
WHERE c.email = '{login}' or c.phone = '{login}';
'''
        res = self._db.execute_select(sql)
        return bool(int(res[0][0]))

    def get_client(self, login: str) -> dto.Client:
        sql = f'''
        SELECT c.id , c.firstname , c.lastname , c.email, c.phone , c.password 
from client c 
where c.email = '{login}' or c.phone = '{login}' or c.id = '{login}';
'''
        return converter.DbResponseToClientConverter().convert(data=self._db.execute_select(sql)[0])

    def register_new_user(self, firstname: str, lastname: str, phone_number: str, password: str,
                          email: str) -> dto.Client:
        sql = f'''
        INSERT INTO client (firstname, lastname, email, phone, password, loyalitylevel) VALUES
("{firstname}", "{lastname}", "{email}", "{phone_number}", "{password}", 1)
        '''
        self._db.execute_update(sql)
        return self.get_client(email)

    def get_client_discount(self, client_id):
        sql = f'''SELECT l.discount 
from client c 
join loyality l on l.id  = c.loyalitylevel 
where c.id = {client_id};'''

        return float(self._db.execute_select(sql)[0][0])

    #    endregion

    #   region DeliveryService
    def save_delivery(self, service_id, address) -> int:
        sql = f'''INSERT INTO delivery(serviceid, deliveryaddress)
VALUES ({service_id}, '{address}') returning id'''

        return int(self._db.execute_update(sql)[0][0])

    def get_services(self):
        sql = 'select * from deliveryservice'

        return self.return_list(sql, converter.DbResponseToDeliveryServiceConverter())

    #   endregion

    #   region OrderService
    def save_order(self, items: list[dto.CreateOrderItemDto], delivery_id: int, client_id: int):
        discount = self.get_client_discount(client_id)
        sql = f'''INSERT into "order"(createtime, clientid, deliveryid, discount)
VALUES ({int(time.time())}, {client_id}, {delivery_id}, {discount}) returning id'''

        order_id = int(self._db.execute_update(sql)[0][0])
        sql = f'''
        INSERT INTO orderitem (orderid, productid, amount) VALUES
        {', '.join([f'({order_id},{item.product_id},{item.amount})' for item in items])};
        '''

        self._db.execute_update(sql)

    def get_categories(self):
        sql = 'select * from productcategoty'
        return self.return_list(sql, converter.DbResponseToFilerConverter())

    def get_products(self):
        sql = '''SELECT p.id , p.name, p.description, p.price, p2.id , p2.name 
from product p 
join productcategoty p2 on p2.id  = p.category '''

        return self.return_list(sql, converter.DbResponseToProductConverter())

    def get_client_orders(self, client_id: int) -> list[dto.Order]:
        sql = f'''SELECT o.id , o.createtime , sum(p.price * o2.amount), o.discount, 
        sum(p.price * o2.amount) * (1 - o.discount), d.deliveryaddress,d2.name, d2.price, 
sum(p.price * o2.amount) * (1 - o.discount) + d2.price 
from "order" o 
join orderitem o2 on o2.orderid = o.id 
join product p on p.id = o2.productid 
join delivery d on d.id = o.deliveryid 
join deliveryservice d2 on d2.id = d.serviceid 
where o.clientid = {client_id}
group by o.id '''

        return self.return_list(sql, converter.DbResponseToOrderConverter())

    def get_products_by_order(self, order_id) -> list[dto.OrderProductInfo]:
        sql = f'''SELECT p.name, p2.name, p.description, p.price, o.amount 
from product p 
join productcategoty p2 on p2.id  = p.id
join orderitem o on o.productid = p.category 
where o.orderid = {order_id};'''

        return self.return_list(sql, converter.DbResponseToOrderProductInfoConverter())

    #   endregion
