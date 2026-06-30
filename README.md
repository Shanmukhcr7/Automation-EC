# Telangana Registration Portal - EC Automation

This project automates the retrieval of Encumbrance Certificates (EC) from the Telangana Registration Portal. 
It features a robust, two-phase execution model that persists authenticated sessions to bypass login walls and handle cross-domain government security protocols.

Please refer to **[DOCUMENTATION.md](./DOCUMENTATION.md)** for a detailed explanation of the architecture, approach, challenges, and assumptions.

## Quick Start

### 1. Install Dependencies
```bash
npm install
npx playwright install chromium
```

### 2. Collect Session (Phase 1)
Run the collector to log in manually and save your session cookies.
```bash
npm run collect
```
*A browser will open. Log in, solve the CAPTCHA, and press ENTER in the terminal.*

### 3. Run Automation (Phase 2)
Edit `src/index.ts` to set your desired `searchCriteria` (Document Number, Year, SRO).
```bash
npm run dev
```
*The script will inject your session, bypass the login, navigate cross-domain, fill the form, and download the EC.*
- `src/browser/`: Playwright lifecycle management.
- `src/components/`: Reusable UI components (Dropdowns, CaptchaHandler).
- `src/pages/`: Page Object Models (HomePage, ECSearchPage).
- `src/services/`: Core orchestration logic.

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```
2. Install Playwright browsers:
   ```bash
   npx playwright install chromium
   ```

## Configuration

Copy the example environment file:
```bash
cp .env.example .env
```

Available configurations:
- `HEADLESS`: `true` or `false` (Must be `false` if manual CAPTCHA solving is required).
- `TIMEOUT`: Global timeout in milliseconds (e.g., `60000`).
- `DOWNLOAD_PATH`: Relative or absolute path for storing PDFs.
- `LOG_LEVEL`: Winston log level (`info`, `debug`, `error`).

## Running Locally

Execute the development script:
```bash
npm run dev
```

The script will launch a browser, navigate to the portal, and pause in the terminal prompting you to complete the login/CAPTCHA manually. Once you press ENTER, it will assume control and complete the EC extraction.

## Documentation
Please refer to the `docs/` directory for detailed explanations of the Architecture, Approach, Challenges, and Future Improvements.
