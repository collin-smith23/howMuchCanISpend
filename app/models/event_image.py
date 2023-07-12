from .db import db, environment, SCHEMA, add_prefix_for_prod
from .user import User




class EventImage(db.Model):
    __tablename__ = 'event_images'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String(255), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("events.id")))
    owner_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")))


    
    def to_dict(self):
        return {
            'id': self.id,
            'url': self.url,
            'event_id': self.event_id,
            'owner_id': self.owner_id,
        }
