from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed, FileRequired
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired
from app.api.aws_helpers import ALLOWED_EXTENSIONS

class CreateEventImage(FlaskForm):
    # url = StringField('url', validators=[DataRequired()])
    url = FileField("url", validators=[FileRequired(), FileAllowed(ALLOWED_EXTENSIONS)])
    