from app.models import Finance
from flask_wtf import FlaskForm
from wtforms import StringField, DecimalField, DateField, TextAreaField, ValidationError
from wtforms.validators import DataRequired
from datetime import datetime

def validate_transaction_type(form, field):
    input_value = field.data
    accepted = ["Expense", "Income"]
    if input_value.lower() not in [transaction.lower() for transaction in accepted]:
        raise ValidationError("Transaction type must be either Expense or Income")

class EditFinanceRecord(FlaskForm):
    amount = DecimalField("amount", validators=[DataRequired()])
    transaction_type = StringField("transaction_type", validators=[validate_transaction_type])
    transaction_details = TextAreaField("details")
    transaction_date = DateField('transaction_date')