// Variation A — Conversational Chat Flow
// Chat bubbles animate in one by one. Orb companion on the left reacts to answers.

const VarA_ConversationFlow = ({ questions = window.DEFAULT_QUESTIONS, motion = 1, theme = "dark" }) => {
  const T = window.OrbytTokens;
  const [step, setStep] = useState(0); // 0 = welcome, 1..N = Q, N+1 = DNA
  const [answers, setAnswers] = useState({});
  const [orbMood, setOrbMood] = useState("idle");
  const [textInput, setTextInput] = useState("");
  const [showingBubbles, setShowingBubbles] = useState(0);
  const [revealOptions, setRevealOptions] = useState(false);
  const scrollRef = useRef(null);

  const currentQ = step > 0 && step <= questions.length ? questions[step - 1] : null;
  const isWelcome = step === 0;
  const isDNA = step === questions.length + 1;

  const bubbles = useMemo(() => {
    if (!currentQ) return [];
    return typeof currentQ.bubbles === "function" ? currentQ.bubbles(answers) : currentQ.bubbles;
  }, [currentQ, answers]);

  // Animate bubbles in
  useEffect(() => {
    if (!currentQ) return;
    setShowingBubbles(0);
    setRevealOptions(false);
    setOrbMood("thinking");
    let i = 0;
    const tick = () => {
      i++;
      setShowingBubbles(i);
      if (i < bubbles.length) {
        setTimeout(tick, 900 / motion);
      } else {
        setTimeout(() => {
          setRevealOptions(true);
          setOrbMood(currentQ.orb || "listening");
        }, 400 / motion);
      }
    };
    setTimeout(tick, 600 / motion);
  }, [step, bubbles.length]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [showingBubbles, revealOptions, answers]);

  const commitAnswer = (val) => {
    setAnswers(a => ({ ...a, [currentQ.id]: val }));
    setOrbMood("happy");
    setTimeout(() => setStep(s => s + 1), 700 / motion);
  };

  const dna = useMemo(() => window.buildStudyDNA(answers), [answers]);

  // ---------- WELCOME ----------
  if (isWelcome) {
    return (
      <div style={{
        width: "100%", height: "100%",
        background: `radial-gradient(ellipse at 30% 20%, rgba(59,130,246,0.15), transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(167,139,250,0.12), transparent 50%), ${T.bg}`,
        display: "grid", gridTemplateRows: "auto 1fr auto",
        padding: "32px 48px 40px",
        position: "relative", overflow: "hidden",
      }}>
        <ParticleField />
        {/* top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <window.OrbytLogo size={28} glow />
            <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.01em" }}>Orbyt</span>
          </div>
          <button style={ghostLinkStyle}>Sign in instead →</button>
        </div>

        {/* center content */}
        <div style={{
          display: "grid", placeItems: "center",
          position: "relative", zIndex: 2,
        }}>
          <div style={{ textAlign: "center", maxWidth: 620 }}>
            <div style={{ display: "grid", placeItems: "center", marginBottom: 32, animation: "welcome-orb-in 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
              <window.CompanionOrb size={180} mood="happy" energy={0.9} hue={220} accentHue={280} />
            </div>
            <div style={{
              fontSize: 13, fontWeight: 600, letterSpacing: "0.12em",
              color: T.blueSoft, textTransform: "uppercase", marginBottom: 16,
              animation: "fade-up 0.8s 0.3s backwards",
            }}>Welcome to Orbyt</div>
            <h1 style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: 64, lineHeight: 1.05, letterSpacing: "-0.02em",
              margin: "0 0 20px", fontWeight: 400,
              animation: "fade-up 0.9s 0.5s backwards",
            }}>
              Your semester,<br/>
              <em style={{ fontStyle: "italic", background: `linear-gradient(135deg, ${T.blueSoft}, ${T.purple})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>in orbit.</em>
            </h1>
            <p style={{
              fontSize: 18, color: T.textDim, lineHeight: 1.6,
              margin: "0 auto 40px", maxWidth: 480,
              animation: "fade-up 1s 0.7s backwards",
            }}>
              I'll ask you a few questions — then build a study system that actually fits how your brain works.
            </p>
            <div style={{ animation: "fade-up 1.1s 0.9s backwards" }}>
              <window.PrimaryBtn size="lg" onClick={() => setStep(1)}>
                Let's get into it
                <span style={{ fontSize: 20, marginLeft: 2 }}>→</span>
              </window.PrimaryBtn>
            </div>
            <div style={{
              marginTop: 20, fontSize: 13, color: T.textFaint,
              animation: "fade-up 1.2s 1.1s backwards",
            }}>
              Takes about 2 minutes · {questions.length} quick questions
            </div>
          </div>
        </div>

        <div style={{ height: 20 }} />

        <style>{`
          @keyframes welcome-orb-in {
            from { opacity: 0; transform: scale(0.5) translateY(30px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
          @keyframes fade-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  // ---------- DNA REVEAL ----------
  if (isDNA) {
    return <DNAReveal dna={dna} answers={answers} onContinue={() => setStep(0)} />;
  }

  // ---------- QUESTION ----------
  return (
    <div style={{
      width: "100%", height: "100%",
      background: `radial-gradient(ellipse at 20% 50%, oklch(0.25 0.1 ${dna.hue} / 0.3), transparent 60%), ${T.bg}`,
      display: "grid", gridTemplateColumns: "320px 1fr",
      transition: "background 1.5s ease",
      position: "relative", overflow: "hidden",
    }}>
      <ParticleField opacity={0.4} />
      {/* left: orb + progress */}
      <div style={{
        borderRight: `1px solid ${T.line}`,
        padding: "24px 20px",
        display: "grid", gridTemplateRows: "auto 1fr auto",
        position: "relative", zIndex: 2,
        background: "rgba(10,14,26,0.4)",
        backdropFilter: "blur(20px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <window.OrbytLogo size={24} />
          <span style={{ fontSize: 15, fontWeight: 600 }}>Orbyt</span>
        </div>
        <div style={{ display: "grid", placeItems: "center" }}>
          <window.CompanionOrb size={180} mood={orbMood} energy={0.7} hue={220 + (step * 10)} accentHue={280} />
          <div style={{
            marginTop: 24, fontSize: 13, color: T.textDim,
            textAlign: "center", fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "0.08em",
          }}>
            {orbMood === "listening" && "// listening…"}
            {orbMood === "thinking" && "// thinking…"}
            {orbMood === "happy" && "// got it ✓"}
            {orbMood === "curious" && "// curious…"}
            {orbMood === "idle" && "// ready"}
          </div>
        </div>
        <div>
          <window.ProgressDots total={questions.length} current={step - 1} />
          <div style={{ marginTop: 10, fontSize: 12, color: T.textFaint }}>
            {step} of {questions.length}
          </div>
        </div>
      </div>

      {/* right: chat */}
      <div style={{ display: "grid", gridTemplateRows: "1fr auto", overflow: "hidden", position: "relative", zIndex: 2 }}>
        <div ref={scrollRef} style={{
          overflowY: "auto",
          padding: "60px 80px 20px",
          display: "flex", flexDirection: "column", gap: 12,
        }}>
          {/* Previous answers summary */}
          {Object.entries(answers).slice(-2).map(([k, v]) => {
            const q = questions.find(x => x.id === k);
            if (!q) return null;
            const label = q.type === "choice"
              ? (q.options.find(o => o.v === v)?.label || v)
              : v;
            return (
              <window.Bubble key={`prev-${k}`} from="user" compact>
                <span style={{ opacity: 0.9 }}>{label}</span>
              </window.Bubble>
            );
          })}

          {bubbles.slice(0, Math.max(0, showingBubbles - 1)).map((b, i) => (
            <window.Bubble key={`b-${step}-${i}`} from="orb">{b}</window.Bubble>
          ))}
          {showingBubbles > 0 && showingBubbles <= bubbles.length && (
            showingBubbles === bubbles.length + 1 ? null : (
              <window.Bubble from="orb" key={`typ-${step}-${showingBubbles}`}>
                {showingBubbles <= bubbles.length && (
                  <div style={{ animation: "bubble-reveal 0.4s" }}>
                    {bubbles[showingBubbles - 1]}
                  </div>
                )}
              </window.Bubble>
            )
          )}
          {showingBubbles < bubbles.length && (
            <div style={{
              background: "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(167,139,250,0.12))",
              padding: "12px 16px", borderRadius: "4px 20px 20px 20px",
              alignSelf: "flex-start",
              border: `1px solid ${T.line}`,
            }}>
              <window.TypingDots />
            </div>
          )}

          {/* Options */}
          {revealOptions && currentQ.type === "choice" && (
            <div style={{
              display: "flex", flexWrap: "wrap", gap: 10,
              marginTop: 20, maxWidth: 640,
            }}>
              {currentQ.options.map((opt, i) => (
                <window.Chip
                  key={opt.v}
                  icon={opt.icon}
                  delay={i * 0.06}
                  selected={answers[currentQ.id] === opt.v}
                  onClick={() => commitAnswer(opt.v)}
                >
                  {opt.label}
                </window.Chip>
              ))}
            </div>
          )}
        </div>

        {/* Input for text questions */}
        {revealOptions && currentQ.type === "text" && (
          <form
            onSubmit={(e) => { e.preventDefault(); if (textInput.trim()) { commitAnswer(textInput.trim()); setTextInput(""); } }}
            style={{
              padding: "20px 80px 28px",
              borderTop: `1px solid ${T.line}`,
              background: "rgba(10,14,26,0.6)",
              backdropFilter: "blur(10px)",
              animation: "fade-up 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            <div style={{
              display: "flex", gap: 10, alignItems: "flex-end",
              background: T.bgElev,
              borderRadius: 18,
              padding: 6,
              border: `1.5px solid ${T.lineStrong}`,
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = T.blue}
            >
              {currentQ.multiline ? (
                <textarea
                  value={textInput}
                  onChange={e => setTextInput(e.target.value)}
                  placeholder={currentQ.placeholder}
                  autoFocus
                  rows={2}
                  style={{
                    flex: 1, padding: "12px 14px",
                    background: "transparent", border: "none", outline: "none",
                    color: T.text, fontSize: 15, fontFamily: "inherit",
                    resize: "none",
                  }}
                />
              ) : (
                <input
                  type="text"
                  value={textInput}
                  onChange={e => setTextInput(e.target.value)}
                  placeholder={currentQ.placeholder}
                  autoFocus
                  style={{
                    flex: 1, padding: "12px 14px",
                    background: "transparent", border: "none", outline: "none",
                    color: T.text, fontSize: 15, fontFamily: "inherit",
                  }}
                />
              )}
              <window.PrimaryBtn size="sm" disabled={!textInput.trim()}>
                Send →
              </window.PrimaryBtn>
            </div>
            <div style={{ marginTop: 8, fontSize: 12, color: T.textFaint, display: "flex", justifyContent: "space-between" }}>
              <span>Press ⏎ to send</span>
              {step > 1 && <button onClick={() => setStep(s => s - 1)} style={ghostLinkStyle}>← Back</button>}
            </div>
          </form>
        )}
        {revealOptions && currentQ.type === "choice" && step > 1 && (
          <div style={{ padding: "16px 80px 20px", borderTop: `1px solid ${T.line}` }}>
            <button onClick={() => setStep(s => s - 1)} style={ghostLinkStyle}>← Back</button>
          </div>
        )}
      </div>
      <style>{`
        @keyframes bubble-reveal {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

const ghostLinkStyle = {
  background: "none", border: "none",
  color: window.OrbytTokens.textDim, fontSize: 13,
  cursor: "pointer", fontFamily: "inherit",
};

// ============ PARTICLE FIELD ============
const ParticleField = ({ opacity = 1 }) => {
  const particles = useMemo(() =>
    Array.from({ length: 40 }).map((_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2,
      dur: 8 + Math.random() * 12,
      delay: Math.random() * 8,
      hue: 220 + Math.random() * 80,
    })), []);
  return (
    <div style={{
      position: "absolute", inset: 0, pointerEvents: "none",
      opacity,
    }}>
      {particles.map((p, i) => (
        <div key={i} style={{
          position: "absolute",
          left: `${p.x}%`, top: `${p.y}%`,
          width: p.size, height: p.size,
          borderRadius: "50%",
          background: `oklch(0.85 0.15 ${p.hue})`,
          boxShadow: `0 0 ${p.size * 4}px oklch(0.85 0.15 ${p.hue})`,
          animation: `particle-drift-${i % 5} ${p.dur}s ease-in-out infinite ${p.delay}s`,
        }} />
      ))}
      <style>{`
        @keyframes particle-drift-0 { 0%,100% { transform: translate(0,0); opacity: 0.3; } 50% { transform: translate(20px,-30px); opacity: 0.9; } }
        @keyframes particle-drift-1 { 0%,100% { transform: translate(0,0); opacity: 0.2; } 50% { transform: translate(-25px,20px); opacity: 0.7; } }
        @keyframes particle-drift-2 { 0%,100% { transform: translate(0,0); opacity: 0.4; } 50% { transform: translate(15px,35px); opacity: 1; } }
        @keyframes particle-drift-3 { 0%,100% { transform: translate(0,0); opacity: 0.25; } 50% { transform: translate(-20px,-25px); opacity: 0.8; } }
        @keyframes particle-drift-4 { 0%,100% { transform: translate(0,0); opacity: 0.35; } 50% { transform: translate(30px,10px); opacity: 0.9; } }
      `}</style>
    </div>
  );
};

// ============ DNA REVEAL ============
const DNAReveal = ({ dna, answers, onContinue }) => {
  const T = window.OrbytTokens;
  const [phase, setPhase] = useState(0); // 0 building, 1 reveal
  useEffect(() => {
    const t = setTimeout(() => setPhase(1), 2400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      width: "100%", height: "100%",
      background: `radial-gradient(ellipse at 50% 40%, oklch(0.3 0.15 ${dna.hue} / 0.6), transparent 60%), radial-gradient(ellipse at 50% 90%, oklch(0.3 0.15 ${dna.accentHue} / 0.4), transparent 60%), ${T.bg}`,
      position: "relative", overflow: "hidden",
      display: "grid", placeItems: "center",
    }}>
      <ParticleField />
      {phase === 0 ? (
        <div style={{ textAlign: "center", zIndex: 2 }}>
          <div style={{ display: "grid", placeItems: "center", marginBottom: 32 }}>
            <window.CompanionOrb size={220} mood="thinking" energy={1} hue={dna.hue} accentHue={dna.accentHue} />
          </div>
          <div style={{
            fontSize: 13, letterSpacing: "0.2em", color: T.textDim,
            fontFamily: "'JetBrains Mono', monospace",
            textTransform: "uppercase", marginBottom: 10,
          }}>
            <span style={{ animation: "dots 2s infinite" }}>Mapping your study DNA</span>
          </div>
          <div style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 42, lineHeight: 1.1, margin: 0,
          }}>
            Reading between the lines…
          </div>
          <style>{`
            @keyframes dots { 0%,100% { opacity: 0.4 } 50% { opacity: 1 } }
          `}</style>
        </div>
      ) : (
        <div style={{
          width: 560,
          animation: "card-drop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
          zIndex: 2,
        }}>
          <div style={{
            textAlign: "center", marginBottom: 24,
            fontSize: 13, color: T.textDim, letterSpacing: "0.2em",
            textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace",
            animation: "fade-up 0.6s 0.3s backwards",
          }}>
            Your Study DNA
          </div>
          <div style={{
            background: `linear-gradient(160deg, oklch(0.25 0.1 ${dna.hue} / 0.9), oklch(0.2 0.08 ${dna.accentHue} / 0.9))`,
            border: `1px solid oklch(0.7 0.2 ${dna.hue} / 0.4)`,
            borderRadius: 28,
            padding: 36,
            boxShadow: `0 30px 80px oklch(0.3 0.15 ${dna.hue} / 0.5), 0 0 0 1px rgba(255,255,255,0.06)`,
            position: "relative",
            overflow: "hidden",
          }}>
            {/* aura */}
            <div style={{
              position: "absolute", inset: -100,
              background: `conic-gradient(from 0deg, oklch(0.7 0.25 ${dna.hue} / 0.3), transparent 50%, oklch(0.7 0.25 ${dna.accentHue} / 0.3), transparent)`,
              animation: "aura-rotate 20s linear infinite",
              pointerEvents: "none",
            }} />

            {/* orb in card */}
            <div style={{ display: "grid", placeItems: "center", marginBottom: 20, position: "relative", zIndex: 1 }}>
              <window.CompanionOrb size={140} mood="happy" energy={1} hue={dna.hue} accentHue={dna.accentHue} />
            </div>

            <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: 14, color: T.textDim, marginBottom: 4 }}>You are</div>
              <h2 style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: 56, fontWeight: 400,
                margin: "0 0 6px",
                letterSpacing: "-0.02em",
                lineHeight: 1,
                background: `linear-gradient(135deg, oklch(0.95 0.1 ${dna.hue}), oklch(0.8 0.2 ${dna.accentHue}))`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                {dna.trait}
              </h2>
              <div style={{ fontSize: 16, color: T.text, opacity: 0.9, marginBottom: 28, fontStyle: "italic" }}>
                — {dna.name}, {dna.peak}
              </div>

              <div style={{
                display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1,
                background: "rgba(255,255,255,0.08)",
                borderRadius: 14,
                overflow: "hidden",
                marginBottom: 28,
              }}>
                {[
                  { label: "Peak hours", value: dna.peak },
                  { label: "Study style", value: dna.style },
                  { label: "Driven by", value: dna.motivation },
                  { label: "Orbyt will", value: "adapt 🎯" },
                ].map((s, i) => (
                  <div key={i} style={{
                    background: "rgba(10,14,26,0.7)",
                    padding: "14px 16px",
                    animation: `fade-up 0.5s ${0.5 + i * 0.1}s backwards`,
                  }}>
                    <div style={{ fontSize: 11, color: T.textFaint, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>{s.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{s.value}</div>
                  </div>
                ))}
              </div>

              <window.PrimaryBtn size="lg" onClick={onContinue}>
                Enter Orbyt
                <span style={{ fontSize: 20, marginLeft: 4 }}>→</span>
              </window.PrimaryBtn>
              <div style={{ marginTop: 14, fontSize: 12, color: T.textFaint }}>
                <button onClick={onContinue} style={ghostLinkStyle}>Start over</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes card-drop {
          from { opacity: 0; transform: translateY(40px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes aura-rotate { to { transform: rotate(360deg); } }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

window.VarA_ConversationFlow = VarA_ConversationFlow;
window.ParticleField = ParticleField;
window.DNAReveal = DNAReveal;
