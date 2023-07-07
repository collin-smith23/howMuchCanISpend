from flask_wtf import FlaskForm
from wtforms import StringField, DecimalField, BooleanField, IntegerField, DateField, TimeField, TextAreaField
from wtforms.validators import DataRequired, Email, ValidationError
from flask_login import current_user


class CreateEvent(FlaskForm):
    event_name = StringField('event_name', validators=[DataRequired()])
    event_date = DateField('event_date', validators=[DataRequired()])
    event_time = TimeField("event_time", validators=[DataRequired()])
    event_details = TextAreaField("event_details")
    estimated_cost = DecimalField('estimated_cost', default='0.00')
    predicted_revenue = DecimalField('predicted_revenue', default='0.00')
    private = BooleanField('private', default=False)
    owner_id = IntegerField('owner_id')