// Shared primitives for Orbyt onboarding variations
// Logo, Companion Orb, bubbles, buttons, hooks

const { useState, useEffect, useRef, useMemo, useCallback, useLayoutEffect } = React;

// ============ TOKENS ============
const OrbytTokens = {
  bg: "#0A0E1A",
  bgElev: "#121827",
  bgElev2: "#1A2236",
  line: "rgba(255,255,255,0.08)",
  lineStrong: "rgba(255,255,255,0.16)",
  text: "#F5F7FB",
  textDim: "#9AA4B8",
  textFaint: "#5C6678",
  blue: "#3B82F6",
  blueSoft: "#60A5FA",
  blueDeep: "#1D4ED8",
  purple: "#A78BFA",
  purpleDeep: "#7C3AED",
  pink: "#F472B6",
  green: "#34D399",
  amber: "#FBBF24",
};

// ============ ORBYT LOGO (SVG) ============
// Planet with tilted ring — matches the uploaded dashboard logo
const OrbytLogo = ({ size = 28, color = OrbytTokens.blue, glow = false }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" style={{
    filter: glow ? `drop-shadow(0 0 12px ${color})` : undefined,
  }}>
    <defs>
      <radialGradient id="orbyt-planet" cx="0.35" cy="0.35">
        <stop offset="0%" stopColor="#93C5FD" />
        <stop offset="60%" stopColor={color} />
        <stop offset="100%" stopColor="#1E3A8A" />
      </radialGradient>
    </defs>
    <ellipse cx="20" cy="22" rx="18" ry="5" stroke={color} strokeWidth="2" transform="rotate(-25 20 22)" fill="none" opacity="0.85" />
    <circle cx="20" cy="20" r="8" fill="url(#orbyt-planet)" />
    <ellipse cx="20" cy="22" rx="18" ry="5" stroke={color} strokeWidth="2" transform="rotate(-25 20 22)" fill="none" strokeDasharray="0 60 30 200" opacity="0.6" />
  </svg>
);

