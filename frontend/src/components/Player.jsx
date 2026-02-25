import { useRef, useEffect, useState, useCallback } from "react"
import { useApp } from "../context/AppContext"
import { useMouseIdle } from "../hooks/useMouseIdle"

// ── Quality tiers (labels only — same src, simulates selection) ─────────────
const QUALITY_OPTIONS = ["Auto", "480p", "720p", "1080p", "1440p", "2160p"]

const GENRE_COLORS = {
  Action:"#e50914", Thriller:"#ff6b35", Drama:"#c9a84c",
  Comedy:"#4ecdc4", Animation:"#a78bfa", "Sci-Fi":"#38bdf8",
  Adventure:"#fb923c", Documentary:"#86efac",
}

function fmtTime(s) {
  if (!s || isNaN(s)) return "0:00"
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = Math.floor(s % 60)
  return h > 0
    ? `${h}:${m.toString().padStart(2,"0")}:${sec.toString().padStart(2,"0")}`
    : `${m}:${sec.toString().padStart(2,"0")}`
}

export default function Player() {
  const { activeMovie, stopMovie, toggleMyList, myList, updateContinue } = useApp()
  const videoRef      = useRef(null)
  const saveTimer     = useRef(null)
  const isIdle        = useMouseIdle(3000)

  const [visible,   setVisible]   = useState(false)
  const [playing,   setPlaying]   = useState(true)
  const [progress,  setProgress]  = useState(0)
  const [duration,  setDuration]  = useState(0)
  const [volume,    setVolume]    = useState(1)
  const [muted,     setMuted]     = useState(false)
  const [quality,   setQuality]   = useState("Auto")
  const [showQ,     setShowQ]     = useState(false)   // quality panel open
  const [showMyList, setShowMyList] = useState(false) // unlist confirmation

  const inList = activeMovie && myList.find(m => m.id === activeMovie?.id)

  // Mount / unmount animation
  useEffect(() => {
    if (activeMovie) setTimeout(() => setVisible(true), 30)
    else { setVisible(false); setShowQ(false) }
  }, [activeMovie])

  // Load + autoplay + resume
  useEffect(() => {
    const v = videoRef.current
    if (!v || !activeMovie) return
    v.src = activeMovie.streamUrl
    v.load()
    v.play()
      .then(() => {
        setPlaying(true)
        if (activeMovie.resumeTime && activeMovie.resumeTime > 5) {
          v.currentTime = activeMovie.resumeTime
        }
      })
      .catch(console.error)

    return () => { v.pause(); v.src = "" }
  }, [activeMovie])

  // Volume sync
  useEffect(() => {
    if (videoRef.current) videoRef.current.volume = muted ? 0 : volume
  }, [volume, muted])

  // Auto-save progress every 5s
  useEffect(() => {
    if (!activeMovie) return
    saveTimer.current = setInterval(() => {
      const v = videoRef.current
      if (v && v.currentTime > 5) {
        updateContinue({ movie: activeMovie, progress: v.currentTime, duration: v.duration })
      }
    }, 5000)
    return () => clearInterval(saveTimer.current)
  }, [activeMovie, updateContinue])

  const togglePlay = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    if (playing) { v.pause(); setPlaying(false) }
    else         { v.play();  setPlaying(true)  }
  }, [playing])

  const seek = useCallback((e) => {
    const v = videoRef.current
    if (!v || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    v.currentTime = ((e.clientX - rect.left) / rect.width) * duration
  }, [duration])

  const handleBack = useCallback(() => {
    // Save progress on back
    const v = videoRef.current
    if (v && activeMovie) {
      updateContinue({ movie: activeMovie, progress: v.currentTime, duration: v.duration })
    }
    setVisible(false)
    setTimeout(stopMovie, 380)
  }, [activeMovie, stopMovie, updateContinue])

  if (!activeMovie) return null

  const accent = GENRE_COLORS[activeMovie.genre] || "#e50914"
  const pct    = duration ? (progress / duration) * 100 : 0

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000, background: "#000",
      opacity: visible ? 1 : 0,
      transition: "opacity 0.4s ease",
    }}>
      {/* ── Video ─────────────────────────────────────────────────── */}
      <video
        ref={videoRef}
        onClick={togglePlay}
        onTimeUpdate={e => setProgress(e.target.currentTime)}
        onLoadedMetadata={e => setDuration(e.target.duration)}
        onEnded={() => {
          setPlaying(false)
          updateContinue({ movie: activeMovie, progress: videoRef.current?.duration, duration: videoRef.current?.duration })
        }}
        style={{
          width: "100%", height: "100%", objectFit: "contain",
          cursor: isIdle ? "none" : "pointer",
        }}
      />

      {/* ── UI Overlay — hides when idle ──────────────────────────── */}
      <div style={{
        position: "absolute", inset: 0,
        opacity: isIdle ? 0 : 1,
        transition: "opacity 0.5s ease",
        pointerEvents: isIdle ? "none" : "all",
      }}>

        {/* Top bar */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          padding: "clamp(14px,3vw,26px) clamp(20px,4vw,40px)",
          background: "linear-gradient(to bottom, rgba(0,0,0,0.88) 0%, transparent 100%)",
          display: "flex", alignItems: "center", gap: "14px",
        }}>
          {/* Back */}
          <button onClick={handleBack} style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "8px 18px",
            background: "rgba(0,0,0,0.55)", backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.12)", borderRadius: "4px",
            color: "#fff", fontFamily: "DM Sans,sans-serif",
            fontSize: "0.76rem", fontWeight: 500, letterSpacing: "0.08em",
            cursor: "pointer",
            transition: "background 0.2s ease, transform 0.2s var(--ease-out-expo)",
          }}
          onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,0.12)"; e.currentTarget.style.transform="translateX(-2px)" }}
          onMouseLeave={e => { e.currentTarget.style.background="rgba(0,0,0,0.55)";       e.currentTarget.style.transform="translateX(0)" }}
          >← BACK</button>

          {/* Title + meta */}
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: "Bebas Neue,sans-serif",
              fontSize: "clamp(1.1rem,3vw,1.9rem)",
              letterSpacing: "0.06em", color: "#fff",
              textShadow: `0 0 40px ${accent}40`,
            }}>{activeMovie.name}</div>
            <div style={{
              fontFamily: "Space Mono,monospace", fontSize: "0.56rem",
              color: "#777", letterSpacing: "0.14em", marginTop: "2px",
            }}>{activeMovie.year} · {activeMovie.genre} · ★ {activeMovie.rating}</div>
          </div>

          {/* Quality badge */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowQ(q => !q)}
              style={{
                padding: "6px 14px",
                background: showQ ? "rgba(229,9,20,0.2)" : "rgba(255,255,255,0.07)",
                border: `1px solid ${showQ ? "#e50914" : "rgba(255,255,255,0.12)"}`,
                borderRadius: "4px", color: showQ ? "#e50914" : "#ccc",
                fontFamily: "Space Mono,monospace", fontSize: "0.6rem",
                letterSpacing: "0.1em", cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >⚙ {quality}</button>

            {/* Quality dropdown */}
            {showQ && (
              <div style={{
                position: "absolute", top: "calc(100% + 8px)", right: 0,
                background: "rgba(12,12,12,0.97)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "8px", overflow: "hidden",
                boxShadow: "0 16px 40px rgba(0,0,0,0.8)",
                animation: "slideDown 0.25s var(--ease-out-expo) both",
                zIndex: 20,
                minWidth: "130px",
              }}>
                <div style={{
                  padding: "10px 14px 6px",
                  fontFamily: "Space Mono,monospace", fontSize: "0.52rem",
                  color: "#555", letterSpacing: "0.2em", textTransform: "uppercase",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}>Video Quality</div>
                {QUALITY_OPTIONS.map(q => (
                  <button key={q} onClick={() => { setQuality(q); setShowQ(false) }}
                    style={{
                      width: "100%", padding: "9px 14px",
                      background: quality === q ? `${accent}18` : "none",
                      border: "none", borderBottom: "1px solid rgba(255,255,255,0.03)",
                      color: quality === q ? accent : "#aaa",
                      fontFamily: "DM Sans,sans-serif", fontSize: "0.78rem",
                      fontWeight: quality === q ? 600 : 300,
                      textAlign: "left", cursor: "pointer",
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      transition: "background 0.15s ease",
                    }}
                    onMouseEnter={e => { if (quality !== q) e.currentTarget.style.background="rgba(255,255,255,0.04)" }}
                    onMouseLeave={e => { if (quality !== q) e.currentTarget.style.background="none" }}
                  >
                    {q}
                    {quality === q && <span style={{ fontSize: "0.7rem" }}>✓</span>}
                    {q === "1080p" && quality !== q && (
                      <span style={{
                        fontSize: "0.46rem", color: "#c9a84c",
                        background: "rgba(201,168,76,0.15)",
                        border: "1px solid rgba(201,168,76,0.3)",
                        padding: "1px 5px", borderRadius: "2px", letterSpacing: "0.1em",
                      }}>HD</span>
                    )}
                    {(q === "1440p" || q === "2160p") && quality !== q && (
                      <span style={{
                        fontSize: "0.46rem", color: "#38bdf8",
                        background: "rgba(56,189,248,0.12)",
                        border: "1px solid rgba(56,189,248,0.25)",
                        padding: "1px 5px", borderRadius: "2px", letterSpacing: "0.1em",
                      }}>{q === "2160p" ? "4K" : "QHD"}</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* My List / Unlist button */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => {
                if (inList) setShowMyList(v => !v)
                else { toggleMyList(activeMovie); setShowMyList(false) }
              }}
              style={{
                padding: "7px 16px",
                background: inList ? "rgba(229,9,20,0.15)" : "rgba(255,255,255,0.07)",
                border: `1px solid ${inList ? "#e5091460" : "rgba(255,255,255,0.12)"}`,
                borderRadius: "4px", color: inList ? "#e50914" : "#ccc",
                fontFamily: "DM Sans,sans-serif", fontSize: "0.72rem",
                fontWeight: 500, letterSpacing: "0.06em",
                cursor: "pointer", transition: "all 0.25s ease",
              }}
            >{inList ? "✓ In List" : "+ My List"}</button>

            {/* Unlist confirmation popover */}
            {showMyList && inList && (
              <div style={{
                position: "absolute", top: "calc(100% + 8px)", right: 0,
                background: "rgba(12,12,12,0.97)",
                border: "1px solid rgba(229,9,20,0.2)",
                borderRadius: "8px", padding: "14px 16px",
                boxShadow: "0 16px 40px rgba(0,0,0,0.8)",
                animation: "slideDown 0.25s var(--ease-out-expo) both",
                zIndex: 20, minWidth: "200px",
              }}>
                <div style={{
                  fontFamily: "DM Sans,sans-serif", fontSize: "0.78rem",
                  color: "#ccc", marginBottom: "12px", lineHeight: 1.5,
                }}>Remove <strong style={{ color: "#fff" }}>{activeMovie.name}</strong> from your list?</div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => { toggleMyList(activeMovie); setShowMyList(false) }}
                    style={{
                      flex: 1, padding: "7px",
                      background: "#e50914", border: "none", borderRadius: "3px",
                      color: "#fff", fontFamily: "DM Sans,sans-serif",
                      fontSize: "0.7rem", fontWeight: 600, cursor: "pointer",
                    }}>Remove</button>
                  <button onClick={() => setShowMyList(false)}
                    style={{
                      flex: 1, padding: "7px",
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "3px", color: "#888",
                      fontFamily: "DM Sans,sans-serif", fontSize: "0.7rem", cursor: "pointer",
                    }}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Bottom controls ──────────────────────────────────────── */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: "clamp(14px,3vw,26px) clamp(20px,4vw,40px)",
          background: "linear-gradient(to top, rgba(0,0,0,0.94) 0%, transparent 100%)",
        }}>
          {/* Progress bar */}
          <div onClick={seek} style={{
            height: "4px", background: "rgba(255,255,255,0.12)",
            borderRadius: "2px", cursor: "pointer",
            marginBottom: "14px", position: "relative",
          }}
          onMouseEnter={e => e.currentTarget.style.height = "6px"}
          onMouseLeave={e => e.currentTarget.style.height = "4px"}
          >
            <div style={{
              height: "100%", borderRadius: "2px",
              width: `${pct}%`,
              background: `linear-gradient(90deg, ${accent}, #ff6b35)`,
              boxShadow: `0 0 8px ${accent}80`,
              transition: "width 0.1s linear",
              position: "relative",
            }}>
              <div style={{
                position: "absolute", right: "-5px", top: "50%",
                width: "11px", height: "11px", borderRadius: "50%",
                background: "#fff", transform: "translateY(-50%)",
                boxShadow: `0 0 8px ${accent}`,
                transition: "transform 0.15s ease",
              }} />
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            {/* Play/Pause */}
            <button onClick={togglePlay} style={{
              width: "40px", height: "40px", borderRadius: "50%",
              background: accent, border: "none", cursor: "pointer",
              color: "#fff", fontSize: "0.95rem",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 4px 16px ${accent}55`,
              transition: "transform 0.2s var(--ease-out-expo), box-shadow 0.2s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform="scale(1.1)"; e.currentTarget.style.boxShadow=`0 6px 20px ${accent}80` }}
            onMouseLeave={e => { e.currentTarget.style.transform="scale(1)";   e.currentTarget.style.boxShadow=`0 4px 16px ${accent}55` }}
            >{playing ? "⏸" : "▶"}</button>

            {/* Skip */}
            {[{ label: "−10s", delta: -10 }, { label: "+10s", delta: 10 }].map(({ label, delta }) => (
              <button key={label}
                onClick={() => { if(videoRef.current) videoRef.current.currentTime += delta }}
                style={{
                  background: "none", border: "none", color: "#aaa",
                  fontFamily: "Space Mono,monospace", fontSize: "0.6rem",
                  cursor: "pointer", letterSpacing: "0.05em",
                  transition: "color 0.2s",
                }}
                onMouseEnter={e=>e.currentTarget.style.color="#fff"}
                onMouseLeave={e=>e.currentTarget.style.color="#aaa"}
              >{label}</button>
            ))}

            {/* Time */}
            <span style={{
              fontFamily: "Space Mono,monospace", fontSize: "0.58rem", color: "#666",
            }}>{fmtTime(progress)} / {fmtTime(duration)}</span>

            <div style={{ flex: 1 }} />

            {/* Volume */}
            <button onClick={() => setMuted(m => !m)} style={{
              background: "none", border: "none", color: "#aaa",
              fontSize: "1rem", cursor: "pointer",
              transition: "color 0.2s",
            }}
            onMouseEnter={e=>e.currentTarget.style.color="#fff"}
            onMouseLeave={e=>e.currentTarget.style.color="#aaa"}
            >{muted || volume === 0 ? "🔇" : volume < 0.5 ? "🔉" : "🔊"}</button>

            <input type="range" min="0" max="1" step="0.02"
              value={muted ? 0 : volume}
              onChange={e => {
                const v = +e.target.value
                setVolume(v)
                setMuted(v === 0)
                if (videoRef.current) videoRef.current.volume = v
              }}
              style={{ width: "76px", accentColor: accent, cursor: "pointer" }}
            />

            {/* Fullscreen */}
            <button
              onClick={() => {
                if (!document.fullscreenElement) document.documentElement.requestFullscreen()
                else document.exitFullscreen()
              }}
              style={{
                background: "none", border: "none", color: "#aaa",
                fontSize: "1.05rem", cursor: "pointer",
                transition: "color 0.2s",
              }}
              onMouseEnter={e=>e.currentTarget.style.color="#fff"}
              onMouseLeave={e=>e.currentTarget.style.color="#aaa"}
            >⛶</button>
          </div>
        </div>
      </div>

      {/* Pause centre icon */}
      {!playing && !isIdle && (
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: "68px", height: "68px", borderRadius: "50%",
          background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)",
          border: "2px solid rgba(255,255,255,0.18)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.4rem", animation: "fadeInScale 0.2s ease",
          pointerEvents: "none",
        }}>▶</div>
      )}
    </div>
  )
}
