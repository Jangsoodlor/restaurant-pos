from abc import ABC
from enum import Enum


class EventType(Enum):
    ORDER_CLOSED = "order_closed"


class EventObserver(ABC):
    def on_event(self, event_type: EventType):
        """This function will trigger when there's an incoming event."""
        raise NotImplementedError


class EventHandler:
    def __init__(self, *args: EventObserver):
        self.__observers = list(args)

    def subscribe(self, *args: EventObserver):
        self.__observers.extend(*args)

    def unsubscribe(self, observer: EventObserver):
        self.__observers.remove(observer)

    def notify(self, event: EventType):
        for observer in self.__observers:
            observer.on_event(event)
