from flask import Blueprint, request
from flask_login import login_required, current_user
from app.models import Event, EventImage, Member, Task, db
from app.forms import CreateEvent, CreateEventImage, CreateTask, AddMembers
from app.api.aws_helpers import upload_file_to_s3, get_unique_file_name

event_routes = Blueprint('event', __name__)


@event_routes.route('/', methods=['GET', 'POST'])
@login_required
# Get all current users events
def user_events():
    if request.method == 'GET':
        events = Event.query.filter(Event.owner_id == current_user.id).all()
        if events: 
            return {'events': [event.to_dict() for event in events]}
        else: 
            return {'error': 'User does not have any events'}
    
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
            owner = Member(
                user_id = current_user.id,
                role = "owner",
                event_id = event.id
            )
            db.session.add(owner)
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
    
@event_routes.route('/<int:id>', methods=['GET', 'POST', 'PUT', 'DELETE'])
@login_required
def event_by_id(id):
    event = Event.query.get(id)
    if event:
        if request.method == "GET":
            return event.to_dict()
        # Create Event Image
        elif request.method == "POST":
            if event.owner_id == current_user.id:
                form = CreateEventImage()
                form['csrf_token'].data = request.cookies['csrf_token']
                if form.validate_on_submit():
                    url = form.data['url']
                    url.filename = get_unique_file_name(url.filename)
                    upload = upload_file_to_s3(url)

                    if "url" not in upload:
                        return {"error": "Not a valid upload"}

                    event_image = EventImage(
                        url = form.data['url'],
                        owner_id = current_user.id,
                        event_id = id
                    )
                    db.session.add(event_image)
                    db.session.commit()
                    return event_image.to_dict()
                else:
                    errors = form.errors
                    return {"errors": errors}
            else: 
                return {'error': "Must Be Event Owner To Add Images"}

        elif request.method == "PUT":
            members = Member.query.filter_by(event_id=event.id).all()
            is_member = any(member.user_id == current_user.id for member in members)
            
            def is_admin():
                if is_member:
                    member = next(member for member in members if member.user_id == current_user.id)
                    return member.role == "admin" or member.role == "owner"
                return False

            if is_admin():
                form = CreateEvent()
                form['csrf_token'].data = request.cookies['csrf_token']
                if form.validate_on_submit():
                    event.event_name=form.data['event_name']
                    event.event_date=form.data['event_date']
                    event.event_time=form.data['event_time']
                    event.event_details=form.data['event_details']
                    event.estimated_cost = form.data['estimated_cost']
                    event.predicted_revenue = form.data['predicted_revenue']
                    event.private = form.data['private']
                    event.owner_id = current_user.id
                    db.session.commit()
                    return event.to_dict(), 202
                else:
                    errors = form.errors
                    return {"errors": errors}
            else :
                return {'error': 'Permissions Not Valid'}
        elif request.method == 'DELETE':
            if event.owner_id == current_user.id:
                db.session.delete(event)
                db.session.commit()
                return {'message': 'Successfully deleted event'}
            else :
                return {'error': 'Permissions Not Valid'}
    else: 
        return {'error': 'Event not found'}
    
@event_routes.route('/<int:id>/images', methods=['GET'])
@login_required
def get_event_image(id):
    event = Event.query.get(id)
    images = EventImage.query.filter_by(event_id=event.id).all()
    members = Member.query.filter_by(event_id=event.id).all()
    is_member = any(member.user_id == current_user.id for member in members)

    if event:
        # if the group is private must be a member to view images
        if ((is_member and event.private) or (not event.private)):
            if images:
                return {"images": [image.to_dict() for image in images]}
            else: 
                return {'erorr': "Event has no images"}
        else:
            return {'error': "Must be event member to view event images for private events"}
    else:
        return {'error': "Event not found"}


@event_routes.route('/<int:id>/image/<int:image_id>', methods=['DELETE'])
@login_required
def delete_event_image(id, image_id):
    event = Event.query.get(id)
    image = EventImage.query.get(image_id)
    if event:
        if image:
            if event.owner_id == current_user.id:
                db.session.delete(image)
                db.session.commit()
                return {'message': 'Successfully deleted image'}
            else :
                return {'error': 'Permissions Not Valid'}
        else:
            return {'error': 'Event image not found'}
    else:
        return {'error': "Event not found"}
    
# Create a task for an event or Get all task for event
@event_routes.route('/<int:id>/task', methods=["GET", "POST"])
@login_required
def event_task(id):
    event = Event.query.get(id)
    tasks = Task.query.filter_by(event_id = id).all()
    members = Member.query.filter_by(event_id=event.id).all()
    is_member = any(member.user_id == current_user.id for member in members)
    
    if event:
        if request.method == 'GET':
            if is_member or (not event.private):
                if tasks:
                    return {"tasks": [task.to_dict() for task in tasks]}
                else:
                    return {'error': 'Event has not tasks yet'}
            else:
                return {'error': "Must be event member to view event tasks for private events"}
        elif request.method == "POST":
            if event.owner_id == current_user.id:
                form = CreateTask()
                form['csrf_token'].data = request.cookies['csrf_token']
                if form.validate_on_submit():
                    task = Task(
                    task_name = form.data['task_name'],
                    task_date = form.data['task_date'],
                    task_time=form.data['task_time'],
                    task_details=form.data['task_details'],
                    status = form.data['status'],
                    assigned_to = form.data['assigned_to'],
                    owner_id = current_user.id,
                    event_id = id
                    )
                    db.session.add(task)
                    db.session.commit()
                    return task.to_dict()
                else: 
                    errors = form.errors
                    return {'errors': errors}
            else:
                return {"error": "Must be event owner to create a task"}
    else:
        return {'error': "Event not found"}
    
@event_routes.route('/<int:id>/members', methods=["GET", "POST"])
@login_required
def task_members(id):
    event = Event.query.get(id)
    members = Member.query.filter_by(event_id=event.id).all()
    is_member = any(member.user_id == current_user.id for member in members)

    if is_member:
        if request.method == "GET":
            if members:
                return {"members": [member.to_dict() for member in members]}
            else: 
                return {"error": "No members in group"}
        elif request.method == "POST":
            form = AddMembers()
            form['csrf_token'].data = request.cookies['csrf_token']
            if form.validate_on_submit():
                member = Member(
                    user_id = form.data['user_id'],
                    role = form.data['role'],
                    event_id = id,
                )
                db.session.add(member)
                db.session.commit()
                return member.to_dict()
            else:
                errors = form.errros
                return {"errors": errors}
    else:
        return {"error": "Must be member to view other members"}