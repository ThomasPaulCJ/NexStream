import { useState, useRef, useEffect } from "react"
import { useApp } from "../context/AppContext"

const GENRE_COLORS = {
  Action:"#e50914", Thriller:"#ff6b35", Drama:"#c9a84c",
  Comedy:"#4ecdc4", Animation:"#a78bfa", "Sci-Fi":"#38bdf8",
  Adventure:"#fb923c", Documentary:"#86efac",
}

function LandscapeCard({ movie, index, rowIndex }) {
  const { playMovie, toggleMyList, myList } = useApp()
  const [hovered, setHovered]       = useState(false)
  const [imgError, setImgError]     = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const videoRef  = useRef(null)
  const accent    = GENRE_COLORS[movie.genre] || "#e50914"
  const inList    = myList.find(m => m.id === movie.id)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (hovered) {
      v.currentTime = 0
      v.play().catch(() => {})
    } else {
      v.pause(); v.currentTime = 0; setVideoReady(false)
    }
  }, [hovered])

  return (
    <article
      onClick={() => playMovie(movie)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position:"relative", aspectRatio:"16/9",
        borderRadius:"6px", overflow:"hidden",
        cursor:"pointer", background:"#0e0e0e",
        border:`1px solid ${hovered ? accent+"55" : "rgba(255,255,255,0.05)"}`,
        transform: hovered ? "scale(1.055) translateY(-6px)" : "scale(1) translateY(0)",
        transition:"transform 0.4s var(--ease-out-expo), box-shadow 0.4s ease, border-color 0.3s ease",
        boxShadow: hovered
          ? `0 22px 55px rgba(0,0,0,0.85), 0 0 28px ${accent}20`
          : "0 3px 14px rgba(0,0,0,0.5)",
        animation:`fadeUp 0.5s ${(rowIndex * 0.12) + (index * 0.07)}s var(--ease-out-expo) both`,
        zIndex: hovered ? 10 : 1,
        willChange: "transform",
      }}
    >
      <img
        src={imgError ? `https://picsum.photos/seed/${movie.id}px/640/360` : movie.logo}
        alt={movie.name} onError={() => setImgError(true)}
        style={{
          width:"100%", height:"100%", objectFit:"cover",
          position:"absolute", inset:0,
          opacity:(hovered && videoReady) ? 0 : 1,
          transition:"opacity 0.45s ease",
          transform: hovered ? "scale(1.03)" : "scale(1)",
          // zoom slightly even on poster
          transitionProperty: "opacity, transform",
        }}
      />
      <video
        ref={videoRef} src={movie.previewUrl}
        muted loop playsInline preload="metadata"
        onCanPlay={() => setVideoReady(true)}
        style={{
          width:"100%", height:"100%", objectFit:"cover",
          position:"absolute", inset:0,
          opacity:(hovered && videoReady) ? 1 : 0,
          transition:"opacity 0.5s ease",
        }}
      />

      {/* Gradient */}
      <div style={{
        position:"absolute", inset:0,
        background:"linear-gradient(to top, rgba(0,0,0,0.94) 0%, rgba(0,0,0,0.08) 55%, transparent 100%)",
      }} />

      {/* Genre + rating */}
      <div style={{
        position:"absolute", top:"10px", left:"10px", right:"10px",
        display:"flex", justifyContent:"space-between",
        opacity: hovered ? 1 : 0.7,
        transition:"opacity 0.3s ease",
      }}>
        <span style={{
          fontFamily:"Space Mono,monospace", fontSize:"0.48rem",
          letterSpacing:"0.12em", textTransform:"uppercase",
          color:accent, background:accent+"22",
          border:`1px solid ${accent}44`,
          padding:"3px 7px", borderRadius:"2px", backdropFilter:"blur(4px)",
        }}>{movie.genre}</span>
        <span style={{
          fontFamily:"Space Mono,monospace", fontSize:"0.5rem",
          color:"#c9a84c", background:"rgba(0,0,0,0.65)",
          padding:"3px 7px", borderRadius:"2px", backdropFilter:"blur(4px)",
          opacity: hovered ? 1 : 0,
          transition:"opacity 0.3s ease",
        }}>★ {movie.rating}</span>
      </div>

      {/* Add to list btn — only on hover */}
      <button
        onClick={e => { e.stopPropagation(); toggleMyList(movie) }}
        style={{
          position:"absolute", top:"10px", right: hovered ? "10px" : "-40px",
          width:"28px", height:"28px", borderRadius:"50%",
          background: inList ? "rgba(229,9,20,0.9)" : "rgba(0,0,0,0.7)",
          border:`1px solid ${inList ? "#e50914" : "rgba(255,255,255,0.2)"}`,
          color: inList ? "#fff" : "#ccc",
          fontSize:"0.75rem", cursor:"pointer",
          display:"flex", alignItems:"center", justifyContent:"center",
          transition:"all 0.3s var(--ease-out-expo)",
          backdropFilter:"blur(8px)",
          opacity: hovered ? 1 : 0,
        }}
      >{inList ? "✓" : "+"}</button>

      {/* Bottom info */}
      <div style={{
        position:"absolute", bottom:0, left:0, right:0, padding:"10px 12px",
      }}>
        <div style={{
          fontFamily:"Bebas Neue,sans-serif",
          fontSize:"clamp(0.85rem,1.6vw,1.1rem)",
          letterSpacing:"0.05em", color:"#fff", lineHeight:1,
          marginBottom: hovered ? "6px" : "0",
          transition:"margin 0.3s ease",
        }}>{movie.name}</div>

        <div style={{
          overflow:"hidden",
          maxHeight: hovered ? "30px" : "0",
          opacity: hovered ? 1 : 0,
          transition:"max-height 0.35s var(--ease-out-expo), opacity 0.3s ease",
          display:"flex", gap:"10px", alignItems:"center",
        }}>
          <span style={{ fontFamily:"Space Mono,monospace", fontSize:"0.52rem", color:"#666" }}>{movie.year}</span>
          <span style={{ fontFamily:"DM Sans,sans-serif", fontSize:"0.62rem", color:accent, fontWeight:600, letterSpacing:"0.08em" }}>▶ PLAY</span>
        </div>
      </div>

      {/* Scanline shimmer on hover */}
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none",
        opacity: hovered ? 0.4 : 0,
        transition:"opacity 0.4s ease",
        background:`repeating-linear-gradient(transparent, transparent 2px, ${accent}05 2px, ${accent}05 4px)`,
      }} />
    </article>
  )
}

