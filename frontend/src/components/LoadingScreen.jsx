import { useEffect, useState } from "react"

export default function LoadingScreen({ onDone }) {
  const [visible, setVisible] = useState(true)
  const [phase, setPhase] = useState("in")

  useEffect(() => {
    const outTimer  = setTimeout(() => setPhase("out"), 1600)
    const doneTimer = setTimeout(() => { setVisible(false); onDone?.() }, 2200)
    return () => { clearTimeout(outTimer); clearTimeout(doneTimer) }
  }, [onDone])

  if (!visible) return null

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:10000,
      background:"#080808",
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      transition:"opacity 0.6s ease",
      opacity: phase === "out" ? 0 : 1,
      pointerEvents: phase === "out" ? "none" : "all",
    }}>
      <div style={{
        position:"absolute", top:0, left:0, right:0, height:"2px",
        background:"linear-gradient(90deg,transparent,#e50914,transparent)",
        animation:"scanline 1.4s ease-in-out infinite",
      }} />
      <div style={{
        fontFamily:"Bebas Neue,sans-serif",
        fontSize:"clamp(3rem,10vw,7rem)",
        letterSpacing:"0.08em",
        background:"linear-gradient(135deg,#e50914 0%,#ff6b35 60%,#c9a84c 100%)",
        WebkitBackgroundClip:"text",
        WebkitTextFillColor:"transparent",
        animation:"fadeInScale 0.8s ease both",
        textAlign:"center",
      }}>
        NEXSTREAM
      </div>
      <div style={{
        marginTop:"1.5rem",
        fontFamily:"Space Mono,monospace",
        fontSize:"0.65rem",
        letterSpacing:"0.4em",
        color:"#555",
        textTransform:"uppercase",
        animation:"fadeIn 0.8s 0.4s ease both",
      }}>
        Cinema Redefined
      </div>
      <div style={{
        position:"absolute", bottom:0, left:0, right:0, height:"2px",
        overflow:"hidden", background:"#111",
      }}>
        <div style={{
          height:"100%",
          background:"linear-gradient(90deg,#e50914,#ff6b35)",
          animation:"shimmer 1.5s ease-out forwards",
          backgroundSize:"800px 100%",
        }} />
      </div>
    </div>
  )
}
