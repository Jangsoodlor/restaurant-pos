class EntityNotFoundError(Exception):
    """Raised when a requested entity is not found in the database."""

    def __init__(self, entity_name: str, entity_id: int | None = None):
        self.entity_name = entity_name
        self.entity_id = entity_id

        if entity_id:
            self.message = f"{entity_name} with ID {entity_id} not found."
        else:
            self.message = f"{entity_name} not found."

        super().__init__(self.message)
