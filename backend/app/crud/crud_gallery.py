from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.gallery import Gallery
from app.schemas.gallery import GalleryCreate, GalleryUpdate


def get_gallery_items(db: Session, category: Optional[str] = None) -> List[Gallery]:
    query = db.query(Gallery)
    if category and category.lower() != "all":
        query = query.filter(Gallery.category.ilike(category))
    return query.order_by(Gallery.display_order.asc(), Gallery.id.desc()).all()


def get_gallery_by_id(db: Session, item_id: int) -> Optional[Gallery]:
    return db.query(Gallery).filter(Gallery.id == item_id).first()


def create_gallery_item(db: Session, gal_in: GalleryCreate) -> Gallery:
    item = Gallery(**gal_in.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def update_gallery_item(db: Session, item: Gallery, gal_in: GalleryUpdate) -> Gallery:
    data = gal_in.model_dump(exclude_unset=True)
    for field, val in data.items():
        setattr(item, field, val)
    db.commit()
    db.refresh(item)
    return item


def delete_gallery_item(db: Session, item_id: int) -> bool:
    item = get_gallery_by_id(db, item_id)
    if not item:
        return False
    db.delete(item)
    db.commit()
    return True
