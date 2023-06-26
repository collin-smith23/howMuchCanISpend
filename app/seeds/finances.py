from datetime import datetime
from app.models import db, Finance, environment, SCHEMA
from sqlalchemy.sql import text


def seed_finances():

    transaction1 = Finance(
            amount = 100.50,
            transaction_type = 'Expense',
            transaction_date = datetime(2023, 6, 20).date(),
            transaction_details = 'Grocery shopping',
            user_id = 1
    )
    
    transaction2 = Finance(
            amount = 500.25,
            transaction_type = 'Income',
            transaction_date = datetime(2023, 6, 22).date(),
            transaction_details = 'Salary payment',
            user_id = 1
    )
    
    transaction3 = Finance(
            amount = 20.75,
            transaction_type = 'Expense',
            transaction_date = datetime(2023, 6, 23).date(),
            transaction_details = 'Dinner at a restaurant',
            user_id = 2
    )
    
    db.session.add(transaction1)
    db.session.add(transaction2)
    db.session.add(transaction3)
    db.session.commit()

def undo_finances():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.finances RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM finances"))
        
    db.session.commit()