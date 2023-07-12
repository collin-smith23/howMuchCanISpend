from .db import db, environment, SCHEMA, add_prefix_for_prod
from .event_image import EventImage
from .user import User
from datetime import datetime
from sqlalchemy import Numeric, Float




class Event(db.Model):
    __tablename__ = 'events'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    event_name = db.Column(db.String(255), nullable=False)
    event_date = db.Column(db.Date, nullable=False)
    event_time = db.Column(db.Time, nullable=False)
    event_details = db.Column(db.String(2500))
    estimated_cost = db.Column(db.Numeric(precision=10, scale=2))
    predicted_revenue = db.Column(db.Numeric(precision=10, scale=2))
    private = db.Column(db.Boolean)
    owner_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")))
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now)

    owner = db.relationship('User', backref=db.backref('events'))
    event_images = db.relationship('EventImage', backref=db.backref('event'), cascade='all, delete-orphan')

    def is_future_date(self):
        current_date = datetime.now().date()
        return self.event_date >= current_date
    
    def to_dict(self):
        return {
            'id': self.id,
            'event_name': self.event_name,
            'event_date': self.event_date.strftime('%m-%d-%Y'),
            'event_time': self.event_time.strftime('%H:%M'),
            'event_details': self.event_details,
            'estimated_cost': float(self.estimated_cost),
            'predicted_revenue': float(self.predicted_revenue),
            'private': self.private,
            'owner_id': self.owner_id,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
        }
