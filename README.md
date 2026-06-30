# Telangana Registration Portal - EC Automation

Enterprise-grade browser automation for the Telangana Registration Portal. 
This project automates the retrieval of the Encumbrance Certificate (EC) using Playwright, TypeScript, and the Page Object Model (POM) design pattern.

## Prerequisites
- Node.js (v16+)
- npm

## Installation
```bash
npm install
npx playwright install chromium
```

## Running the Automation

**1. Collect Session (Log in manually once)**
```bash
npm run collect
```

**2. Run Automated Retrieval**
```bash
npm run dev
```

## Project Structure
- `src/browser/`: Browser and session management.
- `src/pages/`: Page Object Models representing specific portal screens.
- `src/services/`: High-level business logic orchestration (AutomationService, DownloadService).
- `src/utils/`: Common utilities (Logger, Selectors, Wait, Constants).
- `src/components/`: Reusable DOM components (Dropdown, CaptchaHandler).
- `downloads/`: Directory where retrieved EC documents are saved.
- `logs/`: Directory for runtime execution logs and error screenshots.
- `docs/`: In-depth architectural documentation.
- `DOCUMENTATION.md`: Complete project overview, challenges, and engineering decisions.

## Architecture Decisions
1. **Page Object Model (POM)**: Isolates DOM manipulation from business logic. If the portal UI changes, only the specific Page Object needs updating.
2. **Retry Mechanism**: Government portals are notoriously slow or flaky. Custom retry wrappers ensure resilience against transient network failures.
3. **Manual Handover for Security**: By design, the automation pauses for CAPTCHA/OTP resolution rather than bypassing it, adhering strictly to security policies.
4. **Clean Logging**: Detailed runtime logging for easy debugging and audit trails.
