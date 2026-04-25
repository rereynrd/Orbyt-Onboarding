// Variation B — Cosmic cinematic flow
// Full-bleed, one question per screen. Huge editorial type. Orbit metaphor literal.
// Each answered question adds a planet to the user's solar system.

const VarB_CosmicFlow = ({ questions = window.DEFAULT_QUESTIONS }) => {
  const T = window.OrbytTokens;
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [textInput, setTextInput] = useState("");
  const [transitioning, setTransitioning] = useState(false);

  const currentQ = step > 0 && step <= questions.length ? questions[step - 1] : null;
  const isWelcome = step === 0;
  const isDNA = step === questions.length + 1;

  const bubbles = useMemo(() => {
    if (!currentQ) return [];
    return typeof currentQ.bubbles === "function" ? currentQ.bubbles(answers) : currentQ.bubbles;
  }, [currentQ, answers]);

  const go = (dir = 1) => {
    setTransitioning(true);
    setTimeout(() => {
      setStep(s => s + dir);
      setTransitioning(false);
      setTextInput("");
    }, 400);
  };

  const commitAnswer = (val) => {
    setAnswers(a => ({ ...a, [currentQ.id]: val }));
    setTimeout(() => go(1), 300);
  };

  const dna = useMemo(() => window.buildStudyDNA(answers), [answers]);
  const progress = step / (questions.length + 1);

  // ---------- WELCOME ----------
  if (isWelcome) {
    return (
      <div style={{
        width: "100%", height: "100%",
        background: T.bg,
        position: "relative", overflow: "hidden",
      }}>
        <StarField density={120} />
        <OrbitLines answers={{}} progress={0} />

        <div style={{
          position: "relative", zIndex: 10,
          width: "100%", height: "100%",
          display: "grid", gridTemplateRows: "auto 1fr auto",
          padding: "32px 60px 40px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <window.OrbytLogo size={28} glow />
            <span style={{ fontSize: 17, fontWeight: 600 }}>Orbyt</span>
          </div>

          <div style={{ display: "grid", placeItems: "center", textAlign: "center" }}>
            <div style={{ maxWidth: 780 }}>
              <div style={{
                fontSize: 12, letterSpacing: "0.3em",
                color: T.blueSoft, textTransform: "uppercase",
                fontFamily: "'JetBrains Mono', monospace",
                marginBottom: 40,
                animation: "fade-up 0.8s 0.2s backwards",
              }}>
                ✦ Orbyt Onboarding ✦
              </div>
              <h1 style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: 110, lineHeight: 0.95, letterSpacing: "-0.035em",
                margin: "0 0 36px", fontWeight: 400,
                animation: "cosmic-in 1.2s 0.4s cubic-bezier(0.22, 1, 0.36, 1) backwards",
              }}>
                Let's build your<br/>
                <em style={{
                  fontStyle: "italic",
                  background: `linear-gradient(135deg, #60A5FA 10%, #A78BFA 50%, #F472B6 90%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  position: "relative",
                }}>
                  study universe
                </em>
                .
              </h1>
              <p style={{
                fontSize: 20, color: T.textDim, lineHeight: 1.5,
                margin: "0 auto 48px", maxWidth: 520, fontWeight: 400,
                animation: "fade-up 0.8s 0.7s backwards",
              }}>
                Seven questions. Honest answers. One semester that finally works around you.
              </p>
              <div style={{ animation: "fade-up 0.8s 1s backwards" }}>
                <window.PrimaryBtn size="lg" onClick={() => go(1)}>
                  Begin
                  <span style={{ fontSize: 18, marginLeft: 4 }}>↗</span>
                </window.PrimaryBtn>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: T.textFaint, fontFamily: "'JetBrains Mono', monospace" }}>
            <span>T − 00:02:00</span>
            <span>Press SPACE to begin</span>
            <span>v2.0</span>
          </div>
        </div>

        <style>{`
          @keyframes cosmic-in {
            from { opacity: 0; transform: translateY(40px) scale(0.95); filter: blur(10px); }
            to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
          }
          @keyframes fade-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  // ---------- DNA ----------
  if (isDNA) {
    return (
      <div style={{
        width: "100%", height: "100%",
        background: T.bg, position: "relative", overflow: "hidden",
        display: "grid", gridTemplateColumns: "1fr 1fr",
      }}>
        <StarField density={160} />
        {/* left: your complete solar system */}
        <div style={{ position: "relative", display: "grid", placeItems: "center" }}>
          <div style={{ position: "relative", width: 500, height: 500 }}>
            <OrbitLines answers={answers} progress={1} big />
            <div style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%,-50%)",
              animation: "pulse-core 3s ease-in-out infinite",
            }}>
              <window.CompanionOrb size={120} mood="happy" energy={1} hue={dna.hue} accentHue={dna.accentHue} />
            </div>
          </div>
        </div>
        {/* right: DNA */}
        <div style={{ padding: "80px 60px", display: "flex", flexDirection: "column", justifyContent: "center", zIndex: 5 }}>
          <div style={{
            fontSize: 11, letterSpacing: "0.3em",
            color: T.blueSoft, textTransform: "uppercase",
            fontFamily: "'JetBrains Mono', monospace",
            marginBottom: 20,
            animation: "fade-up 0.6s backwards",
          }}>
            ✦ Study DNA · Catalog entry
          </div>
          <div style={{ fontSize: 16, color: T.textDim, marginBottom: 8, animation: "fade-up 0.6s 0.2s backwards" }}>
            Meet {dna.name}, also known as
          </div>
          <h2 style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 80, fontWeight: 400,
            margin: "0 0 12px", lineHeight: 1,
            letterSpacing: "-0.03em",
            background: `linear-gradient(135deg, oklch(0.95 0.1 ${dna.hue}), oklch(0.8 0.2 ${dna.accentHue}))`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "cosmic-in 1s 0.3s backwards",
          }}>
            {dna.trait}
          </h2>
          <div style={{
            fontSize: 18, color: T.textDim, lineHeight: 1.6,
            marginBottom: 40, maxWidth: 420,
            animation: "fade-up 0.6s 0.6s backwards",
          }}>
            A {dna.peak.toLowerCase()} who studies best in <em style={{ color: T.blueSoft, fontStyle: "normal" }}>{dna.style}</em>, powered by <em style={{ color: T.purple, fontStyle: "normal" }}>{dna.motivation.toLowerCase()}</em>.
          </div>

          <div style={{ display: "flex", gap: 12, marginBottom: 32 }}>
            {["Adaptive schedules", "Gentle nudges", "Streak system"].map((tag, i) => (
              <div key={tag} style={{
                padding: "6px 12px", fontSize: 12,
                border: `1px solid ${T.lineStrong}`,
                borderRadius: 999,
                color: T.textDim,
                background: "rgba(255,255,255,0.02)",
                animation: `fade-up 0.6s ${0.8 + i * 0.1}s backwards`,
              }}>
                ✓ {tag}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 14, animation: "fade-up 0.6s 1.2s backwards" }}>
            <window.PrimaryBtn size="lg" onClick={() => setStep(0)}>
              Enter Orbyt →
            </window.PrimaryBtn>
            <button style={{ ...ghostBtn, padding: "18px 24px" }} onClick={() => setStep(0)}>
              Start over
            </button>
          </div>
        </div>

        <style>{`
          @keyframes pulse-core { 0%,100% { transform: translate(-50%,-50%) scale(1); } 50% { transform: translate(-50%,-50%) scale(1.05); } }
          @keyframes cosmic-in {
            from { opacity: 0; transform: translateY(40px); filter: blur(10px); }
            to { opacity: 1; transform: translateY(0); filter: blur(0); }
          }
          @keyframes fade-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  // ---------- QUESTION ----------
  const intro = bubbles[0] || "";
  const prompt = bubbles[1] || bubbles[0] || "";

  return (
    <div style={{
      width: "100%", height: "100%",
      background: `radial-gradient(ellipse at 70% 30%, oklch(0.22 0.12 ${dna.hue} / 0.5), transparent 60%), ${T.bg}`,
      position: "relative", overflow: "hidden",
      transition: "background 1s",
    }}>
      <StarField density={80} />

      {/* Orbit viz right side */}
      <div style={{
        position: "absolute", right: -200, top: "50%",
        transform: "translateY(-50%)",
        width: 700, height: 700,
        zIndex: 1, opacity: 0.7,
      }}>
        <OrbitLines answers={answers} progress={progress} />
      </div>

      {/* top bar */}
      <div style={{
        position: "absolute", top: 32, left: 60, right: 60,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        zIndex: 20,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <window.OrbytLogo size={22} />
          <span style={{ fontSize: 14, fontWeight: 600 }}>Orbyt</span>
        </div>
        <div style={{
          fontSize: 12, fontFamily: "'JetBrains Mono', monospace",
          color: T.textDim, letterSpacing: "0.1em",
        }}>
          {String(step).padStart(2,"0")} / {String(questions.length).padStart(2,"0")}
        </div>
        <div style={{ display: "flex", gap: 14 }}>
          {step > 1 && <button style={ghostBtn} onClick={() => go(-1)}>← Back</button>}
          <button style={ghostBtn} onClick={() => go(1)}>Skip</button>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{
        position: "absolute", top: 80, left: 60, right: 60,
        height: 2, background: "rgba(255,255,255,0.05)",
        zIndex: 20, borderRadius: 2, overflow: "hidden",
      }}>
        <div style={{
          width: `${progress * 100}%`,
          height: "100%",
          background: `linear-gradient(90deg, ${T.blue}, ${T.purple})`,
          transition: "width 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
          boxShadow: `0 0 8px ${T.blue}`,
        }} />
      </div>

      {/* content */}
      <div style={{
        position: "relative", zIndex: 10,
        width: "100%", height: "100%",
        padding: "140px 60px 60px",
        display: "grid", gridTemplateColumns: "1fr 520px", gap: 60,
        alignItems: "center",
      }}>
        <div style={{
          opacity: transitioning ? 0 : 1,
          transform: transitioning ? "translateX(-30px)" : "translateX(0)",
          transition: "opacity 0.4s, transform 0.4s",
        }}>
          <div style={{
            fontSize: 14, color: T.textDim, marginBottom: 20,
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "0.1em",
            animation: "fade-up 0.6s backwards",
          }}>
            ✦ Question {step}
          </div>
          {intro && prompt !== intro && (
            <div style={{
              fontSize: 24, color: T.textDim,
              marginBottom: 12, fontStyle: "italic",
              fontFamily: "'Instrument Serif', serif",
              animation: "fade-up 0.7s 0.1s backwards",
            }}>
              "{intro}"
            </div>
          )}
          <h1 style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 72, lineHeight: 1.05, letterSpacing: "-0.025em",
            margin: 0, fontWeight: 400,
            animation: "cosmic-q-in 0.9s 0.2s cubic-bezier(0.22, 1, 0.36, 1) backwards",
          }}>
            {prompt}
          </h1>

          <div style={{ marginTop: 48 }}>
            {currentQ.type === "choice" && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, maxWidth: 640 }}>
                {currentQ.options.map((opt, i) => (
                  <window.Chip
                    key={opt.v}
                    icon={opt.icon}
                    delay={0.4 + i * 0.06}
                    selected={answers[currentQ.id] === opt.v}
                    onClick={() => commitAnswer(opt.v)}
                  >
                    {opt.label}
                  </window.Chip>
                ))}
              </div>
            )}
            {currentQ.type === "text" && (
              <form
                onSubmit={e => { e.preventDefault(); if (textInput.trim()) commitAnswer(textInput.trim()); }}
                style={{ maxWidth: 560, animation: "fade-up 0.7s 0.4s backwards" }}
              >
                <div style={{
                  borderBottom: `2px solid ${T.blue}`,
                  paddingBottom: 8,
                  display: "flex", alignItems: "center", gap: 8,
                }}>
                  <span style={{ color: T.blue, fontFamily: "'Instrument Serif', serif", fontSize: 36 }}>»</span>
                  <input
                    type="text"
                    value={textInput}
                    onChange={e => setTextInput(e.target.value)}
                    placeholder={currentQ.placeholder}
                    autoFocus
                    style={{
                      flex: 1,
                      background: "transparent", border: "none", outline: "none",
                      color: T.text,
                      fontSize: 32,
                      fontFamily: "'Instrument Serif', serif",
                      padding: "4px 0",
                    }}
                  />
                </div>
                <div style={{ marginTop: 16, display: "flex", gap: 12, alignItems: "center" }}>
                  <window.PrimaryBtn size="md" disabled={!textInput.trim()}>
                    Continue →
                  </window.PrimaryBtn>
                  <span style={{ fontSize: 12, color: T.textFaint }}>or press ⏎</span>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* right visual */}
        <div style={{
          display: "grid", placeItems: "center",
          opacity: transitioning ? 0 : 1,
          transition: "opacity 0.6s",
        }}>
          <window.CompanionOrb
            size={260}
            mood={currentQ.orb || "listening"}
            energy={0.7 + progress * 0.3}
            hue={dna.hue}
            accentHue={dna.accentHue}
          />
        </div>
      </div>

      <style>{`
        @keyframes cosmic-q-in {
          from { opacity: 0; transform: translateY(30px); filter: blur(8px); letter-spacing: 0; }
          to { opacity: 1; transform: translateY(0); filter: blur(0); letter-spacing: -0.025em; }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

// ============ STAR FIELD ============
const StarField = ({ density = 80 }) => {
  const stars = useMemo(() =>
    Array.from({ length: density }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() < 0.8 ? 1 : 2,
      op: 0.3 + Math.random() * 0.6,
      dur: 2 + Math.random() * 4,
      delay: Math.random() * 3,
    })), [density]);
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {stars.map((s, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${s.x}%`, top: `${s.y}%`,
          width: s.size, height: s.size,
          background: "white", borderRadius: "50%",
          opacity: s.op,
          animation: `star-twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
        }} />
      ))}
      <style>{`
        @keyframes star-twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

// ============ ORBIT LINES (grows as answers arrive) ============
const OrbitLines = ({ answers, progress, big = false }) => {
  const T = window.OrbytTokens;
  const count = Object.keys(answers || {}).length;
  const max = 7;
  const size = big ? 500 : 700;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      {Array.from({ length: max }).map((_, i) => {
        const active = i < count;
        const ringSize = 30 + ((i + 1) / max) * 100;
        const tilt = -15 - (i % 3) * 8;
        const dur = 30 + i * 10;
        return (
          <div key={i} style={{
            position: "absolute", top: "50%", left: "50%",
            width: `${ringSize}%`, height: `${ringSize * 0.3}%`,
            marginLeft: `-${ringSize / 2}%`, marginTop: `-${ringSize * 0.15}%`,
            border: `1px ${active ? "solid" : "dashed"} ${active ? `oklch(0.7 0.2 ${220 + i * 25} / 0.7)` : "rgba(255,255,255,0.08)"}`,
            borderRadius: "50%",
            transform: `rotateZ(${tilt}deg)`,
            animation: active ? `orbit-spin-${i} ${dur}s linear infinite` : "none",
            transition: "border-color 0.8s",
          }}>
            {active && (
              <div style={{
                position: "absolute", left: -5, top: "50%",
                width: 10, height: 10, borderRadius: "50%",
                background: `oklch(0.75 0.22 ${220 + i * 25})`,
                boxShadow: `0 0 16px oklch(0.75 0.22 ${220 + i * 25})`,
                transform: "translateY(-50%)",
                animation: "planet-appear 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }} />
            )}
          </div>
        );
      })}
      <style>{`
        ${Array.from({ length: max }).map((_, i) => `
          @keyframes orbit-spin-${i} {
            to { transform: rotateZ(${-15 - (i % 3) * 8}deg) rotate3d(0,0,1,${i % 2 ? 360 : -360}deg); }
          }
        `).join("")}
        @keyframes planet-appear {
          from { opacity: 0; transform: translateY(-50%) scale(0); }
          to { opacity: 1; transform: translateY(-50%) scale(1); }
        }
      `}</style>
    </div>
  );
};

const ghostBtn = {
  background: "transparent", border: `1px solid ${window.OrbytTokens.lineStrong}`,
  color: window.OrbytTokens.textDim,
  padding: "8px 14px", fontSize: 13, fontWeight: 500,
  borderRadius: 999, cursor: "pointer",
  fontFamily: "inherit",
};

window.VarB_CosmicFlow = VarB_CosmicFlow;
window.StarField = StarField;
window.OrbitLines = OrbitLines;
