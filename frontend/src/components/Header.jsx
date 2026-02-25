import { useState, useEffect } from "react"
import { useApp } from "../context/AppContext"
import ProfileModal from "./ProfileModal"

const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "movies", label: "Movies" },
  { id: "series", label: "Series" },
  { id: "mylist", label: "My List" },
]

export default function Header() {
  const { currentPage, setPage, toggleProfile, showProfile, myList } = useApp()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        height: "64px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 clamp(20px,5vw,60px)",
        background: scrolled
          ? "rgba(8,8,8,0.96)"
          : "linear-gradient(to bottom, rgba(8,8,8,0.9) 0%, transparent 100%)",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.04)" : "none",
        transition: "background 0.4s var(--ease-out-expo), backdrop-filter 0.4s ease",
        willChange: "transform",
      }}>
        {/* Logo */}
        <div
          onClick={() => setPage("home")}
          style={{ cursor: "pointer", userSelect: "none", display: "flex" }}
        >
          <span style={{
            fontFamily: "Bebas Neue, sans-serif", fontSize: "1.9rem",
            letterSpacing: "0.1em",
            background: "linear-gradient(135deg,#e50914,#ff3322)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>NEX</span>
          <span style={{
            fontFamily: "Bebas Neue, sans-serif", fontSize: "1.9rem",
            letterSpacing: "0.1em",
            background: "linear-gradient(135deg,#ff6b35,#c9a84c)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>STREAM</span>
        </div>

        {/* Nav links */}
        <nav style={{ display: "flex", gap: "clamp(16px,2.5vw,32px)", alignItems: "center" }}>
          {NAV_ITEMS.map(({ id, label }) => {
            const active = currentPage === id
            return (
              <button
                key={id}
                onClick={() => setPage(id)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "0.8rem",
                  fontWeight: active ? 600 : 300,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: active ? "#fff" : "#666",
                  padding: "4px 0",
                  position: "relative",
                  transition: "color 0.25s ease",
                  display: "flex", alignItems: "center", gap: "5px",
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.color = "#ccc" }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.color = "#666" }}
              >
                {label}
                {/* My List badge */}
                {id === "mylist" && myList.length > 0 && (
                  <span style={{
                    background: "#e50914", color: "#fff",
                    fontFamily: "Space Mono, monospace",
                    fontSize: "0.5rem",
                    padding: "1px 5px", borderRadius: "10px",
                    animation: "fadeIn 0.2s ease",
                  }}>{myList.length}</span>
                )}
                {/* Active underline */}
                {active && (
                  <span style={{
                    position: "absolute", bottom: "-2px", left: 0, right: 0,
                    height: "2px",
                    background: "linear-gradient(90deg, #e50914, #ff6b35)",
                    borderRadius: "1px",
                    animation: "fadeIn 0.2s ease",
                  }} />
                )}
              </button>
            )
          })}
        </nav>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          {/* Live dot */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{
              width: "7px", height: "7px", borderRadius: "50%",
              background: "#22c55e",
              animation: "dotPulse 2s infinite",
            }} />
            <span style={{
              fontFamily: "Space Mono, monospace", fontSize: "0.56rem",
              color: "#22c55e", letterSpacing: "0.18em",
            }}>LIVE</span>
          </div>

          {/* Profile avatar */}
          <button
            onClick={toggleProfile}
            style={{
              width: "34px", height: "34px", borderRadius: "6px",
              background: showProfile
                ? "linear-gradient(135deg,#ff6b35,#c9a84c)"
                : "linear-gradient(135deg,#e50914,#ff6b35)",
              border: `2px solid ${showProfile ? "#ff6b35" : "transparent"}`,
              cursor: "pointer", padding: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "Bebas Neue, sans-serif", fontSize: "1rem", color: "#fff",
              transition: "transform 0.25s var(--ease-out-expo), border-color 0.25s ease",
              transform: showProfile ? "scale(1.08)" : "scale(1)",
              boxShadow: showProfile ? "0 0 16px rgba(229,9,20,0.5)" : "none",
            }}
          >N</button>
        </div>
      </header>

      {showProfile && <ProfileModal />}
    </>
  )
}
