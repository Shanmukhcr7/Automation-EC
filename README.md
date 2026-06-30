# Telangana Registration Portal – EC Automation

This repository contains the source code for automating the retrieval of Encumbrance Certificates (EC) from the Telangana Registration Portal. 

This project was built as a submission for the Jaaga.ai Automation Engineering Internship.

Please see **[DOCUMENTATION.md](./DOCUMENTATION.md)** for the brief document explaining the overall approach, challenges encountered, assumptions made, and future improvements.

## Prerequisites
Ensure the following software is installed on your local machine:
- Node.js (v16.x or higher)
- npm (v8.x or higher)
- Playwright supported browsers (Chromium)

## Setup Instructions

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Install Playwright Browsers:**
   ```bash
   npx playwright install chromium
   ```

3. **Configure Environment:**
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   By default, PDFs will be downloaded to `./downloads` and execution will be non-headless to allow manual CAPTCHA entry.

## Execution Instructions

The execution is split into two phases to securely handle authentication without triggering anti-bot measures.

### Step 1: Session Collection (Manual Login)
Prior to automated execution, an authenticated session must be established.
```bash
npm run collect
```
1. A Chromium browser will open.
2. Manually log in to the portal and solve the initial CAPTCHA.
3. Once logged in, return to the terminal and press **ENTER**.
4. The authenticated session cookies will be saved securely to a local file.

### Step 2: Automated EC Retrieval
Once the session is saved, you can execute the core automation. 
*(Note: You can modify the target Document Number, Year, and SRO in `src/index.ts` before running).*

```bash
npm run dev
```
1. The script automatically injects your saved session.
2. It seamlessly bypasses the login screen and navigates across the portal domains.
3. It fills out the Document Search criteria.
4. **Important:** The script will pause. You must manually solve the second CAPTCHA on the search form and press **ENTER** in the terminal.
5. The automation will resume, submit the form, and download the EC PDF to your `/downloads` directory.
