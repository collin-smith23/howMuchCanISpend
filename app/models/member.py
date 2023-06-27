from .db import db, environment, SCHEMA, add_prefix_for_prod
from .user import User




class Member(db.Model):
    __tablename__ = 'members'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    role = db.Column(db.String(255), nullable=False)
    event_id = db.Column(db.Integer, default=1)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), default=User.current_user_id)
    user = db.relationship(User, backref='members')


    
    def to_dict(self):
        return {
            'id': self.id,
            'event_id': self.event_id,
            'user_id': self.user_id,
            'username': self.user.username if self.user else None,
        }
