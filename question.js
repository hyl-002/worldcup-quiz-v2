const QuestionEngine = {
  normalPool: [],
  jcPool: [],
  count: 0,
  settings: CONFIG.DEFAULTS,

  init(questions, settings) {
    this.settings = settings;
    this.count = 0;
    const enabled = questions.filter(q => String(q.enabled ?? "TRUE").toUpperCase() !== "FALSE");
    this.normalPool = shuffle(enabled.filter(q => normalizeCategory(q.category) !== "jc"));
    this.jcPool = shuffle(enabled.filter(q => normalizeCategory(q.category) === "jc"));
  },

  next() {
    this.count += 1;
    const shouldUseJC = this.settings.jcInterval > 0 && this.count % this.settings.jcInterval === 0;
    let q = null;
    if (shouldUseJC && this.jcPool.length) q = this.jcPool.pop();
    else if (this.normalPool.length) q = this.normalPool.pop();
    else if (this.jcPool.length) q = this.jcPool.pop();
    return q ? normalizeQuestion(q) : null;
  }
};

function normalizeQuestion(q) {
  return {
    id: q.id || q.ID || "",
    question: q.question || q.Question || "",
    options: q.options || [q.A || q.a, q.B || q.b, q.C || q.c, q.D || q.d].filter(Boolean),
    answer: String(q.answer || q.Answer || "").trim().toUpperCase(),
    image: String(q.image || q.Image || "").trim(),
    category: normalizeCategory(q.category || q.Category || "normal"),
    explanation: q.explanation || q.Explanation || ""
  };
}

function normalizeCategory(value) {
  const v = String(value || "normal").trim().toLowerCase();
  return ["jc", "足智彩"].includes(v) ? "jc" : "normal";
}

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
