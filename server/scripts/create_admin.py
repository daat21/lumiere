import asyncio
import os
import sys
from datetime import datetime

import bcrypt
from motor.motor_asyncio import AsyncIOMotorClient

# Add the project root directory to the Python path
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(project_root)

from src.config import settings

client = AsyncIOMotorClient(settings.MONGO_URL)

async def create_admin_user():
    # Obtain databases and collections
    db = client[settings.MONGODB_DB]
    users_collection = db.users

    # Administrator account information
    admin_email = "admin@example.com"
    admin_username = "admin"
    admin_password = "Admin@123"  # Default password. It is recommended to change it immediately after creation

    # Check whether an administrator account already exists
    existing_admin = await users_collection.find_one({
        "$or": [
            {"email": admin_email},
            {"username": admin_username}
        ]
    })

    if existing_admin:
        print("The administrator account already exists!")
        return

    # Encrypt password
    hashed_password = bcrypt.hashpw(
        admin_password.encode('utf-8'),
        bcrypt.gensalt()
    ).decode('utf-8')

    # Create administrator user document
    admin_user = {
        "email": admin_email,
        "username": admin_username,
        "hashed_password": hashed_password,
        "is_active": True,
        "is_superuser": True,
        "created_at": datetime.now(),
        "updated_at": datetime.now(),
        "last_login": None,
        "avatar_url": None,
        "bio": None,
        "preferences": {}
    }

    # Insert into database
    result = await users_collection.insert_one(admin_user)
    
    if result.inserted_id:
        print("The administrator account has been created successfully!")
        print(f"Email: {admin_email}")
        print(f"Username: {admin_username}")
        print(f"Password: {admin_password}")
        print("\nPlease use these credentials to log in to the system and immediately change the password!")
    else:
        print("Failed to create the administrator account!")

async def main():
    try:
        await create_admin_user()
    except Exception as e:
        print(f"Error occurred: {str(e)}")
    finally:
        # Close database connection
        client.close()

if __name__ == "__main__":
    asyncio.run(main()) 