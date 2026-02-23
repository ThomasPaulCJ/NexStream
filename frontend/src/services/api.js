const BASE_URL = ""

export async function fetchMovies() {
  const res = await fetch(`${BASE_URL}/movies`)
  if (!res.ok) throw new Error(`Failed to fetch movies: ${res.status}`)
  return res.json()
}

export async function postPlay(movieId) {
  const res = await fetch(`${BASE_URL}/play/${movieId}`, { method: "POST" })
  if (res.status === 404) throw new Error(`Movie ${movieId} not found`)
  if (!res.ok) throw new Error(`Playback request failed: ${res.status}`)
  return res.json()
}
