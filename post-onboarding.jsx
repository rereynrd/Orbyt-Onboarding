// Post-onboarding flows (continuation of Variation C's DNA world)
// After the DNA reveal: AI Connect → Canvas Sync → Dashboard Walkthrough → Complete
// Full flow lives in a self-contained component that starts already "primed" with a DNA.

const POST_STEPS = [
  { id: "ai",       title: "Connect your AI" },
  { id: "canvas",   title: "Sync your coursework" },
  { id: "routines", title: "Map your week" },
  { id: "tour",     title: "Meet your dashboard" },
  { id: "done",     title: "You're in orbit" },
];

// Mock DNA for standalone/artboard display
const MOCK_ANSWERS = {
  name: "Alex", field: "stem", struggle: "procrastination",
  motivation: "streak", peak: "night", style: "music", goal: "proud"
};

const PostOnboardingFlow = ({ initialAnswers = MOCK_ANSWERS, initialStep = 0 }) => {
  const T = window.OrbytTokens;
  const [step, setStep] = useState(initialStep);
  const answers = initialAnswers;
  const dna = useMemo(() => window.buildStudyDNA(answers), [answers]);

  const next = () => setStep(s => Math.min(s + 1, POST_STEPS.length - 1));
  const back = () => setStep(s => Math.max(s - 1, 0));

  const current = POST_STEPS[step];

  return (
    <div style={{
      width: "100%", height: "100%",
      background: `radial-gradient(ellipse at 20% 50%, oklch(0.22 0.12 ${dna.hue} / 0.4), transparent 60%), ${T.bg}`,
      position: "relative", overflow: "hidden",
      display: "grid", gridTemplateColumns: "1.15fr 1fr",
      transition: "background 1s",
    }}>
      <window.ParticleField opacity={0.3} />

      {/* LEFT: step content */}
      <div style={{
        padding: "36px 60px 40px",
        display: "grid", gridTemplateRows: "auto 1fr auto",
        position: "relative", zIndex: 2, overflow: "hidden",
      }}>
        {/* header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <window.OrbytLogo size={22} />
            <span style={{ fontSize: 14, fontWeight: 600 }}>Orbyt</span>
          </div>
          <StepRail steps={POST_STEPS} current={step} dnaHue={dna.hue} />
        </div>

        {/* body */}
        <div key={step} style={{ display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: 560, animation: "step-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
          {current.id === "ai" && <AIConnectStep dna={dna} onNext={next} />}
          {current.id === "canvas" && <CanvasSyncStep dna={dna} onNext={next} />}
          {current.id === "routines" && <RoutinesStep dna={dna} onNext={next} />}
          {current.id === "tour" && <TourStep dna={dna} onNext={next} />}
          {current.id === "done" && <DoneStep dna={dna} onNext={() => setStep(0)} />}
        </div>

        {/* footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, color: T.textFaint }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em" }}>
            Step {String(step + 1).padStart(2,"0")} / {String(POST_STEPS.length).padStart(2,"0")}
          </span>
          <div style={{ display: "flex", gap: 16 }}>
            {step > 0 && step < POST_STEPS.length - 1 && <button onClick={back} style={postGhostBtn}>← Back</button>}
            {step < POST_STEPS.length - 1 && step !== 0 && <button onClick={next} style={postGhostBtn}>Skip for now</button>}
          </div>
        </div>
      </div>

      {/* RIGHT: persistent DNA identity */}
      <div style={{
        display: "grid", placeItems: "center",
        background: `linear-gradient(160deg, oklch(0.17 0.05 ${dna.hue} / 0.6), oklch(0.12 0.03 ${dna.accentHue} / 0.6))`,
        borderLeft: `1px solid ${T.line}`,
        position: "relative", zIndex: 2, overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: -100,
          background: `radial-gradient(circle at 50% 50%, oklch(0.4 0.2 ${dna.hue} / 0.25), transparent 50%)`,
          filter: "blur(40px)",
        }} />
        <div style={{ position: "relative", zIndex: 2 }}>
          <window.DNACard dna={dna} answers={answers} />
          <div style={{
            marginTop: 16, textAlign: "center",
            fontSize: 11, color: T.textFaint,
            letterSpacing: "0.2em", textTransform: "uppercase",
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            {current.title}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes step-in {
          from { opacity: 0; transform: translateY(16px); filter: blur(6px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
      `}</style>
    </div>
  );
};

// ============ STEP RAIL ============
const StepRail = ({ steps, current, dnaHue }) => {
  const T = window.OrbytTokens;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <React.Fragment key={s.id}>
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              opacity: done || active ? 1 : 0.45,
              transition: "opacity 0.4s",
            }}>
              <div style={{
                width: 16, height: 16,
                borderRadius: "50%",
                background: done
                  ? `radial-gradient(circle at 35% 30%, oklch(0.85 0.15 ${dnaHue}), oklch(0.55 0.2 ${dnaHue}))`
                  : active
                    ? `oklch(0.3 0.12 ${dnaHue} / 0.8)`
                    : "transparent",
                border: active
                  ? `1.5px solid oklch(0.7 0.22 ${dnaHue})`
                  : done
                    ? "none"
                    : `1px solid ${T.lineStrong}`,
                boxShadow: active ? `0 0 12px oklch(0.7 0.22 ${dnaHue} / 0.6)` : "none",
                display: "grid", placeItems: "center",
                transition: "all 0.4s",
              }}>
                {done && (
                  <svg viewBox="0 0 10 10" style={{ width: 10, height: 10 }}>
                    <path d="M2 5 L4.2 7 L8 3"
                      stroke="white" strokeWidth="1.5"
                      strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                )}
                {active && (
                  <div style={{
                    width: 5, height: 5, borderRadius: "50%",
                    background: `oklch(0.85 0.2 ${dnaHue})`,
                    boxShadow: `0 0 6px oklch(0.85 0.2 ${dnaHue})`,
                    animation: "rail-pulse 1.5s ease-in-out infinite",
                  }} />
                )}
              </div>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                width: 20, height: 1,
                background: done
                  ? `oklch(0.6 0.2 ${dnaHue} / 0.7)`
                  : T.line,
                transition: "background 0.4s",
              }} />
            )}
          </React.Fragment>
        );
      })}
      <style>{`
        @keyframes rail-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

// ============ AI CONNECT ============
const AIConnectStep = ({ dna, onNext }) => {
  const T = window.OrbytTokens;
  const [phase, setPhase] = useState("idle"); // idle | connecting | connected
  const handleConnect = () => {
    setPhase("connecting");
    setTimeout(() => setPhase("connected"), 2200);
  };
  return (
    <div>
      <div style={{
        fontSize: 12, letterSpacing: "0.15em",
        color: T.textDim, textTransform: "uppercase",
        fontFamily: "'JetBrains Mono', monospace",
        marginBottom: 16,
      }}>Phase 01 · AI Connection</div>

      <h1 style={{
        fontFamily: "'Instrument Serif', serif",
        fontSize: 52, lineHeight: 1.05, letterSpacing: "-0.02em",
        margin: "0 0 16px", fontWeight: 400,
      }}>
        Give <em style={{ fontStyle: "italic" }}>Orby</em> a brain.
      </h1>

      <p style={{ fontSize: 16, color: T.textDim, lineHeight: 1.6, marginBottom: 32, maxWidth: 480 }}>
        Connect ChatGPT so Orby can actually explain things, draft study plans, and answer the 2 a.m. "wait what does this mean" questions.
      </p>

      {/* connector card */}
      <div style={{
        borderRadius: 18,
        border: `1px solid ${phase === "connected" ? `oklch(0.6 0.2 ${dna.hue} / 0.6)` : T.lineStrong}`,
        background: phase === "connected"
          ? `linear-gradient(135deg, oklch(0.22 0.1 ${dna.hue} / 0.5), oklch(0.18 0.08 ${dna.accentHue} / 0.3))`
          : "rgba(255,255,255,0.03)",
        padding: 20,
        display: "flex", alignItems: "center", gap: 16,
        transition: "all 0.4s",
        marginBottom: 24,
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: 14,
          background: phase === "connected"
            ? `radial-gradient(circle at 35% 30%, oklch(0.9 0.15 ${dna.hue}), oklch(0.5 0.2 ${dna.hue}))`
            : "rgba(255,255,255,0.06)",
          display: "grid", placeItems: "center",
          flexShrink: 0,
          boxShadow: phase === "connected" ? `0 0 28px oklch(0.6 0.22 ${dna.hue} / 0.5)` : "none",
          transition: "all 0.5s",
        }}>
          {phase === "connected" ? (
            <svg viewBox="0 0 24 24" style={{ width: 24, height: 24 }}>
              <path d="M5 12 L10 17 L19 7" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : phase === "connecting" ? (
            <div style={{
              width: 20, height: 20, borderRadius: "50%",
              border: "2px solid rgba(255,255,255,0.2)",
              borderTopColor: T.blue,
              animation: "spin 0.8s linear infinite",
            }} />
          ) : (
            <svg viewBox="0 0 24 24" style={{ width: 24, height: 24, color: T.textDim }}>
              <circle cx="12" cy="12" r="3" fill="currentColor" />
              <path d="M12 2 L12 6 M12 18 L12 22 M2 12 L6 12 M18 12 L22 12 M5 5 L8 8 M16 16 L19 19 M5 19 L8 16 M16 8 L19 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 2 }}>ChatGPT</div>
          <div style={{ fontSize: 13, color: T.textDim }}>
            {phase === "idle" && "Not connected"}
            {phase === "connecting" && "Opening secure window…"}
            {phase === "connected" && `Connected as ${dna.name.toLowerCase()}@orbyt`}
          </div>
        </div>
        {phase === "idle" && (
          <window.PrimaryBtn size="sm" onClick={handleConnect}>Connect →</window.PrimaryBtn>
        )}
        {phase === "connected" && (
          <span style={{
            fontSize: 11, padding: "4px 10px",
            borderRadius: 999,
            background: `oklch(0.4 0.2 ${dna.hue} / 0.3)`,
            color: `oklch(0.85 0.18 ${dna.hue})`,
            letterSpacing: "0.1em", textTransform: "uppercase",
            fontFamily: "'JetBrains Mono', monospace",
          }}>Live</span>
        )}
      </div>

      {/* whispered benefits */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
        {[
          "Chat with your notes, not just about them",
          "Auto-draft a study plan from your syllabus",
          "Private — we never see your conversations",
        ].map((b, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 10,
            fontSize: 14, color: T.textDim,
          }}>
            <div style={{
              width: 14, height: 14, borderRadius: "50%",
              background: `oklch(0.3 0.15 ${dna.hue} / 0.6)`,
              border: `1px solid oklch(0.6 0.2 ${dna.hue} / 0.5)`,
              display: "grid", placeItems: "center",
              flexShrink: 0,
            }}>
              <svg viewBox="0 0 10 10" style={{ width: 8, height: 8 }}>
                <path d="M2 5 L4 7 L8 3" stroke={`oklch(0.85 0.2 ${dna.hue})`} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            {b}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        {phase === "connected" ? (
          <window.PrimaryBtn size="md" onClick={onNext}>Continue →</window.PrimaryBtn>
        ) : (
          <button onClick={onNext} style={postGhostBtn}>Skip — I'll do it later</button>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

// ============ CANVAS SYNC ============
const CanvasSyncStep = ({ dna, onNext }) => {
  const T = window.OrbytTokens;
  const [phase, setPhase] = useState("idle"); // idle | syncing | done
  const [progress, setProgress] = useState(0);
  const [courses, setCourses] = useState([]);

  const mockCourses = [
    { id: 1, code: "CS 374", name: "Algorithms", assignments: 12 },
    { id: 2, code: "MATH 213", name: "Linear Algebra", assignments: 8 },
    { id: 3, code: "ENG 200", name: "Technical Writing", assignments: 5 },
    { id: 4, code: "PHIL 101", name: "Intro to Ethics", assignments: 6 },
  ];

  const startSync = () => {
    setPhase("syncing");
    setProgress(0);
    setCourses([]);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setProgress(Math.min(100, i * 10));
      if (i === 3) setCourses([mockCourses[0]]);
      if (i === 5) setCourses(mockCourses.slice(0, 2));
      if (i === 7) setCourses(mockCourses.slice(0, 3));
      if (i === 9) setCourses(mockCourses);
      if (i >= 10) {
        clearInterval(interval);
        setPhase("done");
      }
    }, 220);
  };

  return (
    <div>
      <div style={{
        fontSize: 12, letterSpacing: "0.15em",
        color: T.textDim, textTransform: "uppercase",
        fontFamily: "'JetBrains Mono', monospace",
        marginBottom: 16,
      }}>Phase 02 · Coursework</div>

      <h1 style={{
        fontFamily: "'Instrument Serif', serif",
        fontSize: 52, lineHeight: 1.05, letterSpacing: "-0.02em",
        margin: "0 0 16px", fontWeight: 400,
      }}>
        Pull in your <em style={{ fontStyle: "italic" }}>universe</em>.
      </h1>

      <p style={{ fontSize: 16, color: T.textDim, lineHeight: 1.6, marginBottom: 28, maxWidth: 480 }}>
        Link Canvas and we'll import every assignment, deadline, and syllabus — no copy-pasting, no missed dates.
      </p>

      {/* sync card */}
      <div style={{
        borderRadius: 18, border: `1px solid ${T.lineStrong}`,
        background: "rgba(255,255,255,0.03)",
        padding: 20, marginBottom: 24,
        minHeight: 220,
      }}>
        {phase === "idle" && (
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: "#E03E2F",
              display: "grid", placeItems: "center",
              color: "white", fontWeight: 800, fontSize: 14,
              flexShrink: 0,
              letterSpacing: "-0.02em",
            }}>LMS</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600 }}>Canvas</div>
              <div style={{ fontSize: 13, color: T.textDim }}>Ready to sync your courses</div>
            </div>
            <window.PrimaryBtn size="sm" onClick={startSync}>Sync now →</window.PrimaryBtn>
          </div>
        )}
        {phase !== "idle" && (
          <div>
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              fontSize: 12, color: T.textDim,
              fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em",
              marginBottom: 10,
            }}>
              <span>{phase === "done" ? "SYNC_COMPLETE" : "SYNCING…"}</span>
              <span>{progress}%</span>
            </div>
            {/* progress bar */}
            <div style={{
              height: 4, background: "rgba(255,255,255,0.06)",
              borderRadius: 2, overflow: "hidden", marginBottom: 16,
            }}>
              <div style={{
                width: `${progress}%`, height: "100%",
                background: `linear-gradient(90deg, oklch(0.6 0.22 ${dna.hue}), oklch(0.7 0.2 ${dna.accentHue}))`,
                boxShadow: `0 0 8px oklch(0.6 0.22 ${dna.hue})`,
                transition: "width 0.25s",
              }} />
            </div>
            {/* courses streaming in */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {courses.map((c, i) => (
                <div key={c.id} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "10px 12px",
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: 10,
                  border: `1px solid ${T.line}`,
                  animation: "course-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{
                      fontSize: 11, padding: "3px 8px",
                      borderRadius: 6,
                      background: `oklch(0.3 0.12 ${(dna.hue + i * 40) % 360} / 0.5)`,
                      color: `oklch(0.85 0.15 ${(dna.hue + i * 40) % 360})`,
                      fontFamily: "'JetBrains Mono', monospace",
                      fontWeight: 600,
                    }}>{c.code}</span>
                    <span style={{ fontSize: 14 }}>{c.name}</span>
                  </div>
                  <span style={{ fontSize: 12, color: T.textDim }}>{c.assignments} assignments</span>
                </div>
              ))}
              {phase === "syncing" && courses.length < mockCourses.length && (
                <div style={{
                  padding: "10px 12px",
                  display: "flex", alignItems: "center", gap: 10,
                  fontSize: 13, color: T.textDim, fontStyle: "italic",
                }}>
                  <window.TypingDots color={T.textDim} />
                  <span>Fetching more…</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        {phase === "done" ? (
          <window.PrimaryBtn size="md" onClick={onNext}>Continue →</window.PrimaryBtn>
        ) : (
          <button onClick={onNext} style={postGhostBtn}>Skip for now</button>
        )}
      </div>

      <style>{`
        @keyframes course-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

// ============ ROUTINES ============
const RoutinesStep = ({ dna, onNext }) => {
  const T = window.OrbytTokens;
  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  const [cells, setCells] = useState(() => {
    // preset: weekday mornings busy
    const s = new Set();
    [0,1,2,3,4].forEach(d => [8,9,10].forEach(h => s.add(`${d}-${h}`)));
    return s;
  });
  const [dragging, setDragging] = useState(null);

  const toggle = (d, h) => {
    const k = `${d}-${h}`;
    setCells(c => {
      const n = new Set(c);
      if (n.has(k)) n.delete(k); else n.add(k);
      return n;
    });
  };

  return (
    <div>
      <div style={{
        fontSize: 12, letterSpacing: "0.15em",
        color: T.textDim, textTransform: "uppercase",
        fontFamily: "'JetBrains Mono', monospace",
        marginBottom: 16,
      }}>Phase 03 · Weekly rhythm</div>

      <h1 style={{
        fontFamily: "'Instrument Serif', serif",
        fontSize: 48, lineHeight: 1.05, letterSpacing: "-0.02em",
        margin: "0 0 14px", fontWeight: 400,
      }}>
        When are you <em style={{ fontStyle: "italic" }}>busy</em>?
      </h1>

      <p style={{ fontSize: 15, color: T.textDim, lineHeight: 1.5, marginBottom: 20, maxWidth: 480 }}>
        Tap the hours already claimed by classes, work, or life. Orby will plan around them — never into them.
      </p>

      {/* grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `36px repeat(${DAYS.length}, 1fr)`,
          gap: 3, marginBottom: 20,
          userSelect: "none",
        }}
        onMouseUp={() => setDragging(null)}
        onMouseLeave={() => setDragging(null)}
      >
        <div />
        {DAYS.map(d => (
          <div key={d} style={{
            textAlign: "center", fontSize: 11, color: T.textDim,
            fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em",
            padding: "2px 0",
          }}>{d}</div>
        ))}
        {HOURS.map(h => (
          <React.Fragment key={h}>
            <div style={{
              fontSize: 10, color: T.textFaint,
              fontFamily: "'JetBrains Mono', monospace",
              display: "flex", alignItems: "center", justifyContent: "flex-end",
              paddingRight: 4,
            }}>{h}</div>
            {DAYS.map((_, d) => {
              const active = cells.has(`${d}-${h}`);
              return (
                <button
                  key={`${d}-${h}`}
                  onMouseDown={() => { setDragging(active ? "off" : "on"); toggle(d, h); }}
                  onMouseEnter={() => {
                    if (dragging === "on" && !active) toggle(d, h);
                    if (dragging === "off" && active) toggle(d, h);
                  }}
                  style={{
                    height: 20,
                    borderRadius: 4,
                    border: "none",
                    cursor: "pointer",
                    background: active
                      ? `linear-gradient(135deg, oklch(0.55 0.2 ${dna.hue} / 0.9), oklch(0.5 0.18 ${dna.accentHue} / 0.9))`
                      : "rgba(255,255,255,0.04)",
                    boxShadow: active ? `0 0 8px oklch(0.6 0.2 ${dna.hue} / 0.4)` : "none",
                    transition: "background 0.15s",
                  }}
                  onMouseOver={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
                  onMouseOut={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>

      <div style={{
        fontSize: 12, color: T.textFaint, marginBottom: 20,
        fontFamily: "'JetBrains Mono', monospace",
      }}>
        {cells.size} blocks claimed · click-drag to paint
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <window.PrimaryBtn size="md" onClick={onNext}>Continue →</window.PrimaryBtn>
      </div>
    </div>
  );
};

// ============ TOUR ============
const TourStep = ({ dna, onNext }) => {
  const T = window.OrbytTokens;
  const [spot, setSpot] = useState(0);
  const SPOTS = [
    { title: "Filters", desc: "Today / Week / Upcoming / Overdue. Quick-slice your workload without losing context." },
    { title: "Coursework", desc: "Assignments grouped by course, sorted by what's due first. Hit complete — watch your streak grow." },
    { title: "Grade Insights", desc: "Real-time standings, projected GPA, and the trend line you check before every exam." },
    { title: "Weekly Outlook", desc: "A timeline of sessions and deadlines. Orby schedules around your busy hours." },
    { title: "Plan my week", desc: "One shortcut. Orby drafts a complete study plan tuned to your DNA. Edit anything." },
  ];
  const s = SPOTS[spot];

  return (
    <div>
      <div style={{
        fontSize: 12, letterSpacing: "0.15em",
        color: T.textDim, textTransform: "uppercase",
        fontFamily: "'JetBrains Mono', monospace",
        marginBottom: 16,
      }}>Phase 04 · Tour</div>

      <h1 style={{
        fontFamily: "'Instrument Serif', serif",
        fontSize: 48, lineHeight: 1.05, letterSpacing: "-0.02em",
        margin: "0 0 14px", fontWeight: 400,
      }}>
        The <em style={{ fontStyle: "italic" }}>five rooms</em> of Orbyt.
      </h1>

      {/* mini dashboard preview */}
      <div style={{
        background: "#0B0F1D",
        border: `1px solid ${T.line}`,
        borderRadius: 14,
        padding: 14,
        marginBottom: 20,
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "auto auto auto",
          gap: 8,
        }}>
          {SPOTS.map((it, i) => {
            const active = i === spot;
            return (
              <button key={i} onClick={() => setSpot(i)} style={{
                gridColumn: i === 4 ? "1 / -1" : "auto",
                padding: "10px 12px",
                borderRadius: 10,
                border: active ? `1px solid oklch(0.7 0.2 ${dna.hue})` : `1px solid ${T.line}`,
                background: active
                  ? `linear-gradient(135deg, oklch(0.22 0.12 ${dna.hue} / 0.5), oklch(0.18 0.08 ${dna.accentHue} / 0.3))`
                  : "rgba(255,255,255,0.02)",
                color: T.text,
                textAlign: "left", cursor: "pointer",
                fontFamily: "inherit", fontSize: 13,
                transition: "all 0.25s",
                boxShadow: active ? `0 0 20px oklch(0.5 0.2 ${dna.hue} / 0.4)` : "none",
                position: "relative",
              }}>
                <div style={{ fontSize: 11, color: T.textFaint, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", marginBottom: 2 }}>0{i+1}</div>
                <div style={{ fontWeight: 600 }}>{it.title}</div>
                {active && (
                  <div style={{
                    position: "absolute", top: 10, right: 10,
                    width: 6, height: 6, borderRadius: "50%",
                    background: `oklch(0.85 0.2 ${dna.hue})`,
                    boxShadow: `0 0 8px oklch(0.85 0.2 ${dna.hue})`,
                    animation: "rail-pulse 1.5s ease-in-out infinite",
                  }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div key={spot} style={{
        padding: "14px 16px",
        borderLeft: `2px solid oklch(0.7 0.22 ${dna.hue})`,
        background: `linear-gradient(90deg, oklch(0.25 0.15 ${dna.hue} / 0.2), transparent)`,
        marginBottom: 24,
        animation: "tour-swap 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}>
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{s.title}</div>
        <div style={{ fontSize: 14, color: T.textDim, lineHeight: 1.5 }}>{s.desc}</div>
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        {spot < SPOTS.length - 1 ? (
          <window.PrimaryBtn size="md" onClick={() => setSpot(s => s + 1)}>Next spot →</window.PrimaryBtn>
        ) : (
          <window.PrimaryBtn size="md" onClick={onNext}>Finish tour →</window.PrimaryBtn>
        )}
        <span style={{ fontSize: 12, color: T.textFaint, fontFamily: "'JetBrains Mono', monospace" }}>
          {spot + 1} / {SPOTS.length}
        </span>
      </div>

      <style>{`
        @keyframes tour-swap {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

// ============ DONE ============
const DoneStep = ({ dna, onNext }) => {
  const T = window.OrbytTokens;
  return (
    <div style={{ textAlign: "left" }}>
      <div style={{
        fontSize: 12, letterSpacing: "0.2em",
        color: `oklch(0.85 0.18 ${dna.hue})`, textTransform: "uppercase",
        fontFamily: "'JetBrains Mono', monospace",
        marginBottom: 18,
      }}>
        ✦ Launch ready
      </div>

      <h1 style={{
        fontFamily: "'Instrument Serif', serif",
        fontSize: 76, lineHeight: 0.98, letterSpacing: "-0.03em",
        margin: "0 0 20px", fontWeight: 400,
      }}>
        Orbyt is<br/>
        <em style={{
          fontStyle: "italic",
          background: `linear-gradient(135deg, oklch(0.9 0.18 ${dna.hue}), oklch(0.75 0.22 ${dna.accentHue}))`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>yours now</em>, {dna.name}.
      </h1>

      <p style={{ fontSize: 17, color: T.textDim, lineHeight: 1.55, marginBottom: 32, maxWidth: 480 }}>
        Your first week is already drafted. Check your dashboard — and remember, Orby adapts. Skip a session, crush a test, panic at 2 a.m. — it'll meet you where you are.
      </p>

      <div style={{ display: "flex", gap: 10, marginBottom: 28, flexWrap: "wrap" }}>
        {["Adaptive schedule ✓", "Gentle nudges ✓", "Streak system ✓", "AI tutor ✓", "Canvas synced ✓"].map((t, i) => (
          <div key={t} style={{
            fontSize: 12, padding: "5px 11px",
            borderRadius: 999,
            border: `1px solid oklch(0.6 0.2 ${dna.hue} / 0.4)`,
            background: `oklch(0.25 0.12 ${dna.hue} / 0.3)`,
            color: T.text,
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "0.05em",
            animation: `opt-in 0.5s ${i * 0.08}s backwards`,
          }}>{t}</div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <window.PrimaryBtn size="lg" onClick={onNext}>
          Open dashboard →
        </window.PrimaryBtn>
      </div>
    </div>
  );
};

const postGhostBtn = {
  background: "transparent", border: "none",
  color: window.OrbytTokens.textDim,
  fontSize: 13, cursor: "pointer", fontFamily: "inherit",
  padding: "6px 10px",
};

window.PostOnboardingFlow = PostOnboardingFlow;
window.POST_STEPS = POST_STEPS;
window.MOCK_ANSWERS = MOCK_ANSWERS;
