"""
Netflix Clone - Flask Backend
Exposes:
  GET  /movies          -> List all 9 movies
  POST /play/<movieId>  -> Simulate playback start (log + status change)
"""

import json
import logging
from datetime import datetime
from pathlib import Path

from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"])

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)

playback_log = []
movie_status = {}


def load_movies():
    data_path = Path(__file__).parent / "movies.json"
    with open(data_path, "r", encoding="utf-8") as fh:
        return json.load(fh)


def get_movie_by_id(movie_id):
    movies = load_movies()
    return next((m for m in movies if m["id"] == movie_id), None)


@app.get("/movies")
def list_movies():
    try:
        movies = load_movies()
        for movie in movies:
            movie["status"] = movie_status.get(movie["id"], movie.get("status", "available"))
        logger.info("GET /movies -> returning %d movies", len(movies))
        return jsonify({"success": True, "count": len(movies), "movies": movies}), 200
    except FileNotFoundError:
        logger.error("movies.json not found")
        return jsonify({"success": False, "error": "Movie database unavailable"}), 500
    except json.JSONDecodeError as exc:
        logger.error("JSON parse error: %s", exc)
        return jsonify({"success": False, "error": "Corrupted movie database"}), 500


@app.post("/play/<movie_id>")
def play_movie(movie_id):
    movie = get_movie_by_id(movie_id)
    if movie is None:
        logger.warning("POST /play/%s -> 404 Not Found", movie_id)
        return jsonify({"success": False, "error": f"Movie with id '{movie_id}' not found"}), 404

    for mid in movie_status:
        if movie_status[mid] == "playing":
            movie_status[mid] = "available"
    movie_status[movie_id] = "playing"

    event = {
        "movieId": movie_id,
        "movieName": movie["name"],
        "streamUrl": movie["streamUrl"],
        "startedAt": datetime.utcnow().isoformat() + "Z",
        "client_ip": request.remote_addr,
    }
    playback_log.append(event)
    logger.info("PLAYBACK STARTED | id=%s | name=%s | client=%s", movie_id, movie["name"], request.remote_addr)

    return jsonify({
        "success": True,
        "message": f"Playback started for '{movie['name']}'",
        "movie": {**movie, "status": "playing"},
        "streamUrl": movie["streamUrl"],
        "startedAt": event["startedAt"],
    }), 200


@app.get("/playback-log")
def get_playback_log():
    return jsonify({"success": True, "count": len(playback_log), "log": playback_log}), 200


@app.errorhandler(404)
def not_found(exc):
    return jsonify({"success": False, "error": "Route not found"}), 404

@app.errorhandler(405)
def method_not_allowed(exc):
    return jsonify({"success": False, "error": "Method not allowed"}), 405

@app.errorhandler(500)
def internal_error(exc):
    logger.exception("Unhandled server error")
    return jsonify({"success": False, "error": "Internal server error"}), 500


if __name__ == "__main__":
    logger.info("Netflix Clone API starting on http://localhost:5000")
    app.run(host="0.0.0.0", port=5000, debug=True)
