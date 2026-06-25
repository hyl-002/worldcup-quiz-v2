const Game = {
  settings: CONFIG.DEFAULTS,
  badge: "",
  score: 0,
  streak: 0,
  bestStreak: 0,
  timeLeft: 40,
  timer: null,
  paused: false,
  ended: false,
  current: null,

  async start({ badge, questions, settings }) {
    this.settings = settings;
    this.badge = badge;
    this.score = 0;
    this.streak = 0;
    this.bestStreak = 0;
    this.timeLeft = settings.gameTime;
    this.paused = false;
    this.ended = false;
    this.current = null;

    QuestionEngine.init(questions, settings);
    UI.updateScore(0);
    UI.updateTime(this.timeLeft, settings.gameTime);
    UI.showScreen("gameScreen");
    this.nextQuestion();

    this.timer = setInterval(() => {
      if (this.paused || this.ended) return;
      this.timeLeft = Math.max(0, this.timeLeft - 0.1);
      UI.updateTime(this.timeLeft, this.settings.gameTime);
      if (this.timeLeft <= 0) this.end();
    }, 100);
  },

  nextQuestion() {
    this.current = QuestionEngine.next();
    if (!this.current) return this.end();
    UI.renderQuestion(this.current, QuestionEngine.count);
  },

  answer(index) {
    if (this.paused || this.ended || !this.current) return;
    this.paused = true;
    const selected = String.fromCharCode(65 + index);
    const correct = selected === this.current.answer;
    if (correct) {
      this.score += 1;
      this.streak += 1;
      this.bestStreak = Math.max(this.bestStreak, this.streak);
    } else {
      this.streak = 0;
    }
    UI.updateScore(this.score);
    const answerIndex = this.current.answer.charCodeAt(0) - 65;
    UI.showResult({
      correct,
      answerText: this.current.options[answerIndex] || this.current.answer,
      explanation: this.current.explanation
    }, this.settings);

    setTimeout(() => {
      UI.hideResult();
      if (this.timeLeft <= 0) this.end();
      else {
        this.paused = false;
        this.nextQuestion();
      }
    }, this.settings.popupTime * 1000);
  },

  async end() {
    if (this.ended) return;
    this.ended = true;
    clearInterval(this.timer);
    UI.showEnd({ badge: this.badge, score: this.score, bestStreak: this.bestStreak });
    try {
      const result = await API.submitResult({ badge: this.badge, score: this.score });
      if (result.success) UI.setSubmitMessage(`成績已提交。本次為第 ${result.attempt} 次挑戰。最高分：${result.bestScore} 分`);
      else UI.setSubmitMessage(result.message || "成績未能提交，請聯絡工作人員。 ");
    } catch (e) {
      UI.setSubmitMessage("成績提交失敗，請截圖保留成績。 ");
    }
  }
};
