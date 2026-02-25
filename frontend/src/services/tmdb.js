/**
 * TMDB client — fetches LIVE high-quality posters + official trailers
 * Falls back gracefully to static URLs already in movies.json
 */

const TMDB_KEY  = "2dca580c2a14b55200e784d157207b4d"
const TMDB_BASE = "https://api.themoviedb.org/3"
export const IMG_BASE = "https://image.tmdb.org/t/p"

async function tmdbGet(path, params = {}) {
  const url = new URL(`${TMDB_BASE}${path}`)
  url.searchParams.set("api_key", TMDB_KEY)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  const r = await fetch(url.toString())
  if (!r.ok) throw new Error(`TMDB ${path}: ${r.status}`)
  return r.json()
}

export async function enrichFromTMDB(imdbId) {
  if (!imdbId) return {}
  const find = await tmdbGet(`/find/${imdbId}`, { external_source: "imdb_id" })
  const result = find.movie_results?.[0]
  if (!result) return {}

  const tmdbId   = result.id
  const poster   = result.poster_path   ? `${IMG_BASE}/w500${result.poster_path}`   : null
  const backdrop = result.backdrop_path ? `${IMG_BASE}/w1280${result.backdrop_path}` : null

  // Fetch official YouTube trailer
  let trailerYoutubeId = null
  try {
    const { results = [] } = await tmdbGet(`/movie/${tmdbId}/videos`)
    const pick =
      results.find(v => v.site === "YouTube" && v.type === "Trailer" && v.official) ||
      results.find(v => v.site === "YouTube" && v.type === "Trailer") ||
      results.find(v => v.site === "YouTube" && v.type === "Teaser")
    if (pick) trailerYoutubeId = pick.key
  } catch (_) {}

  return { poster, backdrop, trailerYoutubeId }
}

export async function enrichMovies(movies) {
  const results = await Promise.allSettled(
    movies.map(async movie => {
      if (!movie.imdbId) return movie
      try {
        const data = await enrichFromTMDB(movie.imdbId)
        return {
          ...movie,
          // Only override if TMDB returned something — keep static fallback otherwise
          logo:             data.poster           || movie.logo,
          backdrop:         data.backdrop         || movie.backdrop,
          trailerYoutubeId: data.trailerYoutubeId || movie.trailerYoutubeId,
        }
      } catch (_) {
        return movie // silently fall back to static data
      }
    })
  )
  return results.map(r => r.status === "fulfilled" ? r.value : r.reason)
}
