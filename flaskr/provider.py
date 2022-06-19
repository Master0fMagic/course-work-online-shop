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


class SqliteDataProvider(AbstractClientProvider):
    _provider = None

    def __init__(self):
        self._db = SqliteDatabaseProvider()

    @classmethod
    def get_provider(cls) -> AbstractClientProvider:
        if not cls._provider:
            cls._provider = SqliteDataProvider()
        return cls._provider

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
        pass
