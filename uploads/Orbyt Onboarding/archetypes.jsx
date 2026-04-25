// Student DNA Archetypes Gallery
// 12 fun + useful personas. Each maps to how Orbyt adapts.

const ARCHETYPES = [
  {
    id: "sprinter",
    name: "The Sprinter",
    tagline: "Deadline-powered. 0 to 100 at 11:47 PM.",
    hue: 20, accentHue: 340,
    icon: "⚡️",
    stats: { focus: 95, consistency: 20, stamina: 60, recovery: 45 },
    signature: "procrastinates",
    peak: "Last 4 hours before due",
    fuel: "Pure adrenaline",
    orbytAdapts: "Starts nudging 72h early. Blocks calendar time you can't unblock. Caffeine-check pings.",
    vibe: "night",
  },
  {
    id: "scatter",
    name: "The Scatterbrain",
    tagline: "47 tabs open, zero regrets.",
    hue: 320, accentHue: 280,
    icon: "🌀",
    stats: { focus: 30, consistency: 50, stamina: 75, recovery: 80 },
    signature: "context switches",
    peak: "Short bursts, often",
    fuel: "Novelty",
    orbytAdapts: "25-min pomodoros by default. Auto-mutes Slack. Gamified 'one thing' widget.",
    vibe: "chaos",
  },
  {
    id: "juggler",
    name: "The Juggler",
    tagline: "12 things due. Knows exactly which are on fire.",
    hue: 260, accentHue: 200,
    icon: "🎪",
    stats: { focus: 70, consistency: 85, stamina: 70, recovery: 40 },
    signature: "gets overwhelmed",
    peak: "Mid-morning, before decisions pile up",
    fuel: "Progress bars",
    orbytAdapts: "'Top 3 today' above everything. Gentle triage before bed. Hides non-urgent work.",
    vibe: "morning",
  },
  {
    id: "waverider",
    name: "The Wave-rider",
    tagline: "Epic streaks. Epic burnouts. Repeat.",
    hue: 195, accentHue: 250,
    icon: "🌊",
    stats: { focus: 85, consistency: 35, stamina: 90, recovery: 55 },
    signature: "motivation cycles",
    peak: "Unpredictable highs",
    fuel: "Meaning",
    orbytAdapts: "Saves momentum during peaks. Easy-mode mode during dips. Never breaks the streak for you.",
    vibe: "flex",
  },
  {
    id: "goldfish",
    name: "The Goldfish",
    tagline: "Learned it. Forgot it. Learned it again.",
    hue: 50, accentHue: 30,
    icon: "🐠",
    stats: { focus: 60, consistency: 65, stamina: 55, recovery: 35 },
    signature: "forgets easily",
    peak: "First pass is always the best",
    fuel: "Repetition rewards",
    orbytAdapts: "Auto-builds spaced repetition flashcards from your notes. Weekly 'what stuck?' quizzes.",
    vibe: "afternoon",
  },
  {
    id: "overthink",
    name: "The Overthinker",
    tagline: "Has re-read the syllabus 11 times.",
    hue: 285, accentHue: 220,
    icon: "💭",
    stats: { focus: 75, consistency: 80, stamina: 50, recovery: 25 },
    signature: "stress spiral",
    peak: "Calm mornings",
    fuel: "Certainty",
    orbytAdapts: "Breaks work into micro-steps (never scary). Breathing breaks. Hides GPA projections on rough days.",
    vibe: "morning",
  },
  {
    id: "owl",
    name: "The Night Owl",
    tagline: "Brain boots at 10 PM. Sorry, morning people.",
    hue: 240, accentHue: 290,
    icon: "🦉",
    stats: { focus: 85, consistency: 60, stamina: 80, recovery: 50 },
    signature: "late-night peak",
    peak: "10 PM – 2 AM",
    fuel: "Silence",
    orbytAdapts: "Schedules hard sessions after 9 PM. Dark mode forced. Morning reminders delayed by default.",
    vibe: "night",
  },
  {
    id: "dawn",
    name: "The Dawn Chaser",
    tagline: "Crushed 3 hours before your alarm.",
    hue: 35, accentHue: 190,
    icon: "🌅",
    stats: { focus: 90, consistency: 88, stamina: 65, recovery: 75 },
    signature: "early-bird peak",
    peak: "5 AM – 9 AM",
    fuel: "Fresh starts",
    orbytAdapts: "Front-loads hard work. Evenings = review only. Gentle wind-down alerts at 9 PM.",
    vibe: "dawn",
  },
  {
    id: "cafe",
    name: "The Café Mind",
    tagline: "Needs exactly 47 dB of ambient hum.",
    hue: 25, accentHue: 55,
    icon: "☕",
    stats: { focus: 80, consistency: 75, stamina: 70, recovery: 70 },
    signature: "ambient-driven",
    peak: "Around other humans",
    fuel: "Background life",
    orbytAdapts: "Study-session matchmaking. Café-finder integration. Lo-fi playlists on focus timer.",
    vibe: "afternoon",
  },
  {
    id: "squad",
    name: "The Squad Scholar",
    tagline: "Learns by teaching. And by yapping.",
    hue: 140, accentHue: 180,
    icon: "👯",
    stats: { focus: 65, consistency: 80, stamina: 85, recovery: 85 },
    signature: "social learner",
    peak: "Group sessions",
    fuel: "Discussion",
    orbytAdapts: "Suggests study buddies from class. Shared decks. Quiz-each-other mode.",
    vibe: "afternoon",
  },
  {
    id: "builder",
    name: "The Builder",
    tagline: "Can't learn it until they've made it.",
    hue: 100, accentHue: 160,
    icon: "🛠",
    stats: { focus: 85, consistency: 70, stamina: 90, recovery: 60 },
    signature: "hands-on",
    peak: "Long deep-work blocks",
    fuel: "Tangible output",
    orbytAdapts: "Converts readings into projects. 'Build it to learn it' prompts. Longer default sessions (90 min).",
    vibe: "flex",
  },
  {
    id: "visual",
    name: "The Visual Thinker",
    tagline: "Sees the whole map before the first step.",
    hue: 170, accentHue: 220,
    icon: "🎨",
    stats: { focus: 75, consistency: 75, stamina: 70, recovery: 70 },
    signature: "spatial memory",
    peak: "When there's a whiteboard",
    fuel: "Diagrams",
    orbytAdapts: "Auto-generates mind maps from notes. Color-codes courses. Timeline view over list view.",
    vibe: "morning",
  },
];