export default function MovieRow({ label, movies, rowIndex }) {
  return (
    <div style={{
      padding:"0 clamp(24px,5vw,64px)",
      marginBottom:"clamp(28px,4vw,48px)",
      animation:`fadeUp 0.5s ${rowIndex * 0.12}s var(--ease-out-expo) both`,
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:"14px", marginBottom:"14px" }}>
        <h3 style={{
          fontFamily:"DM Sans,sans-serif", fontSize:"clamp(0.85rem,1.3vw,1rem)",
          fontWeight:500, color:"#d0d0d0", letterSpacing:"0.02em",
        }}>{label}</h3>
        <div style={{ flex:1, height:"1px", background:"linear-gradient(to right,rgba(255,255,255,0.06),transparent)" }} />
        <span style={{
          fontFamily:"Space Mono,monospace", fontSize:"0.52rem",
          color:"#3a3a3a", letterSpacing:"0.15em", cursor:"pointer",
          transition:"color 0.25s ease",
        }}
        onMouseEnter={e=>e.target.style.color="#888"}
        onMouseLeave={e=>e.target.style.color="#3a3a3a"}
        >SEE ALL →</span>
      </div>

      <div className="movie-grid">
        {movies.map((movie, i) => (
          <LandscapeCard key={movie.id} movie={movie} index={i} rowIndex={rowIndex} />
        ))}
      </div>
    </div>
  )
}
