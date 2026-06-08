from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


from resumeiq_api.models.user import User  # noqa: E402,F401