const ArchetypeCard = ({ a, compact = false }) => {
  const T = window.OrbytTokens;
  return (
    <div style={{
      width: compact ? 280 : 320,
      borderRadius: 20,
      background: `linear-gradient(160deg, oklch(0.2 0.08 ${a.hue} / 0.9), oklch(0.13 0.06 ${a.accentHue} / 0.9))`,
      border: `1px solid oklch(0.6 0.22 ${a.hue} / 0.35)`,
      boxShadow: `0 20px 50px oklch(0.15 0.15 ${a.hue} / 0.4), inset 0 1px 0 rgba(255,255,255,0.08)`,
      padding: compact ? 20 : 24,
      position: "relative",
      overflow: "hidden",
      color: T.text,
    }}>
      {/* aura */}
      <div style={{
        position: "absolute", inset: -40, pointerEvents: "none",
        background: `conic-gradient(from 0deg, oklch(0.7 0.25 ${a.hue} / 0.25), transparent 50%, oklch(0.7 0.25 ${a.accentHue} / 0.25), transparent)`,
        animation: "aura-spin 25s linear infinite",
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* header */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase",
          color: T.textDim, fontFamily: "'JetBrains Mono', monospace",
          marginBottom: 18,
        }}>
          <span>Archetype</span>
          <span>#{a.id.slice(0, 3).toUpperCase()}</span>
        </div>

        {/* orb + icon badge */}
        <div style={{ position: "relative", display: "grid", placeItems: "center", marginBottom: 14 }}>
          <window.CompanionOrb size={compact ? 100 : 120} mood="happy" energy={0.9} hue={a.hue} accentHue={a.accentHue} />
          <div style={{
            position: "absolute", bottom: -4, right: "28%",
            width: 34, height: 34,
            borderRadius: 10,
            background: `linear-gradient(135deg, oklch(0.3 0.15 ${a.hue}), oklch(0.22 0.12 ${a.accentHue}))`,
            border: `1px solid oklch(0.7 0.22 ${a.hue} / 0.5)`,
            display: "grid", placeItems: "center",
            fontSize: 18,
            boxShadow: `0 4px 14px oklch(0.4 0.2 ${a.hue} / 0.5)`,
          }}>{a.icon}</div>
        </div>

        {/* name */}
        <div style={{ textAlign: "center", marginBottom: 6 }}>
          <div style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: compact ? 32 : 38, fontWeight: 400, lineHeight: 1,
            letterSpacing: "-0.02em",
            background: `linear-gradient(135deg, oklch(0.95 0.1 ${a.hue}), oklch(0.82 0.22 ${a.accentHue}))`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>{a.name}</div>
        </div>
        <div style={{
          textAlign: "center", fontSize: 13, color: T.textDim,
          fontStyle: "italic", marginBottom: 18, lineHeight: 1.4,
          minHeight: 36,
        }}>"{a.tagline}"</div>

        {/* stat bars */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
          {Object.entries(a.stats).map(([k, v]) => (
            <div key={k} style={{ display: "grid", gridTemplateColumns: "78px 1fr 28px", alignItems: "center", gap: 8 }}>
              <span style={{
                fontSize: 10, color: T.textDim,
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: "0.08em", textTransform: "uppercase",
              }}>{k}</span>
              <div style={{
                height: 5, background: "rgba(255,255,255,0.06)",
                borderRadius: 3, overflow: "hidden",
              }}>
                <div style={{
                  width: `${v}%`, height: "100%",
                  background: `linear-gradient(90deg, oklch(0.6 0.22 ${a.hue}), oklch(0.75 0.2 ${a.accentHue}))`,
                  boxShadow: `0 0 6px oklch(0.65 0.22 ${a.hue} / 0.6)`,
                  animation: "stat-fill 1.2s cubic-bezier(0.22, 1, 0.36, 1) backwards",
                }} />
              </div>
              <span style={{
                fontSize: 10, color: T.textDim, textAlign: "right",
                fontFamily: "'JetBrains Mono', monospace",
              }}>{v}</span>
            </div>
          ))}
        </div>

        {/* attributes */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          fontSize: 11, gap: 1,
          background: "rgba(255,255,255,0.06)", borderRadius: 10, overflow: "hidden",
          marginBottom: 14,
        }}>
          {[
            ["Peak", a.peak],
            ["Fuel", a.fuel],
          ].map(([k, v]) => (
            <div key={k} style={{ background: "rgba(10,14,26,0.75)", padding: "8px 10px" }}>
              <div style={{ color: T.textFaint, fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2 }}>{k}</div>
              <div style={{ color: T.text, fontSize: 11, fontWeight: 600 }}>{v}</div>
            </div>
          ))}
        </div>

        {/* orbyt adapts */}
        <div style={{
          fontSize: 11, color: T.textDim, lineHeight: 1.5,
          borderLeft: `2px solid oklch(0.65 0.22 ${a.hue})`,
          padding: "2px 0 2px 10px",
        }}>
          <span style={{ color: `oklch(0.85 0.2 ${a.hue})`, fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 3 }}>Orbyt adapts ↓</span>
          {a.orbytAdapts}
        </div>
      </div>

      <style>{`
        @keyframes stat-fill { from { width: 0 !important; } }
      `}</style>
    </div>
  );
};

