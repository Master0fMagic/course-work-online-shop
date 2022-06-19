from abc import ABC, abstractmethod
from dto import Client
import provider
import error


class AbstractClientService(ABC):
    _provider: provider.AbstractClientProvider

    @abstractmethod
    def login(self, login: str, password: str) -> Client:
        """
        :param login: client`s email or phone number
        :param password: client`s password
        :return: client dto if client exists, else raise an error:
            UseNotFoundException if user with such login not exists
            WrongPasswordException if password incorrect
        """
        pass

    @abstractmethod
    def register_new_user(self, first_name: str, last_name: str, email: str, phone: str, password: str) -> Client:
        pass

    @abstractmethod
    def get_user_by_id(self, user_id):
        pass


class ClientService(AbstractClientService):
    def get_user_by_id(self, user_id) -> Client:
        return self._provider.get_client(user_id)

    def login(self, login: str, password: str) -> Client:
        if not self._provider.is_login_exist(login):
            raise error.UseNotFoundException(f'User <{login}> not exists')
        if not self._provider.check_password(login, password):
            raise error.WrongPasswordException()
        return self._provider.get_client(login)

    def register_new_user(self, firstname: str, lastname: str, phone: str, password: str, email='') -> Client:
        if firstname == '' \
                or lastname == '' \
                or phone == '' \
                or password == '':
            raise ValueError('Expected all fields not to be empty')
        return self._provider.register_new_user(firstname, lastname, phone, password, email)

    def __init__(self):
        self._provider = provider.SqliteDataProvider.get_provider()
