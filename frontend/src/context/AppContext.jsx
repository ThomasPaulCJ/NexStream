import { createContext, useContext, useReducer, useCallback, useEffect } from "react"
import { fetchMovies, postPlay } from "../services/api"

const AppContext = createContext(null)

// ── Persist continueWatching + myList to localStorage ──────────────────────
const loadPersisted = () => {
  try {
    return {
      myList:           JSON.parse(localStorage.getItem("nex_mylist")           || "[]"),
      continueWatching: JSON.parse(localStorage.getItem("nex_continue")         || "[]"),
      activeProfile:    JSON.parse(localStorage.getItem("nex_profile")          || '"Nex"'),
    }
  } catch { return { myList: [], continueWatching: [], activeProfile: "Nex" } }
}

const persisted = loadPersisted()

const initialState = {
  movies:           [],
  loading:          true,
  error:            null,
  activeMovie:      null,
  hoveredId:        null,
  currentPage:      "home",
  myList:           persisted.myList,
  showProfile:      false,
  activeProfile:    persisted.activeProfile,   // "Nex" | "Guest" | "Kids"
  continueWatching: persisted.continueWatching,
}

function reducer(state, action) {
  switch (action.type) {
    case "SET_MOVIES":  return { ...state, movies: action.payload, loading: false, error: null }
    case "SET_LOADING": return { ...state, loading: action.payload }
    case "SET_ERROR":   return { ...state, error: action.payload, loading: false }
    case "SET_ACTIVE":  return { ...state, activeMovie: action.payload }
    case "SET_HOVERED": return { ...state, hoveredId: action.payload }
    case "SET_PAGE":    return { ...state, currentPage: action.payload, showProfile: false }
    case "SET_PROFILE": return { ...state, activeProfile: action.payload, showProfile: false }

    case "TOGGLE_MYLIST": {
      const exists = state.myList.find(m => m.id === action.payload.id)
      const myList = exists
        ? state.myList.filter(m => m.id !== action.payload.id)
        : [...state.myList, action.payload]
      localStorage.setItem("nex_mylist", JSON.stringify(myList))
      return { ...state, myList }
    }

    case "TOGGLE_PROFILE":  return { ...state, showProfile: !state.showProfile }
    case "CLOSE_PROFILE":   return { ...state, showProfile: false }

    case "UPDATE_CONTINUE": {
      const { movie, progress, duration } = action.payload
      if (!duration || progress < 5) return state
      const pct = progress / duration
      // Remove if >95% watched
      if (pct > 0.95) {
        const continueWatching = state.continueWatching.filter(c => c.movie.id !== movie.id)
        localStorage.setItem("nex_continue", JSON.stringify(continueWatching))
        return { ...state, continueWatching }
      }
      const entry = { movie, progress, duration, timestamp: Date.now() }
      const existing = state.continueWatching.find(c => c.movie.id === movie.id)
      const continueWatching = existing
        ? state.continueWatching.map(c => c.movie.id === movie.id ? entry : c)
        : [entry, ...state.continueWatching].slice(0, 6)
      localStorage.setItem("nex_continue", JSON.stringify(continueWatching))
      return { ...state, continueWatching }
    }

    case "REMOVE_CONTINUE": {
      const continueWatching = state.continueWatching.filter(c => c.movie.id !== action.payload)
      localStorage.setItem("nex_continue", JSON.stringify(continueWatching))
      return { ...state, continueWatching }
    }

    default: return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const loadMovies = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true })
    try {
      const data = await fetchMovies()
      dispatch({ type: "SET_MOVIES", payload: data.movies })
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err.message })
    }
  }, [])

  const playMovie = useCallback(async (movie, resumeTime = 0) => {
    try { await postPlay(movie.id) } catch (e) { console.warn(e) }
    dispatch({ type: "SET_ACTIVE", payload: { ...movie, resumeTime } })
  }, [])

  const stopMovie            = useCallback(() => dispatch({ type: "SET_ACTIVE", payload: null }), [])
  const setHovered           = useCallback((id) => dispatch({ type: "SET_HOVERED", payload: id }), [])
  const setPage              = useCallback((p)  => dispatch({ type: "SET_PAGE", payload: p }), [])
  const toggleMyList         = useCallback((m)  => dispatch({ type: "TOGGLE_MYLIST", payload: m }), [])
  const toggleProfile        = useCallback(()   => dispatch({ type: "TOGGLE_PROFILE" }), [])
  const closeProfile         = useCallback(()   => dispatch({ type: "CLOSE_PROFILE" }), [])
  const setProfile           = useCallback((p)  => {
    localStorage.setItem("nex_profile", JSON.stringify(p))
    dispatch({ type: "SET_PROFILE", payload: p })
  }, [])
  const updateContinue       = useCallback((d)  => dispatch({ type: "UPDATE_CONTINUE", payload: d }), [])
  const removeContinue       = useCallback((id) => dispatch({ type: "REMOVE_CONTINUE", payload: id }), [])

  return (
    <AppContext.Provider value={{
      ...state,
      loadMovies, playMovie, stopMovie, setHovered,
      setPage, toggleMyList, toggleProfile, closeProfile,
      setProfile, updateContinue, removeContinue,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be inside AppProvider")
  return ctx
}
