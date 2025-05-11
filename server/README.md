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

### 2. Create and activate virtual environment
#### For MAC:
```bash
python3 -m venv .venv
source .venv/bin/activate
```
#### For Windows:
.venv\Scripts\activate

(When activated, your terminal prompt should change to (.venv).)

### 3. Install dependencies

```bash
pip install -r requirements.txt
```
### 4. Set up environment variables
- Copy '.env.example' to '.env' and fill in your MongoDB URI, JWT secret, etc.

### 5. Run the app

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

---