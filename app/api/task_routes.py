from flask import Blueprint, jsonify, session, request
from flask_login import login_required, current_user, login_user
from app.models import Event, Member, Task, db
from app.forms import CreateTask
from datetime import datetime

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
        elif request.method == 'PUT':
            form = CreateTask()
            form['csrf_token'].data = request.cookies['csrf_token']
            if form.validate_on_submit():
                task.task_name = form.data['task_name']
                task.task_date = form.data['task_date']
                task.task_time=form.data['task_time']
                task.task_details=form.data['task_details']
                task.status = form.data['status']
                task.assigned_to = form.data['assigned_to']
                task.updated_at = datetime.now()
                db.session.commit()
                return task.to_dict(), 202
            else:
                errors = form.errors
                return {"errors": errors}
        elif request.method == 'DELETE':
            if task.owner_id == current_user.id:
                db.session.delete(task)
                db.session.commit()
                return {'message': 'Successfully deleted event'}
            else :
                return {'error': 'Permissions Not Valid'}
    else:
        return{'error': "Not valid permissions to view task"}



