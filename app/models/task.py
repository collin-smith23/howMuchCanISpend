from .db import db, environment, SCHEMA, add_prefix_for_prod
from .user import User
from .event import Event
from datetime import datetime
from sqlalchemy import Numeric, Float




class Task(db.Model):
    __tablename__ = 'tasks'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    task_name = db.Column(db.String(255), nullable=False)
    task_date = db.Column(db.Date, nullable=False)
    task_time = db.Column(db.Time, nullable=False)
    task_details = db.Column(db.String(2500))
    status = db.Column(db.String(55))
    owner_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    assigned_to = db.Column(db.Integer, db.ForeignKey("users.id"))
    event_id = db.Column(db.Integer, db.ForeignKey("events.id"))
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now)

    event = db.relationship('Event', backref=db.backref('tasks'))

    def is_future_date(self):
        current_date = datetime.now().date()
        return self.task_date >= current_date
    
    def to_dict(self):
        return {
            'id': self.id,
            'task_name': self.task_name,
            'task_date': self.task_date.strftime('%m-%d-%Y'),
            'task_time': self.task_time.strftime('%H:%M'),
            'task_details': self.task_details,
            'status': self.status,
            'owner_id': self.owner_id,
            'assigned_to': self.assigned_to,
            'event_id': self.event_id,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
