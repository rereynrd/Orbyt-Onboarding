// DNA Catalog — 30 core + 20 rare archetypes
// Each archetype has: triggers, rarity, hue, metadata for AI categorization,
// and variant adjective mappings driven by open-ended sentiment.

// ============ HUE SEEDS (per answer value) ============
const HUE_SEEDS = {
  // field
  stem: 210, humanities: 40, business: 140, arts: 290, health: 160, mix: 60,
  // struggle
  procrastination: 20, focus: 320, overwhelm: 260, motivation: 195, memory: 50, stress: 285,
  // motivation
  grades: 30, mastery: 200, career: 130, people: 350, streak: 70, curious: 180,
  // peak
  dawn: 35, morning: 55, afternoon: 150, evening: 240, night: 275, chaos: 310,
  // style
  alone: 220, music: 270, group: 110, cafe: 45, visual: 165, doing: 90,
};

// Blend all 6 MCQ signals into a unique hue (deterministic per combo)
const blendHue = (answers) => {
  const w = { field: 0.10, struggle: 0.30, motivation: 0.18, peak: 0.22, style: 0.20 };
  let h = 0;
  for (const [key, weight] of Object.entries(w)) {
    h += (HUE_SEEDS[answers[key]] ?? 180) * weight;
  }
  // Add name length as tiny salt so same-MCQ users still differ slightly
  h += ((answers.name?.length ?? 5) * 7) % 15;
  return Math.round(h) % 360;
};

// ============ OPEN-ENDED SENTIMENT → VARIANT ADJECTIVE ============
const SENTIMENT_RULES = [
  { words: ["stress", "anxious", "anxiety", "overwhelm", "panic", "burnt", "exhausted", "tired", "dread"], adjective: "Burnt-out" },
  { words: ["love", "passion", "passionat", "excited", "excit", "thrill", "obsess", "adore", "fascin"], adjective: "Fired-up" },
  { words: ["hate", "dreaded", "despise", "awful", "terrible", "worst", "boring", "loathe"], adjective: "Reluctant" },
  { words: ["family", "parents", "mom", "dad", "prove", "disappoint", "expectations"], adjective: "Driven" },
  { words: ["future", "career", "job", "dream", "goal", "ambition", "success"], adjective: "Ambitious" },
  { words: ["curious", "wonder", "interest", "fascinating", "explore", "discover"], adjective: "Restless" },
  { words: ["alone", "isolated", "lonely", "quiet", "silent", "solo"], adjective: "Solitary" },
  { words: ["never", "always fail", "can't", "impossible", "hopeless", "lost"], adjective: "Weathered" },
];

const detectVariantAdjective = (answers) => {
  const openFields = ["secretLove", "wishBetter", "pastHabit", "forWho", "successLook"];
  const combined = openFields.map(f => answers[f] ?? "").join(" ").toLowerCase();
  if (!combined.trim()) return null;
  let best = null, bestCount = 0;
  for (const rule of SENTIMENT_RULES) {
    const count = rule.words.filter(w => combined.includes(w)).length;
    if (count > bestCount) { bestCount = count; best = rule.adjective; }
  }
  return bestCount >= 1 ? best : null;
};

// ============ ARCHETYPE CATALOG ============
// trigger: primary keys checked in order. First match wins (most specific first = rare before core).
// score: how many triggers must match (1 = any, 2+ = all listed must match)

