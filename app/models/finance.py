from .db import db, environment, SCHEMA, add_prefix_for_prod
from .user import User
from datetime import datetime
from sqlalchemy import Numeric, Float




class Finance(db.Model):
    __tablename__ = 'finances'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Numeric(precision=10, scale=2))
    transaction_type = db.Column(db.String(255), nullable=False)
    transaction_date = db.Column(db.Date, nullable=False)
    transaction_details = db.Column(db.String(2500))
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now)

    
    def to_dict(self):
        formatted_amount = "{:.2f}".format(float(self.amount))
        return {
            'id': self.id,
            'amount': formatted_amount,
            'transaction_type': self.transaction_type,
            'transaction_date': self.transaction_date.strftime('%m-%d-%Y'),
            'transaction_details': self.transaction_details,
            'user_id': self.user_id,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
