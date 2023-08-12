from datetime import datetime
from app.models import db, Task, environment, SCHEMA
from sqlalchemy.sql import text


def seed_tasks():
    task1 = Task(
        id=1,
        task_name="Task 1",
        task_date=datetime.now().date(),
        task_time=datetime.now().time(),
        task_details="Task 1 details",
        status="Pending",
        owner_id=1,
        assigned_to=2,
        event_id=1,
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )

    task2 = Task(
        id=2,
        task_name="Task 2",
        task_date=datetime.now().date(),
        task_time=datetime.now().time(),
        task_details="Task 2 details",
        status="In Progress",
        owner_id=3,
        assigned_to=2,
        event_id=2,
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )

    task3 = Task(
        id=3,
        task_name="Task 3",
        task_date=datetime.now().date(),
        task_time=datetime.now().time(),
        task_details="Task 3 details",
        status="Completed",
        owner_id=2,
        assigned_to=3,
        event_id=1,
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )

    task4 = Task(
        id=4,
        task_name="Task 4",
        task_date=datetime.now().date(),
        task_time=datetime.now().time(),
        task_details="Task 4 details",
        status="Pending",
        owner_id=1,
        assigned_to=3,
        event_id=3,
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )

    db.session.add(task1)
    db.session.add(task2)
    db.session.add(task3)
    db.session.add(task4)
    db.session.commit()


def undo_tasks():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.tasks RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM tasks"))

    db.session.commit()
