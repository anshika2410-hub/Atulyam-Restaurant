import logging
from datetime import datetime, timedelta
from app.db.database import engine, SessionLocal, Base
from app.core.security import get_password_hash
from app.models import (
    Admin,
    MenuCategory,
    MenuItem,
    Offer,
    Catering,
    Gallery,
    HomeSlide,
    Order,
    OrderItem,
)

logger = logging.getLogger("atulyam.seed")
logging.basicConfig(level=logging.INFO)


def init_and_seed_db():
    logger.info("Ensuring database tables are created...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # 1. Seed Admin
        admin_user = db.query(Admin).filter(Admin.username == "admin").first()
        if not admin_user:
            logger.info("Seeding default administrator account...")
            admin_user = Admin(
                username="admin",
                email="anshikaagrawal2410@gmail.com",
                hashed_password=get_password_hash("Admin@123"),
                role="superadmin",
                is_active=True
            )
            db.add(admin_user)
            db.commit()

        # 2. Seed Categories
        categories_data = [
            {
                "name": "Starters & Kebabs",
                "slug": "starters-kebabs",
                "description": "Succulent tandoor-roasted delicacies and royal street appetisers.",
                "display_order": 1
            },
            {
                "name": "Royal Curries",
                "slug": "royal-curries",
                "description": "Slow-simmered rich gravies prepared with authentic heritage spices.",
                "display_order": 2
            },
            {
                "name": "Dum Biryani & Rice",
                "slug": "dum-biryani-rice",
                "description": "Fragrant basmati rice slow-cooked in traditional sealed clay handis.",
                "display_order": 3
            },
            {
                "name": "Artisanal Breads",
                "slug": "artisanal-breads",
                "description": "Freshly baked Indian flatbreads from our traditional clay tandoor ovens.",
                "display_order": 4
            },
            {
                "name": "Heritage Desserts",
                "slug": "heritage-desserts",
                "description": "Decadent handcrafted sweets celebrating centuries of Indian confectionery.",
                "display_order": 5
            },
            {
                "name": "Signature Beverages",
                "slug": "beverages",
                "description": "Refreshing artisanal coolers, herbal mocktails, and traditional sherbets.",
                "display_order": 6
            },
        ]

        cat_map = {}
        for cat_info in categories_data:
            existing = db.query(MenuCategory).filter(MenuCategory.slug == cat_info["slug"]).first()
            if not existing:
                cat = MenuCategory(**cat_info, is_active=True)
                db.add(cat)
                db.commit()
                db.refresh(cat)
                cat_map[cat.slug] = cat.id
            else:
                cat_map[existing.slug] = existing.id

        # 3. Seed Menu Items
        if db.query(MenuItem).count() == 0:
            logger.info("Seeding curated culinary menu items...")
            menu_items_data = [
                # Starters
                {
                    "category_id": cat_map["starters-kebabs"],
                    "name": "Truffle Galouti Kebab",
                    "description": "Silky melt-in-mouth smoked lamb patties infused with aromatic potli spices and black truffle oil.",
                    "price": 650.0,
                    "image_url": "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=80&w=800&auto=format&fit=crop",
                    "is_veg": False,
                    "is_spicy": 1,
                    "is_available": True,
                    "is_featured": True
                },
                {
                    "category_id": cat_map["starters-kebabs"],
                    "name": "Zafrani Paneer Tikka",
                    "description": "Cottage cheese steeped in saffron, hung curd, and stone-ground yellow chillies char-grilled over embers.",
                    "price": 480.0,
                    "image_url": "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?q=80&w=800&auto=format&fit=crop",
                    "is_veg": True,
                    "is_spicy": 1,
                    "is_available": True,
                    "is_featured": True
                },
                # Curries
                {
                    "category_id": cat_map["royal-curries"],
                    "name": "Murgh Makhani Royale",
                    "description": "Tender tandoor chicken morsels enveloped in a rich, velvety sun-ripened tomato gravy infused with dried fenugreek and butter.",
                    "price": 580.0,
                    "image_url": "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=800&auto=format&fit=crop",
                    "is_veg": False,
                    "is_spicy": 1,
                    "is_available": True,
                    "is_featured": True
                },
                {
                    "category_id": cat_map["royal-curries"],
                    "name": "Dal Atulyam Signature",
                    "description": "Our pride: whole black lentils slow-cooked for 24 hours on gentle coals, finished with churned white butter.",
                    "price": 420.0,
                    "image_url": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop",
                    "is_veg": True,
                    "is_spicy": 0,
                    "is_available": True,
                    "is_featured": True
                },
                # Biryani
                {
                    "category_id": cat_map["dum-biryani-rice"],
                    "name": "Awadhi Gosht Dum Biryani",
                    "description": "Long-grain aged basmati rice layered with prime cuts of mutton, saffron kewra essence, and sealed in dough handi.",
                    "price": 690.0,
                    "image_url": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop",
                    "is_veg": False,
                    "is_spicy": 2,
                    "is_available": True,
                    "is_featured": True
                },
                {
                    "category_id": cat_map["dum-biryani-rice"],
                    "name": "Subz Nizami Handi Biryani",
                    "description": "Seasonal garden vegetables, water chestnuts, and fragrant basmati infused with royal whole spices and mint.",
                    "price": 490.0,
                    "image_url": "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=800&auto=format&fit=crop",
                    "is_veg": True,
                    "is_spicy": 1,
                    "is_available": True,
                    "is_featured": False
                },
                # Breads
                {
                    "category_id": cat_map["artisanal-breads"],
                    "name": "Smoked Garlic & Truffle Naan",
                    "description": "Fluffy leavened flatbread brushed with charred garlic butter, fresh coriander, and cold-pressed white truffle oil.",
                    "price": 160.0,
                    "image_url": "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800&auto=format&fit=crop",
                    "is_veg": True,
                    "is_spicy": 0,
                    "is_available": True,
                    "is_featured": False
                },
                # Desserts
                {
                    "category_id": cat_map["heritage-desserts"],
                    "name": "Shahi Tukda with Gold Vark",
                    "description": "Crisp golden brioche steeped in saffron syrup, layered with thick condensed rabri and 24K edible silver leaf.",
                    "price": 320.0,
                    "image_url": "https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=800&auto=format&fit=crop",
                    "is_veg": True,
                    "is_spicy": 0,
                    "is_available": True,
                    "is_featured": True
                },
                # Beverages
                {
                    "category_id": cat_map["beverages"],
                    "name": "Royal Jamun Spritzer",
                    "description": "Black plum extract, roasted cumin, rock salt, fresh lime, and sparkling soda.",
                    "price": 240.0,
                    "image_url": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&auto=format&fit=crop",
                    "is_veg": True,
                    "is_spicy": 0,
                    "is_available": True,
                    "is_featured": True
                }
            ]
            for m in menu_items_data:
                db.add(MenuItem(**m))
            db.commit()

        # 4. Seed Offers
        if db.query(Offer).count() == 0:
            logger.info("Seeding promotional offers...")
            offers_data = [
                {
                    "title": "Royal First Dining Experience",
                    "code": "ROYAL15",
                    "description": "Enjoy 15% off on your fine dining order above ₹1,000.",
                    "discount_percentage": 15,
                    "min_order_amount": 1000.0,
                    "valid_from": datetime.utcnow(),
                    "valid_until": datetime.utcnow() + timedelta(days=90),
                    "is_active": True,
                    "banner_url": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop"
                },
                {
                    "title": "Imperial Weekend Banquet Feast",
                    "code": "ATULYAM20",
                    "description": "Delight in 20% savings on signature family banquets above ₹1,500.",
                    "discount_percentage": 20,
                    "min_order_amount": 1500.0,
                    "valid_from": datetime.utcnow(),
                    "valid_until": datetime.utcnow() + timedelta(days=90),
                    "is_active": True,
                    "banner_url": "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop"
                }
            ]
            for o in offers_data:
                db.add(Offer(**o))
            db.commit()

        # 5. Seed Homepage Slides
        if db.query(HomeSlide).count() == 0:
            logger.info("Seeding homepage slides...")
            slides_data = [
                {
                    "title": "The Art of Contemporary Royal Dining",
                    "subtitle": "An epicurean sanctuary where heritage Indian traditions meet contemporary culinary finesse.",
                    "cta_text": "Explore Artisanal Menu",
                    "cta_link": "/menu",
                    "image_url": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1600&auto=format&fit=crop",
                    "display_order": 1,
                    "is_active": True
                },
                {
                    "title": "Signature Charcoal & Clay Pot Delicacies",
                    "subtitle": "Charcoal grilled kebabs, slow-braised curries, and aromatic Awadhi dum handis.",
                    "cta_text": "Order for Home Delivery",
                    "cta_link": "/order",
                    "image_url": "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1600&auto=format&fit=crop",
                    "display_order": 2,
                    "is_active": True
                }
            ]
            for s in slides_data:
                db.add(HomeSlide(**s))
            db.commit()

        # 6. Seed Gallery
        if db.query(Gallery).count() == 0:
            logger.info("Seeding gallery items...")
            gallery_data = [
                {
                    "title": "The Amber Dining Hall",
                    "image_url": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop",
                    "category": "Ambience",
                    "caption": "Intimate warm-lit spaces crafted with obsidian charcoal and warm amber brass.",
                    "display_order": 1
                },
                {
                    "title": "Dum Handi Unsealing Ritual",
                    "image_url": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=1000&auto=format&fit=crop",
                    "category": "Food",
                    "caption": "Aged basmati and saffron steam rising upon table service.",
                    "display_order": 2
                },
                {
                    "title": "Private Royal Dining Lounge",
                    "image_url": "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=1000&auto=format&fit=crop",
                    "category": "Private Dining",
                    "caption": "Exclusive sanctuary reserved for private banquets and celebrations.",
                    "display_order": 3
                },
                {
                    "title": "The Craft Cocktail Lounge",
                    "image_url": "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1000&auto=format&fit=crop",
                    "category": "Ambience",
                    "caption": "Botanical and spice-infused concoctions prepared by master mixologists.",
                    "display_order": 4
                }
            ]
            for g in gallery_data:
                db.add(Gallery(**g))
            db.commit()

        # 7. Seed Sample Catering Inquiry
        if db.query(Catering).count() == 0:
            logger.info("Seeding sample catering inquiry...")
            inquiry = Catering(
                customer_name="Vikram Malhotra",
                email="vikram.malhotra@example.com",
                phone="+91 98765 43210",
                event_date="2026-10-15",
                guest_count=75,
                event_type="Corporate Gala Banquet",
                special_requests="Live tandoor and chaat counter with custom dessert platters.",
                status="Contacted"
            )
            db.add(inquiry)
            db.commit()

        # 8. Seed Sample Order
        if db.query(Order).count() == 0:
            logger.info("Seeding sample order...")
            sample_order = Order(
                order_number="ATL-20260907-1001",
                customer_name="Aditi Sharma",
                customer_email="aditi.sharma@example.com",
                customer_phone="+91 98111 22334",
                delivery_address="Penthouse 4B, Royale Residency, Luxury Enclave, City Central",
                subtotal=740.0,
                discount_amount=0.0,
                tax_amount=37.0,
                total_amount=777.0,
                status="Preparing",
                payment_status="Paid",
                payment_method="UPI / Online",
                notes="Extra charred garlic naan and no spicy garnish please."
            )
            db.add(sample_order)
            db.flush()

            # Add OrderItems
            dal_item = db.query(MenuItem).filter(MenuItem.name == "Dal Atulyam Signature").first()
            naan_item = db.query(MenuItem).filter(MenuItem.name == "Smoked Garlic & Truffle Naan").first()

            item1 = OrderItem(
                order_id=sample_order.id,
                menu_item_id=dal_item.id if dal_item else None,
                item_name="Dal Atulyam Signature",
                unit_price=420.0,
                quantity=1,
                subtotal=420.0
            )
            item2 = OrderItem(
                order_id=sample_order.id,
                menu_item_id=naan_item.id if naan_item else None,
                item_name="Smoked Garlic & Truffle Naan",
                unit_price=160.0,
                quantity=2,
                subtotal=320.0
            )
            db.add(item1)
            db.add(item2)
            db.commit()

        logger.info("Database initialization and seed complete!")
    except Exception as e:
        db.rollback()
        logger.error("Error during database seed: %s", e)
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    init_and_seed_db()
