from flask import Flask, jsonify, request
from flask_cors import CORS
import json, os, urllib.request, urllib.parse

app = Flask(__name__)
CORS(app)

# ── TMDB config ──────────────────────────────────────────────────────────────
TMDB_KEY  = "2dca580c2a14b55200e784d157207b4d"   # public demo key (read-only)
TMDB_BASE = "https://api.themoviedb.org/3"
IMG_BASE  = "https://image.tmdb.org/t/p"

MOVIES_FILE = os.path.join(os.path.dirname(__file__), "movies.json")

def tmdb_get(path, params=None):
    """Call TMDB API and return parsed JSON."""
    p = {"api_key": TMDB_KEY}
    if params: p.update(params)
    url = f"{TMDB_BASE}{path}?{urllib.parse.urlencode(p)}"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        resp = urllib.request.urlopen(req, timeout=6)
        return json.loads(resp.read())
    except Exception as e:
        print(f"TMDB error: {e}")
        return {}

def enrich_movie(movie):
    """Fetch live poster, backdrop, and trailer from TMDB using imdbId."""
    imdb_id = movie.get("imdbId")
    if not imdb_id:
        return movie

    # Find TMDB id from imdb id
    find = tmdb_get(f"/find/{imdb_id}", {"external_source": "imdb_id"})
    results = find.get("movie_results", [])
    if not results:
        return movie

    tmdb_movie = results[0]
    tmdb_id = tmdb_movie["id"]

    # Poster & backdrop
    poster   = tmdb_movie.get("poster_path")
    backdrop = tmdb_movie.get("backdrop_path")
    if poster:
        movie["logo"] = f"{IMG_BASE}/w500{poster}"
    if backdrop:
        movie["backdrop"] = f"{IMG_BASE}/w1280{backdrop}"

    # Trailer (official YouTube)
    videos = tmdb_get(f"/movie/{tmdb_id}/videos")
    trailer_id = None
    for v in videos.get("results", []):
        if v.get("site") == "YouTube" and v.get("type") == "Trailer" and v.get("official"):
            trailer_id = v["key"]
            break
    # Fallback: any YouTube trailer
    if not trailer_id:
        for v in videos.get("results", []):
            if v.get("site") == "YouTube" and v.get("type") == "Trailer":
                trailer_id = v["key"]
                break
    if trailer_id:
        movie["trailerYoutubeId"] = trailer_id

    return movie

@app.route("/movies", methods=["GET"])
def get_movies():
    with open(MOVIES_FILE) as f:
        movies = json.load(f)

    enriched = []
    for m in movies:
        enriched.append(enrich_movie(dict(m)))

    return jsonify({"movies": enriched})

@app.route("/api/movies/<movie_id>/play", methods=["POST"])
def play_movie(movie_id):
    return jsonify({"status": "ok", "movie_id": movie_id})

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
