from flask.cli import AppGroup
from .users import seed_users, undo_users
from .events import seed_events, undo_events
from .event_images import seed_event_images, undo_event_images
from .tasks import seed_tasks, undo_tasks
from .finances import seed_finances, undo_finances
from .members import seed_members, undo_members

from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo 
        # command, which will  truncate all tables prefixed with 
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_users()
    seed_users()
    seed_events()
    seed_event_images()
    seed_tasks()
    seed_finances()
    seed_members()
    # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_users()
    undo_events()
    undo_tasks()
    undo_finances()
    undo_event_images()
    undo_members()
    # Add other undo functions here