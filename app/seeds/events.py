from datetime import datetime
from app.models import db, Event, environment, SCHEMA
from sqlalchemy.sql import text


def seed_events():

    event1 = Event(
        event_name='Graduation',
        event_date=datetime(2023, 8, 12).date(),
        event_time=datetime.strptime('09:00', '%H:%M').time(),
        event_details='App Academy Graduation Whoop',
        estimated_cost=0.0,
        predicted_revenue=200.0,
        private=False,
        owner_id=1
    )
    
    event2 = Event(
        event_name='Job Interview',
        event_date=datetime(2023, 8, 15).date(),
        event_time=datetime.strptime('14:30', '%H:%M').time(),
        event_details='Big Company Job Interview',
        estimated_cost=0.0,
        predicted_revenue=85000.0,
        private=True,
        owner_id=2
    )
    
    event3 = Event(
        event_name='New House',
        event_date=datetime(2024, 1, 20).date(),
        event_time=datetime.strptime('14:00', '%H:%M').time(),
        event_details='Event 3 details',
        estimated_cost=550200.0,
        predicted_revenue=4.0,
        private=False,
        owner_id=3
    )
    event4 = Event(
        event_name='Splicing',
        event_date=datetime(2023, 11, 30).date(),
        event_time=datetime.strptime('18:00', '%H:%M').time(),
        event_details='864 count',
        estimated_cost=1600.0,
        predicted_revenue=4800.0,
        private=False,
        owner_id=3
    )
    event5 = Event(
        event_name='Troubleshooting',
        event_date=datetime(2023, 9, 22).date(),
        event_time=datetime.strptime('18:00', '%H:%M').time(),
        event_details='Fiber id 112233',
        estimated_cost=450.0,
        predicted_revenue=1200.0,
        private=False,
        owner_id=3
    )
    
    db.session.add(event1)
    db.session.add(event2)
    db.session.add(event3)
    db.session.add(event4)
    db.session.add(event5)
    db.session.commit()

def undo_events():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.events RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM events"))
        
    db.session.commit()