import os
from uuid import UUID
from typing import List

from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException, Header, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_

from .database import Base, engine, get_db
from . import models, schemas
from .nyt_client import fetch_most_viewed, ping_nyt

load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI(title="NYT Clone API")

origins = [o.strip() for o in (os.getenv("ALLOWED_ORIGINS") or "").split(",") if o.strip()]
if not origins:
    origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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
    if not x_user or not x_user.strip():
        raise HTTPException(status_code=400, detail="Username required")
    return x_user.strip()

@app.get("/health")
async def health(db: Session = Depends(get_db)):
    nyt_ok = await ping_nyt()
    try:
        db.execute("SELECT 1")
        db_ok = True
    except Exception:
        db_ok = False

    return {
        "status": "ok",
        "db_ok": db_ok,
        "external_apis": {"nyt_mostpopular": nyt_ok},
    }

@app.get("/articles", response_model=List[schemas.ArticleOut])
def list_articles(page: int = 1, page_size: int = 6, search: str = "", db: Session = Depends(get_db)):
    if page < 1:
        page = 1
    offset = (page - 1) * page_size

    query = db.query(models.Article).options(joinedload(models.Article.author))
    if search:
        query = query.join(models.User).filter(
            or_(
                models.Article.title.ilike(f"%{search}%"),
                models.User.username.ilike(f"%{search}%"),
            )
        )

    return (
        query.order_by(models.Article.published_at.desc())
        .offset(offset)
        .limit(page_size)
        .all()
    )

@app.get("/articles/{article_id}", response_model=schemas.ArticleOut)
def get_article(article_id: UUID, db: Session = Depends(get_db)):
    article = db.query(models.Article).get(article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article

@app.post("/articles", response_model=schemas.ArticleOut, status_code=201)
def create_article(payload: schemas.ArticleCreate, db: Session = Depends(get_db), username: str = Depends(get_current_username)):
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
def update_article(article_id: UUID, payload: schemas.ArticleUpdate, db: Session = Depends(get_db), username: str = Depends(get_current_username)):
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
def delete_article(article_id: UUID, db: Session = Depends(get_db), username: str = Depends(get_current_username)):
    article = db.query(models.Article).get(article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")

    user = get_or_create_user(username, db)
    if article.created_by != user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    db.delete(article)
    db.commit()
    return

@app.get("/trending/nyt")
async def trending_nyt(period: int = Query(7, ge=1, le=30)):
    items = await fetch_most_viewed(period=period)
    return {"source": "nytimes", "period": period, "items": items[:5]}
