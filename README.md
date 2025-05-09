## Get Started
### Client Side
First, set up the environment variables,
```bash
cat <<EOL > .env.local
GOOGLE_GENERATIVE_AI_API_KEY=***
TMDB_API_KEY=***
TMDB_API_LONG_KEY=***
EOL
```
Then, install dependency and run developemnt enviroment,
```bash
cd client
npm install
npm run dev
```
### Server Side
```bash
cd ../server
python3 -m venv .venv
# for windows
.venv\Scripts\activate
# for macos
source .venv/bin/activate
pip install -r requirements.txt

# Start MongoDB
brew services list
brew services start mongodb-community@7.0
python -m uvicorn movie_platform.main:movie_app --reload
```

## Git Repository Branch Overview
<img width="1170" alt="image" src="https://github.cs.adelaide.edu.au/MCI-Project-2025/NL1C/assets/4653/93e29bbb-bd04-4748-8495-28f7142fd63a">

## Project Overview
### ‼️ For Milestone 1
#### Client Side

1. AI Recommendations (AI ChatBot)
2. *(static)* Authentication `/login`, `/signup` 
3. Movie detail `/movieDesc/abc` 
    - *(static)* review & rating 
    - watch trailer
4. *(static)* Watchlist `/watchlist` 
5. Theme Switcher (Light / Dark mode)
6. Search movies
    - search bar
    - *(static)* advance search `/discover` 
7. *(static)* User profile `/settings`  
    - profile
    - reset password

#### Server Side
...
