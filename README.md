# NL1C

## Why use venv?
1. Isolation: Keeps your backend dependencies separate from global/system Python or other projects.
2. Consistency: Ensures your app runs the same everywhere—on your machine, teammate's machine, or server.
3. Avoid version conflicts: Different projects may require different versions of the same library (e.g., Django 4 vs Django 3).
4. Safer dependency management: Avoids messing up your global environment or system-wide Python packages.
5. Easy collaboration: You can share your requirements.txt so others can recreate the same environment.
6. Deployment-ready: Most deployment tools (like Docker, Heroku, or CI/CD) expect isolated environments.

## How to set up venv?
## Environment Settings
The following steps guide you through setting up your development environment locally to ensure that you can run the FastAPI backend.
### 1.Clone project to local：
```bash
git clone <repository-url>
cd NL1C_project
```
### 2.Check Pyhton verison
python3 --version

Should return:
Python 3.9.6

### 3.Create a virtual environment
python3 -m venv .venv
pip install -r requirements.txt

### 4.Activate virtual environment
#### For Windows:
.venv\Scripts\activate
#### For MacOS:
source .venv/bin/activate
(When activated, your terminal prompt should change to (.venv).)

### 5.Install dependencies
pip install -r requirements.txt

## Starting MongoDB
### Check the MongoDB service:
brew services list
### Starting MongoDB
brew services start mongodb-community@7.0
### If MongoDB is not installed, install:
brew install mongodb-community@7.0

## To run FastAPI Back end
### For Windows and MacOS:
fastapi dev ./app/main.py

for accessing the Server and API docs, refer to the links within the returned text in the terminal after running the above command in the format : 
│  Serving at: http://127.0.0.1:8000                  │
│                                                     │
│  API docs: http://127.0.0.1:8000/docs               │

Windows (CTRL+Click) MacOS (CMD+Click) 

## To stop FastAPI Back end
### For Windows and MacOS:
Control+C

## To Deactivate Virtual Environment
### For Windows and MacOS:
deactivate
