from flask_login import UserMixin


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
