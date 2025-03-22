# NL1C

## Why use venv?
1. Isolation: Keeps your backend dependencies separate from global/system Python or other projects.
2. Consistency: Ensures your app runs the same everywhere—on your machine, teammate's machine, or server.
3. Avoid version conflicts: Different projects may require different versions of the same library (e.g., Django 4 vs Django 3).
4. Safer dependency management: Avoids messing up your global environment or system-wide Python packages.
5. Easy collaboration: You can share your requirements.txt so others can recreate the same environment.
6. Deployment-ready: Most deployment tools (like Docker, Heroku, or CI/CD) expect isolated environments.

## To Activate Virtual Environment
### For Windows:
.venv\Scripts\activate
### For MacOS:
source .venv/bin/activate

## To confirm Virtual Environment activation
### For Windows:
where python

Should return:
.venv\Scripts\python

### For MacOS:
which python

Should return:
.venv/bin/python

## To Deactivate Virtual Environment
### For Windows and MacOS:
deactivate
