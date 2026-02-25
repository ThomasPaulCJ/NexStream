/**
 * ContinueWatching — horizontal strip of in-progress movies
 * Shows progress bar per card. Click resumes from saved timestamp.
 */
import { useApp } from "../context/AppContext"

function fmtTime(s) {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2,"0")}`
}

export default function ContinueWatching() {
  const { continueWatching, playMovie, removeContinue } = useApp()

  if (!continueWatching || continueWatching.length === 0) return null

  return (
    <div style={{
      padding: "0 clamp(24px,5vw,64px)",
      marginBottom: "clamp(28px,4vw,44px)",
      animation: "fadeUp 0.5s var(--ease-out-expo) both",
    }}>
      {/* Row header */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" }}>
        <h3 style={{
          fontFamily: "DM Sans,sans-serif",
          fontSize: "clamp(0.85rem,1.3vw,1rem)",
          fontWeight: 500, color: "#d0d0d0",
        }}>▶ Continue Watching</h3>
        <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right,rgba(255,255,255,0.06),transparent)" }} />
      </div>

      {/* Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${Math.min(continueWatching.length, 3)}, 1fr)`,
        gap: "clamp(10px,1.5vw,18px)",
      }}>
        {continueWatching.map((entry, i) => {
          const { movie, progress, duration } = entry
          const pct = duration ? Math.round((progress / duration) * 100) : 0
          const remaining = duration ? duration - progress : 0

          return (
            <div
              key={movie.id}
              style={{
                position: "relative", borderRadius: "7px", overflow: "hidden",
                aspectRatio: "16/9", cursor: "pointer",
                background: "#0e0e0e",
                border: "1px solid rgba(255,255,255,0.06)",
                animation: `fadeUp 0.4s ${i * 0.07}s var(--ease-out-expo) both`,
                transition: "transform 0.35s var(--ease-out-expo), box-shadow 0.35s ease",
              }}
              onClick={() => playMovie(movie, progress)}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "scale(1.04) translateY(-5px)"
                e.currentTarget.style.boxShadow = "0 20px 50px rgba(0,0,0,0.8)"
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "scale(1) translateY(0)"
                e.currentTarget.style.boxShadow = "none"
              }}
            >
              {/* Poster */}
              <img src={movie.logo} alt={movie.name} style={{
                width: "100%", height: "100%", objectFit: "cover",
                filter: "brightness(0.55)",
              }} />

              {/* Gradient */}
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)",
              }} />

              {/* Play icon overlay */}
              <div style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%,-60%)",
                width: "40px", height: "40px", borderRadius: "50%",
                background: "rgba(229,9,20,0.85)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.9rem", color: "#fff",
                opacity: 0, transition: "opacity 0.25s ease",
              }}
              id={`play-icon-${movie.id}`}
              >▶</div>

              {/* Remove button */}
              <button
                onClick={e => { e.stopPropagation(); removeContinue(movie.id) }}
                style={{
                  position: "absolute", top: "8px", right: "8px",
                  width: "24px", height: "24px", borderRadius: "50%",
                  background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "#aaa", fontSize: "0.65rem",
                  cursor: "pointer", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  transition: "background 0.2s, color 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background="rgba(229,9,20,0.8)"; e.currentTarget.style.color="#fff" }}
                onMouseLeave={e => { e.currentTarget.style.background="rgba(0,0,0,0.7)";   e.currentTarget.style.color="#aaa" }}
                title="Remove from Continue Watching"
              >✕</button>

              {/* Info */}
              <div style={{
                position: "absolute", bottom: "28px", left: "12px", right: "12px",
              }}>
                <div style={{
                  fontFamily: "Bebas Neue,sans-serif",
                  fontSize: "clamp(0.82rem,1.5vw,1rem)",
                  letterSpacing: "0.05em", color: "#fff",
                  marginBottom: "4px", lineHeight: 1,
                }}>{movie.name}</div>
                <div style={{
                  fontFamily: "Space Mono,monospace",
                  fontSize: "0.5rem", color: "#666",
                }}>{fmtTime(remaining)} remaining</div>
              </div>

              {/* Progress bar */}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                height: "3px", background: "rgba(255,255,255,0.1)",
              }}>
                <div style={{
                  height: "100%",
                  width: `${pct}%`,
                  background: "linear-gradient(90deg, #e50914, #ff6b35)",
                  boxShadow: "0 0 6px #e5091480",
                  borderRadius: "0 1px 1px 0",
                  transition: "width 0.3s ease",
                }} />
              </div>

              {/* Pct badge */}
              <div style={{
                position: "absolute", bottom: "8px", right: "12px",
                fontFamily: "Space Mono,monospace", fontSize: "0.48rem",
                color: "#555",
              }}>{pct}%</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
