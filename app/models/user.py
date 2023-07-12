from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from wtforms.validators import ValidationError
import re

class User(db.Model, UserMixin):
    __tablename__ = 'users'


    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    name = db.Column(db.String(255), nullable=False)
    hashed_password = db.Column(db.String(255), nullable=False)

    owned_tasks = db.relationship('Task', foreign_keys="Task.owner_id", back_populates="owner")
    assigned_tasks = db.relationship('Task', foreign_keys="Task.assigned_to", back_populates="assigned_user")

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)
    
    def check_is_email(self, email):
        email_regex = r'^[\w\.-]+@[\w\.-]+\.\w+$'
        if re.match(email_regex, email):
            return True
        else:
            return False
        
    def validate_whitespace(self, field):
        value = field.data
        if value and value.strip() != value:
            raise ValidationError("Field must not contain leading or trailing spaces")

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'name': self.name,
        }
