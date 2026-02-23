import { useRef, useEffect, useState } from "react"

const GENRE_COLORS = {
  Action:"#e50914", Thriller:"#ff6b35", Drama:"#c9a84c",
  Comedy:"#4ecdc4", Animation:"#a78bfa", "Sci-Fi":"#38bdf8",
  Adventure:"#fb923c", Documentary:"#86efac",
}

export default function MovieCard({ movie, index, onPlay, isHovered, onHover, onLeave }) {
  const videoRef  = useRef(null)
  const [imgError, setImgError]     = useState(false)
  const [videoReady, setVideoReady] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (isHovered) {
      video.currentTime = 0
      video.play().catch(() => {})
    } else {
      video.pause()
      video.currentTime = 0
      setVideoReady(false)
    }
  }, [isHovered])

  const accent = GENRE_COLORS[movie.genre] || "#e50914"

  return (
    <article
      onClick={() => onPlay(movie)}
      onMouseEnter={() => onHover(movie.id)}
      onMouseLeave={onLeave}
      style={{
        position:"relative", borderRadius:"6px", overflow:"hidden",
        cursor:"pointer", aspectRatio:"2/3", background:"#111",
        border:`1px solid ${isHovered ? accent+"60" : "rgba(255,255,255,0.06)"}`,
        transform: isHovered ? "scale(1.04) translateY(-4px)" : "scale(1) translateY(0)",
        transition:"transform 0.45s cubic-bezier(0.23,1,0.32,1), box-shadow 0.45s ease, border-color 0.3s ease",
        boxShadow: isHovered
          ? `0 24px 60px rgba(0,0,0,0.7), 0 0 40px ${accent}30`
          : "0 4px 20px rgba(0,0,0,0.4)",
        animation:`fadeIn 0.5s ${index * 0.07}s ease both`,
      }}
    >
      <img
        src={imgError ? `https://picsum.photos/seed/${movie.id}/400/600` : movie.logo}
        alt={movie.name}
        onError={() => setImgError(true)}
        style={{
          width:"100%", height:"100%", objectFit:"cover",
          display:"block", position:"absolute", inset:0,
          opacity:(isHovered && videoReady) ? 0 : 1,
          transition:"opacity 0.4s ease",
        }}
      />
      <video
        ref={videoRef}
        src={movie.previewUrl}
        muted loop playsInline preload="metadata"
        onCanPlay={() => setVideoReady(true)}
        style={{
          width:"100%", height:"100%", objectFit:"cover",
          position:"absolute", inset:0,
          opacity:(isHovered && videoReady) ? 1 : 0,
          transition:"opacity 0.5s ease",
        }}
      />
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none",
        background:"linear-gradient(to top,rgba(0,0,0,0.92) 0%,rgba(0,0,0,0.2) 50%,transparent 100%)",
      }} />
      <div style={{
        position:"absolute", top:"10px", left:"10px", right:"10px",
        display:"flex", justifyContent:"space-between", alignItems:"flex-start",
      }}>
        <span style={{
          fontFamily:"Space Mono,monospace", fontSize:"0.55rem",
          letterSpacing:"0.12em", textTransform:"uppercase",
          color:accent, background:accent+"20",
          border:`1px solid ${accent}40`,
          padding:"3px 8px", borderRadius:"2px", backdropFilter:"blur(8px)",
        }}>{movie.genre}</span>
        <span style={{
          width:"8px", height:"8px", borderRadius:"50%",
          background: movie.status === "playing" ? "#22c55e" : accent,
          boxShadow:`0 0 8px ${movie.status === "playing" ? "#22c55e" : accent}`,
          animation: movie.status === "playing" ? "pulse 1.5s infinite" : "none",
          marginTop:"4px",
        }} />
      </div>
      <div style={{
        position:"absolute", bottom:0, left:0, right:0,
        padding:"12px 14px",
        transform: isHovered ? "translateY(0)" : "translateY(6px)",
        opacity: isHovered ? 1 : 0.8,
        transition:"transform 0.4s ease, opacity 0.4s ease",
      }}>
        <div style={{
          fontFamily:"Bebas Neue,sans-serif",
          fontSize:"clamp(0.9rem,2vw,1.15rem)",
          letterSpacing:"0.05em", color:"#fff",
          lineHeight:1.1, marginBottom:"5px",
        }}>{movie.name}</div>
        {isHovered ? (
          <div style={{ display:"flex", gap:"10px", alignItems:"center" }}>
            <span style={{ fontFamily:"Space Mono,monospace", fontSize:"0.6rem", color:"#aaa" }}>{movie.year}</span>
            <span style={{ fontFamily:"Space Mono,monospace", fontSize:"0.6rem", color:"#c9a84c" }}>â˜… {movie.rating}</span>
            <span style={{ fontFamily:"DM Sans,sans-serif", fontSize:"0.65rem", color:accent, fontWeight:500 }}>â–¶ PLAY</span>
          </div>
        ) : (
          <div style={{ fontFamily:"Space Mono,monospace", fontSize:"0.58rem", color:"#888" }}>
            {movie.year} Â· {movie.genre}
          </div>
        )}
      </div>
      {isHovered && (
        <div style={{
          position:"absolute", inset:0, pointerEvents:"none",
          background:`linear-gradient(transparent 49.5%,${accent}08 50%,transparent 50.5%)`,
          backgroundSize:"100% 4px", opacity:0.6,
        }} />
      )}
    </article>
  )
}
