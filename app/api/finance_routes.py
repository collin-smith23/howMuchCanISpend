from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import Finance, db
from app.forms import CreateFinanceRecord

finance_routes = Blueprint('finance', __name__)

@finance_routes.route('/', methods=["GET", "POST"])
@login_required

def user_finances():

    if request.method == "GET":
        finances = Finance.query.filter(Finance.user_id == current_user.id).all()
        
        if finances:
            return {"finances": [finance.to_dict() for finance in finances]}
        else:
            return {"error": "User does not have any finance data to display"}
        
    if request.method == "POST":
        form = CreateFinanceRecord()
        form['csrf_token'].data = request.cookies['csrf_token']
        if form.validate_on_submit():
            record = Finance(
                amount = form.data["amount"],
                transaction_type = form.data["transaction_type"],
                transaction_details = form.data["transaction_details"],
                transaction_date = form.data["date"],
                user_id = current_user.id
            )
            db.session.add(record),
            db.session.commit()
        else:
            errors = form.errors
            return {"errors": errors}
        
@finance_routes.route('/<int:id>', methods=["PUT", "DELETE"])
@login_required

def editing_finances(id):
    record = Finance.query.get(id)

    if record.user_id == current_user.id:
        if request.method == "PUT":
            form = CreateFinanceRecord()
            form['csrf-token'].data = request.cookies['csrf_token']
            if form.validate_on_submit():
                form.amount = form.data["amount"]
                form.transaction_type = form.data["transaction_type"]
                form.transaction_details = form.data["transaction_details"]
                form.transaction_date = form.data["date"]
                db.session.commit()
                return record.to_dict(), 202
            else:
                errors = form.errors
                return {"errors": errors}

        elif request.method == "DELETE":
            if record:
                db.session.delete(record)
                db.session.commit()
                return {"message": "Successfully deleted event"}
            else:
                return {"error": "Record not found"}
    else:
        return {"error": "Not valid permission to acccess record"}