from flask import Blueprint, jsonify, session, request
from flask_login import login_required, current_user, login_user
from app.models import Event, Member, Task, db
from app.forms import EditUserForm, CreateEvent, CreateEventImage

task_routes = Blueprint('task', __name__)

@task_routes.route('/assigned')
@login_required
#Get all current users assigned tasks
def user_assigned_tasks():
    tasks = Task.query.filter(Task.assigned_to == current_user.id).all()
    if tasks:
        return {'tasks': [task.to_dict() for task in tasks]}
    else:
        return {'error': "User does not have any assigned tasks"}


@task_routes.route('/created')
@login_required
#Get all current users created tasks
def user_created_tasks():
    tasks = Task.query.filter(Task.owner_id == current_user.id).all()
    if tasks:
        return {'tasks': [task.to_dict() for task in tasks]}
    else:
        return {'error': "User does not have any created tasks"}
    

@task_routes.route('/<int:id>', methods=['GET', "PUT", "DELETE"])
@login_required
def task_by_id(id):
    task = Task.query.get(id)
    if task.owner_id == current_user.id or task.assigned_to == current_user.id:
        if request.method == 'GET':
            return {"task": task.to_dict()}
        if request.method == 'PUT':
            pass
    else:
        return{'error': "Not valid permissions to view task"}



