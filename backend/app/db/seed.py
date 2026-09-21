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

        # 2. Seed Atulyam Menu Categories
            
        categories_data = [
            ("Mocktail", "mocktail", "Refreshing mocktails and coolers.", 1),
            ("Shakes", "shakes", "Thick and creamy shakes.", 2),
            ("Beverages", "beverages", "Refreshing beverages and cold drinks.", 3),
            ("Hot Tea/Coffee", "hot-tea-coffee", "Freshly prepared hot tea and coffee.", 4),
            ("Salad", "salad", "Fresh and wholesome salads.", 5),
            ("Soup", "soup", "Warm and comforting soups.", 6),
            ("Sider", "sider", "Crispy and classic sides.", 7),
            ("Raita", "raita", "Freshly prepared cooling raitas.", 8),
            ("Indian Appetizer", "indian-appetizer", "Vegetarian Indian starters and appetizers.", 9),
            ("Chinese Appetizers", "chinese-appetizers", "Chinese starters, noodles and Indo-Chinese favourites.", 10),
            ("Sizzler", "sizzler", "Hot sizzling vegetarian specialities.", 11),
            ("South Indian", "south-indian", "Classic South Indian favourites.", 12),
            ("Pizza", "pizza", "Freshly prepared vegetarian pizzas.", 13),
            ("Pasta", "pasta", "Italian-style pasta preparations.", 14),
            ("Sandwich", "sandwich", "Freshly prepared sandwiches.", 15),
            ("Burger", "burger", "Vegetarian burgers and favourites.", 16),
            ("Chaap (Dry)", "chaap-dry", "Dry vegetarian chaap preparations.", 17),
            ("Chaap (Gravy)", "chaap-gravy", "Gravy-based chaap preparations.", 18),
            ("Combo", "combo", "Value meals and delicious combinations.", 19),
            ("Veg Main Course", "veg-main-course", "Vegetarian Indian main course preparations.", 20),
            ("Breads", "breads", "Fresh Indian breads and parathas.", 21),
            ("Rice", "rice", "Rice, pulao and biryani preparations.", 22),
            ("Dessert", "dessert", "Classic Indian and restaurant desserts.", 23),
            ("Indian Thali", "indian-thali", "Complete vegetarian Indian thali meals.", 24),
            ("Chinese Thali", "chinese-thali", "Complete vegetarian Chinese thali meals.", 25),
        ]

        # Keep old categories hidden and activate/update the real Atulyam categories.
        db.query(MenuCategory).update(
            {"is_active": False},
            synchronize_session=False
        )
        db.commit()

        cat_map = {}

        for name, slug, description, display_order in categories_data:
            existing = (
                db.query(MenuCategory)
                .filter(MenuCategory.slug == slug)
                .first()
            )

            if existing:
                existing.name = name
                existing.description = description
                existing.display_order = display_order
                existing.is_active = True
                cat = existing
            else:
                cat = MenuCategory(
                    name=name,
                    slug=slug,
                    description=description,
                    display_order=display_order,
                    is_active=True,
                )
                db.add(cat)

            db.flush()
            cat_map[slug] = cat.id

        db.commit()


       # 3. Seed Atulyam Menu Items
        logger.info("Updating menu with official Atulyam menu...")

        # IMPORTANT:
        # Old seeded dishes ko delete nahi kar rahe because existing orders
        # unke MenuItem IDs ko reference kar sakte hain.
        # Instead, old dishes ko unavailable kar dete hain.
        db.query(MenuItem).update(
            {"is_available": False},
            synchronize_session=False
        )
        db.commit()

        def add_or_update_menu_item(
            category_slug,
            name,
            price,
            description=None,
            image_url=None,
            is_spicy=0,
            is_featured=False,
        ):
            category_id = cat_map[category_slug]

            existing = (
                db.query(MenuItem)
                .filter(
                    MenuItem.category_id == category_id,
                    MenuItem.name == name
                )
                .first()
            )

            if existing:
                existing.price = float(price)
                existing.description = description

                # Only update image when a new image path is provided
                if image_url:
                    existing.image_url = image_url

                existing.is_veg = True
                existing.is_spicy = is_spicy
                existing.is_available = True
                existing.is_featured = is_featured

            else:
                db.add(
                    MenuItem(
                        category_id=category_id,
                        name=name,
                        description=description,
                        price=float(price),
                        image_url=image_url,
                        is_veg=True,
                        is_spicy=is_spicy,
                        is_available=True,
                        is_featured=is_featured,
                    )
                )

        mocktails = [
    ("Mango Mint", 139, "/images/menu/mango-mint.jpeg"),
    ("Watermelon Mojito", 129, "/images/menu/watermelon-mojito.jpeg"),
    ("Blue Lagoon", 135, "/images/menu/blue-lagoon.jpeg"),
    ("Mint Mojito", 155, "/images/menu/mint-mojito.jpeg"),
    ("Fruit Punch", 110, "/images/menu/fruit-punch.jpeg"),
    ("Black Currant", 140, "/images/menu/black-currant.jpeg"),
    ("Lime Iced Tea", 130, "/images/menu/lime-iced-tea.jpeg"),
    ("Coke Float", 99, "/images/menu/coke-float.jpeg"),
    ("Cucumber Surprise", 155, "/images/menu/cucumber-surprise.jpeg"),
]

        # ---------------------------------------------------------
        # SHAKES
        # ---------------------------------------------------------
        shakes = [
            ("Mango Shake", 170, "/images/menu/mango-shake.jpeg"),
            ("Banana Shake", 140, "/images/menu/banana-shake.jpeg"),
            ("Vanilla Shake", 135, "/images/menu/vanilla-shake.jpeg"),
            ("Strawberry Shake", 145, "/images/menu/strawberry-shake.jpeg"),
            ("Butterscotch Shake", 155, "/images/menu/butterscotch-shake.jpeg"),
            ("Chocolate Shake", 160, "/images/menu/chocolate-shake.jpeg"),
            ("Pineapple Shake", 160, "/images/menu/pineapple-shake.jpeg"),
            ("Kit Kat Shake", 179, "/images/menu/kitkat-shake.jpeg"),
            ("Oreo Shake", 169, "/images/menu/oreo-shake.jpeg"),
            ("Cold Coffee", 145, "/images/menu/cold-coffee.jpeg"),
            ("Dry Fruit Shake", 225, "/images/menu/dryfruit-shake.jpeg"),
        ]

        # ---------------------------------------------------------
        # BEVERAGES
        # ---------------------------------------------------------
        # ---------------------------------------------------------
        beverages = [
            ("Mineral Water", 20, "/images/menu/mineral-water.jpeg"),
            ("Fresh Lime Soda", 120, "/images/menu/fresh-lime-soda.jpeg"),
            ("Coke", 60, "/images/menu/coke.jpeg"),
            ("Sprite", 60, "/images/menu/sprite.jpeg"),
            ("Diet Coke", 89, "/images/menu/diet-coke.jpeg"),
            ("Masala Cold Drinks", 80, "/images/menu/masala-cold-drinks.jpeg"),
            ("Redbull", 160, "/images/menu/redbull.jpeg"),
            ("Fruit Juice", 120, "/images/menu/fruit-juice.jpg"),
            ("Lassi", 140, "/images/menu/lassi.jpeg"),
            ("Mango Lassi", 180, "/images/menu/mango-lassi.jpg"),
            ("Butter Milk", 99, "/images/menu/butter-milk.jpeg"),
        ]

        # ---------------------------------------------------------
        # HOT TEA / COFFEE
        # ---------------------------------------------------------
        hot_tea_coffee = [
            ("Hot Coffee", 69, "/images/menu/hot-coffee.jpeg"),
            ("Black Coffee", 79, "/images/menu/black-coffee.jpeg"),
            ("Ginger Tea", 69, "/images/menu/ginger-tea.jpeg"),
            ("Green Tea", 49, "/images/menu/green-tea.jpeg"),
            ("Masala Tea", 79, "/images/menu/masala-tea.jpeg"),
            ("Black Lemon Tea", 59, "/images/menu/black-lemon-tea.jpeg"),
        ]

        # ---------------------------------------------------------
        # SALAD
        # ---------------------------------------------------------
        salads = [
            ("Green Salad", 120, "/images/menu/green-salad.jpeg"),
            ("Kachumar Salad", 140, "/images/menu/kachumar-salad.jpeg"),
            ("Onion Salad", 130, "/images/menu/onion-salad.jpeg"),
            ("Russian Salad", 280, "/images/menu/russian-salad.jpeg"),
            ("Cucumber Salad", 120, "/images/menu/cucumber-salad.jpeg"),
        ]
        # ---------------------------------------------------------
        # SOUP
        # ---------------------------------------------------------
        soups = [
            ("Hot N Sour Soup", 150, "/images/menu/hot-n-sour-soup.jpeg"),
            ("Lemon Coriander Soup", 130, "/images/menu/lemon-coriander-soup.jpeg"),
            ("Sweet Corn Soup", 149, "/images/menu/corn-soup.jpeg"),
            ("Manchow Soup", 140, "/images/menu/manchow-soup.jpeg"),
            ("Cream of Mushroom", 170, "/images/menu/cream-of-mushroom.jpeg"),
            ("Cream of Tomato", 160, "/images/menu/cream-of-tomato.jpeg"),
        ]

        # ---------------------------------------------------------
        # SIDER
        # ---------------------------------------------------------
        siders = [
        ("Roasted Papad", 30, "/images/menu/roasted-papad.jpeg"),
        ("Fried Papad", 40, "/images/menu/fried-papad.jpeg"),
        ("Masala Papad", 60, "/images/menu/masala-papad.jpeg"),
        ("Peanut Masala", 180, "/images/menu/peanut-masala.jpeg"),
    ]

        # ---------------------------------------------------------
        # RAITA
        # ---------------------------------------------------------
        raitas = [
        ("Plain Curd", 99, "/images/menu/plain-curd.jpeg"),
        ("Mix-Veg. Raita", 125, "/images/menu/mix-veg-raita.jpeg"),
        ("Boondi Raita", 110, "/images/menu/boondi-raita.jpeg"),
        ("Bottle Gourd Raita (Lauki)", 180, "/images/menu/bottle-gourd-raita.jpeg"),
        ("Cucumber Raita (Kheera)", 180, "/images/menu/cucumber-raita.jpeg"),
        ("Makhana Raita", 199, "/images/menu/makhana-raita.jpeg"),
        ("Dry Fruit Raita", 299, "/images/menu/dry-fruit-raita.jpeg"),
    ]

        # ---------------------------------------------------------
        # INDIAN APPETIZER
        # ---------------------------------------------------------
        indian_appetizers = [
            ("Veg Cutlet", 160, "/images/menu/veg-cutlet.jpeg"),
            ("Paneer Cutlet", 210, "/images/menu/paneer-cutlet.jpeg"),
            ("Tandoori Stuffed Aloo", 230, "/images/menu/tandoori-stuffed-aloo.jpeg"),
            ("Dahi Kebab", 220, "/images/menu/dahi-kebab.jpeg"),
            ("Tandoori Aloo", 220, "/images/menu/tandoori-aloo.jpeg"),
            ("Hara Bhara Kebab", 240, "/images/menu/hara-bhara-kebab.jpeg"),
            ("Veg Seekh Kebab", 250, "/images/menu/veg-seekh-kebab.jpeg"),
            ("Dhai Ke Shole", 240, "/images/menu/dhai-ke-shole.jpeg"),
            ("Mix Pakoda", 255, "/images/menu/mix-pakoda.jpeg"),
            ("Veg Nuggets", 240, "/images/menu/veg-nuggets.jpeg"),
            ("Cheese Corn Nuggets", 250, "/images/menu/cheese-corn-nuggets.jpeg"),
            ("Paneer Nuggets", 250, "/images/menu/paneer-nuggets.jpeg"),
        ]

        # ---------------------------------------------------------
        # CHINESE APPETIZERS
        # ---------------------------------------------------------
        chinese_appetizers = [
    ("French Fries", 140, "/images/menu/french-fries.jpeg"),
    ("Zig Zag French Fries", 160, "/images/menu/zig-zag-french-fries.jpeg"),
    ("Peri-Peri Fries", 180, "/images/menu/peri-peri-fries.jpeg"),
    ("Veg Momos", 149, "/images/menu/veg-momos.jpeg"),
    ("Paneer Momos", 189, "/images/menu/paneer-momos.jpeg"),
    ("Chilli Momos", 199, "/images/menu/chilli-momos.jpeg"),
    ("Honey Chilli Potato", 210, "/images/menu/honey-chilli-potato.jpeg"),
    ("Spring Roll", 180, "/images/menu/spring-roll.jpeg"),
    ("Crispy Corn", 210, "/images/menu/crispy-corn.jpeg"),
    ("Veg Noodles", 190, "/images/menu/veg-noodles.jpeg"),
    ("Thupka (Noodles)", 230, "/images/menu/thupka-noodles.jpeg"),
    ("Hakka Noodles", 230, "/images/menu/hakka-noodles.jpeg"),
    ("Chilli Garlic Noodles", 240, "/images/menu/chilli-garlic-noodles.jpeg"),
    ("Vegetable Salt Pepper", 260, "/images/menu/vegetable-salt-pepper.jpeg"),
    ("Paneer 65", 249, "/images/menu/paneer-65.jpeg"),
    ("Crispy Veg", 265, "/images/menu/crispy-veg.jpeg"),
    ("Manchurian (Dry / Gravy)", 290, "/images/menu/manchurian.jpeg"),
    ("Veg Fried Rice", 230, "/images/menu/veg-fried-rice.jpeg"),
    ("Paneer Fried Rice", 250, "/images/menu/paneer-fried-rice.jpeg"),
    ("Singapore Fried Rice", 260, "/images/menu/singapore-fried-rice.jpeg"),
    ("Schezwan Fried Rice", 270, "/images/menu/schezwan-fried-rice.jpeg"),
    ("Chilli Garlic Fried Rice", 280, "/images/menu/chilli-garlic-fried-rice.jpeg"),
    ("Schezwan Noodles", 270, "/images/menu/schezwan-noodles.jpeg"),
    ("Singapore Noodles", 280, "/images/menu/singapore-noodles.jpeg"),
    ("Mushroom Fried Rice", 299, "/images/menu/mushroom-fried-rice.jpeg"),
    ("Chilli Babycorn (Dry / Gravy)", 325, "/images/menu/chilli-baby-corn.jpeg"),
    ("Chilli Paneer (Dry / Gravy)", 310, "/images/menu/chilli-paneer.jpeg"),
    ("Chilli Mushroom (Dry / Gravy)", 360, "/images/menu/chilli-mushroom.jpeg"),
]

      
        # ---------------------------------------------------------
        # SIZZLER
        # ---------------------------------------------------------
        sizzlers = [
            ("Achari Aloo", 249, "/images/menu/achari-aloo.jpeg"),
            ("Tandoori Mushroom", 290, "/images/menu/tandoori-mushroom.jpeg"),
            ("Paneer Tikka", 310, "/images/menu/paneer-tikka.jpeg"),
            ("Malai Paneer Tikka", 325, "/images/menu/malai-paneer-tikka.jpeg"),
            ("Hariyali Paneer Tikka", 320, "/images/menu/hariyali-paneer-tikka.jpeg"),
            ("Paneer Afghani Tikka", 320, "/images/menu/paneer-afghani-tikka.jpeg"),
            ("Achari Paneer Tikka", 330, "/images/menu/achari-paneer-tikka.jpeg"),
            ("Paneer Tikka Lahori", 340, "/images/menu/paneer-tikka-lahori.jpeg"),
            ("Paneer Kali Mirch Tikka", 340, "/images/menu/paneer-kalimirch-tikka.jpeg"),
            ("Atulyam Special Tikka", 370, "/images/menu/atulyam-special-tikka.jpeg"),
        ]

        # ---------------------------------------------------------
        # SOUTH INDIAN
        # ---------------------------------------------------------
        south_indian = [
            ("Plain Dosa", 130, "/images/menu/plain-dosa.jpeg"),
            ("Masala Dosa", 140, "/images/menu/masala-dosa.jpeg"),
            ("Onion Dosa", 150, "/images/menu/onion-dosa.jpeg"),
            ("Idli Sambhar (4 Pieces)", 155, "/images/menu/idli-sambhar.jpeg"),
            ("Fried Idli Sambhar (6 Pieces)", 170, "/images/menu/fried-idli-sambhar.jpeg"),
            ("Medu Vada Sambhar (6 Pieces)", 165, "/images/menu/medu-vada-sambhar.jpeg"),
            ("Onion Rawa Dosa", 150, "/images/menu/onion-rawa-dosa.jpeg"),
            ("Rawa Masala Dosa", 190, "/images/menu/rawa-masala-dosa.jpeg"),
            ("Rawa Paneer Masala Dosa", 210, "/images/menu/rawa-paneer-masala-dosa.jpeg"),
            ("Paneer Masala Dosa", 170, "/images/menu/paneer-masala-dosa.jpeg"),
            ("Cheese Masala Dosa", 180, "/images/menu/cheese-masala-dosa.jpeg"),
            ("Mysore Paneer Masala Dosa", 180, "/images/menu/mysore-paneer-masala-dosa.jpeg"),
            ("Mysore Masala Dosa", 170, "/images/menu/mysore-masala-dosa.jpeg"),
            ("Atulyam Special Dosa", 240, "/images/menu/atulyam-special-dosa.jpeg"),
        ]
        # ---------------------------------------------------------
        # PIZZA
        # ---------------------------------------------------------
        pizzas = [
            ("Margherita Pizza", 180, "/images/menu/margherita-pizza.jpeg"),
            ("Onion Tomato Pizza", 260, "/images/menu/onion-tomato-pizza.jpeg"),
            ("Mix Veg Pizza", 280, "/images/menu/mix-veg-pizza.jpeg"),
            ("Cheese Corn Pizza", 310, "/images/menu/cheese-corn-pizza.jpeg"),
            ("Chilli Paneer Pizza", 320, "/images/menu/chilli-paneer-pizza.jpeg"),
            ("Paneer Tikka Cheese Pizza", 350, "/images/menu/paneer-tikka-cheese-pizza.jpeg"),
            ("Mushroom Pizza", 370, "/images/menu/mushroom-pizza.jpeg"),
            ("Farm House Pizza", 399, "/images/menu/farmhouse-pizza.jpeg"),
        ]

        # ---------------------------------------------------------
        # PASTA
        # ---------------------------------------------------------
        pastas = [
            ("Spaghetti Pasta", 330, "/images/menu/spaghetti-pasta.jpeg"),
            ("Basil Pesto Pasta", 360, "/images/menu/basil-pesto-pasta.jpeg"),
            ("Mix Sauce Pasta", 310, "/images/menu/mix-sauce-pasta.jpeg"),
            ("Alfredo Pasta", 349, "/images/menu/alfredo-pasta.jpeg"),
            ("Mac & Cheese Pasta", 350, "/images/menu/mac-cheese-pasta.jpeg"),
            ("Arrabiata Pasta", 369, "/images/menu/arrabiata-pasta.jpeg"),
        ]

        # ---------------------------------------------------------
        # SANDWICH
        # ---------------------------------------------------------
        sandwiches = [
            ("Veg Sandwich", 149, "/images/menu/veg-sandwich.jpeg"),
            ("Cheese Sandwich", 170, "/images/menu/cheese-sandwich.jpeg"),
            ("Cheese Grilled Sandwich", 180, "/images/menu/cheese-grilled-sandwich.jpeg"),
            ("Veg Loaded Sandwich", 190, "/images/menu/veg-loaded-sandwich.jpeg"),
            ("Cheese Corn Sandwich", 199, "/images/menu/cheese-corn-sandwich.jpeg"),
            ("Paneer Tikka Sandwich", 210, "/images/menu/paneer-tikka-sandwich.jpeg"),
        ]

        # ---------------------------------------------------------
        # BURGER
        # ---------------------------------------------------------
        burgers = [
    ("Veg. Burger", 110, "/images/menu/veg-burger.jpeg"),
    ("Paneer Tikka Burger", 140, "/images/menu/paneer-tikka-burger.jpeg"),
    ("Cheese Corn Burger", 150, "/images/menu/cheese-corn-burger.jpeg"),
    ("Maharaja Burger", 165, "/images/menu/maharaja-burger.jpeg"),
    ("Cheese Burger", 120, "/images/menu/cheese-burger.jpeg"),
]

        # ---------------------------------------------------------
        # CHAAP - DRY
        # ---------------------------------------------------------
        chaap_dry = [
            ("Malai Chaap - Half", 130, "/images/menu/malai-chaap.jpeg"),
            ("Malai Chaap - Full", 250, "/images/menu/malai-chaap.jpeg"),

            ("Masala Chaap - Half", 140, "/images/menu/masala-chaap.jpeg"),
            ("Masala Chaap - Full", 270, "/images/menu/masala-chaap.jpeg"),

            ("Punjabi Masala - Half", 130, "/images/menu/punjabi-masala.jpeg"),
            ("Punjabi Masala - Full", 250, "/images/menu/punjabi-masala.jpeg"),

            ("Hariyali Chaap - Half", 130, "/images/menu/hariyali-chaap.jpeg"),
            ("Hariyali Chaap - Full", 250, "/images/menu/hariyali-chaap.jpeg"),

            ("Afghani Chaap - Half", 120, "/images/menu/afghani-chaap.jpeg"),
            ("Afghani Chaap - Full", 230, "/images/menu/afghani-chaap.jpeg"),

            ("Stuffed Chaap - Half", 160, "/images/menu/stuffed-chaap.jpeg"),
            ("Stuffed Chaap - Full", 310, "/images/menu/stuffed-chaap.jpeg"),
        ]
        # ---------------------------------------------------------
        # CHAAP - GRAVY
        # ---------------------------------------------------------
        chaap_gravy = [
    ("Tawa Chaap - Half", 160, "/images/menu/tawa-chaap.jpeg"),
    ("Tawa Chaap - Full", 310, "/images/menu/tawa-chaap.jpeg"),

    ("Handi Chaap - Half", 160, "/images/menu/handi-chaap.jpeg"),
    ("Handi Chaap - Full", 310, "/images/menu/handi-chaap.jpeg"),

    ("Beliram Chaap - Half", 170, "/images/menu/beliram-chaap.jpeg"),
    ("Beliram Chaap - Full", 370, "/images/menu/beliram-chaap.jpeg"),

    ("Rara Chaap - Half", 170, "/images/menu/rara-chaap.jpeg"),
    ("Rara Chaap - Full", 330, "/images/menu/rara-chaap.jpeg"),

    ("Kadhai Chaap - Half", 180, "/images/menu/kadhai-chaap.jpeg"),
    ("Kadhai Chaap - Full", 350, "/images/menu/kadhai-chaap.jpeg"),
]
        # ---------------------------------------------------------
        # COMBO
        # ---------------------------------------------------------
        combos = [
            ("Chole Bhature", 169, "/images/menu/chole-bhature.jpeg"),
            ("Pav Bhaji", 149, "/images/menu/pav-bhaji.jpeg"),
            ("Kadhi Pakoda + Rice", 160, "/images/menu/kadhi-pakoda-rice.jpeg"),
            ("Chole + Rice", 180, "/images/menu/chole-rice.jpeg"),
            ("Rajma + Rice", 199, "/images/menu/rajma-rice.jpeg"),
            ("Dal Makhani + Laccha Paratha (2 Pcs)", 230, "/images/menu/laccha-paratha.jpeg"),
            ("Paneer Butter Masala + Naan (1 Pcs)", 240, "/images/menu/paneer-butter-masala-naan.jpeg"),
            ("Mushroom Masala + Missi Roti (2 Pcs)", 270, "/images/menu/mushroom-masala-missi-roti.jpeg"),
        ]

        # ---------------------------------------------------------
        # VEG MAIN COURSE
        # ---------------------------------------------------------
        veg_main_course = [
    ("Aloo Methi", 250, "/images/menu/aloo-methi.jpeg"),
    ("Aloo Jeera", 260, "/images/menu/aloo-jeera.jpeg"),
    ("Aloo Matar Methi (Dry)", 260, "/images/menu/aloo-matar-methi.jpeg"),
    ("Hing Dhaniya Aloo", 260, "/images/menu/hing-dhaniya-aloo.jpeg"),
    ("Aloo Matar", 265, "/images/menu/aloo-matar.jpeg"),
    ("Dum Aloo", 270, "/images/menu/dum-aloo.jpeg"),
    ("Aloo Gobhi", 280, "/images/menu/aloo-gobhi.jpeg"),
    ("Kashmiri Dum Aloo", 310, "/images/menu/kashmiri-dum-aloo.jpeg"),
    ("Chana Masala (Pindi)", 280, "/images/menu/chana-masala-pindi.jpeg"),
    ("Veg-Jhal-Frezi", 290, "/images/menu/veg-jhal-frezi.jpeg"),
    ("Mix-Veg", 299, "/images/menu/mix-veg.jpeg"),
    ("Plain Dal", 190, "/images/menu/plain-dal.jpeg"),
    ("Dal Tadka", 270, "/images/menu/dal-tadka.jpeg"),
    ("Dal Fry", 260, "/images/menu/dal-fry.jpeg"),
    ("Dal Makhni", 290, "/images/menu/dal-makhani.jpeg"),
    ("Dal Punjabi", 285, "/images/menu/dal-punjabi.jpeg"),
    ("Dal Butter Fry", 260, "/images/menu/dal-butter-fry.jpeg"),
    ("Dal Lahsuni Tadka", 270, "/images/menu/dal-lahsuni-tadka.jpeg"),
    ("Shahi Paneer", 310, "/images/menu/shahi-paneer.jpeg"),
    ("Matar Paneer", 310, "/images/menu/matar-paneer.jpeg"),
    ("Kadhai Paneer", 310, "/images/menu/kadhai-paneer.jpeg"),
    ("Paneer Butter Masala", 340, "/images/menu/paneer-butter-masala.jpeg"),
    ("Paneer Lahori", 330, "/images/menu/paneer-lahori.jpeg"),
    ("Paneer Do Pyaza", 310, "/images/menu/paneer-do-pyaza.jpeg"),
    ("Paneer Lababdar", 320, "/images/menu/paneer-lababdar.jpeg"),
    ("Paneer Kalmirch", 340, "/images/menu/paneer-kalmirch.jpeg"),
    ("Handi Paneer", 330, "/images/menu/handi-paneer.jpeg"),
    ("Khoya Paneer", 360, "/images/menu/khoya-paneer.jpeg"),
    ("Paneer Bhurji (Amritsari)", 299, "/images/menu/paneer-bhurji.jpeg"),
    ("Palak Corn", 280, "/images/menu/palak-corn.jpeg"),
    ("Palak Paneer", 320, "/images/menu/palak-paneer.jpeg"),
    ("Kaju Masala Korma", 350, "/images/menu/kaju-masala-korma.jpeg"),
    ("Veg Kofta", 280, "/images/menu/veg-kofta.jpeg"),
    ("Kaju Korma", 340, "/images/menu/kaju-korma.jpeg"),
    ("Navratan Korma", 300, "/images/menu/navratan-korma.jpeg"),
    ("Bottle Gourd Kofta (Lauki)", 290, "/images/menu/bottle-gourd-kofta.jpeg"),
    ("Malai Kofta", 360, "/images/menu/malai-kofta.jpeg"),
    ("Shahi Kofta", 380, "/images/menu/shahi-kofta.jpeg"),
    ("Matar Mushroom", 310, "/images/menu/matar-mushroom.jpeg"),
    ("Handi Mushroom Masala", 310, "/images/menu/handi-mushroom-masala.jpeg"),
    ("Mushroom Do-Pyaza", 320, "/images/menu/mushroom-do-pyaza.jpeg"),
    ("Mushroom Matar Takatak", 320, "/images/menu/mushroom-matar-takatak.jpeg"),
    ("Mushroom Masala", 330, "/images/menu/mushroom-masala.jpeg"),
    ("Kadhai Mushroom Masala", 330, "/images/menu/kadhai-mushroom-masala.jpeg"),
    ("Kaju Matar Makhana", 360, "/images/menu/kaju-matar-makhana.jpeg"),
    ("Mushroom Tikka Masala", 360, "/images/menu/mushroom-tikka-masala.jpeg"),
    ("Paneer Tikka Masala", 330, "/images/menu/paneer-tikka-masala.jpeg"),
]

        # ---------------------------------------------------------
        # BREADS
        # ---------------------------------------------------------
        breads = [
    ("Rumali Roti", 15, "/images/menu/rumali-roti.jpeg"),
    ("Tawa Roti", 20, "/images/menu/tawa-roti.jpeg"),
    ("Tandoori Roti", 30, "/images/menu/tandoori-roti.jpeg"),
    ("Naan", 60, "/images/menu/naan.jpeg"),
    ("Garlic Naan", 79, "/images/menu/garlic-naan.jpeg"),
    ("Garlic Cheese Naan", 89, "/images/menu/garlic-cheese-naan.jpeg"),
    ("Kashmiri Naan", 130, "/images/menu/kashmiri-naan.jpeg"),
    ("Chur-Chur Naan", 75, "/images/menu/chur-chur-naan.jpeg"),
    ("Missi Roti", 60, "/images/menu/missi-roti.jpeg"),
    ("Masala Missi Roti", 80, "/images/menu/masala-missi-roti.jpeg"),
    ("Laccha Paratha", 60, "/images/menu/laccha-parathas.jpeg"),
    ("Stuffed Naan", 90, "/images/menu/stuffed-naan.jpeg"),
    ("Plain Paratha", 40, "/images/menu/plain-paratha.jpeg"),
    ("Aloo Paratha (Tawa / Tandoor)", 120, "/images/menu/aloo-paratha.jpeg"),
    ("Gobhi Paratha (Tawa / Tandoor)", 130, "/images/menu/gobhi-paratha.jpeg"),
    ("Mint Paratha (Tawa / Tandoor)", 110, "/images/menu/mint-paratha.jpeg"),
    ("Onion Paratha (Tawa / Tandoor)", 120, "/images/menu/onion-paratha.jpeg"),
    ("Mix Veg. Paratha (Tawa / Tandoor)", 140, "/images/menu/mix-veg-paratha.jpeg"),
    ("Paneer Paratha (Tawa / Tandoor)", 160, "/images/menu/paneer-paratha.jpeg"),
]

        # ---------------------------------------------------------
        # RICE
        # ---------------------------------------------------------
        rice_items = [
    ("Steam Rice", 170, "/images/menu/steamed-rice.jpeg"),
    ("Jeera Rice", 190, "/images/menu/jeera-rice.jpeg"),
    ("Matar Pulao", 240, "/images/menu/matar-pulao.jpeg"),
    ("Tawa Pulao", 260, "/images/menu/tawa-pulao.jpeg"),
    ("Paneer Tikka Biryani", 270, "/images/menu/paneer-tikka-biryani.jpeg"),
    ("Veg Dum Biryani", 290, "/images/menu/veg-dum-biryani.jpeg"),
    ("Veg-Hyderabad Biryani", 299, "/images/menu/veg-hyderabadi-biryani.jpeg"),
    ("Kashmiri Pulao", 310, "/images/menu/kashmiri-pulao.jpeg"),
]

        # ---------------------------------------------------------
        # DESSERT
        # ---------------------------------------------------------
        desserts = [
    ("Gulab Jamun (2 Pcs)", 129, "/images/menu/gulab-jamun.jpeg"),
    ("Shahi Kheer", 210, "/images/menu/shahi-kheer.jpeg"),
    ("Gajar Ka Halwa", 189, "/images/menu/gajar-ka-halwa.jpeg"),
    ("Moong Dal Ka Halwa", 210, "/images/menu/moong-dal-ka-halwa.jpeg"),
    ("Rasmalai", 169, "/images/menu/rasmalai.jpeg"),
    ("Ice Cream Fudge", 210, "/images/menu/ice-cream-fudge.jpeg"),
    ("Butterscotch", 120, "/images/menu/butterscotch.jpeg"),
    ("Black Currant", 149, "/images/menu/black-currant-icecream.jpeg"),
    ("American Nuts", 169, "/images/menu/american-nuts.jpeg"),
]

        # ---------------------------------------------------------
        # INDIAN THALI
        # ---------------------------------------------------------
        indian_thali = [
            ("Mini Veg. Thali", 250),
            ("Special Punjabi Thali", 310),
            ("Deluxe Veg. Thali", 395),
        ]

        # ---------------------------------------------------------
        # CHINESE THALI
        # ---------------------------------------------------------
        chinese_thali = [
            ("Veg. Chinese Thali", 310),
            ("Special Chinese Thali", 369),
        ]


        # ---------------------------------------------------------
        # INSERT / UPDATE ALL ITEMS
        # ---------------------------------------------------------
        menu_groups = {
            "mocktail": mocktails,
            "shakes": shakes,
            "beverages": beverages,
            "hot-tea-coffee": hot_tea_coffee,
            "salad": salads,
            "soup": soups,
            "sider": siders,
            "raita": raitas,
            "indian-appetizer": indian_appetizers,
            "chinese-appetizers": chinese_appetizers,
            
            "sizzler": sizzlers,
            "south-indian": south_indian,
            "pizza": pizzas,
            "pasta": pastas,
            "sandwich": sandwiches,
            "burger": burgers,
            "chaap-dry": chaap_dry,
            "chaap-gravy": chaap_gravy,
            "combo": combos,
            "veg-main-course": veg_main_course,
            "breads": breads,
            "rice": rice_items,
            "dessert": desserts,
            "indian-thali": indian_thali,
            "chinese-thali": chinese_thali,
        }

        for category_slug, items in menu_groups.items():
            for item in items:
                item_name = item[0]
                item_price = item[1]
                item_image = item[2] if len(item) > 2 else None

                add_or_update_menu_item(
                    category_slug=category_slug,
                    name=item_name,
                    price=item_price,
                    description=None,
                    image_url=item_image,
                    is_spicy=0,
                    is_featured=False,
                )

        db.commit()

        logger.info(
            "Atulyam menu seeded successfully: %s categories / %s items",
            len(menu_groups),
            sum(len(items) for items in menu_groups.values()),
        )

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
