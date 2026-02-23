import { useEffect, useRef } from "react"
import { useApp } from "../context/AppContext"

const PROFILES = [
  { name: "Nex",     color: "#e50914", emoji: "N" },
  { name: "Guest",   color: "#3b82f6", emoji: "G" },
  { name: "Kids",    color: "#f59e0b", emoji: "K" },
]

const STATS = [
  { label: "Watched",  value: "47" },
  { label: "Hours",    value: "128" },
  { label: "Streak",   value: "12d" },
]

export default function ProfileModal() {
  const { closeProfile, myList, setPage } = useApp()
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) closeProfile()
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [closeProfile])

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 300,
      background: "rgba(0,0,0,0.4)",
      backdropFilter: "blur(4px)",
      animation: "fadeIn 0.2s ease",
    }}>
      <div
        ref={ref}
        style={{
          position: "absolute", top: "72px", right: "clamp(20px,5vw,60px)",
          width: "300px",
          background: "rgba(14,14,14,0.97)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 24px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04)",
          animation: "slideDown 0.3s var(--ease-out-expo) both",
        }}
      >
        {/* Top — current user */}
        <div style={{
          padding: "20px",
          background: "linear-gradient(135deg, rgba(229,9,20,0.08), rgba(255,107,53,0.04))",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
            <div style={{
              width: "52px", height: "52px", borderRadius: "10px",
              background: "linear-gradient(135deg,#e50914,#ff6b35)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "Bebas Neue, sans-serif", fontSize: "1.5rem", color: "#fff",
              boxShadow: "0 6px 20px rgba(229,9,20,0.4)",
            }}>N</div>
            <div>
              <div style={{
                fontFamily: "DM Sans, sans-serif", fontWeight: 600,
                fontSize: "1rem", color: "#fff", marginBottom: "2px",
              }}>Nex User</div>
              <div style={{
                fontFamily: "Space Mono, monospace", fontSize: "0.56rem",
                color: "#555", letterSpacing: "0.1em",
              }}>PREMIUM MEMBER</div>
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: "flex", gap: "0", borderRadius: "8px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)" }}>
            {STATS.map(({ label, value }, i) => (
              <div key={label} style={{
                flex: 1, padding: "10px 8px", textAlign: "center",
                borderRight: i < STATS.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                background: "rgba(255,255,255,0.02)",
              }}>
                <div style={{
                  fontFamily: "Bebas Neue, sans-serif", fontSize: "1.3rem",
                  color: "#fff", letterSpacing: "0.05em", lineHeight: 1,
                }}>{value}</div>
                <div style={{
                  fontFamily: "Space Mono, monospace", fontSize: "0.5rem",
                  color: "#555", textTransform: "uppercase", letterSpacing: "0.1em",
                  marginTop: "3px",
                }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Switch profiles */}
        <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{
            fontFamily: "Space Mono, monospace", fontSize: "0.55rem",
            color: "#444", letterSpacing: "0.2em", textTransform: "uppercase",
            marginBottom: "12px",
          }}>Switch Profile</div>
          <div style={{ display: "flex", gap: "10px" }}>
            {PROFILES.map(p => (
              <button key={p.name}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: "5px",
                  background: "none", border: "none", cursor: "pointer",
                }}
              >
                <div style={{
                  width: "40px", height: "40px", borderRadius: "8px",
                  background: p.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "Bebas Neue, sans-serif", fontSize: "1.1rem", color: "#fff",
                  transition: "transform 0.2s var(--ease-out-expo)",
                  border: p.name === "Nex" ? `2px solid ${p.color}` : "2px solid transparent",
                  boxShadow: p.name === "Nex" ? `0 0 12px ${p.color}60` : "none",
                }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px) scale(1.05)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0) scale(1)"}
                >{p.emoji}</div>
                <span style={{
                  fontFamily: "DM Sans, sans-serif", fontSize: "0.6rem",
                  color: p.name === "Nex" ? "#fff" : "#555",
                }}>{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* My list shortcut */}
        <button
          onClick={() => { setPage("mylist"); closeProfile() }}
          style={{
            width: "100%", padding: "12px 20px",
            background: "none", border: "none",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            cursor: "pointer",
            transition: "background 0.2s ease",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
          onMouseLeave={e => e.currentTarget.style.background = "none"}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "1rem" }}>♥</span>
            <span style={{
              fontFamily: "DM Sans, sans-serif", fontSize: "0.8rem",
              color: "#ccc", fontWeight: 400,
            }}>My List</span>
          </div>
          <span style={{
            fontFamily: "Space Mono, monospace", fontSize: "0.6rem",
            color: "#e50914", background: "rgba(229,9,20,0.12)",
            padding: "2px 8px", borderRadius: "3px",
          }}>{myList.length} titles</span>
        </button>

        {/* Menu items */}
        {[
          { icon: "⚙", label: "Settings" },
          { icon: "◎", label: "Account" },
          { icon: "?", label: "Help Center" },
        ].map(({ icon, label }) => (
          <button key={label}
            style={{
              width: "100%", padding: "11px 20px",
              background: "none", border: "none",
              borderBottom: "1px solid rgba(255,255,255,0.03)",
              display: "flex", alignItems: "center", gap: "10px",
              cursor: "pointer",
              transition: "background 0.2s ease",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
            onMouseLeave={e => e.currentTarget.style.background = "none"}
          >
            <span style={{ fontSize: "0.9rem", opacity: 0.5 }}>{icon}</span>
            <span style={{
              fontFamily: "DM Sans, sans-serif", fontSize: "0.8rem",
              color: "#888", fontWeight: 300,
            }}>{label}</span>
          </button>
        ))}

        {/* Sign out */}
        <button style={{
          width: "100%", padding: "13px 20px",
          background: "none", border: "none",
          cursor: "pointer",
          fontFamily: "DM Sans, sans-serif", fontSize: "0.78rem",
          color: "#e50914", fontWeight: 500, letterSpacing: "0.06em",
          transition: "background 0.2s ease",
        }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(229,9,20,0.06)"}
        onMouseLeave={e => e.currentTarget.style.background = "none"}
        >
          Sign Out
        </button>
      </div>
    </div>
  )
}
