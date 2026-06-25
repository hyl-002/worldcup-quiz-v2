function doGet(e) {
  const action = e.parameter.action;
  if (action === "questions") return getQuestions();
  if (action === "checkBadge") return checkBadge(e.parameter.badge);
  if (action === "settings") return getSettings();
  return jsonOutput({ success: false, message: "Invalid action" });
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents || "{}");
  if (data.action === "submitResult") return submitResult(data);
  return jsonOutput({ success: false, message: "Invalid action" });
}

function getQuestions() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Questions");
  const values = sheet.getDataRange().getValues();
  const headers = values.shift().map(h => String(h).trim());
  const questions = values.filter(r => r.join("") !== "").map(row => rowToObject(headers, row)).map(o => ({
    id: o.ID || o.Id || o.id || "",
    enabled: o.Enabled || "TRUE",
    category: o.Category || "normal",
    difficulty: o.Difficulty || "",
    question: o.Question || "",
    image: o.Image || "",
    options: [o.A, o.B, o.C, o.D],
    answer: o.Answer || "",
    explanation: o.Explanation || ""
  }));
  return jsonOutput({ success: true, questions });
}

function getSettings() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Settings");
  if (!sheet) return jsonOutput({ success: true, settings: {} });
  const values = sheet.getDataRange().getValues();
  values.shift();
  const settings = {};
  values.forEach(row => { if (row[0]) settings[String(row[0]).trim()] = row[1]; });
  return jsonOutput({ success: true, settings });
}

function checkBadge(badge) {
  const settings = getSettingsObject();
  const maxAttempt = Number(settings.maxAttempt || settings.MaxAttempt || 2);
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Results");
  const values = sheet.getDataRange().getValues();
  values.shift();
  const records = values.filter(row => String(row[1]) === String(badge));
  const scores = records.map(row => Number(row[2]) || 0);
  const bestScore = scores.length ? Math.max.apply(null, scores) : 0;
  return jsonOutput({
    success: true,
    badge,
    attempts: records.length,
    remainingAttempts: Math.max(0, maxAttempt - records.length),
    canPlay: records.length < maxAttempt,
    bestScore
  });
}

function submitResult(data) {
  const badge = data.badge;
  const score = Number(data.score) || 0;
  const check = JSON.parse(checkBadge(badge).getContent());
  if (!check.canPlay) return jsonOutput({ success: false, message: "此 Badge Number 已完成挑戰。", bestScore: check.bestScore });
  const attempt = check.attempts + 1;
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Results").appendRow([new Date(), badge, score, attempt]);
  return jsonOutput({ success: true, badge, score, attempt, bestScore: Math.max(check.bestScore, score) });
}

function getSettingsObject() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Settings");
  if (!sheet) return {};
  const values = sheet.getDataRange().getValues();
  values.shift();
  const obj = {};
  values.forEach(row => { if (row[0]) obj[String(row[0]).trim()] = row[1]; });
  return obj;
}

function rowToObject(headers, row) {
  const obj = {};
  headers.forEach((h, i) => obj[h] = row[i]);
  return obj;
}

function jsonOutput(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
