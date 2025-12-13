from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
import os

from .database import Base, engine, get_db
from . import models, schemas
from .twitter_client import get_trends_for_location

Base.metadata.create_all(bind=engine)

app = FastAPI(title="NYT Clone API")

origins = (os.getenv("ALLOWED_ORIGINS") or "").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in origins if o.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_or_create_user(username: str, db: Session) -> models.User:
  user = db.query(models.User).filter(models.User.username == username).first()
  if user:
      return user
  user = models.User(username=username)
  db.add(user)
  db.commit()
  db.refresh(user)
  return user

def get_current_username(x_user: str = Header(..., alias="X-Current-User")):
    return x_user

@app.get("/health")
def health(db: Session = Depends(get_db)):
    external_ok = False
    try:
        get_trends_for_location(woeid=23424900)
        external_ok = True
    except Exception:
        external_ok = False

    try:
        db.execute("SELECT 1")
        db_ok = True
    except Exception:
        db_ok = False

    return {
        "status": "ok",
        "db_ok": db_ok,
        "external_api_ok": external_ok,
    }

@app.get("/articles", response_model=List[schemas.ArticleOut])
def list_articles(
    page: int = 1,
    page_size: int = 10,
    db: Session = Depends(get_db),
):
    if page < 1:
        page = 1
    offset = (page - 1) * page_size

    articles = (
        db.query(models.Article)
        .order_by(models.Article.published_at.desc())
        .offset(offset)
        .limit(page_size)
        .all()
    )
    return articles

@app.get("/articles/{article_id}", response_model=schemas.ArticleOut)
def get_article(article_id: UUID, db: Session = Depends(get_db)):
    article = db.query(models.Article).get(article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article

@app.post("/articles", response_model=schemas.ArticleOut, status_code=201)
def create_article(
    payload: schemas.ArticleCreate,
    db: Session = Depends(get_db),
    username: str = Depends(get_current_username),
):
    user = get_or_create_user(username, db)
    article = models.Article(
        title=payload.title,
        image_url=str(payload.image_url) if payload.image_url else None,
        published_at=payload.published_at,
        body=payload.body,
        created_by=user.id,
    )
    db.add(article)
    db.commit()
    db.refresh(article)
    return article

@app.patch("/articles/{article_id}", response_model=schemas.ArticleOut)
def update_article(
    article_id: UUID,
    payload: schemas.ArticleUpdate,
    db: Session = Depends(get_db),
    username: str = Depends(get_current_username),
):
    article = db.query(models.Article).get(article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")

    user = get_or_create_user(username, db)
    if article.created_by != user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    for field, value in payload.dict(exclude_unset=True).items():
        setattr(article, field, value)

    db.commit()
    db.refresh(article)
    return article

@app.delete("/articles/{article_id}", status_code=204)
def delete_article(
    article_id: UUID,
    db: Session = Depends(get_db),
    username: str = Depends(get_current_username),
):
    article = db.query(models.Article).get(article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")

    user = get_or_create_user(username, db)
    if article.created_by != user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    db.delete(article)
    db.commit()
    return

@app.get("/trending")
def trending(woeid: int = 23424900):
    return get_trends_for_location(woeid)
