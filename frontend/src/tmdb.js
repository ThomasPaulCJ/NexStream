/**
 * TMDB client — runs in the browser, fetches live posters + trailers.
 * Free public read-only API key (v3 auth, no secrets needed).
 */

const TMDB_KEY  = "2dca580c2a14b55200e784d157207b4d"
const TMDB_BASE = "https://api.themoviedb.org/3"
const IMG_BASE  = "https://image.tmdb.org/t/p"

async function tmdbGet(path, params = {}) {
  const url = new URL(`${TMDB_BASE}${path}`)
  url.searchParams.set("api_key", TMDB_KEY)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  const r = await fetch(url.toString())
  if (!r.ok) throw new Error(`TMDB ${path}: ${r.status}`)
  return r.json()
}

/**
 * Given an IMDb ID (e.g. "tt1396484"), return enriched movie data:
 * { poster, backdrop, trailerYoutubeId, tmdbId, overview, tagline }
 */
export async function enrichFromTMDB(imdbId) {
  if (!imdbId) return {}

  // 1. Find TMDB movie from IMDb ID
  const find = await tmdbGet(`/find/${imdbId}`, { external_source: "imdb_id" })
  const result = find.movie_results?.[0]
  if (!result) return {}

  const tmdbId = result.id
  const poster   = result.poster_path   ? `${IMG_BASE}/w500${result.poster_path}`   : null
  const backdrop = result.backdrop_path ? `${IMG_BASE}/w1280${result.backdrop_path}` : null

  // 2. Fetch videos (trailers)
  let trailerYoutubeId = null
  try {
    const videos = await tmdbGet(`/movie/${tmdbId}/videos`)
    const results = videos.results || []

    // Prefer official YouTube trailer
    let trailer =
      results.find(v => v.site === "YouTube" && v.type === "Trailer" && v.official) ||
      results.find(v => v.site === "YouTube" && v.type === "Trailer") ||
      results.find(v => v.site === "YouTube" && v.type === "Teaser")

    if (trailer) trailerYoutubeId = trailer.key
  } catch (e) {
    console.warn("TMDB videos fetch failed:", e)
  }

  return { poster, backdrop, trailerYoutubeId, tmdbId }
}

/**
 * Enrich a full array of movies in parallel (with fallback to existing data).
 */
export async function enrichMovies(movies) {
  const enriched = await Promise.allSettled(
    movies.map(async (movie) => {
      if (!movie.imdbId) return movie
      try {
        const data = await enrichFromTMDB(movie.imdbId)
        return {
          ...movie,
          logo:             data.poster      || movie.logo,
          backdrop:         data.backdrop    || movie.backdrop || movie.logo,
          trailerYoutubeId: data.trailerYoutubeId || movie.trailerYoutubeId,
        }
      } catch (e) {
        console.warn(`TMDB enrich failed for ${movie.name}:`, e)
        return movie
      }
    })
  )
  return enriched.map(r => r.status === "fulfilled" ? r.value : r.reason)
}
