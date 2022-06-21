CREATE TABLE deliveryservice(
id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
name TEXT NOT NULL,
price DOUBLE NOT NULL
);


CREATE TABLE productcategoty(
id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
name TEXT NOT NULL
);

CREATE TABLE loyality(
id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
discount DOUBLE NOT NULL,
requiredsum DOUBLE NOT NULL
);


CREATE TABLE product(
id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
description TEXT,
name TEXT NOT NULL,
price DOUBLE NOT NULL,
category INTEGER NOT NULL,
FOREIGN KEY(category) references productcategoty(id)
);

CREATE TABLE client(
id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
password TEXT NOT NULL,
firstname TEXT NOT NULL,
lastname TEXT NOT NULL,
email TEXT NOT NULL,
phone TEXT NOT NULL,
loyalitylevel INTEGER NOT NULL,
FOREIGN KEY(loyalitylevel) REFERENCES loyality(id)
);

CREATE TABLE delivery(
id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
serviceid INTEGER NOT NULL,
deliveryaddress TEXT NOT NULL,
FOREIGN KEY (serviceid) REFERENCES deliveryservice(id)
);


CREATE TABLE "order"(
id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
createtime INSUGNED BIG INT NOT NULL,
clientid INTEGER NOT NULL,
deliveryid INTEGER NOT NULL,
discount DOUBLE NOT NULL,
FOREIGN KEY(clientid) REFERENCES client(id),
FOREIGN KEY(deliveryid) REFERENCES delivery(id)
);


CREATE TABLE orderitem(
id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
productid INTEGER NOT NULL,
amount INTEGER NOT NULL,
orderid INTEGER NOT NULL,
FOREIGN KEY(productid) REFERENCES product(id),
FOREIGN KEY(orderid) REFERENCES "order"(id)
);


INSERT INTO deliveryservice(name, price) values
('GLOVO', '45' ),
('ROCKET', '35'),
('UBER FOOD', '40');

INSERT INTO productcategoty(name) VALUES
('Смартфони'),
("Ноутбуки"),
('Навушники'),
('Аксесуари для смартфонів');

INSERT INTO loyality(discount,requiredsum) VALUES
(0, 0),
(0.01, 50000),
(0.05, 150000),
(0.07, 200000),
(0.1, 300000);

INSERT INTO product(description,name , price , category ) VALUES
('256gb', 'Apple Iphone 13',34999 , 1),
('m1Pro 8/512', 'Apple MackBook Air 2022', 45999 ,  2),
('', 'Apple AirPods Pro',7899, 3),
('1m', 'Кабель TypeC-TypeC', 450  , 4),
('12/256', 'Google Pixel 6 Pro', 38999  , 1),
('i7, 8/256; 13"', 'Asus Vivo Book 3', 19999  , 2),
('', 'Xiaomi Redmi AirDots Pro', 1899, 3);

INSERT INTO client(firstname, lastname, email, phone, loyalitylevel, password) VALUES
('test1', 'test1', 'test1@gmail.com', '38000000001', 1, 123123),
('test2', 'test2', 'test2@gmail.com', '38000000002', 1, 123123);


