from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, ValidationError
from wtforms.validators import DataRequired

def validate_role(form, field):
    input_value = field.data
    accepted = ["guest", "admin", "owner"]
    if input_value.lower() not in [role.lower() for role in accepted]:
        raise ValidationError('Role must be either guest, admin or owner')

class AddMembers(FlaskForm):
    user_id = IntegerField("user_id", validators=[DataRequired()])
    role = StringField("role", default="guest", validators=[validate_role])