// ============ COMPANION ORB ============
// The animated "buddy" that reacts to answers.
// mood: 'idle' | 'listening' | 'thinking' | 'happy' | 'curious'
// energy: 0..1 (how much it pulses / orbits spin)
const CompanionOrb = ({ size = 160, mood = "idle", energy = 0.6, hue = 220, accentHue = 280 }) => {
  const moodConfig = {
    idle:      { pulse: 1.0, spin: 1.0,  rings: 1, sparkle: 0 },
    listening: { pulse: 1.4, spin: 1.4,  rings: 2, sparkle: 0 },
    thinking:  { pulse: 0.8, spin: 2.2,  rings: 3, sparkle: 1 },
    happy:     { pulse: 1.6, spin: 1.2,  rings: 2, sparkle: 1 },
    curious:   { pulse: 1.2, spin: 1.6,  rings: 2, sparkle: 0 },
  }[mood] || { pulse: 1, spin: 1, rings: 1, sparkle: 0 };

  const e = 0.3 + energy * 0.7;

  return (
    <div style={{
      width: size, height: size, position: "relative",
      display: "grid", placeItems: "center",
    }}>
      {/* outer atmospheric glow */}
      <div style={{
        position: "absolute", inset: -size * 0.3,
        background: `radial-gradient(circle at 50% 50%, oklch(0.65 0.2 ${hue} / ${0.35 * e}) 0%, transparent 60%)`,
        filter: "blur(20px)",
        animation: `orb-breathe ${3 / moodConfig.pulse}s ease-in-out infinite`,
      }} />

      {/* orbital rings */}
      {Array.from({ length: moodConfig.rings }).map((_, i) => {
        const ringSize = size * (0.95 + i * 0.18);
        const tilt = -20 + i * 15;
        const dur = (8 - i * 1.5) / moodConfig.spin;
        return (
          <div key={i} style={{
            position: "absolute",
            width: ringSize, height: ringSize * 0.28,
            border: `1.5px solid oklch(0.7 0.18 ${hue + i * 30} / ${0.65 - i * 0.15})`,
            borderRadius: "50%",
            transform: `rotateZ(${tilt}deg)`,
            animation: `orb-spin-${i} ${dur}s linear infinite`,
          }}>
            {/* particle on ring */}
            <div style={{
              position: "absolute", left: "-4px", top: "50%",
              width: 8, height: 8, borderRadius: "50%",
              background: `oklch(0.85 0.2 ${hue + i * 30})`,
              boxShadow: `0 0 12px oklch(0.85 0.2 ${hue + i * 30})`,
              transform: "translateY(-50%)",
            }} />
          </div>
        );
      })}

      {/* core planet */}
      <div style={{
        width: size * 0.5, height: size * 0.5,
        borderRadius: "50%",
        background: `radial-gradient(circle at 35% 30%, oklch(0.9 0.15 ${hue}) 0%, oklch(0.6 0.22 ${hue}) 55%, oklch(0.35 0.2 ${accentHue}) 100%)`,
        boxShadow: `0 0 40px oklch(0.65 0.2 ${hue} / 0.8), inset -8px -8px 20px oklch(0.3 0.15 ${accentHue} / 0.6)`,
        position: "relative",
        animation: `orb-pulse ${2 / moodConfig.pulse}s ease-in-out infinite`,
      }}>
        {/* highlight */}
        <div style={{
          position: "absolute", top: "15%", left: "20%",
          width: "30%", height: "25%",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.55)",
          filter: "blur(4px)",
        }} />
        {/* surface swirl */}
        <div style={{
          position: "absolute", inset: 0,
          borderRadius: "50%",
          background: `conic-gradient(from 0deg, transparent, oklch(0.95 0.05 ${hue} / 0.12), transparent 50%, oklch(0.4 0.15 ${accentHue} / 0.2), transparent)`,
          animation: `orb-surface ${6 / moodConfig.spin}s linear infinite`,
          mixBlendMode: "overlay",
        }} />
      </div>

      {/* sparkles */}
      {moodConfig.sparkle > 0 && Array.from({ length: 5 }).map((_, i) => (
        <div key={`s-${i}`} style={{
          position: "absolute",
          width: 4, height: 4, borderRadius: "50%",
          background: "white",
          boxShadow: "0 0 8px white",
          top: `${20 + (i * 13) % 60}%`,
          left: `${15 + (i * 23) % 70}%`,
          animation: `orb-sparkle 1.8s ease-in-out infinite ${i * 0.3}s`,
        }} />
      ))}

      <style>{`
        @keyframes orb-breathe {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.15); opacity: 1; }
        }
        @keyframes orb-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes orb-surface {
          to { transform: rotate(360deg); }
        }
        @keyframes orb-sparkle {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        ${Array.from({ length: 4 }).map((_, i) => `
          @keyframes orb-spin-${i} {
            to { transform: rotateZ(${-20 + i * 15}deg) rotate3d(0,0,1,${i % 2 ? -360 : 360}deg); }
          }
        `).join("")}
      `}</style>
    </div>
  );
};

// ============ TYPING BUBBLE ============
const TypingDots = ({ color = OrbytTokens.textDim }) => (
  <div style={{ display: "flex", gap: 4, alignItems: "center", padding: "4px 2px" }}>
    {[0, 1, 2].map(i => (
      <div key={i} style={{
        width: 7, height: 7, borderRadius: "50%",
        background: color,
        animation: `typing-dot 1.2s ease-in-out ${i * 0.15}s infinite`,
      }} />
    ))}
    <style>{`
      @keyframes typing-dot {
        0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
        30% { transform: translateY(-5px); opacity: 1; }
      }
    `}</style>
  </div>
);

