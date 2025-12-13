from datetime import datetime
from pydantic import BaseModel, HttpUrl
from typing import Optional
from uuid import UUID

class ArticleBase(BaseModel):
    title: str
    image_url: Optional[HttpUrl] = None
    published_at: datetime
    body: str

class ArticleCreate(ArticleBase):
    pass

class ArticleUpdate(BaseModel):
    title: Optional[str] = None
    image_url: Optional[HttpUrl] = None
    published_at: Optional[datetime] = None
    body: Optional[str] = None

class ArticleOut(ArticleBase):
    id: UUID
    created_by: UUID
    created_at: datetime

    class Config:
        orm_mode = True
