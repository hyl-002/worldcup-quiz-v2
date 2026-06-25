const UI = {
  el: {},

  init() {
    [
      "landingScreen","loadingScreen","gameScreen","endScreen","badgeInput","challengeBtn","startGameBtn","restartBtn",
      "rulesPopup","resultPopup","scoreText","timeText","timeBar","questionNo","questionText","questionImage",
      "optionsBox","categoryTag","finalBadge","finalScore","finalStreak","submitMessage","resultTitle",
      "correctAnswerText","explanationText","eventTitle","attemptInfo","ruleGameTime","ruleMaxAttempt","landingMessage"
    ].forEach(id => this.el[id] = document.getElementById(id));
  },

  showScreen(name) {
    ["landingScreen","loadingScreen","gameScreen","endScreen"].forEach(id => this.el[id].classList.remove("active"));
    this.el[name].classList.add("active");
  },

  applySettings(settings) {
    this.el.eventTitle.textContent = settings.eventTitle || CONFIG.DEFAULTS.eventTitle;
    this.el.ruleGameTime.textContent = settings.gameTime;
    this.el.ruleMaxAttempt.textContent = settings.maxAttempt;
  },

  showRules(info, settings) {
    this.el.attemptInfo.textContent = `你尚餘 ${info.remainingAttempts} 次挑戰機會。`;
    this.applySettings(settings);
    this.el.rulesPopup.classList.remove("hidden");
  },

  hideRules() { this.el.rulesPopup.classList.add("hidden"); },

  renderQuestion(q, number) {
    this.el.questionNo.textContent = number;
    this.el.questionText.textContent = q.question;
    this.el.categoryTag.innerHTML = q.category === "jc" ? '<span class="category-tag">足智彩</span>' : "";

    if (q.image) {
      const src = q.image.includes("/") || q.image.startsWith("http") ? q.image : CONFIG.IMAGE_BASE + q.image;
      this.el.questionImage.src = src;
      this.el.questionImage.classList.remove("hidden");
      this.el.questionImage.onerror = () => this.el.questionImage.classList.add("hidden");
    } else {
      this.el.questionImage.src = "";
      this.el.questionImage.classList.add("hidden");
    }

    this.el.optionsBox.innerHTML = "";
    q.options.forEach((option, index) => {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.textContent = `${String.fromCharCode(65 + index)}. ${option}`;
      btn.onclick = () => Game.answer(index);
      this.el.optionsBox.appendChild(btn);
    });
  },

  updateScore(score) { this.el.scoreText.textContent = score; },

  updateTime(left, total) {
    this.el.timeText.textContent = left.toFixed(1);
    this.el.timeBar.style.width = `${Math.max(0, left / total * 100)}%`;
    this.el.timeText.parentElement.classList.toggle("danger", left <= 10);
  },

  showResult({ correct, answerText, explanation }, settings) {
    const box = this.el.resultPopup.querySelector(".modal-box");
    box.classList.toggle("goal", correct);
    box.classList.toggle("miss", !correct);
    this.el.resultTitle.className = correct ? "goal-title" : "miss-title";
    this.el.resultTitle.textContent = correct ? "✅ GOAL! 答對！" : "❌ MISS! 答錯！";
    this.el.correctAnswerText.textContent = answerText;

    if (settings.showExplanation && explanation) {
      this.el.explanationText.textContent = explanation;
      this.el.explanationText.classList.remove("hidden");
    } else {
      this.el.explanationText.classList.add("hidden");
    }

    this.el.resultPopup.classList.remove("hidden");
  },

  hideResult() { this.el.resultPopup.classList.add("hidden"); },

  showEnd(state) {
    this.el.finalBadge.textContent = state.badge;
    this.el.finalScore.textContent = state.score;
    this.el.finalStreak.textContent = state.bestStreak;
    this.el.submitMessage.textContent = "正在提交成績...";
    this.showScreen("endScreen");
  },

  setSubmitMessage(text) { this.el.submitMessage.textContent = text; },

  setLandingMessage(text) { this.el.landingMessage.textContent = text; }
};
