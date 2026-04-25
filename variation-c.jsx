// Variation C — Split-screen "Live Study DNA" flow
// Left: conversational question. Right: a card that builds visibly with each answer.

const VarC_SplitDNA = ({ questions = window.DEFAULT_QUESTIONS }) => {
  const T = window.OrbytTokens;
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [textInput, setTextInput] = useState("");
  const [flashKey, setFlashKey] = useState(0);

  const currentQ = step > 0 && step <= questions.length ? questions[step - 1] : null;
  const isWelcome = step === 0;
  const isDNA = step === questions.length + 1;

  const bubbles = useMemo(() => {
    if (!currentQ) return [];
    return typeof currentQ.bubbles === "function" ? currentQ.bubbles(answers) : currentQ.bubbles;
  }, [currentQ, answers]);

  const commitAnswer = (val) => {
    setAnswers(a => ({ ...a, [currentQ.id]: val }));
    setFlashKey(k => k + 1);
    setTimeout(() => { setStep(s => s + 1); setTextInput(""); }, 600);
  };

  const dna = useMemo(() => window.buildStudyDNA(answers), [answers]);
  const answered = Object.keys(answers).length;

  if (isWelcome) {
    return (
      <div style={{
        width: "100%", height: "100%",
        background: T.bg,
        position: "relative", overflow: "hidden",
        display: "grid", gridTemplateColumns: "1.1fr 1fr",
      }}>
        <window.ParticleField opacity={0.5} />
        {/* left: intro */}
        <div style={{
          padding: "48px 60px",
          display: "flex", flexDirection: "column", justifyContent: "space-between",
          position: "relative", zIndex: 2,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <window.OrbytLogo size={24} />
            <span style={{ fontSize: 15, fontWeight: 600 }}>Orbyt</span>
          </div>
          <div>
            <div style={{
              fontSize: 12, letterSpacing: "0.2em",
              color: T.blueSoft, textTransform: "uppercase",
              fontFamily: "'JetBrains Mono', monospace",
              marginBottom: 20,
              animation: "fade-up 0.8s backwards",
            }}>
              Setting up your study profile
            </div>
            <h1 style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: 72, lineHeight: 1.02, letterSpacing: "-0.025em",
              margin: "0 0 28px", fontWeight: 400,
              animation: "fade-up 1s 0.2s backwards",
            }}>
              7 questions.<br/>
              <em style={{
                fontStyle: "italic",
                background: "linear-gradient(135deg, #60A5FA, #A78BFA)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>One Study DNA.</em>
            </h1>
            <p style={{
              fontSize: 18, color: T.textDim, lineHeight: 1.6,
              margin: "0 0 32px", maxWidth: 460,
              animation: "fade-up 1s 0.4s backwards",
            }}>
              Watch your profile come to life on the right as you answer. No wrong answers — just you, on paper.
            </p>
            <div style={{ animation: "fade-up 1s 0.6s backwards" }}>
              <window.PrimaryBtn size="lg" onClick={() => setStep(1)}>
                Let's begin →
              </window.PrimaryBtn>
            </div>
          </div>
          <div style={{ fontSize: 12, color: T.textFaint }}>
            You can come back and edit anything later.
          </div>
        </div>

        {/* right: card preview */}
        <div style={{
          display: "grid", placeItems: "center",
          background: `radial-gradient(ellipse at 50% 50%, oklch(0.25 0.1 220 / 0.4), transparent 70%)`,
          borderLeft: `1px solid ${T.line}`,
          position: "relative", zIndex: 2,
        }}>
          <DNACard dna={dna} answers={answers} previewMode={true} />
        </div>
        <style>{`
          @keyframes fade-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  if (isDNA) {
    return (
      <div style={{
        width: "100%", height: "100%",
        background: `radial-gradient(ellipse at 50% 40%, oklch(0.25 0.12 ${dna.hue} / 0.5), transparent 70%), ${T.bg}`,
        position: "relative", overflow: "hidden",
        display: "grid", placeItems: "center",
      }}>
        <window.StarField density={100} />
        <div style={{ textAlign: "center", zIndex: 2, animation: "dna-final 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
          <div style={{
            fontSize: 12, letterSpacing: "0.3em",
            color: T.blueSoft, textTransform: "uppercase",
            fontFamily: "'JetBrains Mono', monospace",
            marginBottom: 24,
            animation: "fade-up 0.8s 0.4s backwards",
          }}>
            ✨ Profile complete
          </div>
          <h1 style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 56, margin: "0 0 36px", fontWeight: 400,
            animation: "fade-up 0.8s 0.6s backwards",
          }}>
            Here's <em style={{ fontStyle: "italic" }}>you</em>.
          </h1>
          <div style={{ animation: "fade-up 0.8s 0.8s backwards" }}>
            <DNACard dna={dna} answers={answers} large />
          </div>
          <div style={{ marginTop: 40, display: "flex", gap: 12, justifyContent: "center", animation: "fade-up 0.8s 1.2s backwards" }}>
            <window.PrimaryBtn size="lg" onClick={() => setStep(0)}>
              Open my dashboard →
            </window.PrimaryBtn>
          </div>
        </div>
        <style>{`
          @keyframes dna-final {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes fade-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      width: "100%", height: "100%",
      background: T.bg,
      display: "grid", gridTemplateColumns: "1.1fr 1fr",
      position: "relative", overflow: "hidden",
    }}>
      <window.ParticleField opacity={0.3} />
      {/* LEFT: question */}
      <div style={{
        padding: "36px 60px 40px",
        display: "grid", gridTemplateRows: "auto 1fr auto",
        position: "relative", zIndex: 2,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <window.OrbytLogo size={22} />
            <span style={{ fontSize: 14, fontWeight: 600 }}>Orbyt</span>
          </div>
          <window.ProgressDots total={questions.length} current={step - 1} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: 520 }}>
          <div style={{
            fontSize: 12, letterSpacing: "0.15em",
            color: T.textDim, textTransform: "uppercase",
            fontFamily: "'JetBrains Mono', monospace",
            marginBottom: 16,
          }} key={`qn-${step}`}>
            <span style={{ animation: "fade-up 0.5s" }}>Question {step} · {questions.length}</span>
          </div>

          <div key={`bubbles-${step}`} style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
            {bubbles.map((b, i) => (
              <div key={i} style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: i === bubbles.length - 1 ? 44 : 22,
                fontStyle: i === bubbles.length - 1 ? "normal" : "italic",
                color: i === bubbles.length - 1 ? T.text : T.textDim,
                lineHeight: 1.15, letterSpacing: "-0.015em",
                animation: `fade-up 0.7s ${i * 0.2}s backwards`,
              }}>
                {b}
              </div>
            ))}
          </div>

          {currentQ.type === "choice" && (
            <div key={`opts-${step}`} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {currentQ.options.map((opt, i) => (
                <window.OptionCheck
                  key={opt.v}
                  icon={opt.icon}
                  delay={0.5 + i * 0.06}
                  selected={answers[currentQ.id] === opt.v}
                  onClick={() => commitAnswer(opt.v)}
                  dnaHue={dna.hue}
                >
                  {opt.label}
                </window.OptionCheck>
              ))}
            </div>
          )}
          {currentQ.type === "text" && (
            <form
              key={`f-${step}`}
              onSubmit={e => { e.preventDefault(); if (textInput.trim()) commitAnswer(textInput.trim()); }}
              style={{ animation: "fade-up 0.7s 0.5s backwards" }}
            >
              <div style={{
                borderBottom: `2px solid ${T.blue}`,
                paddingBottom: 6,
                display: "flex", alignItems: "center", gap: 8,
              }}>
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
                    fontSize: 28,
                    fontFamily: "'Instrument Serif', serif",
                    padding: "4px 0",
                  }}
                />
                <window.PrimaryBtn size="sm" disabled={!textInput.trim()}>→</window.PrimaryBtn>
              </div>
              <div style={{ marginTop: 10, fontSize: 12, color: T.textFaint }}>
                Press ⏎ to continue
              </div>
            </form>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, color: T.textFaint }}>
          <span>{answered} of {questions.length} traits identified</span>
          {step > 1 && <button onClick={() => setStep(s => s - 1)} style={ghostBtn2}>← Back</button>}
        </div>
      </div>

      {/* RIGHT: DNA card */}
      <div style={{
        display: "grid", placeItems: "center",
        background: `linear-gradient(160deg, oklch(0.17 0.05 ${dna.hue} / 0.6), oklch(0.12 0.03 ${dna.accentHue} / 0.6))`,
        borderLeft: `1px solid ${T.line}`,
        position: "relative", zIndex: 2,
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: -100,
          background: `radial-gradient(circle at 50% 50%, oklch(0.4 0.2 ${dna.hue} / 0.3), transparent 50%)`,
          filter: "blur(40px)",
          transition: "background 1s",
        }} />
        <div style={{ position: "relative", zIndex: 2 }} key={`card-${flashKey}`}>
          <DNACard dna={dna} answers={answers} flashKey={flashKey} />
        </div>
      </div>

      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

// ============ DNA CARD ============
const DNACard = ({ dna, answers, previewMode = false, large = false, flashKey = 0 }) => {
  const T = window.OrbytTokens;
  const answered = Object.keys(answers).length;
  const W = large ? 440 : 380;

  const rows = [
    { label: "Identity", value: dna.name || "—", filled: !!answers.name, key: "name" },
    { label: "Discipline", value: answers.field ? window.DEFAULT_QUESTIONS[1].options.find(o => o.v === answers.field)?.label : "—", filled: !!answers.field, key: "field" },
    { label: "Struggle", value: dna.trait.replace("The ", ""), filled: !!answers.struggle, key: "struggle" },
    { label: "Driver", value: dna.motivation, filled: !!answers.motivation, key: "motivation" },
    { label: "Peak hours", value: dna.peak, filled: !!answers.peak, key: "peak" },
    { label: "Study mode", value: dna.style, filled: !!answers.style, key: "style" },
    { label: "Goal", value: answers.goal || "—", filled: !!answers.goal, key: "goal" },
  ];

  return (
    <div style={{
      width: W,
      borderRadius: 24,
      background: `linear-gradient(160deg, oklch(0.2 0.08 ${dna.hue} / 0.9), oklch(0.14 0.06 ${dna.accentHue} / 0.9))`,
      border: `1px solid oklch(0.65 0.2 ${dna.hue} / 0.35)`,
      boxShadow: `0 30px 80px oklch(0.2 0.15 ${dna.hue} / 0.45), inset 0 1px 0 rgba(255,255,255,0.1)`,
      padding: 28,
      position: "relative",
      overflow: "hidden",
      transition: "border-color 0.8s, box-shadow 0.8s",
    }}>
      {/* aura layer */}
      <div style={{
        position: "absolute", inset: -40, pointerEvents: "none",
        background: `conic-gradient(from 0deg, oklch(0.7 0.25 ${dna.hue} / 0.2), transparent 60%, oklch(0.7 0.25 ${dna.accentHue} / 0.2), transparent)`,
        animation: "aura-spin 30s linear infinite",
      }} />

      {/* header */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase",
        color: T.textDim, fontFamily: "'JetBrains Mono', monospace",
        marginBottom: 24, position: "relative", zIndex: 1,
      }}>
        <span>Orbyt · Study DNA</span>
        <span>#{String(1337 + answered * 7).padStart(4, "0")}</span>
      </div>

      {/* orb + trait */}
      <div style={{ display: "grid", placeItems: "center", marginBottom: 20, position: "relative", zIndex: 1 }}>
        <window.CompanionOrb size={large ? 150 : 120} mood={answered === 7 ? "happy" : "thinking"} energy={0.4 + answered / 10} hue={dna.hue} accentHue={dna.accentHue} />
      </div>

      <div style={{ textAlign: "center", marginBottom: 20, position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: 11, color: T.textFaint, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 4 }}>
          {answered < 3 ? "Decoding…" : "You are"}
        </div>
        <div style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: large ? 48 : 38,
          fontWeight: 400,
          lineHeight: 1,
          letterSpacing: "-0.02em",
          background: `linear-gradient(135deg, oklch(0.95 0.1 ${dna.hue}), oklch(0.8 0.2 ${dna.accentHue}))`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          transition: "all 0.6s",
          minHeight: large ? 48 : 38,
          opacity: answered >= 3 ? 1 : 0.3,
          filter: answered >= 3 ? "none" : "blur(8px)",
        }}>
          {answered >= 3 ? dna.trait : "???"}
        </div>
      </div>

      {/* table */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {rows.map((r, i) => (
          <div key={r.key} style={{
            display: "flex", justifyContent: "space-between",
            padding: "10px 0",
            borderBottom: i < rows.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
            opacity: r.filled ? 1 : 0.35,
            transition: "opacity 0.6s",
          }}>
            <span style={{ fontSize: 12, color: T.textDim, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.05em" }}>{r.label}</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: T.text, textAlign: "right", maxWidth: "60%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {r.filled ? (
                <span style={{ animation: flashKey > 0 && r.key === Object.keys(answers).pop() ? "flash-new 0.8s" : "none" }}>
                  {r.value}
                </span>
              ) : (
                <span style={{ color: T.textFaint, fontFamily: "'JetBrains Mono', monospace" }}>█▒▒</span>
              )}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes aura-spin { to { transform: rotate(360deg); } }
        @keyframes flash-new {
          0% { color: oklch(0.9 0.25 ${dna.hue}); text-shadow: 0 0 16px oklch(0.7 0.25 ${dna.hue}); transform: translateX(6px); }
          100% { color: ${T.text}; text-shadow: none; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

const ghostBtn2 = {
  background: "transparent", border: "none",
  color: window.OrbytTokens.textDim,
  fontSize: 13, cursor: "pointer", fontFamily: "inherit",
};

window.VarC_SplitDNA = VarC_SplitDNA;
window.DNACard = DNACard;
