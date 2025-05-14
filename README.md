## Get Started
### Client Side
First, set up the environment variables,
```bash
cd client
cat <<EOL > .env.local
GOOGLE_GENERATIVE_AI_API_KEY=***
TMDB_API_KEY=***
TMDB_API_LONG_KEY=***
EOL
```
Then, install dependency and run developemnt enviroment,
```bash
npm install
npm run dev
```
### Server Side
Open a new terminal on the root of NL1C
```bash
cd server
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```
Then, rename '.env.example' to '.env' and fill in your MongoDB URI, JWT secret, etc. And run,
```bash
python3 -m uvicorn src.main:app --reload
```

Read more in <a href="https://github.cs.adelaide.edu.au/MCI-Project-2025/NL1C/tree/feature/user_profile/server">Server README</a>.

## Git Repository Branch Overview
<img width="1170" alt="image" src="https://github.cs.adelaide.edu.au/MCI-Project-2025/NL1C/assets/4653/93e29bbb-bd04-4748-8495-28f7142fd63a">

## Project Overview
### ‼️ For Milestone 1
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
...
