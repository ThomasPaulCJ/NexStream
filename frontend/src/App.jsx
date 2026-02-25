import { useEffect, useState } from "react"
import { AppProvider, useApp } from "./context/AppContext"
import LoadingScreen from "./components/LoadingScreen"
import Header from "./components/Header"
import Player from "./components/Player"
import HeroBanner from "./components/HeroBanner"
import MovieRow from "./components/MovieRow"
import ContinueWatching from "./components/ContinueWatching"
import HelpPage from "./components/HelpPage"

const ROWS = [
  { label: "🔥 Trending Now",       slice: [0, 3] },
  { label: "⚡ Action & Thrillers",  slice: [3, 6] },
  { label: "🎬 Staff Picks",         slice: [6, 9] },
]

// ── Pages ────────────────────────────────────────────────────────────────────

function HomePage() {
  const { movies, loading, error, continueWatching } = useApp()
  return (
    <>
      {!loading && !error && movies.length > 0 && <HeroBanner movies={movies} />}
      <div style={{ position: "relative", zIndex: 1, paddingBottom: "20px" }}>
        {loading && <SkeletonRows />}
        {error && <ErrorState error={error} />}
        {!loading && !error && (
          <>
            <ContinueWatching />
            {ROWS.map((row, i) => (
              <MovieRow
                key={row.label}
                label={row.label}
                movies={movies.slice(...row.slice)}
                rowIndex={continueWatching.length > 0 ? i + 1 : i}
              />
            ))}
          </>
        )}
      </div>
    </>
  )
}

function MoviesPage() {
  const { movies } = useApp()
  return (
    <div style={{ paddingTop: "80px" }}>
      <PageHeader label="Browse All" title="All Movies" />
      <MovieRow label="All Titles" movies={movies} rowIndex={0} />
    </div>
  )
}

