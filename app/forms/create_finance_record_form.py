from app.models import Finance
from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, DateField, TextAreaField, ValidationError
from wtforms.validators import DataRequired
from datetime import datetime

def validate_transaction_type(form, field):
    input_value = field.data
    accepted = ["Expense", "Income"]

class CreateFinanceRecord(FlaskForm):
    amount = IntegerField("amount", validators=[DataRequired()])
    transaction_type = StringField("transaction_type", validators=[validate_transaction_type])
    transaction_details = TextAreaField("details")
    transaction_date = DateField('date', validators=[DataRequired()])