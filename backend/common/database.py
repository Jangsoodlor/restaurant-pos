import time
from sqlmodel import Session, SQLModel, create_engine
from sqlalchemy.exc import OperationalError
from ..config import get_settings
from typing import Annotated
from fastapi import Depends

engine = create_engine(get_settings().database_url)


def create_db_and_tables():
    retries = 5
    while retries > 0:
        try:
            SQLModel.metadata.create_all(engine)
            print("Successfully connected to the database and created tables!")
            break
        except OperationalError as e:
            retries -= 1
            print(
                f"Database unavailable, waiting 3 seconds... ({retries} retries left)"
            )
            time.sleep(3)
            if retries == 0:
                raise e


def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]


# if __name__ == "__main__":
#     create_db_and_tables()
#     hero_1 = Hero(name="Deadpond", secret_name="Dive Wilson")
#     hero_2 = Hero(name="Spider-Boy", secret_name="Pedro Parqueador")
#     hero_3 = Hero(name="Rusty-Man", secret_name="Tommy Sharp", age=48)

#     with Session(engine) as session:
#         session.add(hero_1)
#         session.add(hero_2)
#         session.add(hero_3)
#         session.commit()

#     with Session(engine) as session:
#         statement = select(Hero).where(Hero.name == "Spider-Boy")
#         hero = session.exec(statement).first()
#         print(hero)