function MyListPage() {
  const { myList, playMovie, toggleMyList } = useApp()
  return (
    <div style={{ padding: "100px clamp(24px,5vw,64px) 60px", minHeight: "80vh" }}>
      <PageHeader label="Your Collection" title="My List" />
      {myList.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <div style={{ fontSize: "3rem", marginBottom: "16px", opacity: 0.15 }}>♥</div>
          <div style={{ fontFamily: "DM Sans,sans-serif", color: "#444", fontSize: "0.88rem" }}>
            Your list is empty. Add movies from any card or the hero banner.
          </div>
        </div>
      ) : (
        <div className="movie-grid">
          {myList.map((movie, i) => (
            <article key={movie.id} style={{
              aspectRatio: "16/9", borderRadius: "7px", overflow: "hidden",
              cursor: "pointer", position: "relative",
              border: "1px solid rgba(255,255,255,0.06)",
              animation: `fadeUp 0.4s ${i * 0.06}s var(--ease-out-expo) both`,
              transition: "transform 0.35s var(--ease-out-expo), box-shadow 0.35s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform="scale(1.04) translateY(-4px)"; e.currentTarget.style.boxShadow="0 20px 50px rgba(0,0,0,0.8)" }}
            onMouseLeave={e => { e.currentTarget.style.transform="scale(1) translateY(0)"; e.currentTarget.style.boxShadow="none" }}
            >
              <img src={movie.logo} alt={movie.name} onClick={() => playMovie(movie)} style={{ width:"100%", height:"100%", objectFit:"cover", filter:"brightness(0.6)" }} />
              <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(0,0,0,0.9) 0%,transparent 60%)", pointerEvents:"none" }} />
              <div style={{ position:"absolute", bottom:"10px", left:"12px", fontFamily:"Bebas Neue,sans-serif", fontSize:"0.95rem", color:"#fff", letterSpacing:"0.05em" }} onClick={() => playMovie(movie)}>{movie.name}</div>
              {/* Remove from list */}
              <button
                onClick={e => { e.stopPropagation(); toggleMyList(movie) }}
                style={{
                  position:"absolute", top:"8px", right:"8px",
                  width:"26px", height:"26px", borderRadius:"50%",
                  background:"rgba(229,9,20,0.85)", border:"none",
                  color:"#fff", fontSize:"0.7rem", cursor:"pointer",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  transition:"transform 0.2s ease",
                }}
                onMouseEnter={e => e.currentTarget.style.transform="scale(1.15)"}
                onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}
                title="Remove from My List"
              >✕</button>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

function SeriesPage() {
  return (
    <div style={{ padding: "120px clamp(24px,5vw,64px) 60px", minHeight: "80vh", textAlign: "center" }}>
      <div style={{ fontSize: "3rem", marginBottom: "20px", opacity: 0.15 }}>📺</div>
      <div style={{ fontFamily: "Bebas Neue,sans-serif", fontSize: "2.5rem", color: "#333", letterSpacing: "0.1em" }}>COMING SOON</div>
      <div style={{ fontFamily: "DM Sans,sans-serif", color: "#333", fontSize: "0.85rem", marginTop: "10px" }}>Series content is on the way.</div>
    </div>
  )
}

// ── Shared UI ────────────────────────────────────────────────────────────────

function PageHeader({ label, title }) {
  return (
    <div style={{ padding: "24px clamp(24px,5vw,64px) 24px", animation: "fadeUp 0.4s var(--ease-out-expo) both" }}>
      <div style={{ fontFamily:"Space Mono,monospace", fontSize:"0.58rem", letterSpacing:"0.35em", color:"#e50914", textTransform:"uppercase", marginBottom:"8px" }}>{label}</div>
      <h1 style={{ fontFamily:"Bebas Neue,sans-serif", fontSize:"clamp(2.2rem,5vw,4rem)", letterSpacing:"0.04em", color:"#fff" }}>{title}</h1>
    </div>
  )
}

function SkeletonRows() {
  return (
    <div style={{ padding: "40px clamp(24px,5vw,64px)" }}>
      {[...Array(3)].map((_, ri) => (
        <div key={ri} style={{ marginBottom: "40px" }}>
          <div className="skeleton" style={{ width: "200px", height: "15px", borderRadius: "3px", marginBottom: "14px" }} />
          <div className="movie-grid">
            {[...Array(3)].map((_, ci) => (
              <div key={ci} className="skeleton" style={{ aspectRatio: "16/9", borderRadius: "6px" }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function ErrorState({ error }) {
  return (
    <div style={{ textAlign: "center", padding: "120px 20px", fontFamily: "Space Mono,monospace" }}>
      <div style={{ fontSize: "2rem", marginBottom: "16px", opacity: 0.25 }}>⚠</div>
      <div style={{ color: "#e50914", fontSize: "0.7rem", letterSpacing: "0.2em", marginBottom: "8px" }}>CONNECTION FAILED</div>
      <div style={{ color: "#333", fontSize: "0.6rem" }}>Is Flask running on port 5000?</div>
    </div>
  )
}

// ── Root ─────────────────────────────────────────────────────────────────────

function AppInner() {
  const { loadMovies, activeMovie, currentPage } = useApp()
  const [introComplete, setIntroComplete] = useState(false)

  useEffect(() => { loadMovies() }, [loadMovies])

  const PAGE_MAP = {
    home:   <HomePage />,
    movies: <MoviesPage />,
    mylist: <MyListPage />,
    series: <SeriesPage />,
    help:   <HelpPage />,
  }

  return (
    <>
      <LoadingScreen onDone={() => setIntroComplete(true)} />

      {/* Ambient BG glow */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        background: `
          radial-gradient(ellipse 80% 50% at 10% 20%, rgba(229,9,20,0.05) 0%, transparent 60%),
          radial-gradient(ellipse 60% 40% at 90% 80%, rgba(255,107,53,0.03) 0%, transparent 60%)
        `,
      }} />

      <div style={{
        minHeight: "100vh", position: "relative", zIndex: 1,
        opacity: introComplete ? 1 : 0,
        transition: "opacity 0.7s ease",
        display: activeMovie ? "none" : "block",
      }}>
        <Header />

        {/* Page with smooth transition */}
        <div key={currentPage} style={{ animation: "fadeIn 0.3s ease" }}>
          {PAGE_MAP[currentPage] || <HomePage />}
        </div>

        <footer style={{
          borderTop: "1px solid rgba(255,255,255,0.04)",
          padding: "18px clamp(24px,5vw,64px)",
          display: "flex", justifyContent: "space-between",
          alignItems: "center", flexWrap: "wrap", gap: "10px",
        }}>
          <span style={{
            fontFamily: "Bebas Neue,sans-serif", fontSize: "0.9rem",
            letterSpacing: "0.15em",
            background: "linear-gradient(135deg,#e50914,#ff6b35)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>NEXSTREAM</span>
          <span style={{ fontFamily: "Space Mono,monospace", fontSize: "0.48rem", color: "#1e1e1e", letterSpacing: "0.12em" }}>
            REACT + FLASK · {new Date().getFullYear()}
          </span>
        </footer>
      </div>

      <Player />
    </>
  )
}

export default function App() {
  return <AppProvider><AppInner /></AppProvider>
}
