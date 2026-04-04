from enum import Enum


class OrderStatus(Enum):
    DRAFT = "draft"
    IN_PROGRESS = "in_progress"
    AWAITING_PAYMENT = "awaiting_payment"
    ON_HOLD = "on_hold"

    # terminal states
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    VOIDED = "voided"
    REFUNDED = "refunded"

    @property
    def is_terminal(self):
        return self in (
            OrderStatus.COMPLETED,
            OrderStatus.CANCELLED,
            OrderStatus.VOIDED,
            OrderStatus.REFUNDED,
        )
