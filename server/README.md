# NL1C Movie API
A RESTful API for movie information, user authentication, reviews and watchlists, built with FastAPI and MongoDB.

## Features
- User registration, login, JWT authentication
- Movie reviews (create, update, delete, list)
- Personal watchlists (add/remove movies)
- Admin user management
- MongoDB async integration

## Quick Start
### 1. Clone the repo

```bash
git clone https://github.com/"username"/"repo".git
cd "repo"
```

### 2. Set up MongoDB

#### Step 1: Install MongoDB Server
##### For MAC:
```bash
# Install MongoDB server
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Verify MongoDB is running
brew services list
```

##### For Windows:
- Download MongoDB Community Server from [MongoDB website](https://www.mongodb.com/try/download/community).
- Run the installer and follow the instructions.
- MongoDB will be installed as a Windows service and start automatically.
- Verify MongoDB is running in Windows Services.

#### Step 2: Install MongoDB Compass
1. Download MongoDB Compass from [MongoDB Compass Download](https://www.mongodb.com/try/download/compass).
2. Install and open MongoDB Compass.
3. Click "New Connection" and use the connection string: `mongodb://localhost:27017`.
   - Note: 27017 is the default MongoDB port. If you've configured a different port, update the connection string accordingly.
4. Click "Connect" to establish the connection.
5. You should see the MongoDB server and be able to create/manage databases.

### 3. Create and activate virtual environment
#### For MAC:
```bash
python3 -m venv .venv
source .venv/bin/activate
```
#### For Windows:
.venv\Scripts\activate

(When activated, your terminal prompt should change to (.venv).)

### 4. Install dependencies

```bash
pip install -r requirements.txt
```

### 5. Set up environment variables
- Copy '.env.example' to '.env' and fill in your MongoDB URI, JWT secret, etc.
- Make sure your MongoDB connection string is set to: `mongodb://localhost:27017`
  - If you're using a different port, update the connection string accordingly.
  - If you're using MongoDB Atlas or a remote MongoDB instance, use the provided connection string.

### 6. Run the app

```bash
unicorn src.main:app --reload
```

- Visit [http://128.0.0.1:8000/docs](http://127.0.0.1:8000/docs) for Swagger UI.

## Project Structure
- src/
- api/ # FastAPI routes
- models/ # Pydantic models
- services/ # Business logic
- database/ # MongoDB connection & repositories
- config/ # Settings & auth

---

## Tips
- **Admin user**: Use 'scripts/create_admin.py' to create an admin account.
- **Environment**: Never commit your '.env' or secrets to GitHub!
- **Notices**: We have retained the feature that MongoDB can provide movie data, so that we can respond promptly when situations occur when calling the movie API.
- **MongoDB Compass**: Use MongoDB Compass to:
  - View and manage your database collections
  - Monitor database performance
  - Create and modify indexes
  - Import/export data
  - Run queries and aggregations
- **MongoDB**: Make sure MongoDB is running before starting the application. You can check the status with:
  - macOS: `brew services list`.
  - Windows: Check Services application for "MongoDB".

---