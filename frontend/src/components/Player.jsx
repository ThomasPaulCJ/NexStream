import { useRef, useEffect, useState, useCallback } from "react"
import { useApp } from "../context/AppContext"
import { useMouseIdle } from "../hooks/useMouseIdle"

export default function Player() {
  const { activeMovie, stopMovie, toggleMyList, myList } = useApp()
  const videoRef   = useRef(null)
  const isIdle     = useMouseIdle(3000)
  const [progress, setProgress]   = useState(0)
  const [duration, setDuration]   = useState(0)
  const [playing,  setPlaying]    = useState(true)
  const [volume,   setVolume]     = useState(1)
  const [muted,    setMuted]      = useState(false)
  const [visible,  setVisible]    = useState(false)
  const inList = activeMovie && myList.find(m => m.id === activeMovie.id)

  // Mount animation
  useEffect(() => {
    if (activeMovie) setTimeout(() => setVisible(true), 30)
    else setVisible(false)
  }, [activeMovie])

  useEffect(() => {
    const v = videoRef.current
    if (!v || !activeMovie) return
    v.src = activeMovie.streamUrl
    v.load()
    v.play().catch(console.error)
    setPlaying(true)
    return () => { v.pause(); v.src = "" }
  }, [activeMovie])

  const togglePlay = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    if (playing) { v.pause(); setPlaying(false) }
    else          { v.play(); setPlaying(true)  }
  }, [playing])

  const seek = useCallback((e) => {
    const v = videoRef.current
    if (!v || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pct  = (e.clientX - rect.left) / rect.width
    v.currentTime = pct * duration
  }, [duration])

  const fmtTime = (s) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, "0")}`
  }

  if (!activeMovie) return null

  const GENRE_COLORS = {
    Action:"#e50914", Thriller:"#ff6b35", Drama:"#c9a84c",
    Comedy:"#4ecdc4", Animation:"#a78bfa", "Sci-Fi":"#38bdf8",
    Adventure:"#fb923c", Documentary:"#86efac",
  }
  const accent = GENRE_COLORS[activeMovie.genre] || "#e50914"

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "#000",
      opacity: visible ? 1 : 0,
      transition: "opacity 0.4s ease",
    }}>
      {/* Video */}
      <video
        ref={videoRef}
        onClick={togglePlay}
        onTimeUpdate={e => setProgress(e.target.currentTime)}
        onLoadedMetadata={e => setDuration(e.target.duration)}
        onEnded={() => setPlaying(false)}
        volume={muted ? 0 : volume}
        style={{
          width: "100%", height: "100%",
          objectFit: "contain", cursor: isIdle ? "none" : "pointer",
        }}
      />

      {/* Overlay UI — fades when idle */}
      <div style={{
        position: "absolute", inset: 0,
        opacity: isIdle ? 0 : 1,
        transition: "opacity 0.5s ease",
        pointerEvents: isIdle ? "none" : "all",
      }}>
        {/* Top bar */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          padding: "clamp(16px,3vw,28px) clamp(20px,4vw,40px)",
          background: "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, transparent 100%)",
          display: "flex", alignItems: "center", gap: "16px",
        }}>
          <button
            onClick={() => { setVisible(false); setTimeout(stopMovie, 400) }}
            style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "9px 20px",
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "4px", color: "#fff",
              fontFamily: "DM Sans, sans-serif",
              fontSize: "0.78rem", fontWeight: 500,
              letterSpacing: "0.08em", cursor: "pointer",
              transition: "background 0.2s, transform 0.2s var(--ease-out-expo)",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.transform = "translateX(-2px)" }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(0,0,0,0.5)"; e.currentTarget.style.transform = "translateX(0)" }}
          >
            ← BACK
          </button>

          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: "Bebas Neue, sans-serif",
              fontSize: "clamp(1.2rem,3vw,2rem)",
              letterSpacing: "0.06em", color: "#fff",
              textShadow: `0 0 40px ${accent}40`,
            }}>{activeMovie.name}</div>
            <div style={{
              fontFamily: "Space Mono, monospace",
              fontSize: "0.58rem", color: "#888",
              letterSpacing: "0.15em", marginTop: "2px",
            }}>
              {activeMovie.year} · {activeMovie.genre} · ★ {activeMovie.rating}
            </div>
          </div>

          {/* Add to list button */}
          <button
            onClick={() => toggleMyList(activeMovie)}
            style={{
              padding: "8px 16px",
              background: inList ? "rgba(229,9,20,0.2)" : "rgba(255,255,255,0.08)",
              border: `1px solid ${inList ? "#e50914" : "rgba(255,255,255,0.12)"}`,
              borderRadius: "4px", color: inList ? "#e50914" : "#ccc",
              fontFamily: "DM Sans, sans-serif",
              fontSize: "0.72rem", letterSpacing: "0.06em",
              cursor: "pointer",
              transition: "all 0.25s ease",
            }}
          >{inList ? "✓ In List" : "+ My List"}</button>
        </div>

        {/* Bottom controls */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: "clamp(16px,3vw,28px) clamp(20px,4vw,40px)",
          background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, transparent 100%)",
        }}>
          {/* Progress bar */}
          <div
            onClick={seek}
            style={{
              height: "4px", background: "rgba(255,255,255,0.15)",
              borderRadius: "2px", cursor: "pointer", marginBottom: "14px",
              position: "relative", overflow: "visible",
            }}
          >
            <div style={{
              height: "100%", borderRadius: "2px",
              background: `linear-gradient(90deg, ${accent}, #ff6b35)`,
              width: `${duration ? (progress / duration) * 100 : 0}%`,
              transition: "width 0.1s linear",
              boxShadow: `0 0 8px ${accent}80`,
              position: "relative",
            }}>
              <div style={{
                position: "absolute", right: "-5px", top: "50%",
                width: "10px", height: "10px", borderRadius: "50%",
                background: "#fff", transform: "translateY(-50%)",
                boxShadow: `0 0 8px ${accent}`,
              }} />
            </div>
          </div>

          {/* Controls row */}
          <div style={{
            display: "flex", alignItems: "center", gap: "16px",
          }}>
            {/* Play/pause */}
            <button onClick={togglePlay} style={{
              width: "42px", height: "42px", borderRadius: "50%",
              background: accent,
              border: "none", cursor: "pointer", color: "#fff",
              fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center",
              transition: "transform 0.2s var(--ease-out-expo), box-shadow 0.2s ease",
              boxShadow: `0 4px 16px ${accent}60`,
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.boxShadow = `0 6px 20px ${accent}80` }}
            onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)";   e.currentTarget.style.boxShadow = `0 4px 16px ${accent}60` }}
            >{playing ? "⏸" : "▶"}</button>

            {/* Skip */}
            <button onClick={() => { if(videoRef.current) videoRef.current.currentTime += 10 }}
              style={{ background:"none", border:"none", color:"#ccc", cursor:"pointer", fontSize:"0.8rem", fontFamily:"DM Sans,sans-serif", letterSpacing:"0.05em", opacity:0.7, transition:"opacity 0.2s" }}
              onMouseEnter={e=>e.currentTarget.style.opacity="1"}
              onMouseLeave={e=>e.currentTarget.style.opacity="0.7"}
            >+10s</button>

            {/* Time */}
            <span style={{
              fontFamily: "Space Mono, monospace", fontSize: "0.62rem", color: "#888",
            }}>
              {fmtTime(progress)} / {fmtTime(duration)}
            </span>

            <div style={{ flex: 1 }} />

            {/* Volume */}
            <button onClick={() => setMuted(m => !m)} style={{
              background:"none", border:"none", color:"#ccc", cursor:"pointer",
              fontSize:"1rem", opacity: 0.7, transition:"opacity 0.2s",
            }}
            onMouseEnter={e=>e.currentTarget.style.opacity="1"}
            onMouseLeave={e=>e.currentTarget.style.opacity="0.7"}
            >{muted ? "🔇" : "🔊"}</button>

            <input type="range" min="0" max="1" step="0.05"
              value={muted ? 0 : volume}
              onChange={e => { setVolume(+e.target.value); if(videoRef.current) videoRef.current.volume = +e.target.value; setMuted(false) }}
              style={{ width: "80px", accentColor: accent, cursor: "pointer" }}
            />

            {/* Fullscreen */}
            <button onClick={() => { const el = document.documentElement; if(!document.fullscreenElement) el.requestFullscreen(); else document.exitFullscreen() }}
              style={{ background:"none", border:"none", color:"#ccc", cursor:"pointer", fontSize:"1.1rem", opacity:0.7, transition:"opacity 0.2s" }}
              onMouseEnter={e=>e.currentTarget.style.opacity="1"}
              onMouseLeave={e=>e.currentTarget.style.opacity="0.7"}
            >⛶</button>
          </div>
        </div>
      </div>

      {/* Pause overlay indicator */}
      {!playing && !isIdle && (
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: "70px", height: "70px", borderRadius: "50%",
          background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
          border: "2px solid rgba(255,255,255,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.5rem",
          animation: "fadeInScale 0.2s ease",
          pointerEvents: "none",
        }}>▶</div>
      )}
    </div>
  )
}
