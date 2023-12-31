from flask_wtf import FlaskForm
from wtforms import StringField
from flask_login import current_user
from wtforms.validators import DataRequired, Email, ValidationError
from app.models import User


def user_exists(form, field):
    # Checking if user exists
    email = field.data
    user = User.query.filter(User.email == email).first()
    if user and user != current_user:
        raise ValidationError('Email address is already in use.')


def username_exists(form, field):
    # Checking if username is already in use
    username = field.data
    user = User.query.filter(User.username == username).first()
    if user and user != current_user:
        raise ValidationError('Username is already in use.')


class EditUserForm(FlaskForm):
    csrf_token = StringField('csrf_token')
    username = StringField(
        'username', validators=[DataRequired(), username_exists])
    email = StringField('email', validators=[DataRequired(), user_exists])
    name = StringField('name', validators=[DataRequired()])
    password = StringField('password', validators=[DataRequired()])