const ARCHETYPE_CATALOG = [
  // ===== RARE (20) — check first, need 2-3 specific signals =====
  {
    id: "midnight_phantom",
    name: "The Midnight Phantom",
    rarity: "rare",
    triggers: { struggle: "procrastination", peak: "night", style: "alone" },
    tagline: "Vanishes by day, creates by night.",
    description: "You do your best work when the world goes quiet — but avoiding the work until then is the art form you've perfected.",
    metadata: {
      studyTechniques: ["Self-imposed 'mission briefings' before each session", "Accountability windows (11pm–2am only)", "No-internet drafts to prevent distraction spirals"],
      failureModes: ["Waiting for the 'right' mood that never arrives", "Night sessions bleeding into morning exhaustion", "Isolation amplifying avoidance"],
      sessionPattern: { durationMin: 90, breakMin: 20, bestWindow: "10pm–2am" },
      motivationalTriggers: ["Deadline proximity", "Self-set dramatic stakes", "Dark academia aesthetics"],
      aiSentimentHints: ["high avoidance behavior", "peak output in solitude", "time-of-day dependent performance"],
      orbytFeatures: ["Night mode focus timer", "Late-session streaks", "Pre-session mission cards"],
      peerCompatibility: ["The Anchor", "The Dawn Warrior"],
    },
  },
  {
    id: "reluctant_genius",
    name: "The Reluctant Genius",
    rarity: "rare",
    triggers: { struggle: "stress", motivation: "mastery", peak: "night" },
    tagline: "Brilliant under pressure, broken by it too.",
    description: "You genuinely love understanding things deeply — but the weight of your own standards turns studying into a battlefield.",
    metadata: {
      studyTechniques: ["Scheduled 'good enough' stopping points", "Concept mapping before reading", "Deliberate low-stakes practice runs"],
      failureModes: ["Perfectionism spirals before exams", "Knowledge hoarding without output", "Underperforming due to test anxiety"],
      sessionPattern: { durationMin: 60, breakMin: 10, bestWindow: "9pm–midnight" },
      motivationalTriggers: ["Intellectual challenge", "Mastery milestones", "Private acknowledgment of progress"],
      aiSentimentHints: ["perfectionism-driven stress", "intrinsic motivation primary", "output anxiety secondary"],
      orbytFeatures: ["Progress milestone tracker", "Anxiety-aware reminders", "Concept journal"],
      peerCompatibility: ["The Deep Diver", "The Parallel Thinker"],
    },
  },
  {
    id: "chaos_architect",
    name: "The Chaos Architect",
    rarity: "rare",
    triggers: { struggle: "overwhelm", peak: "chaos", style: "doing" },
    tagline: "Builds meaning from entropy.",
    description: "Structure feels like a cage. You thrive when you can make, break, and rebuild — and somehow the deadline always finds you just in time.",
    metadata: {
      studyTechniques: ["Project-based learning over rote memorization", "Mind-dump + cluster technique", "Building something to understand it"],
      failureModes: ["Over-engineering study systems instead of studying", "Abandoning plans mid-execution", "Mistaking busyness for progress"],
      sessionPattern: { durationMin: 45, breakMin: 5, bestWindow: "unpredictable" },
      motivationalTriggers: ["Creative constraints", "Novel problems", "Tangible outputs"],
      aiSentimentHints: ["high novelty-seeking", "executive function challenges", "strong maker instinct"],
      orbytFeatures: ["Flexible task capture", "Visual project boards", "Chaos-to-clarity sprint mode"],
      peerCompatibility: ["The Strategist", "The Social Engine"],
    },
  },
  {
    id: "silent_flame",
    name: "The Silent Flame",
    rarity: "rare",
    triggers: { struggle: "motivation", style: "alone", motivation: "curious" },
    tagline: "Burns quietly, but never goes out.",
    description: "Externally still, internally lit by questions no one else is asking. Motivation fluctuates but curiosity is the constant pilot light.",
    metadata: {
      studyTechniques: ["Question-led note-taking", "Teaching to self (rubber duck method)", "Interest-first scheduling"],
      failureModes: ["Low-energy days killing whole weeks", "Mistaking silence for laziness", "External expectations feeling alien"],
      sessionPattern: { durationMin: 75, breakMin: 15, bestWindow: "afternoon–evening" },
      motivationalTriggers: ["Open-ended questions", "Intellectual rabbit holes", "Self-determined goals"],
      aiSentimentHints: ["intrinsic only motivation", "external validation aversion", "curiosity as core driver"],
      orbytFeatures: ["Interest-linked task framing", "Exploration mode", "No-streak pressure settings"],
      peerCompatibility: ["The Alchemist", "The Wanderer"],
    },
  },
  {
    id: "parallel_thinker",
    name: "The Parallel Thinker",
    rarity: "rare",
    triggers: { struggle: "focus", style: "visual", motivation: "mastery" },
    tagline: "Sees the map before anyone else draws it.",
    description: "Your brain runs multiple threads at once. Visual systems are your superpower — but keeping all the threads from tangling is the challenge.",
    metadata: {
      studyTechniques: ["Sketchnotes + concept webs", "Color-coded systems across subjects", "Connecting new ideas to existing mental models"],
      failureModes: ["Rabbit holes derailing linear tasks", "Over-elaborate diagrams instead of practice", "Losing focus mid-concept"],
      sessionPattern: { durationMin: 50, breakMin: 10, bestWindow: "morning" },
      motivationalTriggers: ["Pattern recognition", "Seeing the big picture click", "Elegant systems"],
      aiSentimentHints: ["divergent thinking dominant", "visual-spatial learner", "focus as primary friction"],
      orbytFeatures: ["Visual study board", "Cross-subject connections", "Mind map exports"],
      peerCompatibility: ["The Alchemist", "The Reluctant Genius"],
    },
  },
  {
    id: "velocity_kid",
    name: "The Velocity Kid",
    rarity: "rare",
    triggers: { struggle: "procrastination", peak: "dawn", motivation: "streak" },
    tagline: "Fastest start in the room, if they start.",
    description: "When you're on, you're untouchable — streaks, early mornings, raw momentum. Getting there is the only obstacle.",
    metadata: {
      studyTechniques: ["2-minute rule to initiate", "Pre-laid study stations (environment design)", "Morning lock-in rituals"],
      failureModes: ["Broken streaks triggering full stops", "Overconfidence after fast starts", "Burnout from unsustainable pace"],
      sessionPattern: { durationMin: 60, breakMin: 10, bestWindow: "5am–9am" },
      motivationalTriggers: ["Visible streak counter", "Morning momentum windows", "Quick wins first"],
      aiSentimentHints: ["streak-dependent motivation", "start friction as core problem", "high output when activated"],
      orbytFeatures: ["Morning routine builder", "Streak recovery mode", "Fast-start task queue"],
      peerCompatibility: ["The Grinder", "The Dawn Warrior"],
    },
  },
  {
    id: "pressure_gem",
    name: "The Pressure Gem",
    rarity: "rare",
    triggers: { struggle: "stress", motivation: "streak", motivation2: "career" },
    tagline: "Forged under heat, shines under deadline.",
    description: "External pressure doesn't break you — it clarifies you. But the cost of living at high pressure accumulates silently.",
    metadata: {
      studyTechniques: ["Simulated exam conditions for studying", "Micro-deadline self-imposition", "Pressure-release journaling"],
      failureModes: ["Normalizing unsustainable stress levels", "Crashing after high-pressure periods", "Ignoring low-priority but important tasks"],
      sessionPattern: { durationMin: 90, breakMin: 20, bestWindow: "evening–night" },
      motivationalTriggers: ["Visible stakes", "External accountability", "Track record visibility"],
      aiSentimentHints: ["pressure-optimized", "stress tolerance high but not infinite", "career fear as underlying driver"],
      orbytFeatures: ["Exam simulation mode", "Stress check-ins", "Post-crunch recovery planner"],
      peerCompatibility: ["The Strategist", "The Phantom"],
    },
  },
  {
    id: "infinite_loop",
    name: "The Infinite Loop",
    rarity: "rare",
    triggers: { struggle: "focus", style: "music", style2: "doing" },
    tagline: "Keeps running, just not always forward.",
    description: "You enter flow states easily but breaking out is the problem. Lo-fi on, hands busy — except sometimes you're looping the same task for hours.",
    metadata: {
      studyTechniques: ["Time-boxed sessions with hard stops", "Output targets instead of time targets", "Active recall over re-reading"],
      failureModes: ["Confusing busyness with progress", "Flow state on wrong task", "Difficulty switching subjects"],
      sessionPattern: { durationMin: 45, breakMin: 15, bestWindow: "evening" },
      motivationalTriggers: ["Defined output goals", "Playlist rituals", "Tactile task completion"],
      aiSentimentHints: ["flow state accessible", "task-switching difficulty", "doing-mode over planning-mode"],
      orbytFeatures: ["Output-based session goals", "Subject-switch reminders", "Flow session tracker"],
      peerCompatibility: ["The Builder", "The Caffeinated Mind"],
    },
  },
  {
    id: "lighthouse",
    name: "The Lighthouse",
    rarity: "rare",
    triggers: { struggle: "overwhelm", peak: "morning", motivation: "people" },
    tagline: "Guides others while navigating their own storm.",
    description: "You're the friend everyone turns to — but your own overwhelm hides behind the competence others see in you.",
    metadata: {
      studyTechniques: ["Peer teaching as revision", "Shared accountability groups", "Public commitment schedules"],
      failureModes: ["Others' needs displacing own study time", "Masking personal struggle behind helpfulness", "Emotional exhaustion mid-semester"],
      sessionPattern: { durationMin: 60, breakMin: 15, bestWindow: "7am–11am" },
      motivationalTriggers: ["Group progress", "Being relied on", "Shared milestones"],
      aiSentimentHints: ["socially-driven motivation", "internal overwhelm masked externally", "people as both fuel and drain"],
      orbytFeatures: ["Study group scheduler", "Boundary-setting reminders", "Overwhelm early-warning system"],
      peerCompatibility: ["The Anchor", "The Social Engine"],
    },
  },
  {
    id: "burning_clock",
    name: "The Burning Clock",
    rarity: "rare",
    triggers: { struggle: "procrastination", struggle2: "stress", peak: "evening" },
    tagline: "Always racing the clock they set on fire.",
    description: "You procrastinate, then stress about procrastinating, which causes more procrastination. The evening finally breaks the cycle — for tonight.",
    metadata: {
      studyTechniques: ["Structured procrastination (do smaller tasks while avoiding big ones)", "Worry journaling before study sessions", "Evening planning rituals to pre-commit"],
      failureModes: ["Avoidance-stress-avoidance spiral", "Last-minute quality degradation", "Emotional crash post-deadline"],
      sessionPattern: { durationMin: 75, breakMin: 10, bestWindow: "7pm–11pm" },
      motivationalTriggers: ["Hard deadlines", "Accountability partner check-ins", "Visible time countdowns"],
      aiSentimentHints: ["procrastination-anxiety loop", "evening activation pattern", "deadline pressure required"],
      orbytFeatures: ["Countdown mode", "Anti-spiral check-ins", "Evening session auto-scheduler"],
      peerCompatibility: ["The Pressure Gem", "The Night Architect"],
    },
  },
  {
    id: "quantum_leaper",
    name: "The Quantum Leaper",
    rarity: "rare",
    triggers: { struggle: "focus", peak: "chaos", motivation: "mastery" },
    tagline: "Skips steps others take, lands somewhere unexpected.",
    description: "Linear learning bores you. You jump between ideas, make non-obvious connections, and understand things in the wrong order — and it works.",
    metadata: {
      studyTechniques: ["Non-linear note systems (Zettelkasten)", "Interleaved practice across subjects", "Synthesis over summary"],
      failureModes: ["Skipping foundational steps that later create gaps", "Difficulty explaining 'basic' things", "Restlessness in structured courses"],
      sessionPattern: { durationMin: 40, breakMin: 5, bestWindow: "unpredictable" },
      motivationalTriggers: ["Novel connections", "Intellectual surprise", "Self-directed learning paths"],
      aiSentimentHints: ["non-linear thinker", "high cognitive flexibility", "structure aversion with deep mastery drive"],
      orbytFeatures: ["Cross-subject connection graph", "Non-linear study mode", "Foundation gap detector"],
      peerCompatibility: ["The Chaos Architect", "The Parallel Thinker"],
    },
  },
  {
    id: "storm_chaser",
    name: "The Storm Chaser",
    rarity: "rare",
    triggers: { struggle: "stress", peak: "chaos", style: "group" },
    tagline: "Runs toward what others run from.",
    description: "High-stress, high-energy, best in the chaos of group work and last-minute sessions. You need the electricity to feel alive.",
    metadata: {
      studyTechniques: ["Group study under deadline pressure", "Competitive practice exams", "Debate-style concept review"],
      failureModes: ["Dependent on external energy to start anything", "Burnout after sustained high-intensity periods", "Underperforming in quiet, solo environments"],
      sessionPattern: { durationMin: 60, breakMin: 20, bestWindow: "evening (group)" },
      motivationalTriggers: ["Competition", "Group energy", "High stakes visible to others"],
      aiSentimentHints: ["social-stress energized", "adrenaline-driven motivation", "solo performance gap"],
      orbytFeatures: ["Group challenge mode", "Peer race sessions", "Energy-state check-ins"],
      peerCompatibility: ["The Lighthouse", "The Fire-Starter"],
    },
  },
  {
    id: "time_sculptor",
    name: "The Time Sculptor",
    rarity: "rare",
    triggers: { struggle: "procrastination", peak: "afternoon", style: "visual" },
    tagline: "Carves order from the chaos of their own calendar.",
    description: "You're a system-builder who loves beautiful planners and color-coded schedules — following them is where the art ends.",
    metadata: {
      studyTechniques: ["Time-blocking with visual calendar", "Weekly review rituals", "Habit stacking onto existing routines"],
      failureModes: ["Planning as procrastination", "Over-engineering schedules never followed", "All-or-nothing thinking when schedule breaks"],
      sessionPattern: { durationMin: 60, breakMin: 15, bestWindow: "1pm–5pm" },
      motivationalTriggers: ["Beautiful systems", "Visible week-at-a-glance", "Incremental routine wins"],
      aiSentimentHints: ["planning-execution gap", "visual-system dependent", "afternoon activation"],
      orbytFeatures: ["Visual weekly planner", "Routine builder", "Follow-through tracker"],
      peerCompatibility: ["The Cartographer", "The Strategist"],
    },
  },
  {
    id: "deep_current",
    name: "The Deep Current",
    rarity: "rare",
    triggers: { struggle: "memory", motivation: "mastery", field: "stem" },
    tagline: "Slower on the surface, unstoppable underneath.",
    description: "You don't forget things — you just need more time to encode them properly. Once in, they're in forever. Shallow studying is your kryptonite.",
    metadata: {
      studyTechniques: ["Spaced repetition (Anki)", "First-principles derivation", "Deep single-subject immersion sessions"],
      failureModes: ["Slow start looking like low ability", "Cramming incompatible with your encoding style", "Frustration comparing pace to peers"],
      sessionPattern: { durationMin: 90, breakMin: 20, bestWindow: "morning" },
      motivationalTriggers: ["Long-term mastery milestones", "Seeing prior knowledge activate", "Depth over breadth framing"],
      aiSentimentHints: ["slow-encode high-retention learner", "mastery-intrinsic", "STEM depth orientation"],
      orbytFeatures: ["Spaced repetition scheduler", "Mastery milestone cards", "Long-session focus mode"],
      peerCompatibility: ["The Reluctant Genius", "The Cartographer"],
    },
  },
  {
    id: "ghost_writer",
    name: "The Ghost Writer",
    rarity: "rare",
    triggers: { struggle: "memory", style: "alone", field: "arts" },
    tagline: "Processes everything through the act of writing.",
    description: "You understand by articulating. Lectures don't click until you've rewritten them in your own voice, alone, probably at 2am.",
    metadata: {
      studyTechniques: ["Rewrite notes in own words immediately after class", "Letter-to-self summaries", "Free-writing before studying to clear mental queue"],
      failureModes: ["Rewriting as avoidance of active recall", "Isolation deepening into disconnection", "Perfectionist paralysis on written work"],
      sessionPattern: { durationMin: 80, breakMin: 10, bestWindow: "late night" },
      motivationalTriggers: ["Personal expression", "Creative control", "Self-set writing rituals"],
      aiSentimentHints: ["writing-dominant cognition", "solo processor", "arts-humanities orientation"],
      orbytFeatures: ["Note rewriting prompts", "Personal reflection journal", "Solo deep-work mode"],
      peerCompatibility: ["The Silent Flame", "The Solitary Drifter"],
    },
  },
  {
    id: "iron_curtain",
    name: "The Iron Curtain",
    rarity: "rare",
    triggers: { struggle: "overwhelm", style: "alone", motivation: "career" },
    tagline: "Walls built for protection become walls that trap.",
    description: "You've learned to handle everything alone and appear invulnerable. Under that is someone overwhelmed who won't ask for help.",
    metadata: {
      studyTechniques: ["Structured solo planning with external check-in points", "Modular task breakdown", "Scheduled decompression activities"],
      failureModes: ["Refusing help until crisis point", "Appearing fine while sinking", "All-consuming career anxiety"],
      sessionPattern: { durationMin: 90, breakMin: 25, bestWindow: "morning–afternoon" },
      motivationalTriggers: ["Future security", "Self-sufficiency milestones", "Visible progress toward concrete goals"],
      aiSentimentHints: ["help-refusal pattern", "career-driven overwhelm", "emotional suppression"],
      orbytFeatures: ["Workload visibility tools", "Check-in nudges", "Career progress tracker"],
      peerCompatibility: ["The Strategist", "The Anchor"],
    },
  },
  {
    id: "wandering_star",
    name: "The Wandering Star",
    rarity: "rare",
    triggers: { struggle: "motivation", peak: "chaos", style: "visual" },
    tagline: "Bright, scattered, beautiful, hard to pin down.",
    description: "Motivation comes in vivid bursts tied to inspiration, not obligation. You produce stunning work — erratically.",
    metadata: {
      studyTechniques: ["Inspiration capture system (voice notes, quick sketches)", "Energy-matched task scheduling", "Short creative sprints over long slogs"],
      failureModes: ["Long dead zones between inspiration hits", "Inconsistent output confusing others", "Missing structured deadlines during low phases"],
      sessionPattern: { durationMin: 30, breakMin: 10, bestWindow: "whenever inspired" },
      motivationalTriggers: ["Visual beauty in material", "Creative autonomy", "Unexpected connections"],
      aiSentimentHints: ["inspiration-dependent motivation", "visual-creative orientation", "irregular output pattern"],
      orbytFeatures: ["Inspiration log", "Energy-state scheduling", "Flexible deadline buffers"],
      peerCompatibility: ["The Time Sculptor", "The Silent Flame"],
    },
  },
  {
    id: "last_minute_oracle",
    name: "The Last-Minute Oracle",
    rarity: "rare",
    triggers: { struggle: "procrastination", peak: "evening", motivation: "grades" },
    tagline: "Sees clarity only when the deadline is hours away.",
    description: "Somehow your best work happens when everyone else has given up. The adrenaline isn't a bug — it's your operating system.",
    metadata: {
      studyTechniques: ["Backward planning from deadlines", "High-yield topic prioritization", "No-fluff summary creation under pressure"],
      failureModes: ["Gambling with deadlines and occasionally losing", "Shallow understanding from compressed review", "Health deterioration from repeated crunch cycles"],
      sessionPattern: { durationMin: 120, breakMin: 10, bestWindow: "night before deadline" },
      motivationalTriggers: ["Hard external deadlines", "Grade stakes", "Time pressure clarity"],
      aiSentimentHints: ["deadline-activated cognition", "grade-extrinsic motivation", "procrastination as coping mechanism"],
      orbytFeatures: ["Deadline countdown mode", "High-yield topic filter", "Crunch-session planner"],
      peerCompatibility: ["The Pressure Gem", "The Burning Clock"],
    },
  },
  {
    id: "unwritten",
    name: "The Unwritten",
    rarity: "rare",
    triggers: { struggle: "motivation", peak: "chaos", style: "group" },
    tagline: "Still writing the story of who they are as a student.",
    description: "You haven't found your thing yet, and that uncertainty reads as lack of motivation. The potential is there — the identity isn't.",
    metadata: {
      studyTechniques: ["Interest exploration sprints (try new methods for 2 weeks)", "Identity-based habit framing", "Role model study sessions"],
      failureModes: ["Identity confusion blocking commitment", "Comparison to peers with clear direction", "Abandoning approaches before they take hold"],
      sessionPattern: { durationMin: 45, breakMin: 15, bestWindow: "varies" },
      motivationalTriggers: ["Permission to experiment", "Non-judgmental exploration", "Small identity-consistent wins"],
      aiSentimentHints: ["identity formation in progress", "motivation tied to self-concept", "high variance output"],
      orbytFeatures: ["Method experiment tracker", "Reflection prompts", "Identity-building milestone system"],
      peerCompatibility: ["The Wanderer", "The Spark"],
    },
  },

  // ===== CORE (30) — matched by primary 1-2 signals =====
  {
    id: "night_architect",
    name: "The Night Architect",
    rarity: "common",
    triggers: { struggle: "procrastination", peak: "night" },
    tagline: "Plans the night, builds it too.",
    description: "Darkness is your signal to finally begin. The world goes quiet and the work comes out.",
    metadata: {
      studyTechniques: ["Time-blocking for late hours", "Pomodoro 45/10", "Analog task lists to avoid screen drift"],
      failureModes: ["Sleep debt accumulating", "Isolation in late hours", "Daytime functionality collapse"],
      sessionPattern: { durationMin: 90, breakMin: 15, bestWindow: "10pm–1am" },
      motivationalTriggers: ["Night rituals", "Silence", "Self-set deadlines"],
      aiSentimentHints: ["circadian-shifted", "night productivity pattern", "avoidance by day"],
      orbytFeatures: ["Night mode", "Late-session streaks", "Sleep health reminders"],
      peerCompatibility: ["The Lone Wolf", "The Midnight Phantom"],
    },
  },
  {
    id: "dawn_warrior",
    name: "The Dawn Warrior",
    rarity: "common",
    triggers: { struggle: "procrastination", peak: "dawn" },
    tagline: "Beats the world to the desk.",
    description: "Early mornings are sacred. Before the noise, before obligations, the work gets done.",
    metadata: {
      studyTechniques: ["Pre-sunrise deep work blocks", "Night-before task queuing", "Environment setup rituals"],
      failureModes: ["Afternoon energy crashes", "Evening meetings destroying next morning", "Rigidity around schedule"],
      sessionPattern: { durationMin: 75, breakMin: 15, bestWindow: "5am–8am" },
      motivationalTriggers: ["Morning silence", "Head start feeling", "Routine consistency"],
      aiSentimentHints: ["morning-peak performance", "routine-dependent", "starts well but follow-through varies"],
      orbytFeatures: ["Dawn session tracker", "Night-before prep reminders", "Morning streak system"],
      peerCompatibility: ["The Velocity Kid", "The Anchor"],
    },
  },
  {
    id: "lone_wolf",
    name: "The Lone Wolf",
    rarity: "common",
    triggers: { struggle: "focus", style: "alone" },
    tagline: "Focus is a solo sport.",
    description: "Every person in the room is a potential distraction. Alone, you're unstoppable.",
    metadata: {
      studyTechniques: ["Deep work sessions (2+ hours)", "Headphone isolation", "Single-subject focus per session"],
      failureModes: ["Isolation becoming avoidance", "Difficulty asking for help", "Tunnel vision missing exam priorities"],
      sessionPattern: { durationMin: 120, breakMin: 20, bestWindow: "flexible" },
      motivationalTriggers: ["Uninterrupted environment", "Self-directed goals", "Progress metrics"],
      aiSentimentHints: ["solo-optimal focus", "social interruption sensitivity", "self-reliant learner"],
      orbytFeatures: ["Do-not-disturb session mode", "Solo deep-work streaks", "Focus analytics"],
      peerCompatibility: ["The Silent Flame", "The Night Architect"],
    },
  },
  {
    id: "caffeinated_mind",
    name: "The Caffeinated Mind",
    rarity: "common",
    triggers: { struggle: "focus", style: "cafe" },
    tagline: "Ambient noise is your focus soundtrack.",
    description: "Silence is too loud. The background hum of a café calibrates your attention in ways silence never can.",
    metadata: {
      studyTechniques: ["Café + lo-fi playlist sessions", "Sensory anchoring (same seat, same drink)", "Short sharp tasks in ambient environments"],
      failureModes: ["Café-dependent sessions failing at home", "People-watching derailing focus", "Noise threshold too easy to cross"],
      sessionPattern: { durationMin: 60, breakMin: 15, bestWindow: "morning–afternoon" },
      motivationalTriggers: ["Sensory ritual", "Change of environment", "Visible external industry"],
      aiSentimentHints: ["ambient stimulation optimal", "environmental-dependent focus", "ritual-anchored"],
      orbytFeatures: ["Ambient sound player", "Location-based session tracking", "Environment rituals"],
      peerCompatibility: ["The Infinite Loop", "The Wave-rider"],
    },
  },
  {
    id: "perfectionist",
    name: "The Perfectionist",
    rarity: "common",
    triggers: { struggle: "stress", motivation: "grades" },
    tagline: "The bar is always one notch higher than yesterday.",
    description: "An A- feels like failure. You know it's irrational, but the standard keeps rising.",
    metadata: {
      studyTechniques: ["Fixed-time studying (not until-perfect)", "Grade-decoupled learning sprints", "Scheduled imperfect drafts"],
      failureModes: ["Diminishing returns on over-preparation", "Grade anxiety derailing performance", "Comparative suffering with peers"],
      sessionPattern: { durationMin: 90, breakMin: 20, bestWindow: "morning–afternoon" },
      motivationalTriggers: ["Measurable metrics", "External benchmarks", "Incremental grade improvements"],
      aiSentimentHints: ["grade-extrinsic perfectionism", "anxiety as motivator and limiter", "output quality-obsessed"],
      orbytFeatures: ["Grade tracking", "Anxiety check-ins pre-exam", "Good-enough session mode"],
      peerCompatibility: ["The Pressure Gem", "The Reluctant Genius"],
    },
  },
  {
    id: "idealist",
    name: "The Idealist",
    rarity: "common",
    triggers: { struggle: "motivation", motivation: "mastery" },
    tagline: "Studying for reasons bigger than the grade.",
    description: "You want to actually understand, not just pass. When the material feels meaningless, the motivation evaporates.",
    metadata: {
      studyTechniques: ["Meaning-first topic framing", "Real-world application hunting", "Teach-back method"],
      failureModes: ["Struggling with coursework that feels pointless", "Frustration with surface-level exams", "Drifting away from rote-heavy subjects"],
      sessionPattern: { durationMin: 70, breakMin: 15, bestWindow: "afternoon" },
      motivationalTriggers: ["Relevance and purpose", "Big-picture framing", "Application to real problems"],
      aiSentimentHints: ["purpose-driven motivation", "mastery-intrinsic", "meaning-dependency"],
      orbytFeatures: ["Why-framing for tasks", "Interest connection engine", "Mastery progress tracker"],
      peerCompatibility: ["The Alchemist", "The Deep Diver"],
    },
  },
  {
    id: "builder",
    name: "The Builder",
    rarity: "common",
    triggers: { struggle: "focus", style: "doing" },
    tagline: "Understands by making.",
    description: "Sitting and reading about things isn't learning. Building them is. You need your hands in it.",
    metadata: {
      studyTechniques: ["Project-based learning", "Code-it/build-it to understand it", "Active problem-solving over passive review"],
      failureModes: ["Theoretical content feeling inaccessible", "Skipping conceptual foundations", "Building the wrong thing confidently"],
      sessionPattern: { durationMin: 60, breakMin: 10, bestWindow: "afternoon" },
      motivationalTriggers: ["Tangible outputs", "Making progress you can see", "Creative problem-solving"],
      aiSentimentHints: ["kinesthetic learning dominant", "doing-mode over reading-mode", "strong maker instinct"],
      orbytFeatures: ["Project tracking", "Hands-on task framing", "Output-based session goals"],
      peerCompatibility: ["The Infinite Loop", "The Chaos Architect"],
    },
  },
  {
    id: "social_engine",
    name: "The Social Engine",
    rarity: "common",
    triggers: { struggle: "overwhelm", style: "group" },
    tagline: "Carries more when others share the load.",
    description: "Overwhelm dissolves in community. Studying alone piles everything on one person — with others, it somehow weighs less.",
    metadata: {
      studyTechniques: ["Study groups with rotating explainers", "Collaborative note systems", "Accountability pairs"],
      failureModes: ["Groups becoming social time", "Dependency on group to start anything", "Others' pace controlling your own"],
      sessionPattern: { durationMin: 60, breakMin: 20, bestWindow: "afternoon (group)" },
      motivationalTriggers: ["Shared purpose", "Group progress visibility", "Peer encouragement"],
      aiSentimentHints: ["social-regulated motivation", "overwhelm reduced by community", "interdependent learner"],
      orbytFeatures: ["Study group scheduler", "Shared progress boards", "Group challenge mode"],
      peerCompatibility: ["The Lighthouse", "The Storm Chaser"],
    },
  },
  {
    id: "fire_starter",
    name: "The Fire-Starter",
    rarity: "common",
    triggers: { struggle: "motivation", motivation: "people" },
    tagline: "Proves them wrong, one exam at a time.",
    description: "External doubt is your fuel. Skeptics become targets. You study hardest when someone believes you can't.",
    metadata: {
      studyTechniques: ["Competitor framing (internal or external)", "Public commitment accountability", "Progress updates to relevant skeptics"],
      failureModes: ["Motivation collapsing when there's no one to prove wrong", "Chip-on-shoulder exhaustion", "Extrinsic-only motivation brittleness"],
      sessionPattern: { durationMin: 60, breakMin: 15, bestWindow: "evening" },
      motivationalTriggers: ["Perceived underestimation", "Visible progress", "Competitive framing"],
      aiSentimentHints: ["externally-validated motivation", "spite as fuel", "needs perceived challenge"],
      orbytFeatures: ["Competitor tracking", "Personal record system", "Doubt-to-done journal"],
      peerCompatibility: ["The Storm Chaser", "The Grinder"],
    },
  },
  {
    id: "deep_diver",
    name: "The Deep Diver",
    rarity: "common",
    triggers: { struggle: "memory", motivation: "mastery" },
    tagline: "Goes further down than most dare.",
    description: "Surface-level understanding feels dishonest to you. You'd rather know one thing completely than five things partially.",
    metadata: {
      studyTechniques: ["First-principles derivation", "Feynman technique", "Deep single-topic immersion blocks"],
      failureModes: ["Over-investing in fascinating topics at expense of others", "Slow broad coverage", "Depth bias in shallow-exam courses"],
      sessionPattern: { durationMin: 100, breakMin: 20, bestWindow: "morning" },
      motivationalTriggers: ["Intellectual depth", "Complete understanding", "Mastery validation"],
      aiSentimentHints: ["depth-obsessive", "slow-but-thorough", "mastery-intrinsic memory encoding"],
      orbytFeatures: ["Deep focus sessions", "Concept mastery checks", "Time-boxing for coverage balance"],
      peerCompatibility: ["The Alchemist", "The Deep Current"],
    },
  },
  {
    id: "grinder",
    name: "The Grinder",
    rarity: "common",
    triggers: { struggle: "procrastination", motivation: "grades" },
    tagline: "Will outwork anyone. Eventually.",
    description: "You don't rely on talent. Raw repetition, practice problems, and hours logged — that's the strategy.",
    metadata: {
      studyTechniques: ["Massive practice problem sets", "Timed repetition drills", "Grade-tracking dashboards"],
      failureModes: ["Grinding inefficiently (busy ≠ productive)", "Burnout from volume-without-strategy", "Overlooking conceptual gaps while drilling"],
      sessionPattern: { durationMin: 90, breakMin: 15, bestWindow: "evening" },
      motivationalTriggers: ["Grade progress visible", "Volume milestones", "Others' success as competition"],
      aiSentimentHints: ["effort-quantity over quality", "grade-extrinsic primary", "discipline over inspiration"],
      orbytFeatures: ["Practice set tracker", "Grade progress charts", "Efficiency analytics"],
      peerCompatibility: ["The Velocity Kid", "The Fire-Starter"],
    },
  },
  {
    id: "wanderer",
    name: "The Wanderer",
    rarity: "common",
    triggers: { struggle: "motivation", motivation: "curious" },
    tagline: "Never lost, just taking the scenic route.",
    description: "Curiosity takes you everywhere except sometimes where you need to be. Every rabbit hole is a feature, not a bug.",
    metadata: {
      studyTechniques: ["Interest-first scheduling", "Curiosity capture (note it, park it, return later)", "Broad-to-narrow session structure"],
      failureModes: ["Rabbit holes consuming deadline time", "Covering everything except what's tested", "Commitment-aversion to any single path"],
      sessionPattern: { durationMin: 50, breakMin: 10, bestWindow: "afternoon–evening" },
      motivationalTriggers: ["Novelty", "Open questions", "Self-directed exploration"],
      aiSentimentHints: ["curiosity-dominant", "extrinsic structure aversion", "wide-ranging interests"],
      orbytFeatures: ["Interest exploration mode", "Rabbit hole timer", "Curiosity-to-task bridge"],
      peerCompatibility: ["The Silent Flame", "The Unwritten"],
    },
  },
  {
    id: "harmonist",
    name: "The Harmonist",
    rarity: "common",
    triggers: { struggle: "overwhelm", style: "alone" },
    tagline: "Needs calm to think, and creates it.",
    description: "Noise and chaos block your thinking. You build serene study environments not out of preference but necessity.",
    metadata: {
      studyTechniques: ["Environment design before sessions", "Minimal-distraction note systems", "One subject per day approach"],
      failureModes: ["Waiting for perfect conditions", "Overwhelm from messy physical or mental space", "Fragility to unexpected disruptions"],
      sessionPattern: { durationMin: 75, breakMin: 20, bestWindow: "morning" },
      motivationalTriggers: ["Orderly environment", "Clear schedule", "Manageable task lists"],
      aiSentimentHints: ["environment-regulated performance", "overwhelm from sensory overload", "calm-optimized cognition"],
      orbytFeatures: ["Environment setup reminders", "Minimal UI mode", "One-thing-at-a-time task view"],
      peerCompatibility: ["The Lone Wolf", "The Iron Curtain"],
    },
  },
  {
    id: "maestro",
    name: "The Maestro",
    rarity: "common",
    triggers: { struggle: "focus", style: "visual" },
    tagline: "Orchestrates information into beautiful systems.",
    description: "If it's not visual, it's not learnable. Color, layout, and spatial organization are how you think.",
    metadata: {
      studyTechniques: ["Sketchnotes", "Color-coded outline systems", "Visual concept mapping"],
      failureModes: ["System-building as procrastination", "Beautiful notes rarely revisited", "Over-organizing at cost of actual studying"],
      sessionPattern: { durationMin: 60, breakMin: 15, bestWindow: "afternoon" },
      motivationalTriggers: ["Aesthetic satisfaction", "Organized visual systems", "Progress you can see and color"],
      aiSentimentHints: ["visual-dominant cognition", "system-builder", "aesthetic motivation factor"],
      orbytFeatures: ["Visual study planner", "Color tagging system", "Progress visual dashboard"],
      peerCompatibility: ["The Parallel Thinker", "The Time Sculptor"],
    },
  },
  {
    id: "strategist",
    name: "The Strategist",
    rarity: "common",
    triggers: { struggle: "overwhelm", motivation: "career" },
    tagline: "Every study session is a career move.",
    description: "You see the long game. Every assignment is a chess piece. Overwhelm is just a resource allocation problem to be optimized.",
    metadata: {
      studyTechniques: ["Priority matrix (impact vs. effort)", "Career-mapped study focus", "Strategic topic selection"],
      failureModes: ["Over-optimizing and under-doing", "Low-priority subjects falling dangerously behind", "Analysis paralysis"],
      sessionPattern: { durationMin: 75, breakMin: 15, bestWindow: "morning" },
      motivationalTriggers: ["Career relevance", "Strategic edge over peers", "Long-term payoff framing"],
      aiSentimentHints: ["strategic-extrinsic motivation", "career-driven", "resource-optimization mindset"],
      orbytFeatures: ["Priority matrix tool", "Career-aligned task tagging", "Strategic weekly review"],
      peerCompatibility: ["The Iron Curtain", "The Pressure Gem"],
    },
  },
  {
    id: "rebel",
    name: "The Rebel",
    rarity: "common",
    triggers: { struggle: "stress", motivation: "people" },
    tagline: "Studies best when the world thinks they won't.",
    description: "Rules feel arbitrary, expectations feel like traps, but results? Results you can make undeniable.",
    metadata: {
      studyTechniques: ["Self-defined success metrics", "Unconventional study methods that work for you", "Anti-schedule flexibility"],
      failureModes: ["Resistance to structure even when it would help", "Burning bridges with study resources", "Stress from constant friction with systems"],
      sessionPattern: { durationMin: 60, breakMin: 15, bestWindow: "evening–night" },
      motivationalTriggers: ["Autonomy", "Defying low expectations", "Unconventional success"],
      aiSentimentHints: ["autonomy-dominant", "anti-conformist motivation", "stress from external pressure"],
      orbytFeatures: ["Flexible scheduling", "No-rules study mode", "Personal rules system"],
      peerCompatibility: ["The Fire-Starter", "The Chaos Architect"],
    },
  },
  {
    id: "sentinel",
    name: "The Sentinel",
    rarity: "common",
    triggers: { struggle: "memory", motivation: "streak" },
    tagline: "Never lets the chain break.",
    description: "Consistency is the strategy. You trust the process because you've seen what happens when you don't.",
    metadata: {
      studyTechniques: ["Daily spaced repetition (Anki)", "Non-negotiable minimum daily sessions", "Calendar accountability marking"],
      failureModes: ["Streak-breakage causing disproportionate guilt", "Quantity over quality studying", "Rigidity when life disrupts routine"],
      sessionPattern: { durationMin: 45, breakMin: 10, bestWindow: "same time daily" },
      motivationalTriggers: ["Unbroken streak", "Daily ritual", "Long-term compounding proof"],
      aiSentimentHints: ["consistency-driven", "streak-dependent", "memory encoding through repetition"],
      orbytFeatures: ["Streak system", "Daily reminder system", "Streak recovery features"],
      peerCompatibility: ["The Grinder", "The Velocity Kid"],
    },
  },
  {
    id: "alchemist",
    name: "The Alchemist",
    rarity: "common",
    triggers: { struggle: "focus", motivation: "mastery" },
    tagline: "Turns raw confusion into gold understanding.",
    description: "You sit with hard things longer than others. Not because you're slower — because you refuse to leave without the real answer.",
    metadata: {
      studyTechniques: ["Productive struggle (sit with confusion before seeking answers)", "Synthesis sessions", "Cross-domain concept connecting"],
      failureModes: ["Over-thinking simple questions", "Slow throughput on broad-coverage exams", "Frustration at surface-level courses"],
      sessionPattern: { durationMin: 90, breakMin: 20, bestWindow: "morning–afternoon" },
      motivationalTriggers: ["Breakthrough moments", "Deep understanding", "Intellectual transformation"],
      aiSentimentHints: ["productive struggle tolerance", "mastery-intrinsic", "depth over speed"],
      orbytFeatures: ["Confusion-to-clarity tracker", "Deep focus sessions", "Insight journal"],
      peerCompatibility: ["The Deep Diver", "The Parallel Thinker"],
    },
  },
  {
    id: "drifter",
    name: "The Drifter",
    rarity: "common",
    triggers: { struggle: "motivation", peak: "chaos" },
    tagline: "Floats between modes, lands somewhere unexpected.",
    description: "Schedules feel fake to you. Your best work emerges from moods, not plans — which terrifies everyone around you.",
    metadata: {
      studyTechniques: ["Energy-state matching to task type", "Flexible task lists with no time slots", "Low-friction capture of ideas when they arrive"],
      failureModes: ["Low-energy periods with zero output", "Unreliable to partners in group work", "Falling behind on slow-burn tasks"],
      sessionPattern: { durationMin: 35, breakMin: 10, bestWindow: "mood-dependent" },
      motivationalTriggers: ["Internal energy surge", "Novel framing of familiar task", "Self-chosen timing"],
      aiSentimentHints: ["mood-regulated motivation", "structure resistance", "high variance output"],
      orbytFeatures: ["Mood-based task recommendations", "Flexible scheduling", "Low-pressure check-ins"],
      peerCompatibility: ["The Wanderer", "The Unwritten"],
    },
  },
  {
    id: "anchor",
    name: "The Anchor",
    rarity: "common",
    triggers: { struggle: "overwhelm", peak: "morning" },
    tagline: "Holds steady when everything else is moving.",
    description: "Morning routines are the foundation of your sanity. You build stability because you know how quickly things can tip.",
    metadata: {
      studyTechniques: ["Morning planning rituals", "Fixed weekly schedule", "Single priority per day"],
      failureModes: ["Over-scheduling as anxiety management", "Afternoon energy cliff", "Rigidity breaking under life disruptions"],
      sessionPattern: { durationMin: 60, breakMin: 20, bestWindow: "7am–11am" },
      motivationalTriggers: ["Stable routines", "Manageable daily plan", "Progress visibility"],
      aiSentimentHints: ["structure-seeking", "morning-optimal", "overwhelm managed through routine"],
      orbytFeatures: ["Morning routine builder", "Daily priority setter", "Stability-focused planning"],
      peerCompatibility: ["The Dawn Warrior", "The Lighthouse"],
    },
  },
  {
    id: "spark",
    name: "The Spark",
    rarity: "common",
    triggers: { struggle: "motivation", peak: "dawn" },
    tagline: "Ignites fast, needs fuel to stay lit.",
    description: "Early inspiration hits hard and bright. The art is building enough momentum to carry through the day.",
    metadata: {
      studyTechniques: ["Morning momentum capture", "First-hour high-priority work", "Pre-commitment to tasks the night before"],
      failureModes: ["Early inspiration not translating to afternoon output", "Inconsistent energy management", "Mood-dependent productivity"],
      sessionPattern: { durationMin: 60, breakMin: 20, bestWindow: "5am–9am" },
      motivationalTriggers: ["Morning inspiration", "Quick wins at start of day", "Possibility framing"],
      aiSentimentHints: ["early-activation pattern", "motivation-fluctuation", "dawn-peak alignment"],
      orbytFeatures: ["Morning inspiration prompt", "Early session tracker", "Day momentum builder"],
      peerCompatibility: ["The Dawn Warrior", "The Velocity Kid"],
    },
  },
  {
    id: "storm",
    name: "The Storm",
    rarity: "common",
    triggers: { struggle: "stress", peak: "chaos" },
    tagline: "Doesn't avoid the weather. Is the weather.",
    description: "Stress and unpredictability don't derail you — they're where you paradoxically find your edge.",
    metadata: {
      studyTechniques: ["High-intensity short sessions", "Pressure simulation", "Chaos-resistant task systems"],
      failureModes: ["Addiction to the chaos even when calm would serve better", "Burnout disguised as intensity", "Dismissing the need for rest"],
      sessionPattern: { durationMin: 60, breakMin: 15, bestWindow: "unpredictable" },
      motivationalTriggers: ["High stakes", "Urgency", "Visible challenge"],
      aiSentimentHints: ["chaos-adapted", "stress tolerance high", "urgency-dependent activation"],
      orbytFeatures: ["Crunch mode", "High-intensity sprint timer", "Recovery planner"],
      peerCompatibility: ["The Storm Chaser", "The Pressure Gem"],
    },
  },
  {
    id: "cartographer",
    name: "The Cartographer",
    rarity: "common",
    triggers: { struggle: "memory", motivation: "career" },
    tagline: "Maps the territory before moving through it.",
    description: "You need to know where everything fits before you can hold it. Career clarity gives you the map; memory systems are the legend.",
    metadata: {
      studyTechniques: ["Course concept maps before studying detail", "Career-linked topic prioritization", "Memory palace / spatial memorization"],
      failureModes: ["Over-planning before execution", "Memory anxiety when things don't stick fast", "Difficulty with unpredictable exam formats"],
      sessionPattern: { durationMin: 75, breakMin: 15, bestWindow: "morning" },
      motivationalTriggers: ["Career relevance of material", "Visible subject map", "System clarity"],
      aiSentimentHints: ["spatial-sequential memory", "career-extrinsic driver", "map-then-memorize pattern"],
      orbytFeatures: ["Concept map tool", "Career-linked task tags", "Memory review scheduler"],
      peerCompatibility: ["The Strategist", "The Deep Current"],
    },
  },
  {
    id: "wave_rider",
    name: "The Wave-Rider",
    rarity: "common",
    triggers: { struggle: "motivation" },
    tagline: "Rides the highs, survives the lows.",
    description: "Your motivation moves in cycles. You've stopped fighting it — now you surf it.",
    metadata: {
      studyTechniques: ["Energy-burst capture sessions", "Minimum viable daily tasks during low phases", "High-output sprint during wave peaks"],
      failureModes: ["Waiting for the wave instead of studying", "Severe output inconsistency", "Self-criticism during low phases"],
      sessionPattern: { durationMin: 40, breakMin: 15, bestWindow: "during energy peaks" },
      motivationalTriggers: ["Emotional resonance with material", "Self-compassion for troughs", "Progress in peaks"],
      aiSentimentHints: ["cyclical motivation pattern", "energy-state dependent", "self-awareness of cycles"],
      orbytFeatures: ["Energy wave tracker", "Minimum-mode for low days", "Peak session planner"],
      peerCompatibility: ["The Drifter", "The Wandering Star"],
    },
  },
  {
    id: "sprinter",
    name: "The Sprinter",
    rarity: "common",
    triggers: { struggle: "procrastination" },
    tagline: "Slow to start, fast to finish.",
    description: "The gap between intention and action is your daily battle. When you finally go, you go all in.",
    metadata: {
      studyTechniques: ["2-minute rule for starting", "Pomodoro 25/5 to lower start friction", "Environment-based triggers"],
      failureModes: ["Extended pre-study rituals", "Deadline gambling", "All-or-nothing session mentality"],
      sessionPattern: { durationMin: 60, breakMin: 10, bestWindow: "evening" },
      motivationalTriggers: ["Deadline proximity", "Environment change", "Accountability check-in"],
      aiSentimentHints: ["start-friction dominant", "high output when activated", "deadline-dependent"],
      orbytFeatures: ["Quick-start mode", "Accountability nudges", "Sprint session timer"],
      peerCompatibility: ["The Grinder", "The Velocity Kid"],
    },
  },
  {
    id: "scatterbrain",
    name: "The Scatterbrain",
    rarity: "common",
    triggers: { struggle: "focus" },
    tagline: "Everything is interesting. Focus is a choice.",
    description: "Your brain offers you everything at once. The work is learning which invitations to decline.",
    metadata: {
      studyTechniques: ["Single-tab browser rule", "Distraction capture list (park it, don't fight it)", "Pomodoro with no-interruption rule"],
      failureModes: ["Task-switching killing deep work", "Peripheral noise killing the session", "Unfinished work accumulation"],
      sessionPattern: { durationMin: 25, breakMin: 5, bestWindow: "variable" },
      motivationalTriggers: ["Novel angles on familiar material", "Engagement spikes", "Frequent progress markers"],
      aiSentimentHints: ["attention regulation primary challenge", "high curiosity high distraction", "ADHD-adjacent traits possible"],
      orbytFeatures: ["Focus mode (kill distractions)", "Short session sprints", "Distraction journal"],
      peerCompatibility: ["The Caffeinated Mind", "The Builder"],
    },
  },
  {
    id: "juggler",
    name: "The Juggler",
    rarity: "common",
    triggers: { struggle: "overwhelm" },
    tagline: "Keeps everything in the air, somehow.",
    description: "More responsibilities than any one person should carry — and you carry them anyway. The trick is not dropping the important ones.",
    metadata: {
      studyTechniques: ["Weekly priority triage", "Batching similar tasks", "Non-negotiable study blocks in calendar"],
      failureModes: ["Spreading effort too thin", "Important but non-urgent tasks never getting done", "Chronic overwhelm as background noise"],
      sessionPattern: { durationMin: 45, breakMin: 15, bestWindow: "morning" },
      motivationalTriggers: ["Checked-off lists", "Reduced cognitive load", "One clear priority at a time"],
      aiSentimentHints: ["cognitive overload pattern", "multi-obligational", "triage-skill dependent"],
      orbytFeatures: ["Priority triage tool", "Workload visibility", "Batch task planner"],
      peerCompatibility: ["The Anchor", "The Strategist"],
    },
  },
  {
    id: "overthinker",
    name: "The Overthinker",
    rarity: "common",
    triggers: { struggle: "stress" },
    tagline: "Processes everything twice, then once more.",
    description: "Your brain won't let a thought pass without full inspection. This makes you thorough — and exhausting to be.",
    metadata: {
      studyTechniques: ["Timed worry windows before studying", "Active recall to break rumination loops", "Pre-exam preparation checklists"],
      failureModes: ["Pre-exam anxiety overwhelming content knowledge", "Over-preparing minor topics", "Decision paralysis on study prioritization"],
      sessionPattern: { durationMin: 60, breakMin: 20, bestWindow: "morning (lower anxiety)" },
      motivationalTriggers: ["Preparation completeness", "Reduced uncertainty", "Known frameworks"],
      aiSentimentHints: ["anxiety-dominant", "rumination pattern", "thorough-at-cost-of-efficiency"],
      orbytFeatures: ["Pre-session worry journal", "Exam anxiety toolkit", "Preparation completeness checklist"],
      peerCompatibility: ["The Perfectionist", "The Harmonist"],
    },
  },
  {
    id: "goldfish",
    name: "The Goldfish",
    rarity: "common",
    triggers: { struggle: "memory" },
    tagline: "Learns everything. Twice.",
    description: "It's not that you don't understand — it just doesn't stick the first time. The right retrieval system changes everything.",
    metadata: {
      studyTechniques: ["Active recall over re-reading", "Spaced repetition (Anki)", "Teaching to others"],
      failureModes: ["Passive review feeling productive but failing to encode", "Cramming completely ineffective", "Confidence from recognition not recall"],
      sessionPattern: { durationMin: 45, breakMin: 10, bestWindow: "morning" },
      motivationalTriggers: ["Visible memory improvements", "Test success from active recall", "Retrieval practice streaks"],
      aiSentimentHints: ["encoding-retrieval gap", "passive review trap", "repetition-dependent memory"],
      orbytFeatures: ["Flashcard system", "Spaced repetition scheduler", "Active recall prompts"],
      peerCompatibility: ["The Sentinel", "The Deep Diver"],
    },
  },
];

