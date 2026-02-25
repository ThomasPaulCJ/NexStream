# 🎬 NexStream — Netflix Clone Prototype

A full-stack Netflix-style web application built for an interview task. Features a cinematic UI, real movie posters from TMDB, official YouTube trailers, hover video previews, and a full-featured video player.

---

## 🛠 Tech Stack

### Frontend
| Technology | Why |
|---|---|
| **React 18 + Vite** | Fast dev server, component-based architecture, hot module reload |
| **Context API** | Lightweight state management — no Redux overhead needed for this scale |
| **Pure CSS (inline styles)** | Full control over animations, no class conflicts, easier to maintain |
| **TMDB API** | Live high-quality movie posters, backdrops, and official trailer IDs |

### Backend
| Technology | Why |
|---|---|
| **Python Flask** | Lightweight, minimal setup, perfect for a simple REST API |
| **JSON file storage** | No database overhead needed for 9 movies |
| **Flask-CORS** | Handles cross-origin requests between Vite (5173) and Flask (5000) |

---

## 📁 Project Structure

```
netflix-app/
│
├── backend/
│   ├── app.py              # Flask API — GET /movies, POST /play/:id
│   ├── movies.json         # Movie data (name, poster, trailer, stream URL)
│   └── requirements.txt    # Python dependencies
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Header.jsx          # Navigation bar with page routing
    │   │   ├── HeroBanner.jsx      # Cinematic auto-cycling hero section
    │   │   ├── MovieRow.jsx        # Movie grid rows with hover preview
    │   │   ├── Player.jsx          # Fullscreen video player (YouTube + MP4)
    │   │   ├── ContinueWatching.jsx # Resume incomplete movies
    │   │   ├── ProfileModal.jsx    # Profile switcher dropdown
    │   │   ├── HelpPage.jsx        # Support / contact page
    │   │   └── LoadingScreen.jsx   # Intro loading animation
    │   │
    │   ├── context/
    │   │   └── AppContext.jsx      # Global state (movies, player, myList, etc.)
    │   │
    │   ├── services/
    │   │   ├── api.js              # Flask API calls
    │   │   └── tmdb.js             # TMDB live poster + trailer enrichment
    │   │
    │   ├── hooks/
    │   │   └── useMouseIdle.js     # Detects mouse inactivity for player UI
    │   │
    │   ├── App.jsx                 # Root component + page routing
    │   └── index.css               # Global styles, animations, keyframes
    │
    ├── vite.config.js              # Proxy config (localhost → 127.0.0.1 for Windows)
    └── package.json
```

---

## ⚙️ Prerequisites

- **Node.js** v18 or higher
- **Python** 3.8 or higher
- **pip** (comes with Python)

---

## 🚀 How to Run

### Step 1 — Clone / Extract the project
```bash
# If using the zip file, extract it first
# Then open a terminal in the project root
```

### Step 2 — Start the Backend
```bash
cd backend

# Install dependencies (first time only)
pip install -r requirements.txt

# Start Flask server
python app.py
```
> Flask runs on **http://127.0.0.1:5000**

### Step 3 — Start the Frontend
```bash
# Open a second terminal
cd frontend

# Install dependencies (first time only)
npm install

# Start Vite dev server
npm run dev
```
> App runs on **http://localhost:5173**

### Step 4 — Open in Browser
```
http://localhost:5173
```

> ⚠️ **Windows users:** If you get a connection error, make sure Flask is running on `127.0.0.1` not `localhost`. The `vite.config.js` proxy is already set to `127.0.0.1:5000` to handle this.

---

## 🔌 API Endpoints

### `GET /api/movies`
Returns the list of all 9 movies.

**Response:**
```json
{
  "movies": [
    {
      "id": "1",
      "name": "IT",
      "genre": "Thriller",
      "year": 2017,
      "rating": "7.3",
      "status": "available",
      "logo": "https://image.tmdb.org/t/p/w500/...",
      "backdrop": "https://image.tmdb.org/t/p/w1280/...",
      "trailerYoutubeId": "xKJmEC5ieOk",
      "streamUrl": "https://...sample.mp4",
      "description": "..."
    }
  ]
}
```

### `POST /api/movies/:id/play`
Simulates starting playback for a movie. Logs the event server-side.

**Response:**
```json
{ "status": "ok", "movie_id": "1" }
```

---

## ✨ Features

### 🎥 Movie Browsing
- Cinematic hero banner that auto-cycles through featured movies every 7 seconds
- Three categorized movie rows — Trending, Action & Thrillers, Staff Picks
- Real official movie posters from TMDB image CDN
- Wide cinematic backdrop images used in the hero section

### 🖱️ Hover Preview
- Hovering a card fades out the poster and plays an MP4 stock video preview
- Only one card plays at a time
- Genre-colored glow border, star rating, and quick-add button appear on hover
- 300ms delay prevents accidental triggers on fast mouse-overs

### ▶️ Video Player
- Clicking a movie hides the main page and opens fullscreen player
- Plays the **official YouTube trailer** embedded directly (fetched via TMDB + IMDb ID)
- Toggle button to switch between YouTube trailer and MP4 sample stream
- Full controls: play/pause, seek bar, −10s/+10s skip, volume, fullscreen
- Video quality selector: Auto / 480p / 720p / 1080p HD / 1440p QHD / 2160p 4K
- Controls fade after 3 seconds of mouse inactivity
- Back button returns to the main page and stops playback

### ↩️ Continue Watching
- Progress saves automatically every 5 seconds while watching
- Movies appear in a "Continue Watching" row on the home page
- Click to resume from exactly where you left off
- Progress bar shows percentage watched
- ✕ button to remove from the row
- Persists across page refreshes (localStorage)

### ♥ My List
- Add any movie from the card, hero banner, or player
- Dedicated My List page accessible from the header
- Unlist confirmation popup inside the player
- Count badge shown in the header nav

### 👤 Profile System
- Three profiles: Nex, Guest, Kids
- Active profile persists in localStorage
- Profile modal shows stats, Continue Watching shortcut, settings links

### 🆘 Help Page
- Accessible from the profile dropdown
- Contact via email and LinkedIn
- FAQ section covering all major features

---

## 📹 Video Source Explanation

| Source | Used For |
|---|---|
| **TMDB Image CDN** (`image.tmdb.org`) | High-quality official movie posters and backdrop images |
| **YouTube (via TMDB trailer data)** | Official trailers played in the fullscreen player |
| **Google GTV CDN** (`commondatastorage.googleapis.com`) | Free public MP4 sample videos used for hover previews |

The app uses each movie's **IMDb ID** to query the TMDB API at runtime, which returns the official TMDB movie entry. From there it fetches the poster, backdrop, and the official YouTube trailer key — so every movie displays its real poster and plays its real trailer.

---

## 🎨 Design Highlights

- Dark cinematic theme with ambient red/orange gradient mesh background
- `Bebas Neue` for titles, `DM Sans` for body, `Space Mono` for metadata
- 60fps animations using `cubic-bezier(0.16, 1, 0.3, 1)` (iOS expo-out easing)
- Staggered card entrance animations
- Grain texture overlay for depth
- Genre-colored accents throughout (each genre has its own color)
- Fully responsive: 3-column → 2-column → 1-column grid

---

## 📦 Dependencies

### Backend
```
flask
flask-cors
```

### Frontend
```
react
react-dom
vite
@vitejs/plugin-react
```

---

## 👤 Author

**Thomas Paul CJ**
- LinkedIn: [linkedin.com/in/thomaspaulcj](https://www.linkedin.com/in/thomaspaulcj/)
- Email: xyz123@gmail.com
