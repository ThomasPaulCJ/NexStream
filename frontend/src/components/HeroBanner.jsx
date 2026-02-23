import { useState, useEffect, useRef } from "react"
import { useApp } from "../context/AppContext"

const GENRE_COLORS = {
  Action:"#e50914", Thriller:"#ff6b35", Drama:"#c9a84c",
  Comedy:"#4ecdc4", Animation:"#a78bfa", "Sci-Fi":"#38bdf8",
  Adventure:"#fb923c", Documentary:"#86efac",
}

export default function HeroBanner({ movies }) {
  const { playMovie, toggleMyList, myList } = useApp()
  const [idx,      setIdx]     = useState(0)
  const [phase,    setPhase]   = useState("in")
  const timerRef = useRef(null)
  const featured  = movies[idx]
  const inList    = featured && myList.find(m => m.id === featured.id)

  const goTo = (i) => {
    if (i === idx) return
    setPhase("out")
    setTimeout(() => { setIdx(i); setPhase("in") }, 400)
  }

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setPhase("out")
      setTimeout(() => { setIdx(i => (i + 1) % Math.min(movies.length, 5)); setPhase("in") }, 400)
    }, 7000)
    return () => clearInterval(timerRef.current)
  }, [movies.length])

  if (!featured) return null
  const accent = GENRE_COLORS[featured.genre] || "#e50914"

  const fadeStyle = {
    opacity:   phase === "in" ? 1 : 0,
    transform: phase === "in" ? "translateY(0)" : "translateY(10px)",
    transition: "opacity 0.45s var(--ease-out-expo), transform 0.45s var(--ease-out-expo)",
  }

  return (
    <div style={{
      position: "relative", width: "100%",
      height: "clamp(440px, 64vh, 660px)", overflow: "hidden",
    }}>
      {/* BG */}
      <img
        key={featured.id}
        src={featured.logo}
        alt=""
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          objectFit: "cover", objectPosition: "center 15%",
          filter: "brightness(0.25) saturate(1.3)",
          animation: "heroFloat 12s ease-in-out infinite",
          opacity: phase === "in" ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}
      />

      {/* Colour tint */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse 70% 90% at 65% 50%, ${accent}14 0%, transparent 70%)`,
        transition: "background 0.6s ease",
      }} />

      {/* Gradients */}
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to right, rgba(8,8,8,0.97) 28%, rgba(8,8,8,0.6) 55%, rgba(8,8,8,0.05) 100%)" }} />
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,    rgba(8,8,8,1)    0%,  rgba(8,8,8,0)   35%)" }} />
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom, rgba(8,8,8,0.55) 0%,  transparent     20%)" }} />

      {/* Animated vertical accent line */}
      <div style={{
        position: "absolute",
        left: "clamp(24px,5vw,64px)",
        top: "18%", height: "60%", width: "2px",
        background: `linear-gradient(to bottom, transparent, ${accent}, transparent)`,
        opacity: phase === "in" ? 0.75 : 0,
        transition: "opacity 0.5s 0.2s ease",
      }} />

      {/* Content */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "0 clamp(36px,6vw,88px)",
        paddingTop: "70px",
        ...fadeStyle,
      }}>
        {/* Label */}
        <div style={{
          display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px",
        }}>
          <div style={{ width: "28px", height: "1.5px", background: accent, borderRadius: "1px" }} />
          <span style={{
            fontFamily: "Space Mono, monospace", fontSize: "0.58rem",
            letterSpacing: "0.4em", color: accent, textTransform: "uppercase",
          }}>Featured Tonight</span>
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: "Bebas Neue, sans-serif",
          fontSize: "clamp(3.2rem, 9vw, 7.5rem)",
          letterSpacing: "0.02em", lineHeight: 0.86,
          color: "#fff", maxWidth: "620px", marginBottom: "18px",
          textShadow: `0 0 60px ${accent}25`,
        }}>{featured.name}</h1>

        {/* Meta */}
        <div style={{ display:"flex", gap:"12px", alignItems:"center", marginBottom:"16px", flexWrap:"wrap" }}>
          <span style={{
            background: accent, color:"#fff",
            fontFamily:"Space Mono,monospace", fontSize:"0.56rem",
            padding:"3px 10px", borderRadius:"2px",
            letterSpacing:"0.12em", textTransform:"uppercase",
          }}>{featured.genre}</span>
          <span style={{ fontFamily:"Space Mono,monospace", fontSize:"0.6rem", color:"#c9a84c" }}>★ {featured.rating}</span>
          <span style={{ fontFamily:"Space Mono,monospace", fontSize:"0.6rem", color:"#555" }}>{featured.year}</span>
          <span style={{ display:"flex", alignItems:"center", gap:"5px", fontFamily:"Space Mono,monospace", fontSize:"0.6rem", color:"#22c55e" }}>
            <span style={{ width:"5px", height:"5px", borderRadius:"50%", background:"#22c55e", display:"inline-block", animation:"pulse 1.5s infinite" }} />
            STREAMING
          </span>
        </div>

        {/* Description */}
        <p style={{
          fontFamily:"DM Sans,sans-serif", fontSize:"clamp(0.78rem,1.1vw,0.9rem)",
          color:"#666", fontWeight:300, maxWidth:"380px",
          lineHeight:1.75, marginBottom:"28px",
        }}>{featured.description}</p>

        {/* Buttons */}
        <div style={{ display:"flex", gap:"12px", flexWrap:"wrap" }}>
          <button
            onClick={() => playMovie(featured)}
            style={{
              display:"flex", alignItems:"center", gap:"10px",
              padding:"12px 32px",
              background: accent, border:"none", borderRadius:"4px",
              color:"#fff", fontFamily:"DM Sans,sans-serif",
              fontSize:"0.82rem", fontWeight:600,
              letterSpacing:"0.1em", textTransform:"uppercase",
              cursor:"pointer",
              boxShadow:`0 6px 24px ${accent}50`,
              transition:"transform 0.25s var(--ease-out-expo), box-shadow 0.25s ease",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px) scale(1.02)"; e.currentTarget.style.boxShadow=`0 12px 32px ${accent}70` }}
            onMouseLeave={e => { e.currentTarget.style.transform="translateY(0) scale(1)";       e.currentTarget.style.boxShadow=`0 6px 24px ${accent}50` }}
          >▶ &nbsp;Play Now</button>

          <button
            onClick={() => toggleMyList(featured)}
            style={{
              display:"flex", alignItems:"center", gap:"8px",
              padding:"12px 24px",
              background: inList ? "rgba(229,9,20,0.15)" : "rgba(255,255,255,0.07)",
              border: `1px solid ${inList ? "#e5091480" : "rgba(255,255,255,0.12)"}`,
              borderRadius:"4px", color: inList ? "#e50914" : "#ccc",
              fontFamily:"DM Sans,sans-serif",
              fontSize:"0.82rem", fontWeight:400,
              letterSpacing:"0.08em", textTransform:"uppercase",
              cursor:"pointer", backdropFilter:"blur(8px)",
              transition:"all 0.25s var(--ease-out-expo)",
            }}
            onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,0.12)"; e.currentTarget.style.transform="translateY(-2px)" }}
            onMouseLeave={e => { e.currentTarget.style.background=inList?"rgba(229,9,20,0.15)":"rgba(255,255,255,0.07)"; e.currentTarget.style.transform="translateY(0)" }}
          >{inList ? "✓ In List" : "⊕ My List"}</button>
        </div>
      </div>

      {/* Right mini cards */}
      <div style={{
        position:"absolute", right:"clamp(24px,4vw,60px)",
        top:"50%", transform:"translateY(-50%)",
        display:"flex", flexDirection:"column", gap:"10px",
        ...fadeStyle,
      }}>
        {movies.slice(1, 5).map((m, i) => (
          <div key={m.id} onClick={() => playMovie(m)} style={{
            width:"clamp(90px,11vw,140px)", aspectRatio:"16/9",
            borderRadius:"5px", overflow:"hidden", cursor:"pointer",
            border:"1px solid rgba(255,255,255,0.07)",
            transition:"transform 0.3s var(--ease-out-expo), border-color 0.25s ease, box-shadow 0.25s ease",
            animation:`slideInRight 0.5s ${0.1 + i*0.07}s var(--ease-out-expo) both`,
          }}
          onMouseEnter={e => { e.currentTarget.style.transform="scale(1.06) translateX(-4px)"; e.currentTarget.style.borderColor=accent+"70"; e.currentTarget.style.boxShadow=`0 8px 24px ${accent}30` }}
          onMouseLeave={e => { e.currentTarget.style.transform="scale(1) translateX(0)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.07)"; e.currentTarget.style.boxShadow="none" }}
          >
            <img src={m.logo} alt={m.name} style={{ width:"100%", height:"100%", objectFit:"cover", filter:"brightness(0.65)", transition:"filter 0.25s ease" }}
              onMouseEnter={e => e.currentTarget.style.filter="brightness(0.9)"}
              onMouseLeave={e => e.currentTarget.style.filter="brightness(0.65)"}
            />
          </div>
        ))}
      </div>

      {/* Dot navigation */}
      <div style={{
        position:"absolute", bottom:"28px", left:"clamp(36px,6vw,88px)",
        display:"flex", gap:"8px", alignItems:"center",
      }}>
        {movies.slice(0, 5).map((_, i) => (
          <button key={i} onClick={() => goTo(i)} style={{
            width: i === idx ? "28px" : "6px",
            height:"6px", borderRadius:"3px",
            background: i === idx ? accent : "#2a2a2a",
            border:"none", cursor:"pointer", padding:0,
            transition:"width 0.4s var(--ease-out-expo), background 0.3s ease",
            boxShadow: i === idx ? `0 0 8px ${accent}80` : "none",
          }} />
        ))}
      </div>
    </div>
  )
}
