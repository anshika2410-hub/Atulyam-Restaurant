from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.models.menu import MenuCategory, MenuItem
from app.schemas.menu import (
    CategoryCreate,
    CategoryUpdate,
    MenuItemCreate,
    MenuItemUpdate,
)


# --- Category CRUD ---
def get_categories(db: Session, active_only: bool = True) -> List[MenuCategory]:
    query = db.query(MenuCategory)
    if active_only:
        query = query.filter(MenuCategory.is_active == True)
    return query.order_by(MenuCategory.display_order.asc(), MenuCategory.id.asc()).all()


def get_category_by_id(db: Session, category_id: int) -> Optional[MenuCategory]:
    return db.query(MenuCategory).filter(MenuCategory.id == category_id).first()


def get_category_by_slug(db: Session, slug: str) -> Optional[MenuCategory]:
    return db.query(MenuCategory).filter(MenuCategory.slug == slug).first()


def create_category(db: Session, cat_in: CategoryCreate) -> MenuCategory:
    category = MenuCategory(**cat_in.model_dump())
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


def update_category(db: Session, category: MenuCategory, cat_in: CategoryUpdate) -> MenuCategory:
    data = cat_in.model_dump(exclude_unset=True)
    for field, val in data.items():
        setattr(category, field, val)
    db.commit()
    db.refresh(category)
    return category


def delete_category(db: Session, category_id: int) -> bool:
    category = get_category_by_id(db, category_id)
    if not category:
        return False
    db.delete(category)
    db.commit()
    return True


# --- MenuItem CRUD ---
def get_menu_items(
    db: Session,
    category_id: Optional[int] = None,
    is_veg: Optional[bool] = None,
    is_featured: Optional[bool] = None,
    available_only: bool = True,
    search: Optional[str] = None
) -> List[MenuItem]:
    query = db.query(MenuItem)
    if available_only:
        query = query.filter(MenuItem.is_available == True)
    if category_id is not None:
        query = query.filter(MenuItem.category_id == category_id)
    if is_veg is not None:
        query = query.filter(MenuItem.is_veg == is_veg)
    if is_featured is not None:
        query = query.filter(MenuItem.is_featured == is_featured)
    if search:
        search_pattern = f"%{search.strip()}%"
        query = query.filter(
            or_(
                MenuItem.name.ilike(search_pattern),
                MenuItem.description.ilike(search_pattern)
            )
        )
    return query.order_by(MenuItem.id.asc()).all()


def get_menu_item_by_id(db: Session, item_id: int) -> Optional[MenuItem]:
    return db.query(MenuItem).filter(MenuItem.id == item_id).first()


def create_menu_item(db: Session, item_in: MenuItemCreate) -> MenuItem:
    item = MenuItem(**item_in.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def update_menu_item(db: Session, item: MenuItem, item_in: MenuItemUpdate) -> MenuItem:
    data = item_in.model_dump(exclude_unset=True)
    for field, val in data.items():
        setattr(item, field, val)
    db.commit()
    db.refresh(item)
    return item


def delete_menu_item(db: Session, item_id: int) -> bool:
    item = get_menu_item_by_id(db, item_id)
    if not item:
        return False
    db.delete(item)
    db.commit()
    return True
