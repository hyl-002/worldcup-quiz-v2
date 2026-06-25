const App = {
  settings: CONFIG.DEFAULTS,
  questions: [],
  badgeInfo: null,

  async init() {
    UI.init();
    UI.el.challengeBtn.onclick = () => this.prepare();
    UI.el.startGameBtn.onclick = () => this.startGame();
    UI.el.restartBtn.onclick = () => window.location.reload();
    UI.showScreen("landingScreen");
    try {
      this.settings = await API.getSettings();
      UI.applySettings(this.settings);
    } catch (e) {}
  },

  async prepare() {
    const badge = UI.el.badgeInput.value.trim();
    if (!badge) {
      UI.setLandingMessage("請先輸入 Badge Number。 ");
      return;
    }

    UI.showScreen("loadingScreen");
    try {
      const [settings, questions, badgeInfo] = await Promise.all([
        API.getSettings(),
        API.getQuestions(),
        API.checkBadge(badge)
      ]);

      this.settings = settings;
      this.questions = questions;
      this.badgeInfo = badgeInfo;

      if (!badgeInfo.canPlay) {
        UI.showScreen("landingScreen");
        UI.setLandingMessage(`此 Badge Number 已完成 ${settings.maxAttempt} 次挑戰。最高分：${badgeInfo.bestScore} 分。`);
        return;
      }

      if (!questions.length) {
        UI.showScreen("landingScreen");
        UI.setLandingMessage("題庫沒有可用題目，請檢查 Google Sheet。 ");
        return;
      }

      UI.showScreen("landingScreen");
      UI.showRules(badgeInfo, settings);
    } catch (e) {
      UI.showScreen("landingScreen");
      UI.setLandingMessage("暫時未能連接伺服器，請稍後再試。 ");
      console.error(e);
    }
  },

  startGame() {
    UI.hideRules();
    Game.start({ badge: UI.el.badgeInput.value.trim(), questions: this.questions, settings: this.settings });
  }
};

document.addEventListener("DOMContentLoaded", () => App.init());
