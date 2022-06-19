# aka orderService
from abc import ABC, abstractmethod
import dto
import provider


class BaseDeliveryService(ABC):
    _provider: provider.AbstractDeliveryProvider

    @abstractmethod
    def create_delivery(self, address: str, delivery_service_id: int) -> int:
        pass

    @abstractmethod
    def get_delivery_services(self) -> list[dto.DeliveryService]:
        pass


class BaseSeller(ABC):
    _seller: provider.AbstractOrderProvider
    _client_provider: provider.AbstractClientProvider

    def __init__(self, ds: BaseDeliveryService):
        self._ds = ds

    @abstractmethod
    def _save_order(self, items: list[dto.CreateOrderItemDto], delivery_id: int, client_id: int):
        pass

    def create_order(self, address, delivery_service_id: int, items: list[dto.CreateOrderItemDto], client_id: int):
        delivery_id = self._ds.create_delivery(address, delivery_service_id)
        self._save_order(items, delivery_id, client_id)
        self._client_provider.update_client_loyality_level(client_id)

    @abstractmethod
    def get_categories(self) -> list[dto.Filter]:
        pass

    @abstractmethod
    def get_products(self):
        pass


class DeliveryService(BaseDeliveryService):
    def get_delivery_services(self) -> list[dto.DeliveryService]:
        return self._provider.get_services()

    def create_delivery(self, address: str, delivery_service_id: int) -> int:
        return self._provider.save_delivery(delivery_service_id, address)

    def __init__(self):
        self._provider = provider.SqliteDataProvider.get_provider()


class Seller(BaseSeller):
    def get_categories(self) -> list[dto.Filter]:
        return self._seller.get_categories()

    def _save_order(self, items: list[dto.CreateOrderItemDto], delivery_id: int, client_id: int):
        self._seller.save_order(items, delivery_id, client_id)

    def __init__(self):
        super().__init__(DeliveryService())
        self._seller = provider.SqliteDataProvider.get_provider()
        self._client_provider = provider.SqliteDataProvider.get_provider()

    def get_products(self):
        return self._seller.get_products()
