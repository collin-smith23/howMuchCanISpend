from app.models import Task
from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, DateField, TimeField, TextAreaField, ValidationError
from wtforms.validators import DataRequired
from datetime import datetime


def validate_future_date(form, field):
    input_date = field.data.strftime('%m-%d-%Y')
    inpute_date = datetime.strptime(input_date, '%m-%d-%Y').date()
    if  inpute_date < datetime.now().date():
        raise ValidationError('Task date must be a future date')
    
def validate_status(form, field):
    input_value = field.data
    accepted = ["Pending", "Accepted", "Complete"]
    if input_value.lower() not in [status.lower() for status in accepted]:
        raise ValidationError("Status type must be one of the following: Pending, Accepted or Complete")

class CreateTask(FlaskForm):
    task_name = StringField('task_name', validators=[DataRequired()])
    task_date = DateField('task_date', validators=[DataRequired(), validate_future_date])
    task_time = TimeField("task_time", validators=[DataRequired()])
    task_details = TextAreaField("task_details")
    status = StringField('status', default="Pending", validators=[validate_status])
    assigned_to = IntegerField('assigned_to', validators=[DataRequired()])