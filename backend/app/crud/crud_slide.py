from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.slide import HomeSlide
from app.schemas.slide import HomeSlideCreate, HomeSlideUpdate


def get_home_slides(db: Session, active_only: bool = True) -> List[HomeSlide]:
    query = db.query(HomeSlide)
    if active_only:
        query = query.filter(HomeSlide.is_active == True)
    return query.order_by(HomeSlide.display_order.asc(), HomeSlide.id.asc()).all()


def get_slide_by_id(db: Session, slide_id: int) -> Optional[HomeSlide]:
    return db.query(HomeSlide).filter(HomeSlide.id == slide_id).first()


def create_slide(db: Session, slide_in: HomeSlideCreate) -> HomeSlide:
    slide = HomeSlide(**slide_in.model_dump())
    db.add(slide)
    db.commit()
    db.refresh(slide)
    return slide


def update_slide(db: Session, slide: HomeSlide, slide_in: HomeSlideUpdate) -> HomeSlide:
    data = slide_in.model_dump(exclude_unset=True)
    for field, val in data.items():
        setattr(slide, field, val)
    db.commit()
    db.refresh(slide)
    return slide


def delete_slide(db: Session, slide_id: int) -> bool:
    slide = get_slide_by_id(db, slide_id)
    if not slide:
        return False
    db.delete(slide)
    db.commit()
    return True
