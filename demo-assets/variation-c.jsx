// Variation C — "Mystery DNA" onboarding
// Left: conversational question with always-visible Continue button.
// Right: swirling nebula that intensifies with each answer — no trait readout until the reveal.
// Includes new Active Hours range slider step, plus a cinematic DNA decode reveal sequence.

const VarC_SplitDNA = ({ questions = window.DEFAULT_QUESTIONS }) => {
  const T = window.OrbytTokens;
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [textInput, setTextInput] = useState("");
  const [activeHours, setActiveHours] = useState({ start: 9, end: 23 });
  const [flashKey, setFlashKey] = useState(0);
  const [revealPhase, setRevealPhase] = useState(0); // 0 idle → 1 build-up → 2 decode → 3 card materialize → 4 done
  const [postOnboarding, setPostOnboarding] = useState(false);
  const [fadeToPost, setFadeToPost] = useState(false);

  // ---- Flow layout ----
  // step 0 = welcome
  // step 1..questions.length = questions (mcq + open-ended)
  // step questions.length+1 = Active Hours range slider (when does your day begin/end?)
  // step questions.length+2 = Reveal sequence
  const ACTIVE_HOURS_STEP = questions.length + 1;
  const REVEAL_STEP = questions.length + 2;

  const currentQ = step > 0 && step <= questions.length ? questions[step - 1] : null;
  const isWelcome = step === 0;
  const isActiveHours = step === ACTIVE_HOURS_STEP;
  const isReveal = step === REVEAL_STEP;

  const bubbles = useMemo(() => {
    if (!currentQ) return [];
    return typeof currentQ.bubbles === "function" ? currentQ.bubbles(answers) : currentQ.bubbles;
  }, [currentQ, answers]);

  const commitAnswer = (val) => {
    setAnswers(a => ({ ...a, [currentQ.id]: val }));
    setFlashKey(k => k + 1);
    setTimeout(() => { setStep(s => s + 1); setTextInput(""); }, 450);
  };

  // ---- Value resolution for current question (for Continue-enable state) ----
  const currentValue = currentQ ? (currentQ.type === "text" ? textInput.trim() : answers[currentQ.id]) : null;
  const canContinue = !!currentValue;

  const handleContinue = () => {
    if (!canContinue) return;
    if (currentQ.type === "text") {
      commitAnswer(textInput.trim());
    } else {
      // choice already committed on click; advance
      setStep(s => s + 1);
    }
  };

  const dna = useMemo(() => window.buildStudyDNA(answers), [answers]);
  const answered = Object.keys(answers).length;
  const totalSteps = questions.length + 1; // +1 for active hours

  // ---- Reveal sequence choreography ----
  // Rare archetypes get longer, more explosive timing
  useEffect(() => {
    if (!isReveal) { setRevealPhase(0); return; }
    const isRare = dna.rarity === "rare";
    setRevealPhase(1);
    const t1 = setTimeout(() => setRevealPhase(2), isRare ? 2800 : 1800);
    const t2 = setTimeout(() => setRevealPhase(3), isRare ? 5200 : 3600);
    const t3 = setTimeout(() => setRevealPhase(4), isRare ? 7000 : 5000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [isReveal, dna.rarity]);

  // =============================== WELCOME ===============================
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
              Welcome — a few quick questions
            </div>
            <h1 style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: 72, lineHeight: 1.02, letterSpacing: "-0.025em",
              margin: "0 0 28px", fontWeight: 400,
              animation: "fade-up 1s 0.2s backwards",
            }}>
              Let's decode<br/>
              <em style={{
                fontStyle: "italic",
                background: "linear-gradient(135deg, #60A5FA, #A78BFA)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>your Study DNA.</em>
            </h1>
            <p style={{
              fontSize: 18, color: T.textDim, lineHeight: 1.6,
              margin: "0 0 32px", maxWidth: 460,
              animation: "fade-up 1s 0.4s backwards",
            }}>
              Answer honestly — we'll reveal who you are as a learner at the end. No wrong answers.
            </p>
            <div style={{ animation: "fade-up 1s 0.6s backwards" }}>
              <window.PrimaryBtn size="lg" onClick={() => setStep(1)}>
                Begin →
              </window.PrimaryBtn>
            </div>
          </div>
          <div style={{ fontSize: 12, color: T.textFaint }}>
            ~2 minutes · you can edit anything later
          </div>
        </div>

        {/* right: mystery nebula (hidden DNA) */}
        <div style={{
          display: "grid", placeItems: "center",
          borderLeft: `1px solid ${T.line}`,
          position: "relative", zIndex: 2, overflow: "hidden",
        }}>
          <MysteryNebula intensity={0} />
          <div style={{
            position: "absolute", bottom: 28, left: 0, right: 0,
            textAlign: "center",
            fontSize: 11, color: T.textFaint,
            letterSpacing: "0.3em", textTransform: "uppercase",
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            ╳ Study DNA · Unidentified
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
  }

  // =============================== ACTIVE HOURS ===============================
  if (isActiveHours) {
    return (
      <div style={{
        width: "100%", height: "100%",
        background: T.bg,
        display: "grid", gridTemplateColumns: "1.1fr 1fr",
        position: "relative", overflow: "hidden",
      }}>
        <window.ParticleField opacity={0.3} />
        <div style={{
          padding: "36px 60px 28px",
          display: "grid", gridTemplateRows: "auto 1fr auto",
          position: "relative", zIndex: 2,
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <window.OrbytLogo size={22} />
              <span style={{ fontSize: 14, fontWeight: 600 }}>Orbyt</span>
            </div>
            <window.ProgressDots total={totalSteps} current={totalSteps - 1} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: 560 }}>
            <div style={{
              fontSize: 12, letterSpacing: "0.15em",
              color: T.textDim, textTransform: "uppercase",
              fontFamily: "'JetBrains Mono', monospace",
              marginBottom: 16,
            }}>
              Last one · Your daily rhythm
            </div>

            <h1 style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: 44,
              lineHeight: 1.1, letterSpacing: "-0.02em",
              margin: "0 0 10px", fontWeight: 400,
            }}>
              When does your day <em style={{ fontStyle: "italic" }}>begin</em>?
            </h1>
            <p style={{ fontSize: 16, color: T.textDim, margin: "0 0 32px", maxWidth: 480, lineHeight: 1.5 }}>
              Drag the handles to mark your waking hours. Orby uses this to plan around your real life.
            </p>

            <DayRangeSlider
              start={activeHours.start}
              end={activeHours.end}
              onChange={(start, end) => setActiveHours({ start, end })}
              dnaHue={dna.hue}
            />

            <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <TimeCard label="Day begins" time={activeHours.start} dnaHue={dna.hue} />
              <TimeCard label="Day ends" time={activeHours.end} dnaHue={dna.accentHue} />
            </div>
          </div>

          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            paddingTop: 16, borderTop: `1px solid ${T.line}`,
          }}>
            <button onClick={() => setStep(s => s - 1)} style={ghostBtn2}>← Back</button>
            <window.PrimaryBtn
              size="lg"
              onClick={() => {
                setAnswers(a => ({ ...a, activeStart: activeHours.start, activeEnd: activeHours.end }));
                setFlashKey(k => k + 1);
                setTimeout(() => setStep(REVEAL_STEP), 300);
              }}
            >
              Decode my Study DNA →
            </window.PrimaryBtn>
          </div>
        </div>

        {/* right: nebula almost fully charged */}
        <div style={{
          display: "grid", placeItems: "center",
          borderLeft: `1px solid ${T.line}`,
          position: "relative", zIndex: 2, overflow: "hidden",
        }}>
          <MysteryNebula intensity={answered / questions.length} dnaHue={dna.hue} accentHue={dna.accentHue} />
          <div style={{
            position: "absolute", bottom: 28, left: 0, right: 0,
            textAlign: "center",
            fontSize: 11, color: T.textFaint,
            letterSpacing: "0.3em", textTransform: "uppercase",
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            ◉ {answered} / {questions.length} signals captured
          </div>
        </div>
      </div>
    );
  }

  // =============================== REVEAL ===============================
  // Post-onboarding takeover
  if (postOnboarding) {
    return (
      <div style={{ width: "100%", height: "100%", animation: "post-fade-in 0.7s ease forwards" }}>
        <style>{`@keyframes post-fade-in { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }`}</style>
        <window.PostOnboardingFlow initialAnswers={{ ...answers, activeStart: activeHours.start, activeEnd: activeHours.end }} initialStep={0} />
      </div>
    );
  }

  if (isReveal) {
    return (
      <div style={{ width: "100%", height: "100%", opacity: fadeToPost ? 0 : 1, transition: "opacity 0.5s ease", pointerEvents: fadeToPost ? "none" : "auto" }}>
        <RevealSequence phase={revealPhase} dna={dna} answers={answers} onDone={() => {
          setFadeToPost(true);
          setTimeout(() => setPostOnboarding(true), 520);
        }} />
      </div>
    );
  }

  // =============================== QUESTIONS ===============================
  const phaseLabel = currentQ.phase === "open" ? "Open" : "Basics";
  const phaseIndex = questions.filter(q => q.phase === currentQ.phase).indexOf(currentQ) + 1;
  const phaseTotal = questions.filter(q => q.phase === currentQ.phase).length;

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
        padding: "32px 60px 24px",
        display: "grid", gridTemplateRows: "auto 1fr auto",
        position: "relative", zIndex: 2,
        minHeight: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <window.OrbytLogo size={22} />
            <span style={{ fontSize: 14, fontWeight: 600 }}>Orbyt</span>
          </div>
          <window.ProgressDots total={totalSteps} current={step - 1} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: 540, minHeight: 0, overflow: "auto" }}>
          <div style={{
            fontSize: 12, letterSpacing: "0.15em",
            color: T.textDim, textTransform: "uppercase",
            fontFamily: "'JetBrains Mono', monospace",
            marginBottom: 14,
            display: "flex", alignItems: "center", gap: 10,
          }} key={`qn-${step}`}>
            <span style={{ animation: "fade-up 0.5s" }}>{phaseLabel} · {phaseIndex} of {phaseTotal}</span>
          </div>

          <div key={`bubbles-${step}`} style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
            {bubbles.map((b, i) => (
              <div key={i} style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: i === 0 ? 40 : 20,
                fontStyle: i === 0 ? "normal" : "italic",
                color: i === 0 ? T.text : T.textDim,
                lineHeight: 1.15, letterSpacing: "-0.015em",
                animation: `fade-up 0.6s ${i * 0.15}s backwards`,
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
                  delay={0.3 + i * 0.05}
                  selected={answers[currentQ.id] === opt.v}
                  onClick={() => setAnswers(a => ({ ...a, [currentQ.id]: opt.v }))}
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
              onSubmit={e => { e.preventDefault(); if (textInput.trim()) handleContinue(); }}
              style={{ animation: "fade-up 0.6s 0.3s backwards" }}
            >
              {currentQ.multiline ? (
                <textarea
                  value={textInput}
                  onChange={e => setTextInput(e.target.value)}
                  placeholder={currentQ.placeholder}
                  autoFocus
                  rows={3}
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.03)",
                    border: `1.5px solid ${T.lineStrong}`,
                    outline: "none",
                    borderRadius: 14,
                    color: T.text,
                    fontSize: 18,
                    fontFamily: "'Instrument Serif', serif",
                    padding: "14px 18px",
                    resize: "none",
                    lineHeight: 1.4,
                    transition: "border 0.2s",
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = `oklch(0.6 0.2 ${dna.hue} / 0.7)`}
                  onBlur={e => e.currentTarget.style.borderColor = T.lineStrong}
                />
              ) : (
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
                </div>
              )}
            </form>
          )}
        </div>

        {/* FOOTER with always-visible primary Continue button */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          paddingTop: 16, borderTop: `1px solid ${T.line}`,
        }}>
          {step > 1 ? (
            <button onClick={() => setStep(s => s - 1)} style={ghostBtn2}>← Back</button>
          ) : <span />}
          <GlowContinueBtn
            canContinue={canContinue}
            dnaHue={dna.hue}
            accentHue={dna.accentHue}
            onClick={handleContinue}
            isLast={step === questions.length}
          />
        </div>
      </div>

      {/* RIGHT: mystery nebula — intensifies per answer */}
      <div style={{
        display: "grid", placeItems: "center",
        borderLeft: `1px solid ${T.line}`,
        position: "relative", zIndex: 2, overflow: "hidden",
      }}>
        <MysteryNebula intensity={answered / (questions.length + 1)} dnaHue={dna.hue} accentHue={dna.accentHue} flashKey={flashKey} />
        <div style={{
          position: "absolute", bottom: 28, left: 0, right: 0,
          textAlign: "center",
          fontSize: 11, color: T.textFaint,
          letterSpacing: "0.3em", textTransform: "uppercase",
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          ◉ {answered} / {questions.length} signals captured
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

// ============ GLOW CONTINUE BUTTON ============
// Always visible. Disabled (dim) until an answer is captured, then enabled + glows.
const GlowContinueBtn = ({ canContinue, dnaHue, accentHue, onClick, isLast }) => {
  const T = window.OrbytTokens;
  return (
    <button
      onClick={onClick}
      disabled={!canContinue}
      style={{
        padding: "16px 36px",
        border: "none",
        borderRadius: 999,
        fontWeight: 600,
        fontFamily: "inherit",
        fontSize: 16,
        cursor: canContinue ? "pointer" : "not-allowed",
        color: canContinue ? "white" : T.textFaint,
        background: canContinue
          ? `linear-gradient(135deg, oklch(0.6 0.22 ${dnaHue}), oklch(0.55 0.2 ${accentHue}))`
          : "rgba(255,255,255,0.04)",
        border: canContinue ? "none" : `1px solid ${T.lineStrong}`,
        boxShadow: canContinue
          ? `0 0 0 0 oklch(0.7 0.22 ${dnaHue} / 0.6), 0 10px 36px oklch(0.5 0.2 ${dnaHue} / 0.55), inset 0 1px 0 rgba(255,255,255,0.2)`
          : "none",
        display: "inline-flex", alignItems: "center", gap: 10,
        transition: "all 0.3s",
        animation: canContinue ? "continue-glow 2.2s ease-in-out infinite" : "none",
      }}
    >
      {isLast ? "Next — one more step" : "Continue"} →
      <style>{`
        @keyframes continue-glow {
          0%, 100% { box-shadow: 0 0 0 0 oklch(0.7 0.22 ${dnaHue} / 0.5), 0 10px 36px oklch(0.5 0.2 ${dnaHue} / 0.45), inset 0 1px 0 rgba(255,255,255,0.2); }
          50% { box-shadow: 0 0 0 8px oklch(0.7 0.22 ${dnaHue} / 0), 0 12px 44px oklch(0.5 0.2 ${dnaHue} / 0.65), inset 0 1px 0 rgba(255,255,255,0.2); }
        }
      `}</style>
    </button>
  );
};

// ============ MYSTERY NEBULA (hidden DNA surrogate) ============
// Swirling cosmic cloud that intensifies with `intensity` (0..1).
// No readable info. Occasional "signal" flashes when flashKey changes.
const MysteryNebula = ({ intensity = 0, dnaHue = 220, accentHue = 280, flashKey = 0 }) => {
  const T = window.OrbytTokens;
  const strength = 0.25 + intensity * 0.75;
  return (
    <div style={{
      position: "relative",
      width: "88%", aspectRatio: "1 / 1", maxHeight: "86%",
      borderRadius: "50%",
      overflow: "hidden",
      background: `radial-gradient(circle at 50% 50%, oklch(0.25 ${0.05 + intensity * 0.12} ${dnaHue} / ${0.8 * strength}) 0%, oklch(0.15 ${0.05 + intensity * 0.08} ${accentHue} / ${0.5 * strength}) 40%, transparent 72%)`,
      boxShadow: `0 0 120px oklch(0.4 0.2 ${dnaHue} / ${0.25 * strength}), inset 0 0 80px oklch(0.3 0.15 ${accentHue} / ${0.3 * strength})`,
      transition: "background 1.2s ease, box-shadow 1.2s ease",
    }}>
      {/* swirl 1 */}
      <div style={{
        position: "absolute", inset: "-10%",
        background: `conic-gradient(from 0deg, transparent, oklch(0.6 0.22 ${dnaHue} / ${0.4 * strength}), transparent 45%, oklch(0.5 0.2 ${accentHue} / ${0.3 * strength}), transparent)`,
        animation: `nebula-spin-a ${45 - intensity * 20}s linear infinite`,
        filter: `blur(${20 - intensity * 8}px)`,
      }} />
      {/* swirl 2 counter */}
      <div style={{
        position: "absolute", inset: "-20%",
        background: `conic-gradient(from 180deg, transparent 30%, oklch(0.65 0.25 ${(dnaHue + 40) % 360} / ${0.25 * strength}), transparent 60%, oklch(0.55 0.22 ${dnaHue} / ${0.2 * strength}), transparent)`,
        animation: `nebula-spin-b ${60 - intensity * 25}s linear infinite reverse`,
        filter: `blur(${30 - intensity * 10}px)`,
      }} />
      {/* core glow */}
      <div key={flashKey} style={{
        position: "absolute", inset: "25%",
        borderRadius: "50%",
        background: `radial-gradient(circle, oklch(0.75 0.25 ${dnaHue} / ${0.5 * strength}) 0%, transparent 65%)`,
        filter: "blur(20px)",
        animation: `nebula-pulse ${3.5 - intensity * 1.2}s ease-in-out infinite${flashKey ? ", nebula-flash 0.8s" : ""}`,
      }} />
      {/* scattered stars / sparks — count grows with intensity */}
      {Array.from({ length: Math.round(6 + intensity * 20) }).map((_, i) => {
        const ang = (i * 73) % 360;
        const rad = 25 + ((i * 17) % 35);
        const sz = 2 + ((i * 3) % 4);
        return (
          <div key={i} style={{
            position: "absolute",
            left: `${50 + Math.cos(ang * Math.PI / 180) * rad}%`,
            top: `${50 + Math.sin(ang * Math.PI / 180) * rad}%`,
            width: sz, height: sz, borderRadius: "50%",
            background: `oklch(0.9 0.2 ${dnaHue + (i * 20) % 100})`,
            boxShadow: `0 0 ${sz * 3}px oklch(0.8 0.2 ${dnaHue + (i * 20) % 100})`,
            opacity: 0.6 + (i % 3) * 0.15,
            animation: `nebula-spark ${2 + (i % 4) * 0.5}s ease-in-out ${i * 0.15}s infinite`,
          }} />
        );
      })}
      {/* question mark glyph in center, fades out as intensity rises */}
      <div style={{
        position: "absolute", inset: 0,
        display: "grid", placeItems: "center",
        fontFamily: "'Instrument Serif', serif",
        fontSize: 120, fontStyle: "italic",
        color: `oklch(0.8 0.1 ${dnaHue} / ${0.3 * (1 - intensity)})`,
        textShadow: `0 0 30px oklch(0.7 0.2 ${dnaHue} / ${0.5 * (1 - intensity)})`,
        opacity: Math.max(0, 1 - intensity * 1.3),
        transition: "opacity 1s, color 1s",
        userSelect: "none",
      }}>?</div>

      <style>{`
        @keyframes nebula-spin-a { to { transform: rotate(360deg); } }
        @keyframes nebula-spin-b { to { transform: rotate(-360deg); } }
        @keyframes nebula-pulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.15); opacity: 1; }
        }
        @keyframes nebula-flash {
          0% { filter: blur(20px) brightness(2.5); transform: scale(1.4); }
          100% { filter: blur(20px) brightness(1); transform: scale(1); }
        }
        @keyframes nebula-spark {
          0%, 100% { opacity: 0.3; transform: scale(0.7); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
};

// ============ DAY RANGE SLIDER ============
// 24h timeline with start + end handles.
const DayRangeSlider = ({ start, end, onChange, dnaHue }) => {
  const T = window.OrbytTokens;
  const trackRef = useRef(null);
  const [dragging, setDragging] = useState(null);

  const handleMove = (clientX) => {
    if (!trackRef.current || !dragging) return;
    const rect = trackRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const h = Math.round(pct * 24);
    if (dragging === "start") onChange(Math.min(h, end - 1), end);
    else onChange(start, Math.max(h, start + 1));
  };

  useEffect(() => {
    const onMove = e => handleMove(e.clientX);
    const onUp = () => setDragging(null);
    if (dragging) {
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
      return () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
    }
  }, [dragging, start, end]);

  const startPct = (start / 24) * 100;
  const endPct = (end / 24) * 100;

  return (
    <div style={{ position: "relative", padding: "10px 0 38px" }}>
      {/* hour ticks */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 10, color: T.textFaint, fontFamily: "'JetBrains Mono', monospace" }}>
        {[0, 6, 12, 18, 24].map(h => (
          <span key={h}>{h === 24 ? "24h" : `${h}h`}</span>
        ))}
      </div>
      {/* track */}
      <div
        ref={trackRef}
        style={{
          position: "relative",
          height: 10,
          borderRadius: 999,
          background: "rgba(255,255,255,0.06)",
          border: `1px solid ${T.line}`,
        }}
      >
        {/* gradient fill between handles */}
        <div style={{
          position: "absolute",
          left: `${startPct}%`,
          width: `${endPct - startPct}%`,
          top: 0, bottom: 0,
          borderRadius: 999,
          background: `linear-gradient(90deg, oklch(0.6 0.22 ${dnaHue}), oklch(0.7 0.2 ${(dnaHue + 60) % 360}))`,
          boxShadow: `0 0 16px oklch(0.6 0.22 ${dnaHue} / 0.5)`,
        }} />
        {/* handles */}
        {[{ pct: startPct, key: "start", label: "Begin" }, { pct: endPct, key: "end", label: "End" }].map(h => (
          <div
            key={h.key}
            onMouseDown={e => { e.preventDefault(); setDragging(h.key); }}
            style={{
              position: "absolute",
              left: `${h.pct}%`,
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: 24, height: 24,
              borderRadius: "50%",
              background: `radial-gradient(circle at 35% 30%, oklch(0.92 0.15 ${dnaHue}), oklch(0.5 0.2 ${dnaHue}))`,
              border: "2px solid white",
              boxShadow: `0 4px 18px oklch(0.4 0.2 ${dnaHue} / 0.6), 0 0 0 ${dragging === h.key ? 8 : 0}px oklch(0.7 0.22 ${dnaHue} / 0.25)`,
              cursor: "grab",
              transition: "box-shadow 0.2s",
            }}
          />
        ))}
      </div>
      {/* sun/moon glyphs */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, display: "flex", justifyContent: "space-between", fontSize: 12, color: T.textFaint, fontFamily: "'JetBrains Mono', monospace" }}>
        <span>🌙 night</span>
        <span>☀️ midday</span>
        <span>🌙 night</span>
      </div>
    </div>
  );
};

const TimeCard = ({ label, time, dnaHue }) => {
  const T = window.OrbytTokens;
  const h12 = time % 12 || 12;
  const ampm = time < 12 || time === 24 ? "AM" : "PM";
  return (
    <div style={{
      padding: "14px 18px",
      borderRadius: 14,
      border: `1px solid oklch(0.6 0.2 ${dnaHue} / 0.35)`,
      background: `linear-gradient(135deg, oklch(0.22 0.1 ${dnaHue} / 0.4), oklch(0.15 0.06 ${dnaHue} / 0.3))`,
    }}>
      <div style={{ fontSize: 11, color: T.textDim, letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>{label}</div>
      <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 30, lineHeight: 1 }}>
        {h12}<span style={{ fontSize: 18, color: T.textDim, marginLeft: 4 }}>{ampm}</span>
      </div>
    </div>
  );
};

// ============ CINEMATIC REVEAL SEQUENCE ============
// phase 1: build-up (nebula collapses inward, star lanes converge)
// phase 2: decode (typewriter archetype text from glyphs)
// phase 3: card materializes from the light
// phase 4: CTA in
const RevealSequence = ({ phase, dna, answers, onDone }) => {
  const T = window.OrbytTokens;
  return (
    <div style={{
      width: "100%", height: "100%",
      background: `radial-gradient(ellipse at 50% 50%, oklch(0.2 0.12 ${dna.hue} / ${0.5 + phase * 0.1}), ${T.bg} 70%)`,
      position: "relative", overflow: "hidden",
      display: "grid", placeItems: "center",
      transition: "background 1.5s ease",
    }}>
      <window.StarField density={160} />

      {/* collapsing nebula + light column (phases 1-2) */}
      {phase < 3 && (
        <div style={{
          position: "absolute", left: "50%", top: "50%",
          width: phase === 1 ? 540 : 240,
          height: phase === 1 ? 540 : 240,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background: `radial-gradient(circle, oklch(0.7 0.25 ${dna.hue} / 0.85), oklch(0.4 0.2 ${dna.accentHue} / 0.5) 45%, transparent 75%)`,
          boxShadow: `0 0 200px oklch(0.6 0.25 ${dna.hue} / 0.7)`,
          filter: "blur(6px)",
          transition: "all 1.6s cubic-bezier(0.7, 0, 0.3, 1)",
          animation: "reveal-pulse 2s ease-in-out infinite",
        }} />
      )}

      {/* converging light rays */}
      {phase === 1 && Array.from({ length: 12 }).map((_, i) => (
        <div key={i} style={{
          position: "absolute", left: "50%", top: "50%",
          width: 2, height: "80%",
          background: `linear-gradient(180deg, transparent, oklch(0.8 0.2 ${dna.hue} / 0.5), transparent)`,
          transformOrigin: "50% 0",
          transform: `translate(-50%, -50%) rotate(${i * 30}deg)`,
          animation: `ray-converge 1.8s ${i * 0.05}s ease-out forwards`,
          filter: "blur(1px)",
        }} />
      ))}

      {/* decoding glyphs (phase 2) */}
      {phase === 2 && (
        <div style={{
          position: "absolute", left: "50%", top: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}>
          <GlyphDecoder target={dna.trait} hue={dna.hue} />
        </div>
      )}

      {/* card materialization (phases 3+) */}
      {phase >= 3 && (
        <div style={{
          textAlign: "center",
          animation: "card-materialize 1.4s cubic-bezier(0.16, 1, 0.3, 1)",
          position: "relative", zIndex: 3,
        }}>
          {/* Rare badge */}
          {dna.rarity === "rare" && (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "6px 16px", borderRadius: 999,
              background: `linear-gradient(135deg, oklch(0.35 0.22 ${dna.hue} / 0.6), oklch(0.3 0.2 ${dna.accentHue} / 0.5))`,
              border: `1px solid oklch(0.7 0.25 ${dna.hue} / 0.7)`,
              boxShadow: `0 0 30px oklch(0.6 0.25 ${dna.hue} / 0.5)`,
              marginBottom: 20,
              fontSize: 11, letterSpacing: "0.25em", textTransform: "uppercase",
              fontFamily: "'JetBrains Mono', monospace",
              color: `oklch(0.92 0.18 ${dna.hue})`,
              animation: "rare-badge-in 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}>
              <span style={{ fontSize: 14 }}>✦</span> Rare Archetype
            </div>
          )}
          {dna.rarity !== "rare" && (
            <div style={{
              fontSize: 12, letterSpacing: "0.3em",
              color: `oklch(0.85 0.2 ${dna.hue})`, textTransform: "uppercase",
              fontFamily: "'JetBrains Mono', monospace",
              marginBottom: 20,
            }}>✦ Decoded</div>
          )}
          <h1 style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: dna.rarity === "rare" ? 52 : 44,
            margin: "0 0 8px", fontWeight: 400,
            lineHeight: 1,
          }}>
            You are <em style={{
              fontStyle: "italic",
              background: `linear-gradient(135deg, oklch(0.9 0.2 ${dna.hue}), oklch(0.8 0.22 ${dna.accentHue}))`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>{dna.trait}</em>.
          </h1>
          {dna.tagline && (
            <div style={{
              fontSize: 16, color: `oklch(0.75 0.15 ${dna.hue})`,
              fontStyle: "italic", marginBottom: 28,
              fontFamily: "'Instrument Serif', serif",
              animation: "fade-up 0.6s 0.3s backwards",
            }}>{dna.tagline}</div>
          )}
          <window.DNACard dna={dna} answers={answers} large />
          {phase >= 4 && (
            <div style={{ marginTop: 30, display: "flex", gap: 12, justifyContent: "center", animation: "fade-up 0.6s" }}>
              <window.PrimaryBtn size="lg" onClick={onDone}>
                Continue setup →
              </window.PrimaryBtn>
            </div>
          )}
        </div>
      )}

      {/* status overlay during decode */}
      {phase < 3 && (
        <div style={{
          position: "absolute", bottom: 40, left: 0, right: 0,
          textAlign: "center",
          fontSize: 12, color: `oklch(0.85 0.18 ${dna.hue})`,
          letterSpacing: "0.3em", textTransform: "uppercase",
          fontFamily: "'JetBrains Mono', monospace",
          animation: "pulse-text 1.4s ease-in-out infinite",
        }}>
          {phase === 1 ? "Collating signals…" : "Decoding Study DNA…"}
        </div>
      )}

      <style>{`
        @keyframes reveal-pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.08); }
        }
        @keyframes ray-converge {
          from { opacity: 0; height: 20%; }
          to { opacity: 0.8; height: 80%; }
        }
        @keyframes card-materialize {
          from { opacity: 0; transform: scale(0.85); filter: blur(16px); }
          to { opacity: 1; transform: scale(1); filter: blur(0); }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-text {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

// Glyph decoder — rapidly cycles through random chars then settles on target
const GlyphDecoder = ({ target, hue }) => {
  const [display, setDisplay] = useState("▒▒▒▒▒▒▒▒");
  useEffect(() => {
    const glyphs = "█▓▒░◐◑◒◓◔◕○●◯⬡⬢⬣✦✧✶✷".split("");
    let frame = 0;
    const max = 24;
    const t = setInterval(() => {
      frame++;
      const settled = Math.floor((frame / max) * target.length);
      const out = target.split("").map((ch, i) => {
        if (i < settled) return ch;
        if (ch === " ") return " ";
        return glyphs[Math.floor(Math.random() * glyphs.length)];
      }).join("");
      setDisplay(out);
      if (frame >= max) clearInterval(t);
    }, 60);
    return () => clearInterval(t);
  }, [target]);

  return (
    <div style={{
      fontFamily: "'Instrument Serif', serif",
      fontSize: 72, fontStyle: "italic",
      color: `oklch(0.9 0.22 ${hue})`,
      textShadow: `0 0 30px oklch(0.7 0.25 ${hue}), 0 0 80px oklch(0.6 0.25 ${hue} / 0.6)`,
      letterSpacing: "-0.02em",
      lineHeight: 1,
    }}>
      {display}
    </div>
  );
};

// ============ DNA CARD ============
const toAmPm = (h) => {
  if (h === 0 || h === 24) return "12 AM";
  if (h === 12) return "12 PM";
  return h < 12 ? `${h} AM` : `${h - 12} PM`;
};
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
    { label: "Active window", value: answers.activeStart != null ? `${toAmPm(answers.activeStart)} → ${toAmPm(answers.activeEnd)}` : "—", filled: answers.activeStart != null, key: "active" },
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
        <window.CompanionOrb size={large ? 150 : 120} mood="happy" energy={0.9} hue={dna.hue} accentHue={dna.accentHue} />
      </div>

      <div style={{ textAlign: "center", marginBottom: 20, position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: 11, color: T.textFaint, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 4 }}>
          You are
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
        }}>
          {dna.trait}
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
              {r.filled ? r.value : <span style={{ color: T.textFaint, fontFamily: "'JetBrains Mono', monospace" }}>█▒▒</span>}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes aura-spin { to { transform: rotate(360deg); } }
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
window.MysteryNebula = MysteryNebula;