// ============ MATCH ARCHETYPE ============
const matchArchetype = (answers) => {
  const rareCandidates = ARCHETYPE_CATALOG.filter(a => a.rarity === "rare");
  const commonCandidates = ARCHETYPE_CATALOG.filter(a => a.rarity === "common");

  const score = (archetype) => {
    let hits = 0, total = 0;
    for (const [key, val] of Object.entries(archetype.triggers)) {
      if (key.endsWith("2")) continue; // skip secondary keys in score (bonus only)
      total++;
      if (answers[key] === val) hits++;
    }
    return total > 0 ? hits / total : 0;
  };

  // Try rare first (need full match)
  for (const a of rareCandidates) {
    const primaryKeys = Object.entries(a.triggers).filter(([k]) => !k.endsWith("2"));
    const allMatch = primaryKeys.every(([k, v]) => answers[k] === v);
    if (allMatch) return a;
  }

  // Fall back to best common match
  let best = commonCandidates[0], bestScore = 0;
  for (const a of commonCandidates) {
    const s = score(a);
    if (s > bestScore) { bestScore = s; best = a; }
  }
  return best;
};

// ============ UPDATED buildStudyDNA ============
const buildStudyDNA = (answers) => {
  const hue = blendHue(answers);
  const archetype = matchArchetype(answers);
  const variantAdj = detectVariantAdjective(answers);

  const traitName = variantAdj
    ? `The ${variantAdj} ${archetype.name.replace("The ", "")}`
    : archetype.name;

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

  return {
    trait: traitName,
    baseArchetype: archetype,
    variantAdj,
    rarity: archetype.rarity,
    hue,
    accentHue: (hue + 70 + (archetype.rarity === "rare" ? 20 : 0)) % 360,
    peak: peakMap[answers.peak] || "Flexible Clock",
    style: styleMap[answers.style] || "Mixed Mode",
    motivation: motivationMap[answers.motivation] || "Multi-driven",
    name: answers.name || "Friend",
    tagline: archetype.tagline,
    metadata: archetype.metadata,
  };
};

Object.assign(window, {
  ARCHETYPE_CATALOG,
  matchArchetype,
  detectVariantAdjective,
  blendHue,
  buildStudyDNA,
});
