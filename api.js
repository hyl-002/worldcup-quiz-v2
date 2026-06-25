const API = {
  async getQuestions() {
    const data = await this.get("questions");
    if (!data.success) throw new Error("題庫載入失敗");
    return data.questions || [];
  },

  async getSettings() {
    try {
      const data = await this.get("settings");
      if (!data.success) return { ...CONFIG.DEFAULTS };
      return normalizeSettings(data.settings || {});
    } catch (e) {
      return { ...CONFIG.DEFAULTS };
    }
  },

  async checkBadge(badge) {
    return this.get("checkBadge", { badge });
  },

  async submitResult(payload) {
    const response = await fetch(CONFIG.API_URL, {
      method: "POST",
      body: JSON.stringify({ action: "submitResult", ...payload })
    });
    return response.json();
  },

  async get(action, params = {}) {
    const url = new URL(CONFIG.API_URL);
    url.searchParams.set("action", action);
    Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
    const response = await fetch(url.toString());
    return response.json();
  }
};

function normalizeSettings(raw) {
  const settings = { ...CONFIG.DEFAULTS };
  for (const [key, value] of Object.entries(raw)) {
    const k = key.trim();
    if (["gameTime", "popupTime", "maxAttempt", "jcInterval"].includes(k)) settings[k] = Number(value) || settings[k];
    else if (k === "showExplanation") settings[k] = String(value).toUpperCase() !== "FALSE";
    else settings[k] = value;
  }
  return settings;
}
