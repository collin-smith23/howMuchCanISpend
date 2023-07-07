from flask import Blueprint, jsonify, session, request
from flask_login import login_required, current_user, login_user
from app.models import Event, db
from app.forms import EditUserForm, CreateEvent
from datetime import datetime

event_routes = Blueprint('event', __name__)


@event_routes.route('/', methods=['GET', 'POST'])
@login_required
# Get all current users events
def user_events ():
    if request.method == 'GET':
        events = Event.query.filter(Event.owner_id == current_user.id).all()
        if events: 
            return {'events': [event.to_dict() for event in events]}
        else: 
            return {'message': 'User does not have any events'}
    
    if request.method == 'POST':
        form = CreateEvent()
        form['csrf_token'].data = request.cookies['csrf_token']
        if form.validate_on_submit():
            event = Event(
                event_name=form.data['event_name'],
                event_date=form.data['event_date'],
                event_time=form.data['event_time'],
                event_details=form.data['event_details'],
                estimated_cost = form.data['estimated_cost'],
                predicted_revenue = form.data['predicted_revenue'],
                private = form.data['private'],
                owner_id = current_user.id
                )  
            db.session.add(event)
            db.session.commit()
            return event.to_dict()
        else:
            errors = form.errors
            return {"errors": errors}




# Route to get all events
@event_routes.route('/all')
@login_required
def events ():
    events = Event.query.all()
    if events:
        return {'events': [event.to_dict() for event in events]}
    else:
        return {'error': "Unable to locate any events"}