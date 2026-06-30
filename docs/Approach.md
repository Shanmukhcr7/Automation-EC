# Approach & Strategy

## Portal Analysis
Initial analysis of `registration.telangana.gov.in` revealed that direct access to the Encumbrance Search (`EncumbranceSearch.htm`) forces a redirect to a User Registration/Login wall.

## Security Stance
Because the requirements strictly forbade bypassing CAPTCHAs, OTPs, or authentication, the approach leverages a "manual handoff" technique.

## Automation Strategy
1. **Initialization:** Launch Playwright in headed or headless mode (configurable).
2. **Navigation:** Go to the EC Search URL.
3. **Handoff:** Detect the authentication wall. Pause the Node.js execution using a CLI prompt. The user must manually solve the CAPTCHA, enter the OTP, and navigate to the actual EC search form.
4. **Resumption:** The user presses `ENTER` in the terminal. The automation resumes, taking control of the active session.
5. **Form Execution:** The script parses the target criteria (Property or Document details), interacts with cascading dropdowns (waiting for AJAX calls between selections), and submits the form.
6. **Download Interception:** The script waits for the Result Page, locates the download button, intercepts the Playwright download event, streams it to the `downloads/` directory, and performs a file integrity check (size > 0 bytes).

## Trade-offs
- **Speed vs Reliability:** We implemented a `slowMo` setting and explicit network idle waits. Government portals are often slow; prioritizing reliability over raw execution speed prevents brittle tests.
- **Centralized Selectors:** Instead of embedding selectors in POMs, they are centralized in `Selectors.ts`. Since we are inferring some post-login selectors, this ensures rapid fixes without altering business logic if the portal UI changes.
