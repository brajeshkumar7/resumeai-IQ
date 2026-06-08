from pydantic import BaseModel


class DependencyStatus(BaseModel):
    name: str
    status: str
    message: str
