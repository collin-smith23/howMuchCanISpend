from datetime import datetime
from app.models import db, Event, environment, SCHEMA
from sqlalchemy.sql import text


def seed_events():

    event1 = Event(
        event_name='Event 1',
        event_date=datetime(2023, 7, 1).date(),
        event_time=datetime.strptime('09:00', '%H:%M').time(),
        event_details='Event 1 details',
        estimated_cost=100.0,
        predicted_revenue=200.0,
        private=False,
        owner_id=1
    )
    
    event2 = Event(
        event_name='Event 2',
        event_date=datetime(2023, 8, 15).date(),
        event_time=datetime.strptime('14:30', '%H:%M').time(),
        event_details='Event 2 details',
        estimated_cost=150.0,
        predicted_revenue=300.0,
        private=True,
        owner_id=2
    )
    
    event3 = Event(
        event_name='Event 3',
        event_date=datetime(2023, 9, 30).date(),
        event_time=datetime.strptime('18:00', '%H:%M').time(),
        event_details='Event 3 details',
        estimated_cost=200.0,
        predicted_revenue=400.0,
        private=False,
        owner_id=1
    )
    
    db.session.add(event1)
    db.session.add(event2)
    db.session.add(event3)
    db.session.commit()

def undo_events():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.events RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM events"))
        
    db.session.commit()