from flask import Blueprint, jsonify, session, request
from flask_login import login_required, current_user, login_user
from app.models import User, db
from app.forms import EditUserForm

user_routes = Blueprint('users', __name__)


@user_routes.route('/')
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}

@user_routes.route('/current', methods=['GET', 'PUT'])
@login_required

def current_user_route():
    if request.method == 'GET':
        return current_user.to_dict()
    elif request.method == 'PUT':
        user = current_user
        form = EditUserForm()
        form['csrf_token'].data = request.cookies['csrf_token']
        if form.validate_on_submit():
            print('this is user', user)
            if user :
                user.username=form.data['username'],
                user.email=form.data['email'],
                user.name=form.data['name'],
                user.password=form.data['password']
                db.session.commit()
                return user.to_dict(), 202
            else:
                return {'error': "Not a signed in user"}
        return user.to_dict(), 401

@user_routes.route('/<int:id>')
@login_required
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    return user.to_dict()
