from app.models import Event
from flask_wtf import FlaskForm
from wtforms import StringField, DecimalField, BooleanField, IntegerField, DateField, TimeField, TextAreaField, ValidationError
from wtforms.validators import DataRequired
from datetime import datetime


def validate_future_date(form, field):
    input_date = field.data.strftime('%m-%d-%Y')
    inpute_date = datetime.strptime(input_date, '%m-%d-%Y').date()
    if  inpute_date < datetime.now().date():
        raise ValidationError('Event date must be a future date')

class CreateEvent(FlaskForm):
    event_name = StringField('event_name', validators=[DataRequired()])
    event_date = DateField('event_date', validators=[DataRequired(), validate_future_date])
    event_time = TimeField("event_time", validators=[DataRequired()])
    event_details = TextAreaField("event_details")
    estimated_cost = DecimalField('estimated_cost', default='0.00')
    predicted_revenue = DecimalField('predicted_revenue', default='0.00')
    private = BooleanField('private', default=False)
    owner_id = IntegerField('owner_id')