const ArchetypesGallery = () => {
  const T = window.OrbytTokens;
  return (
    <div style={{
      width: "100%", minHeight: "100%",
      background: `radial-gradient(ellipse at 30% 0%, oklch(0.25 0.12 260 / 0.3), transparent 60%), radial-gradient(ellipse at 80% 100%, oklch(0.25 0.12 30 / 0.25), transparent 60%), ${T.bg}`,
      position: "relative", overflow: "hidden",
      padding: "48px 60px 60px",
      color: T.text,
    }}>
      <window.ParticleField opacity={0.3} />
      <div style={{ position: "relative", zIndex: 2, maxWidth: 1320, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{
            fontSize: 12, letterSpacing: "0.3em",
            color: "#60A5FA", textTransform: "uppercase",
            fontFamily: "'JetBrains Mono', monospace",
            marginBottom: 16,
          }}>✦ The Study DNA Catalog ✦</div>
          <h1 style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 72, lineHeight: 1, letterSpacing: "-0.03em",
            margin: "0 0 16px", fontWeight: 400,
          }}>
            Twelve kinds of <em style={{ fontStyle: "italic", background: "linear-gradient(135deg, #60A5FA, #A78BFA, #F472B6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>brain</em>.
          </h1>
          <p style={{ fontSize: 17, color: T.textDim, maxWidth: 620, margin: "0 auto", lineHeight: 1.55 }}>
            Your onboarding answers map to one of these — or a blend. Each archetype changes what Orbyt shows you, when it nudges, and how it talks.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 24,
        }}>
          {ARCHETYPES.map((a, i) => (
            <div key={a.id} style={{ animation: `arch-in 0.6s ${i * 0.05}s cubic-bezier(0.34, 1.56, 0.64, 1) backwards` }}>
              <ArchetypeCard a={a} />
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 48, padding: "24px 28px",
          borderRadius: 18,
          background: "rgba(255,255,255,0.03)",
          border: `1px solid ${T.line}`,
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 32,
          flexWrap: "wrap",
        }}>
          <div>
            <div style={{
              fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase",
              fontFamily: "'JetBrains Mono', monospace", color: T.textFaint, marginBottom: 6,
            }}>A note on blends</div>
            <div style={{ fontFamily: "'Instrument Serif', serif", fontSize: 24, lineHeight: 1.2, marginBottom: 6 }}>
              Most people are two at once.
            </div>
            <div style={{ fontSize: 14, color: T.textDim, maxWidth: 560, lineHeight: 1.55 }}>
              A <em style={{ color: "#60A5FA", fontStyle: "normal" }}>Sprinter × Owl</em> is a different beast than a <em style={{ color: "#A78BFA", fontStyle: "normal" }}>Builder × Dawn Chaser</em>. Orbyt treats your DNA as a vector, not a box — so the dashboard shifts as you do.
            </div>
          </div>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(2, auto)", gap: 6,
            fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: T.textDim,
          }}>
            <span>primary</span><span style={{ color: T.text }}>Sprinter 68%</span>
            <span>secondary</span><span style={{ color: T.text }}>Night Owl 24%</span>
            <span>trace</span><span style={{ color: T.text }}>Overthinker 8%</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes arch-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

window.ARCHETYPES = ARCHETYPES;
window.ArchetypeCard = ArchetypeCard;
window.ArchetypesGallery = ArchetypesGallery;
