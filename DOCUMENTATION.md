# Telangana Registration Portal - EC Automation

This project automates the retrieval of Encumbrance Certificates (EC) from the Telangana Registration Portal using Node.js, TypeScript, and Playwright.

## Architecture & Approach

This project is built using the **Page Object Model (POM)** design pattern to ensure maintainability, separation of concerns, and robust error handling. The architecture mimics enterprise-grade RPA (Robotic Process Automation) deployments.

### 1. Two-Phase Automation (Session Injection)
Government portals often implement strict anti-bot measures, including complex CAPTCHAs, dynamic DOMs, and session tokens. 
Instead of fighting the CAPTCHA with unreliable OCR (which fails in production), this architecture splits the workflow into two phases:
- **Phase 1: Session Collector (`npm run collect`)**: A dedicated script that allows the user to manually log in once and solve the CAPTCHA. The authenticated session (cookies) is serialized and saved locally (`session.json`).
- **Phase 2: Headless Automation (`npm run dev`)**: The main script injects the saved session cookies into the browser context. This allows the script to completely bypass the login wall and run fully automated.

### 2. Cross-Domain Session Handover
A major challenge discovered during development was the portal's use of two distinct subdomains:
- Login & Dashboard: `registration.telangana.gov.in`
- EC Search Form: `tgigrs.telangana.gov.in`
Directly navigating to the EC Search Form after injecting cookies results in an "Unauthorised Access" error because the session cookie is bound to the first domain. The automation solves this by navigating to the EC Intro page on the `registration` domain and programmatically clicking the "Submit" button, which executes the portal's native cross-domain POST request to securely transfer the token to `tgigrs`.

### 3. Page Object Model (POM)
- `HomePage.ts`: Handles session validation and cross-domain navigation.
- `ECSearchPage.ts`: Manages form filling, interacting with complex UI elements (like autocomplete dropdowns), and handling the secondary CAPTCHA on the search form.
- `ResultPage.ts`: Intercepts the PDF download and handles negative paths (e.g., "No records found").

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Initialize Browsers**
   ```bash
   npx playwright install chromium
   ```

## Execution Instructions

**Step 1: Collect Session (Run Once)**
Run the collector to log in manually and save your session cookies.
```bash
npm run collect
```
*Note: A browser will open. Log in, solve the CAPTCHA, and press ENTER in the terminal.*

**Step 2: Run Automation**
Edit the `searchCriteria` in `src/index.ts` to include the specific Document Number, Year, and SRO you wish to search for. Then run:
```bash
npm run dev
```

The script will:
1. Inject your saved session.
2. Navigate to the EC Search page (bypassing login).
3. Fill out the search criteria automatically.
4. Pause for you to solve the search-page CAPTCHA.
5. Download the final EC document to the `downloads/` directory.

## Assumptions Made
1. **Manual CAPTCHA Solving is Acceptable**: Given the instruction to build a robust solution, relying on external OCR libraries (like Tesseract) for complex, noisy government CAPTCHAs introduces a high point of failure. The assumption is that in a real enterprise environment, either an API-based solver (like 2Captcha) is used, or the system utilizes Attended Automation (manual login once per day).
2. **Session Lifespan**: It is assumed the session cookies remain valid for a reasonable duration (e.g., 20-30 minutes) before the server invalidates them, allowing for bulk processing of multiple ECs in a single run.

## Challenges Encountered
1. **Double CAPTCHA**: The portal requires solving a CAPTCHA not only on the login page but also on the specific EC search form. We implemented a `CaptchaHandler` utility to gracefully pause Node execution using `readline` prompts at both interaction points.
2. **Autocomplete SRO Field**: The SRO (Sub-Registrar Office) field on the Document Search form is not a standard `<select>` dropdown, but rather a jQuery UI autocomplete text input. The `Helpers.safeFill` utility was adapted to type directly into this field.
3. **Strict Session Invalidation**: If a logged-in session attempts to navigate back to the public homepage (`/`), the server immediately drops the session and issues a new anonymous `JSESSIONID`. The navigation flow was carefully routed to avoid the homepage entirely after authentication.

## Limitations & Future Improvements
1. **Fully Headless CAPTCHA**: Integrating a third-party CAPTCHA solving service API (e.g., AntiCaptcha or 2Captcha) would completely eliminate the need for manual intervention, making the script 100% headless.
2. **Data-Driven Execution**: Modifying `index.ts` to read an Excel (`.xlsx`) or CSV file containing hundreds of document numbers, looping through them, and downloading all ECs in bulk using a single session.
3. **Advanced Error Recovery**: Implementing automatic session-refresh logic. If the script detects a timeout or an "Unauthorized" error mid-execution, it could automatically pause and prompt the user to re-authenticate before resuming from where it left off.
