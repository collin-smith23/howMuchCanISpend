from app.models import db, Member, environment, SCHEMA
from sqlalchemy.sql import text

def seed_members():

    member1 = Member(
        role = 'owner',
        event_id = 1,
        user_id = 1
    )

    member2 = Member(
        role = 'owner',
        event_id = 2,
        user_id = 2
    )
    member3 = Member(
        role = 'owner',
        event_id = 3,
        user_id = 3
    )
    member4 = Member(
        role = 'admin',
        event_id = 2,
        user_id = 1
    )

    db.session.add(member1)
    db.session.add(member2)
    db.session.add(member3)
    db.session.add(member4)
    db.session.commit()

def undo_members():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.members RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM members"))
        
    db.session.commit()