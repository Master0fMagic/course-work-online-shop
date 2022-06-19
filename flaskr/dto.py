from flask_login import UserMixin
from dataclasses import dataclass


class Client(UserMixin):
    def __init__(self, client_id=-1, firstname="", lastname="", email="", phone_number="", password=""):
        self._firstname = firstname
        self._lastname = lastname
        self._password = password
        self._email = email
        self._phone_number = phone_number
        self._id = client_id

    @property
    def firstname(self) -> str:
        return self._firstname

    @property
    def id(self) -> int:
        return self._id

    @property
    def lastname(self) -> str:
        return self._lastname

    @property
    def password(self) -> str:
        return self._password

    @property
    def email(self) -> str:
        return self._email

    @property
    def phone_number(self) -> str:
        return self._phone_number


class CreateOrderItemDto:
    def __init__(self, product_id=-1, amount=-1):
        self.product_id = product_id
        self.amount = amount


@dataclass()
class DeliveryService:
    id: int
    name: str
    price: float

    def to_dict(self):
        return self.__dict__


@dataclass()
class Filter:
    id: int
    name: str

    def to_dict(self):
        return self.__dict__


@dataclass()
class Product:
    id: int
    name: str
    description: str
    price: float
    category_id: int
    category: str

    def to_dict(self):
        return self.__dict__