// ============ CHAT BUBBLE ============
const Bubble = ({ from = "orb", children, delay = 0, compact = false }) => {
  const isOrb = from === "orb";
  return (
    <div style={{
      display: "flex",
      justifyContent: isOrb ? "flex-start" : "flex-end",
      animation: `bubble-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s backwards`,
    }}>
      <div style={{
        maxWidth: "78%",
        padding: compact ? "10px 14px" : "14px 18px",
        borderRadius: isOrb ? "4px 20px 20px 20px" : "20px 4px 20px 20px",
        background: isOrb
          ? "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(167,139,250,0.12))"
          : OrbytTokens.blue,
        color: isOrb ? OrbytTokens.text : "white",
        border: isOrb ? `1px solid ${OrbytTokens.line}` : "none",
        fontSize: 16,
        lineHeight: 1.5,
        boxShadow: isOrb
          ? "0 2px 12px rgba(0,0,0,0.2)"
          : "0 4px 20px rgba(59,130,246,0.4)",
      }}>
        {children}
      </div>
      <style>{`
        @keyframes bubble-in {
          from { opacity: 0; transform: translateY(12px) scale(0.92); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
};

// ============ OPTION CHIP ============
const Chip = ({ selected, onClick, children, delay = 0, icon }) => (
  <button
    onClick={onClick}
    style={{
      padding: "12px 18px",
      borderRadius: 14,
      border: `1.5px solid ${selected ? OrbytTokens.blue : OrbytTokens.lineStrong}`,
      background: selected
        ? "linear-gradient(135deg, rgba(59,130,246,0.25), rgba(167,139,250,0.15))"
        : "rgba(255,255,255,0.03)",
      color: OrbytTokens.text,
      fontSize: 15,
      fontWeight: 500,
      fontFamily: "inherit",
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
      transform: selected ? "scale(1.03)" : "scale(1)",
      boxShadow: selected ? `0 0 0 3px rgba(59,130,246,0.15), 0 4px 16px rgba(59,130,246,0.3)` : "none",
      animation: `chip-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s backwards`,
    }}
    onMouseEnter={e => { if (!selected) e.currentTarget.style.borderColor = OrbytTokens.textDim; }}
    onMouseLeave={e => { if (!selected) e.currentTarget.style.borderColor = OrbytTokens.lineStrong; }}
  >
    {icon && <span style={{ fontSize: 18 }}>{icon}</span>}
    {children}
    <style>{`
      @keyframes chip-in {
        from { opacity: 0; transform: translateY(8px) scale(0.9); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
    `}</style>
  </button>
);

// ============ PRIMARY BUTTON ============
const PrimaryBtn = ({ children, onClick, disabled, size = "md", variant = "primary" }) => {
  const sizes = {
    sm: { padding: "8px 16px", fontSize: 14 },
    md: { padding: "14px 28px", fontSize: 16 },
    lg: { padding: "18px 40px", fontSize: 18 },
  };
  const variants = {
    primary: {
      background: `linear-gradient(135deg, ${OrbytTokens.blue}, ${OrbytTokens.purpleDeep})`,
      color: "white",
      boxShadow: `0 8px 32px rgba(59,130,246,0.45), inset 0 1px 0 rgba(255,255,255,0.2)`,
    },
    ghost: {
      background: "transparent",
      color: OrbytTokens.textDim,
      boxShadow: "none",
    },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...sizes[size],
        ...variants[variant],
        border: "none",
        borderRadius: 999,
        fontWeight: 600,
        fontFamily: "inherit",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        transition: "transform 0.15s, box-shadow 0.2s",
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
      }}
      onMouseDown={e => !disabled && (e.currentTarget.style.transform = "scale(0.97)")}
      onMouseUp={e => !disabled && (e.currentTarget.style.transform = "scale(1)")}
      onMouseLeave={e => !disabled && (e.currentTarget.style.transform = "scale(1)")}
    >
      {children}
    </button>
  );
};

// ============ PROGRESS DOTS ============
const ProgressDots = ({ total, current }) => (
  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
    {Array.from({ length: total }).map((_, i) => (
      <div key={i} style={{
        width: i === current ? 24 : 6,
        height: 6,
        borderRadius: 3,
        background: i <= current ? OrbytTokens.blue : "rgba(255,255,255,0.15)",
        transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }} />
    ))}
  </div>
);

// ============ WINDOW CHROME (macOS) ============
const WindowChrome = ({ title = "Orbyt", children, width = 1100, height = 720 }) => (
  <div style={{
    width, height,
    borderRadius: 12,
    overflow: "hidden",
    background: OrbytTokens.bg,
    boxShadow: "0 40px 120px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)",
    display: "flex", flexDirection: "column",
    fontFamily: "'Inter', system-ui, sans-serif",
    color: OrbytTokens.text,
  }}>
    <div style={{
      height: 36,
      background: "rgba(255,255,255,0.02)",
      borderBottom: `1px solid ${OrbytTokens.line}`,
      display: "flex", alignItems: "center",
      padding: "0 14px",
      gap: 8,
      flexShrink: 0,
    }}>
      <div style={{ display: "flex", gap: 7 }}>
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF5F57" }} />
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FEBC2E" }} />
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28C840" }} />
      </div>
      <div style={{
        flex: 1, textAlign: "center",
        fontSize: 13, color: OrbytTokens.textDim, fontWeight: 500,
      }}>{title}</div>
      <div style={{ width: 40 }} />
    </div>
    <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
      {children}
    </div>
  </div>
);

// ============ QUESTIONS DATA ============
// Flow: name → field → MCQ (struggle, motivation, peak, style) → active hours → busy-map → 5 open-ended → reveal
const DEFAULT_QUESTIONS = [
  {
    id: "name",
    type: "text",
    orb: "listening",
    bubbles: ["Hi — I'm Orby.", "What's your name?"],
    placeholder: "Your name…",
    phase: "mcq",
  },
  {
    id: "field",
    type: "choice",
    orb: "curious",
    bubbles: (ctx) => [`Nice to meet you, ${ctx.name || "friend"}.`, "What do you study?"],
    options: [
      { v: "stem", label: "STEM / Engineering", icon: "🧪" },
      { v: "humanities", label: "Humanities", icon: "📚" },
      { v: "business", label: "Business", icon: "📊" },
      { v: "arts", label: "Arts & Design", icon: "🎨" },
      { v: "health", label: "Health / Pre-med", icon: "🩺" },
      { v: "mix", label: "A bit of everything", icon: "🌀" },
    ],
    phase: "mcq",
  },
  {
    id: "struggle",
    type: "choice",
    orb: "thinking",
    bubbles: ["What trips you up most?"],
    options: [
      { v: "procrastination", label: "I procrastinate", icon: "⏰" },
      { v: "focus", label: "Can't focus long", icon: "🌀" },
      { v: "overwhelm", label: "Too much to juggle", icon: "🌊" },
      { v: "motivation", label: "Motivation dips", icon: "🔋" },
      { v: "memory", label: "I forget things", icon: "🫠" },
      { v: "stress", label: "Stress gets me", icon: "💭" },
    ],
    phase: "mcq",
  },
  {
    id: "motivation",
    type: "choice",
    orb: "curious",
    bubbles: ["What keeps you going?"],
    options: [
      { v: "grades", label: "Grades & GPA", icon: "📈" },
      { v: "mastery", label: "Love of learning", icon: "✨" },
      { v: "career", label: "Future career", icon: "🎯" },
      { v: "people", label: "Proving people wrong", icon: "🔥" },
      { v: "streak", label: "My streak", icon: "⚡" },
      { v: "curious", label: "Curiosity", icon: "🔭" },
    ],
    phase: "mcq",
  },
  {
    id: "peak",
    type: "choice",
    orb: "happy",
    bubbles: ["When does your brain peak?"],
    options: [
      { v: "dawn", label: "Crack of dawn", icon: "🌅" },
      { v: "morning", label: "Mid-morning", icon: "☀️" },
      { v: "afternoon", label: "After lunch", icon: "🌤" },
      { v: "evening", label: "Evening", icon: "🌆" },
      { v: "night", label: "Night", icon: "🌙" },
      { v: "chaos", label: "Chaos", icon: "🎲" },
    ],
    phase: "mcq",
  },
  {
    id: "style",
    type: "choice",
    orb: "thinking",
    bubbles: ["How do you study best?"],
    options: [
      { v: "alone", label: "Alone in silence", icon: "🧘" },
      { v: "music", label: "Headphones, lo-fi", icon: "🎧" },
      { v: "group", label: "With friends", icon: "👯" },
      { v: "cafe", label: "Café noise", icon: "☕" },
      { v: "visual", label: "Visual notes", icon: "🎨" },
      { v: "doing", label: "By doing", icon: "🛠" },
    ],
    phase: "mcq",
  },
  // ============ OPEN-ENDED (5) — crucial for the student profile ============
  {
    id: "secretLove",
    type: "text",
    orb: "curious",
    bubbles: ["A class you secretly love — or hate?", "Why?"],
    placeholder: "Organic Chem. The puzzles, not the hours…",
    multiline: true,
    phase: "open",
  },
  {
    id: "wishBetter",
    type: "text",
    orb: "thinking",
    bubbles: ["What do you wish you were better at?"],
    placeholder: "Reading without re-reading three times…",
    multiline: true,
    phase: "open",
  },
  {
    id: "pastHabit",
    type: "text",
    orb: "curious",
    bubbles: ["A study habit that worked — or failed spectacularly?"],
    placeholder: "All-nighters. They ruined finals week…",
    multiline: true,
    phase: "open",
  },
  {
    id: "forWho",
    type: "text",
    orb: "listening",
    bubbles: ["Who are you doing this for?"],
    placeholder: "Me. My family. My future self…",
    multiline: true,
    phase: "open",
  },
  {
    id: "successLook",
    type: "text",
    orb: "happy",
    bubbles: ["What does a successful semester look like?", "Be specific."],
    placeholder: "A- in calc. No 3am panic. Two Saturdays off…",
    multiline: true,
    phase: "open",
  },
];

// Build Study DNA from answers
const buildStudyDNA = (answers) => {
  const struggleMap = {
    procrastination: { trait: "The Sprinter", hue: 20 },
    focus: { trait: "The Scatterbrain", hue: 320 },
    overwhelm: { trait: "The Juggler", hue: 260 },
    motivation: { trait: "The Wave-rider", hue: 195 },
    memory: { trait: "The Goldfish", hue: 50 },
    stress: { trait: "The Overthinker", hue: 285 },
  };
  const peakMap = {
    dawn: "Dawn Chaser", morning: "Morning Engine", afternoon: "Afternoon Glider",
    evening: "Dusk Worker", night: "Night Owl", chaos: "Chaos Operator",
  };
  const styleMap = {
    alone: "Solo Mode", music: "Lo-fi Lab", group: "Study Squad",
    cafe: "Café Mind", visual: "Visual Thinker", doing: "Builder",
  };
  const motivationMap = {
    grades: "Goal-driven", mastery: "Truth-seeker", career: "Future-focused",
    people: "Fire-fueled", streak: "Streak-loyal", curious: "Wonder-led",
  };
  const s = struggleMap[answers.struggle] || { trait: "The Explorer", hue: 220 };
  return {
    trait: s.trait,
    hue: s.hue,
    accentHue: (s.hue + 80) % 360,
    peak: peakMap[answers.peak] || "Flexible Clock",
    style: styleMap[answers.style] || "Mixed Mode",
    motivation: motivationMap[answers.motivation] || "Multi-driven",
    name: answers.name || "Friend",
  };
};

// ============ OPTION CHECK (themed checkmark row) ============
// Used in Var C — visually answers the "checkbox that fits the theme" brief.
// A card-row with a custom animated orbit-ring + checkmark indicator on the right.
const OptionCheck = ({ selected, onClick, children, icon, delay = 0, dnaHue = 220 }) => {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: "auto 1fr auto",
        alignItems: "center",
        gap: 14,
        padding: "14px 18px",
        borderRadius: 14,
        border: `1.5px solid ${selected ? `oklch(0.7 0.2 ${dnaHue} / 0.6)` : OrbytTokens.lineStrong}`,
        background: selected
          ? `linear-gradient(135deg, oklch(0.25 0.12 ${dnaHue} / 0.5), oklch(0.18 0.08 ${(dnaHue + 60) % 360} / 0.3))`
          : "rgba(255,255,255,0.025)",
        color: OrbytTokens.text,
        fontSize: 15,
        fontWeight: 500,
        fontFamily: "inherit",
        cursor: "pointer",
        textAlign: "left",
        transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
        transform: selected ? "translateX(4px)" : "translateX(0)",
        boxShadow: selected
          ? `0 8px 32px oklch(0.55 0.2 ${dnaHue} / 0.25), inset 0 1px 0 rgba(255,255,255,0.08)`
          : "none",
        animation: `opt-in 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s backwards`,
      }}
      onMouseEnter={e => {
        if (!selected) {
          e.currentTarget.style.borderColor = `oklch(0.55 0.15 ${dnaHue} / 0.5)`;
          e.currentTarget.style.background = "rgba(255,255,255,0.045)";
        }
      }}
      onMouseLeave={e => {
        if (!selected) {
          e.currentTarget.style.borderColor = OrbytTokens.lineStrong;
          e.currentTarget.style.background = "rgba(255,255,255,0.025)";
        }
      }}
    >
      {icon && (
        <span style={{
          fontSize: 20,
          width: 32, height: 32,
          display: "grid", placeItems: "center",
          background: selected ? `oklch(0.3 0.15 ${dnaHue} / 0.6)` : "rgba(255,255,255,0.04)",
          borderRadius: 10,
          transition: "background 0.25s",
        }}>{icon}</span>
      )}
      <span style={{ lineHeight: 1.3 }}>{children}</span>
      {/* orbit-ring checkmark indicator */}
      <span style={{
        width: 24, height: 24, position: "relative",
        display: "grid", placeItems: "center",
        flexShrink: 0,
      }}>
        {/* outer tilted orbit ring */}
        <span style={{
          position: "absolute", inset: 0,
          border: `1.5px solid ${selected ? `oklch(0.75 0.2 ${dnaHue})` : "rgba(255,255,255,0.2)"}`,
          borderRadius: "50%",
          transform: "rotateZ(-25deg) scaleY(0.9)",
          transition: "border-color 0.25s",
          boxShadow: selected ? `0 0 12px oklch(0.7 0.22 ${dnaHue} / 0.7)` : "none",
        }} />
        {/* inner filled planet when selected */}
        <span style={{
          width: 14, height: 14,
          borderRadius: "50%",
          background: selected
            ? `radial-gradient(circle at 35% 30%, oklch(0.9 0.15 ${dnaHue}), oklch(0.6 0.22 ${dnaHue}) 60%, oklch(0.35 0.2 ${(dnaHue + 60) % 360}))`
            : "transparent",
          border: selected ? "none" : `1.5px solid rgba(255,255,255,0.18)`,
          transform: selected ? "scale(1)" : "scale(0.85)",
          transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
          position: "relative",
          boxShadow: selected ? `0 0 10px oklch(0.7 0.22 ${dnaHue})` : "none",
        }}>
          {/* checkmark */}
          {selected && (
            <svg viewBox="0 0 14 14" style={{
              position: "absolute", inset: 0, width: "100%", height: "100%",
              animation: "check-draw 0.4s 0.1s cubic-bezier(0.65, 0, 0.35, 1) backwards",
            }}>
              <path d="M3 7.5 L6 10 L11 4.5"
                stroke="white" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"
                fill="none"
                style={{
                  strokeDasharray: 14,
                  strokeDashoffset: 0,
                  filter: "drop-shadow(0 0 3px rgba(255,255,255,0.8))",
                }}
              />
            </svg>
          )}
        </span>
      </span>
      <style>{`
        @keyframes opt-in {
          from { opacity: 0; transform: translateY(8px) translateX(0); }
          to { opacity: 1; transform: translateY(0) translateX(${selected ? 4 : 0}px); }
        }
        @keyframes check-draw {
          from { stroke-dashoffset: 14; opacity: 0; }
          to { stroke-dashoffset: 0; opacity: 1; }
        }
      `}</style>
    </button>
  );
};

Object.assign(window, {
  OrbytTokens, OrbytLogo, CompanionOrb, TypingDots,
  Bubble, Chip, OptionCheck, PrimaryBtn, ProgressDots, WindowChrome,
  DEFAULT_QUESTIONS, buildStudyDNA,
});
