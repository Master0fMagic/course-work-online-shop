from abc import ABC, abstractmethod
import dto


class AbstractConverter(ABC):
    @abstractmethod
    def convert(self, **kwargs):
        pass


class DbResponseToClientConverter(AbstractConverter):

    def convert(self, **kwargs):
        """
        kwargs:
            data: list|set|tuple with db result
        """

        if 'data' not in kwargs:
            raise KeyError('"data" is not present in kwargs')

        return dto.Client(*kwargs['data'])


class DbResponseToDeliveryServiceConverter(AbstractConverter):

    def convert(self, **kwargs):
        """
        kwargs:
            data: list|set|tuple with db result
        """

        if 'data' not in kwargs:
            raise KeyError('"data" is not present in kwargs')

        return dto.DeliveryService(*kwargs['data'])
