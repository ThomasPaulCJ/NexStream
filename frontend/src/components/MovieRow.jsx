import { useState, useRef, useEffect } from "react"
import { useApp } from "../context/AppContext"

const GENRE_COLORS = {
  Action:"#e50914", Thriller:"#ff6b35", Drama:"#c9a84c",
  Comedy:"#4ecdc4", Animation:"#a78bfa", "Sci-Fi":"#38bdf8",
  Adventure:"#fb923c", Documentary:"#86efac",
}

function LandscapeCard({ movie, index, rowIndex }) {
  const { playMovie, toggleMyList, myList } = useApp()
  const [hovered,    setHovered]    = useState(false)
  const [imgError,   setImgError]   = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const videoRef = useRef(null)
  const hoverTimer = useRef(null)

  const accent = GENRE_COLORS[movie.genre] || "#e50914"
  const inList = myList.find(m => m.id === movie.id)

  // Delay video start slightly so fast mouse-overs don't flicker
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (hovered) {
      hoverTimer.current = setTimeout(() => {
        v.currentTime = 0
        v.play().catch(() => {})
      }, 300)
    } else {
      clearTimeout(hoverTimer.current)
      v.pause()
      v.currentTime = 0
      setVideoReady(false)
    }
    return () => clearTimeout(hoverTimer.current)
  }, [hovered])

  const fallbackPoster = `https://picsum.photos/seed/${movie.id}movie/640/360`
  const poster = imgError ? fallbackPoster : movie.logo

  return (
    <article
      onClick={() => playMovie(movie)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        aspectRatio: "16/9",
        borderRadius: "7px",
        overflow: "hidden",
        cursor: "pointer",
        background: "#0e0e0e",
        border: `1px solid ${hovered ? accent + "55" : "rgba(255,255,255,0.05)"}`,
        transform: hovered ? "scale(1.055) translateY(-6px)" : "scale(1) translateY(0)",
        transition: "transform 0.4s var(--ease-out-expo), box-shadow 0.4s ease, border-color 0.3s ease",
        boxShadow: hovered
          ? `0 22px 55px rgba(0,0,0,0.85), 0 0 30px ${accent}25`
          : "0 3px 14px rgba(0,0,0,0.5)",
        animation: `fadeUp 0.5s ${(rowIndex * 0.12) + (index * 0.07)}s var(--ease-out-expo) both`,
        zIndex: hovered ? 10 : 1,
        willChange: "transform",
      }}
    >
      {/* ── Real TMDB Poster ── */}
      <img
        src={poster}
        alt={movie.name}
        onError={() => setImgError(true)}
        style={{
          width: "100%", height: "100%",
          objectFit: "cover",
          position: "absolute", inset: 0,
          opacity: hovered && videoReady ? 0 : 1,
          transition: "opacity 0.5s ease, transform 0.6s ease",
          transform: hovered ? "scale(1.05)" : "scale(1)",
        }}
      />

      {/* ── MP4 Stock Video on hover ── */}
      <video
        ref={videoRef}
        src={movie.previewUrl}
        muted
        loop
        playsInline
        preload="metadata"
        onCanPlay={() => setVideoReady(true)}
        style={{
          width: "100%", height: "100%",
          objectFit: "cover",
          position: "absolute", inset: 0,
          opacity: hovered && videoReady ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}
      />

      {/* ── Gradient overlay ── */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)",
      }} />

      {/* ── Genre badge top-left ── */}
      <div style={{
        position: "absolute", top: "10px", left: "10px",
        background: `${accent}22`,
        border: `1px solid ${accent}44`,
        borderRadius: "3px", padding: "3px 8px",
        fontFamily: "Space Mono, monospace", fontSize: "0.46rem",
        color: accent, letterSpacing: "0.12em", textTransform: "uppercase",
        backdropFilter: "blur(6px)",
      }}>{movie.genre}</div>

      {/* ── Rating pill top-right ── */}
      <div style={{
        position: "absolute", top: "10px", right: "10px",
        background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "3px", padding: "2px 7px",
        fontFamily: "Space Mono, monospace", fontSize: "0.48rem",
        color: "#f5c518", letterSpacing: "0.06em",
        opacity: hovered ? 1 : 0,
        transition: "opacity 0.3s ease",
      }}>★ {movie.rating}</div>

      {/* ── Add to My List button ── */}
      <button
        onClick={e => { e.stopPropagation(); toggleMyList(movie) }}
        title={inList ? "Remove from My List" : "Add to My List"}
        style={{
          position: "absolute", top: "36px", right: "10px",
          width: "26px", height: "26px", borderRadius: "50%",
          background: inList ? accent : "rgba(0,0,0,0.7)",
          backdropFilter: "blur(8px)",
          border: `1px solid ${inList ? accent : "rgba(255,255,255,0.2)"}`,
          color: "#fff", fontSize: "0.75rem",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateY(0) scale(1)" : "translateY(-4px) scale(0.85)",
          transition: "opacity 0.25s ease, transform 0.3s var(--ease-out-expo), background 0.2s",
        }}
      >{inList ? "✓" : "+"}</button>

      {/* ── PLAY label shown on hover ── */}
      {hovered && (
        <div style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          width: "44px", height: "44px", borderRadius: "50%",
          background: "rgba(229,9,20,0.85)", backdropFilter: "blur(6px)",
          boxShadow: `0 0 24px ${accent}80`,
          animation: "fadeInScale 0.2s ease",
          pointerEvents: "none",
          fontSize: "1rem", color: "#fff",
        }}>▶</div>
      )}

      {/* ── Title + year ── */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        padding: "10px 12px",
      }}>
        <div style={{
          fontFamily: "Bebas Neue, sans-serif",
          fontSize: "clamp(0.78rem, 1.4vw, 0.98rem)",
          letterSpacing: "0.05em", color: "#fff",
          marginBottom: "2px", lineHeight: 1,
          textShadow: "0 1px 6px rgba(0,0,0,0.9)",
        }}>{movie.name}</div>
        <div style={{
          fontFamily: "Space Mono, monospace",
          fontSize: "0.46rem", color: "#555",
        }}>{movie.year}</div>
      </div>

      {/* Scanline shimmer on hover */}
      {hovered && (
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "linear-gradient(transparent 50%, rgba(0,0,0,0.06) 50%)",
          backgroundSize: "100% 4px", opacity: 0.3,
          animation: "shimmer 2s linear infinite",
        }} />
      )}
    </article>
  )
}

