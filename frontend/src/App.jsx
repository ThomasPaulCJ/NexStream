import { useEffect, useState } from "react"
import { AppProvider, useApp } from "./context/AppContext"
import LoadingScreen from "./components/LoadingScreen"
import Header from "./components/Header"
import Player from "./components/Player"
import HeroBanner from "./components/HeroBanner"
import MovieRow from "./components/MovieRow"

const ROWS = [
  { label: "🔥 Trending Now",       slice: [0, 3] },
  { label: "⚡ Action & Thrillers",  slice: [3, 6] },
  { label: "🎬 Staff Picks",         slice: [6, 9] },
]

function MyListPage() {
  const { myList, playMovie } = useApp()
  return (
    <div style={{ padding:"100px clamp(24px,5vw,64px) 60px", minHeight:"100vh" }}>
      <div style={{ marginBottom:"32px" }}>
        <div style={{ fontFamily:"Space Mono,monospace", fontSize:"0.6rem", letterSpacing:"0.35em", color:"#e50914", textTransform:"uppercase", marginBottom:"10px" }}>Your Collection</div>
        <h1 style={{ fontFamily:"Bebas Neue,sans-serif", fontSize:"clamp(2.5rem,6vw,4.5rem)", letterSpacing:"0.04em", color:"#fff" }}>My List</h1>
      </div>
      {myList.length === 0 ? (
        <div style={{ textAlign:"center", padding:"80px 20px" }}>
          <div style={{ fontSize:"3rem", marginBottom:"16px", opacity:0.2 }}>♥</div>
          <div style={{ fontFamily:"DM Sans,sans-serif", color:"#444", fontSize:"0.9rem" }}>Your list is empty. Add movies from the home page.</div>
        </div>
      ) : (
        <div className="movie-grid">
          {myList.map((movie, i) => (
            <article key={movie.id} onClick={() => playMovie(movie)} style={{
              aspectRatio:"16/9", borderRadius:"6px", overflow:"hidden",
              cursor:"pointer", position:"relative",
              animation:`fadeUp 0.4s ${i*0.06}s var(--ease-out-expo) both`,
              border:"1px solid rgba(255,255,255,0.06)",
              transition:"transform 0.3s var(--ease-out-expo), box-shadow 0.3s ease",
            }}
            onMouseEnter={e=>{ e.currentTarget.style.transform="scale(1.04) translateY(-4px)"; e.currentTarget.style.boxShadow="0 20px 50px rgba(0,0,0,0.8)" }}
            onMouseLeave={e=>{ e.currentTarget.style.transform="scale(1) translateY(0)"; e.currentTarget.style.boxShadow="none" }}
            >
              <img src={movie.logo} alt={movie.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
              <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%)" }} />
              <div style={{ position:"absolute", bottom:"10px", left:"12px", fontFamily:"Bebas Neue,sans-serif", fontSize:"1rem", color:"#fff", letterSpacing:"0.05em" }}>{movie.name}</div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

function MoviesPage() {
  const { movies, playMovie } = useApp()
  return (
    <div style={{ paddingTop:"80px" }}>
      <div style={{ padding:"32px clamp(24px,5vw,64px) 24px" }}>
        <div style={{ fontFamily:"Space Mono,monospace", fontSize:"0.6rem", letterSpacing:"0.35em", color:"#e50914", textTransform:"uppercase", marginBottom:"10px" }}>Browse All</div>
        <h1 style={{ fontFamily:"Bebas Neue,sans-serif", fontSize:"clamp(2.5rem,6vw,4.5rem)", letterSpacing:"0.04em", color:"#fff" }}>All Movies</h1>
      </div>
      <MovieRow label="All Titles" movies={movies} rowIndex={0} />
    </div>
  )
}

function HomePage() {
  const { movies, loading, error } = useApp()
  return (
    <>
      {!loading && !error && movies.length > 0 && <HeroBanner movies={movies} />}
      <div style={{ position:"relative", zIndex:1 }}>
        {loading && (
          <div style={{ padding:"80px clamp(24px,5vw,64px)" }}>
            {[...Array(3)].map((_, ri) => (
              <div key={ri} style={{ marginBottom:"40px" }}>
                <div className="skeleton" style={{ width:"200px", height:"16px", borderRadius:"3px", marginBottom:"16px" }} />
                <div className="movie-grid">
                  {[...Array(3)].map((_, ci) => (
                    <div key={ci} className="skeleton" style={{ aspectRatio:"16/9", borderRadius:"6px" }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        {error && (
          <div style={{ textAlign:"center", padding:"120px 20px", fontFamily:"Space Mono,monospace" }}>
            <div style={{ fontSize:"2rem", marginBottom:"16px", opacity:0.3 }}>⚠</div>
            <div style={{ color:"#e50914", fontSize:"0.72rem", letterSpacing:"0.2em", marginBottom:"8px" }}>CONNECTION FAILED</div>
            <div style={{ color:"#444", fontSize:"0.62rem" }}>Is Flask running on port 5000?</div>
          </div>
        )}
        {!loading && !error && ROWS.map((row, i) => (
          <MovieRow
            key={row.label}
            label={row.label}
            movies={movies.slice(...row.slice)}
            rowIndex={i}
          />
        ))}
      </div>
    </>
  )
}

function AppInner() {
  const { loadMovies, activeMovie, currentPage } = useApp()
  const [introComplete, setIntroComplete] = useState(false)

  useEffect(() => { loadMovies() }, [loadMovies])

  const pages = { home: <HomePage />, movies: <MoviesPage />, mylist: <MyListPage />, series: <HomePage /> }

  return (
    <>
      <LoadingScreen onDone={() => setIntroComplete(true)} />

      {/* Ambient BG */}
      <div style={{
        position:"fixed", inset:0, zIndex:0, pointerEvents:"none",
        background:`
          radial-gradient(ellipse 80% 50% at 10% 20%, rgba(229,9,20,0.055) 0%, transparent 60%),
          radial-gradient(ellipse 60% 40% at 90% 80%, rgba(255,107,53,0.035) 0%, transparent 60%)
        `,
      }} />

      <div style={{
        minHeight:"100vh", position:"relative", zIndex:1,
        opacity: introComplete ? 1 : 0,
        transition:"opacity 0.7s ease",
        display: activeMovie ? "none" : "block",
      }}>
        <Header />

        {/* Page content with smooth page transitions */}
        <div key={currentPage} style={{ animation:"fadeIn 0.35s ease" }}>
          {pages[currentPage] || <HomePage />}
        </div>

        <footer style={{
          borderTop:"1px solid rgba(255,255,255,0.04)",
          padding:"20px clamp(24px,5vw,64px)",
          display:"flex", justifyContent:"space-between",
          alignItems:"center", flexWrap:"wrap", gap:"10px",
        }}>
          <span style={{
            fontFamily:"Bebas Neue,sans-serif", fontSize:"0.95rem",
            letterSpacing:"0.15em",
            background:"linear-gradient(135deg,#e50914,#ff6b35)",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
          }}>NEXSTREAM</span>
          <span style={{ fontFamily:"Space Mono,monospace", fontSize:"0.5rem", color:"#222", letterSpacing:"0.12em" }}>
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
