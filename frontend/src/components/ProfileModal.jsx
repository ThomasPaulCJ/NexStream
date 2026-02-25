import { useEffect, useRef } from "react"
import { useApp } from "../context/AppContext"

const PROFILES = [
  { name: "Nex",   color: "#e50914", emoji: "N", gradient: "linear-gradient(135deg,#e50914,#ff6b35)" },
  { name: "Guest", color: "#3b82f6", emoji: "G", gradient: "linear-gradient(135deg,#3b82f6,#6366f1)" },
  { name: "Kids",  color: "#f59e0b", emoji: "K", gradient: "linear-gradient(135deg,#f59e0b,#f97316)" },
]

const STATS = [
  { label: "Watched",  value: "47" },
  { label: "Hours",    value: "128" },
  { label: "Streak",   value: "12d" },
]

export default function ProfileModal() {
  const { closeProfile, myList, setPage, activeProfile, setProfile, continueWatching } = useApp()
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) closeProfile()
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [closeProfile])

  const currentProfileData = PROFILES.find(p => p.name === activeProfile) || PROFILES[0]

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 300,
      background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)",
      animation: "fadeIn 0.2s ease",
    }}>
      <div ref={ref} style={{
        position: "absolute", top: "72px", right: "clamp(20px,5vw,60px)",
        width: "300px",
        background: "rgba(13,13,13,0.98)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "12px", overflow: "hidden",
        boxShadow: "0 24px 60px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.03)",
        animation: "slideDown 0.3s var(--ease-out-expo) both",
      }}>

        {/* ── Current user ──────────────────────────────────────────── */}
        <div style={{
          padding: "18px 20px 16px",
          background: `linear-gradient(135deg, rgba(229,9,20,0.07), rgba(255,107,53,0.03))`,
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
            <div style={{
              width: "50px", height: "50px", borderRadius: "10px",
              background: currentProfileData.gradient,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "Bebas Neue,sans-serif", fontSize: "1.4rem", color: "#fff",
              boxShadow: `0 6px 20px ${currentProfileData.color}50`,
            }}>{currentProfileData.emoji}</div>
            <div>
              <div style={{ fontFamily: "DM Sans,sans-serif", fontWeight: 600, fontSize: "0.95rem", color: "#fff" }}>
                {activeProfile} Profile
              </div>
              <div style={{ fontFamily: "Space Mono,monospace", fontSize: "0.52rem", color: "#444", letterSpacing: "0.12em", marginTop: "2px" }}>
                PREMIUM MEMBER
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", borderRadius: "7px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)" }}>
            {STATS.map(({ label, value }, i) => (
              <div key={label} style={{
                flex: 1, padding: "9px 6px", textAlign: "center",
                borderRight: i < STATS.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                background: "rgba(255,255,255,0.02)",
              }}>
                <div style={{ fontFamily: "Bebas Neue,sans-serif", fontSize: "1.25rem", color: "#fff", lineHeight: 1 }}>{value}</div>
                <div style={{ fontFamily: "Space Mono,monospace", fontSize: "0.46rem", color: "#444", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "3px" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Switch Profile ────────────────────────────────────────── */}
        <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{
            fontFamily: "Space Mono,monospace", fontSize: "0.5rem",
            color: "#3a3a3a", letterSpacing: "0.22em", textTransform: "uppercase",
            marginBottom: "12px",
          }}>Switch Profile</div>

          <div style={{ display: "flex", gap: "12px" }}>
            {PROFILES.map(p => {
              const isActive = activeProfile === p.name
              return (
                <button
                  key={p.name}
                  onClick={() => setProfile(p.name)}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
                    background: "none", border: "none", cursor: "pointer", padding: "4px",
                    borderRadius: "8px",
                    transition: "background 0.2s ease",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                  onMouseLeave={e => e.currentTarget.style.background = "none"}
                >
                  <div style={{
                    width: "42px", height: "42px", borderRadius: "9px",
                    background: p.gradient,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "Bebas Neue,sans-serif", fontSize: "1.15rem", color: "#fff",
                    outline: isActive ? `2px solid ${p.color}` : "2px solid transparent",
                    outlineOffset: "2px",
                    boxShadow: isActive ? `0 0 14px ${p.color}60` : "none",
                    transition: "transform 0.25s var(--ease-out-expo), outline-color 0.2s, box-shadow 0.2s",
                    transform: isActive ? "scale(1.08)" : "scale(1)",
                  }}>
                    {p.emoji}
                  </div>
                  <span style={{
                    fontFamily: "DM Sans,sans-serif", fontSize: "0.62rem",
                    color: isActive ? "#fff" : "#555",
                    transition: "color 0.2s",
                  }}>{p.name}</span>
                  {isActive && (
                    <span style={{
                      width: "4px", height: "4px", borderRadius: "50%",
                      background: p.color,
                      boxShadow: `0 0 6px ${p.color}`,
                    }} />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* ── My List shortcut ─────────────────────────────────────── */}
        <button onClick={() => { setPage("mylist"); closeProfile() }}
          style={{
            width: "100%", padding: "11px 20px",
            background: "none", border: "none",
            borderBottom: "1px solid rgba(255,255,255,0.04)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            cursor: "pointer", transition: "background 0.2s ease",
          }}
          onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.04)"}
          onMouseLeave={e=>e.currentTarget.style.background="none"}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ opacity: 0.5, fontSize: "0.9rem" }}>♥</span>
            <span style={{ fontFamily: "DM Sans,sans-serif", fontSize: "0.78rem", color: "#ccc", fontWeight: 400 }}>My List</span>
          </div>
          <span style={{
            fontFamily: "Space Mono,monospace", fontSize: "0.56rem",
            color: "#e50914", background: "rgba(229,9,20,0.1)",
            padding: "2px 8px", borderRadius: "3px",
          }}>{myList.length} titles</span>
        </button>

        {/* Continue Watching shortcut */}
        {continueWatching.length > 0 && (
          <button onClick={() => { setPage("home"); closeProfile() }}
            style={{
              width: "100%", padding: "11px 20px",
              background: "none", border: "none",
              borderBottom: "1px solid rgba(255,255,255,0.04)",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              cursor: "pointer", transition: "background 0.2s ease",
            }}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.04)"}
            onMouseLeave={e=>e.currentTarget.style.background="none"}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ opacity: 0.5, fontSize: "0.9rem" }}>▶</span>
              <span style={{ fontFamily: "DM Sans,sans-serif", fontSize: "0.78rem", color: "#ccc", fontWeight: 400 }}>Continue Watching</span>
            </div>
            <span style={{
              fontFamily: "Space Mono,monospace", fontSize: "0.56rem",
              color: "#ff6b35", background: "rgba(255,107,53,0.1)",
              padding: "2px 8px", borderRadius: "3px",
            }}>{continueWatching.length}</span>
          </button>
        )}

        {/* Menu items */}
        {[
          { icon: "⚙", label: "Settings",    action: null },
          { icon: "?", label: "Help Center",  action: "help" },
          { icon: "◎", label: "Account",      action: null },
        ].map(({ icon, label, action }) => (
          <button key={label}
            onClick={() => action && setPage(action)}
            style={{
              width: "100%", padding: "10px 20px",
              background: "none", border: "none",
              borderBottom: "1px solid rgba(255,255,255,0.03)",
              display: "flex", alignItems: "center", gap: "10px",
              cursor: "pointer", transition: "background 0.2s ease",
            }}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.03)"}
            onMouseLeave={e=>e.currentTarget.style.background="none"}
          >
            <span style={{ opacity: 0.4, fontSize: "0.85rem" }}>{icon}</span>
            <span style={{ fontFamily: "DM Sans,sans-serif", fontSize: "0.78rem", color: "#777", fontWeight: 300 }}>{label}</span>
          </button>
        ))}

        {/* Sign out */}
        <button style={{
          width: "100%", padding: "12px 20px",
          background: "none", border: "none", cursor: "pointer",
          fontFamily: "DM Sans,sans-serif", fontSize: "0.76rem",
          color: "#e50914", fontWeight: 500, letterSpacing: "0.05em",
          transition: "background 0.2s ease",
        }}
        onMouseEnter={e=>e.currentTarget.style.background="rgba(229,9,20,0.06)"}
        onMouseLeave={e=>e.currentTarget.style.background="none"}
        >Sign Out</button>
      </div>
    </div>
  )
}
