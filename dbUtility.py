#!/usr/bin/env python
import os
from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import text

# Configuration
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_FILENAME = os.path.join(BASE_DIR, "backEnd", "server", "instance", "data.db")
DATABASE_URL = f"sqlite:///{DATABASE_FILENAME}"

# SQLAlchemy base (not used for reflection, but may be useful)
Base = declarative_base()

def view_db():
    """View contents of all tables in the DB."""
    if not os.path.exists(DATABASE_FILENAME):
        print("DB file not found.")
        print("Attempted path:")
        print(DATABASE_FILENAME)
        return

    engine = create_engine(DATABASE_URL)
    inspector = inspect(engine)
    tables = inspector.get_table_names()

    if not tables:
        print("DB empty.")
        return

    print("\n--- DB Contents ---")
    with engine.connect() as conn:
        for table in tables:
            print(f"\nTable: {table}")
            # Retrieve column names
            columns = inspector.get_columns(table)
            col_names = [col["name"] for col in columns]
            print("Columns:", col_names)

            # Query all rows from the table
            result = conn.execute(text(f"SELECT * FROM {table}"))
            rows = result.fetchall()
            if rows:
                for row in rows:
                    print(row)
            else:
                print("No data in this table.")

def wipe_db():
    """Wipe the DB by deleting the file."""
    if os.path.exists(DATABASE_FILENAME):
        confirmation = input("Are you sure you want to wipe the DB? (Y/N): ")
        if confirmation.lower() == 'y':
            os.remove(DATABASE_FILENAME)
            print("DB wiped successfully.")
        else:
            print("Wipe cancelled.")
    else:
        print("DB file not found.")

def main():
    while True:
        print("\n--- DB Utility ---")
        print("Options:")
        print("1. view - View DB contents")
        print("2. wipe - Wipe the DB")
        print("3. quit - Exit")
        choice = input("Enter your choice: ").strip().lower()

        if choice in ["view", "1"]:
            view_db()
        elif choice in ["wipe", "2"]:
            wipe_db()
        elif choice in ["quit", "3"]:
            print("Exiting.")
            break
        else:
            print("Invalid choice. Please try again.")

if __name__ == "__main__":
    main()
