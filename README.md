# ICC World Cup Quiz V2

## GitHub Pages
Upload all files/folders to repository root:
- index.html
- css/
- js/
- images/
- sounds/

## Google Sheet tabs
Required:
1. Questions
2. Results
3. Settings

### Questions headers
ID | Enabled | Category | Difficulty | Question | Image | A | B | C | D | Answer | Explanation

Category: `normal` or `jc`.
Image: put filename only, e.g. `messi.jpg`, and upload the image to `/images` on GitHub.
Enabled: TRUE / FALSE.

### Results headers
Time | Badge | Score | Attempt

### Settings headers
Key | Value

Suggested settings:
EventTitle | ICC 世界杯快問快答
GameTime | 40
PopupTime | 0.8
MaxAttempt | 2
JCInterval | 5
ShowExplanation | TRUE

## Apps Script
Paste `GoogleAppsScript.gs` into Apps Script, deploy as Web App, access: Anyone.
Then update `js/config.js` API_URL if needed.
