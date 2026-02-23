import { createContext, useContext, useReducer, useCallback } from "react"
import { fetchMovies, postPlay } from "../services/api"

const AppContext = createContext(null)

const initialState = {
  movies: [],
  loading: true,
  error: null,
  activeMovie: null,
  hoveredId: null,
  currentPage: "home",   // "home" | "movies" | "mylist" | "series"
  myList: [],
  showProfile: false,
}

function reducer(state, action) {
  switch (action.type) {
    case "SET_MOVIES":      return { ...state, movies: action.payload, loading: false, error: null }
    case "SET_LOADING":     return { ...state, loading: action.payload }
    case "SET_ERROR":       return { ...state, error: action.payload, loading: false }
    case "SET_ACTIVE":      return { ...state, activeMovie: action.payload }
    case "SET_HOVERED":     return { ...state, hoveredId: action.payload }
    case "SET_PAGE":        return { ...state, currentPage: action.payload, showProfile: false }
    case "TOGGLE_MYLIST": {
      const exists = state.myList.find(m => m.id === action.payload.id)
      return {
        ...state,
        myList: exists
          ? state.myList.filter(m => m.id !== action.payload.id)
          : [...state.myList, action.payload],
      }
    }
    case "TOGGLE_PROFILE":  return { ...state, showProfile: !state.showProfile }
    case "CLOSE_PROFILE":   return { ...state, showProfile: false }
    default:                return state
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

  const playMovie = useCallback(async (movie) => {
    try { await postPlay(movie.id) } catch (e) { console.warn("postPlay:", e) }
    dispatch({ type: "SET_ACTIVE", payload: movie })
  }, [])

  const stopMovie  = useCallback(() => dispatch({ type: "SET_ACTIVE", payload: null }), [])
  const setHovered = useCallback((id) => dispatch({ type: "SET_HOVERED", payload: id }), [])
  const setPage    = useCallback((p)  => dispatch({ type: "SET_PAGE", payload: p }), [])
  const toggleMyList   = useCallback((m) => dispatch({ type: "TOGGLE_MYLIST", payload: m }), [])
  const toggleProfile  = useCallback(() => dispatch({ type: "TOGGLE_PROFILE" }), [])
  const closeProfile   = useCallback(() => dispatch({ type: "CLOSE_PROFILE" }), [])

  return (
    <AppContext.Provider value={{
      ...state,
      loadMovies, playMovie, stopMovie, setHovered,
      setPage, toggleMyList, toggleProfile, closeProfile,
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
