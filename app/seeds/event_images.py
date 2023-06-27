from app.models import db, EventImage, environment, SCHEMA
from sqlalchemy.sql import text

def seed_event_images():

    image1 = EventImage(
        url = 'https://d3vhc53cl8e8km.cloudfront.net/hello-staging/wp-content/uploads/2017/12/22223742/Events-1200x630.jpg',
        event_id = 1,
        owner_id = 1
    )

    image2 = EventImage(
        url = 'https://www.alexanevents.com/wp-content/uploads/2019/08/Event-Management-Tips.jpg',
        event_id = 2,
        owner_id = 2
    )

    image3 = EventImage(
        url = 'https://media.gettyimages.com/id/468308738/photo/bruce-wayne-meets-with-the-wayne-enterprises-board-members-in-the-the-blind-fortune-teller.jpg?s=612x612&w=gi&k=20&c=GsyBR_b8RN19A2FylfTd2oePufqZrJXq0fV_CJLkBIc=',
        event_id = 3,
        owner_id = 3
    )

    db.session.add(image1)
    db.session.add(image2)
    db.session.add(image3)
    db.session.commit()

def undo_event_images():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.event_images RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM event_images"))
        
    db.session.commit()