export default function MovieRow({ label, movies, rowIndex = 0 }) {
  if (!movies?.length) return null

  return (
    <section style={{
      padding: "0 clamp(24px,5vw,64px)",
      marginBottom: "clamp(28px,4vw,44px)",
      animation: `fadeUp 0.5s ${rowIndex * 0.1}s var(--ease-out-expo) both`,
    }}>
      {/* Row header */}
      <div style={{
        display: "flex", alignItems: "center",
        gap: "14px", marginBottom: "14px",
      }}>
        <h3 style={{
          fontFamily: "DM Sans, sans-serif",
          fontSize: "clamp(0.82rem, 1.3vw, 0.98rem)",
          fontWeight: 500, color: "#c0c0c0",
          whiteSpace: "nowrap",
        }}>{label}</h3>
        <div style={{
          flex: 1, height: "1px",
          background: "linear-gradient(to right, rgba(255,255,255,0.06), transparent)",
        }} />
        <span style={{
          fontFamily: "Space Mono, monospace",
          fontSize: "0.46rem", color: "#2a2a2a",
          letterSpacing: "0.18em", cursor: "pointer",
          transition: "color 0.2s",
        }}
        onMouseEnter={e => e.currentTarget.style.color = "#666"}
        onMouseLeave={e => e.currentTarget.style.color = "#2a2a2a"}
        >SEE ALL →</span>
      </div>

      {/* Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "clamp(10px, 1.5vw, 18px)",
      }}>
        {movies.map((movie, i) => (
          <LandscapeCard
            key={movie.id}
            movie={movie}
            index={i}
            rowIndex={rowIndex}
          />
        ))}
      </div>
    </section>
  )
}
