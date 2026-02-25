/**
 * HelpPage — support contact page
 */
export default function HelpPage() {
  const FAQS = [
    { q: "How do I add movies to My List?", a: "Hover over any movie card and click the + button, or use the ⊕ My List button in the hero banner or player." },
    { q: "Can I resume a movie I started?", a: "Yes! Movies you've partially watched appear in the 'Continue Watching' row on the home page. Click to resume from where you left off." },
    { q: "How do I change video quality?", a: "While a movie is playing, click the ⚙ quality button in the top-right of the player to choose from 480p up to 4K (2160p)." },
    { q: "How do I switch profiles?", a: "Click your profile avatar in the top-right corner, then click any profile (Nex, Guest, Kids) under 'Switch Profile'." },
    { q: "What video sources are used?", a: "All streams use Google's public GTV sample video CDN — free, reliable MP4 files used for development and testing." },
  ]

  return (
    <div style={{
      minHeight: "100vh",
      padding: "100px clamp(24px,5vw,64px) 80px",
      maxWidth: "860px",
    }}>
      {/* Header */}
      <div style={{ marginBottom: "48px", animation: "fadeUp 0.5s var(--ease-out-expo) both" }}>
        <div style={{
          fontFamily: "Space Mono,monospace", fontSize: "0.6rem",
          letterSpacing: "0.35em", color: "#e50914",
          textTransform: "uppercase", marginBottom: "10px",
        }}>Support</div>
        <h1 style={{
          fontFamily: "Bebas Neue,sans-serif",
          fontSize: "clamp(2.5rem,6vw,4.5rem)",
          letterSpacing: "0.04em", color: "#fff",
          marginBottom: "12px",
        }}>Help Center</h1>
        <p style={{
          fontFamily: "DM Sans,sans-serif", fontSize: "0.9rem",
          color: "#555", fontWeight: 300, lineHeight: 1.7,
        }}>
          Find answers below or reach out directly — we're happy to help.
        </p>
      </div>

      {/* Contact cards */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))",
        gap: "16px", marginBottom: "48px",
        animation: "fadeUp 0.5s 0.1s var(--ease-out-expo) both",
      }}>
        {/* Email */}
        <a href="mailto:xyz123@gmail.com" style={{ textDecoration: "none" }}>
          <div style={{
            padding: "22px", borderRadius: "10px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            transition: "transform 0.3s var(--ease-out-expo), border-color 0.3s, background 0.3s",
            cursor: "pointer",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "translateY(-4px)"
            e.currentTarget.style.borderColor = "rgba(229,9,20,0.35)"
            e.currentTarget.style.background  = "rgba(229,9,20,0.05)"
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "translateY(0)"
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"
            e.currentTarget.style.background  = "rgba(255,255,255,0.03)"
          }}
          >
            <div style={{ fontSize: "1.6rem", marginBottom: "12px" }}>✉</div>
            <div style={{
              fontFamily: "DM Sans,sans-serif", fontWeight: 600,
              color: "#fff", marginBottom: "6px",
            }}>Email Support</div>
            <div style={{
              fontFamily: "Space Mono,monospace", fontSize: "0.62rem",
              color: "#e50914", letterSpacing: "0.05em",
            }}>xyz123@gmail.com</div>
            <div style={{
              fontFamily: "DM Sans,sans-serif", fontSize: "0.72rem",
              color: "#444", marginTop: "8px", fontWeight: 300,
            }}>We typically respond within 24 hours.</div>
          </div>
        </a>

        {/* LinkedIn */}
        <a href="https://www.linkedin.com/in/thomaspaulcj/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
          <div style={{
            padding: "22px", borderRadius: "10px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            transition: "transform 0.3s var(--ease-out-expo), border-color 0.3s, background 0.3s",
            cursor: "pointer",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "translateY(-4px)"
            e.currentTarget.style.borderColor = "rgba(10,102,194,0.4)"
            e.currentTarget.style.background  = "rgba(10,102,194,0.06)"
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "translateY(0)"
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"
            e.currentTarget.style.background  = "rgba(255,255,255,0.03)"
          }}
          >
            <div style={{ fontSize: "1.6rem", marginBottom: "12px" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="#0a66c2">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </div>
            <div style={{
              fontFamily: "DM Sans,sans-serif", fontWeight: 600,
              color: "#fff", marginBottom: "6px",
            }}>LinkedIn</div>
            <div style={{
              fontFamily: "Space Mono,monospace", fontSize: "0.58rem",
              color: "#0a66c2", letterSpacing: "0.04em",
            }}>thomaspaulcj</div>
            <div style={{
              fontFamily: "DM Sans,sans-serif", fontSize: "0.72rem",
              color: "#444", marginTop: "8px", fontWeight: 300,
            }}>Connect for project queries & collaboration.</div>
          </div>
        </a>
      </div>

      {/* Divider */}
      <div style={{
        height: "1px",
        background: "linear-gradient(90deg,rgba(229,9,20,0.4),transparent)",
        marginBottom: "40px",
      }} />

      {/* FAQ */}
      <div style={{ animation: "fadeUp 0.5s 0.2s var(--ease-out-expo) both" }}>
        <h2 style={{
          fontFamily: "Bebas Neue,sans-serif", fontSize: "1.8rem",
          letterSpacing: "0.05em", color: "#fff", marginBottom: "24px",
        }}>Frequently Asked</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {FAQS.map(({ q, a }, i) => (
            <FAQItem key={i} q={q} a={a} index={i} />
          ))}
        </div>
      </div>

      {/* Footer note */}
      <div style={{
        marginTop: "60px", padding: "20px",
        border: "1px solid rgba(255,255,255,0.05)",
        borderRadius: "8px",
        background: "rgba(255,255,255,0.02)",
        animation: "fadeUp 0.5s 0.35s var(--ease-out-expo) both",
      }}>
        <div style={{
          fontFamily: "Space Mono,monospace", fontSize: "0.56rem",
          color: "#333", letterSpacing: "0.15em", textTransform: "uppercase",
          marginBottom: "6px",
        }}>About NexStream</div>
        <div style={{
          fontFamily: "DM Sans,sans-serif", fontSize: "0.78rem",
          color: "#444", fontWeight: 300, lineHeight: 1.7,
        }}>
          NexStream is a Netflix-style prototype built with React + Vite (frontend) and Python Flask (backend).
          Developed as part of a frontend + backend interview task. All video content uses publicly available
          sample streams from Google's GTV CDN.
        </div>
      </div>
    </div>
  )
}

function FAQItem({ q, a, index }) {
  return (
    <div style={{
      borderRadius: "8px", overflow: "hidden",
      border: "1px solid rgba(255,255,255,0.06)",
      animation: `fadeUp 0.4s ${0.25 + index * 0.06}s var(--ease-out-expo) both`,
    }}>
      <div style={{
        padding: "14px 18px",
        background: "rgba(255,255,255,0.02)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}>
        <div style={{
          fontFamily: "DM Sans,sans-serif", fontWeight: 500,
          fontSize: "0.85rem", color: "#ddd",
          display: "flex", alignItems: "flex-start", gap: "10px",
        }}>
          <span style={{ color: "#e50914", flexShrink: 0, marginTop: "1px" }}>Q</span>
          {q}
        </div>
      </div>
      <div style={{ padding: "12px 18px" }}>
        <div style={{
          fontFamily: "DM Sans,sans-serif", fontWeight: 300,
          fontSize: "0.8rem", color: "#666", lineHeight: 1.7,
          display: "flex", gap: "10px",
        }}>
          <span style={{ color: "#ff6b35", flexShrink: 0 }}>A</span>
          {a}
        </div>
      </div>
    </div>
  )
}
