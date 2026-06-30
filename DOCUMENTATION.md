# Engineering Documentation

This document explains the technical approach, challenges, assumptions, and future improvements for the Telangana Registration Portal EC Automation, as requested in the Jaaga.ai evaluation criteria.

## 1. Overall Approach
The primary objective was to build an enterprise-grade, highly resilient automation framework. Rather than relying on fragile web-scraping or HTTP request forgery, the project adopts a **Page Object Model (POM)** architecture utilizing **TypeScript** and **Playwright**.

### Session Reuse Strategy
Government portals deploy strict anti-bot mechanisms, including dynamically salted hashes and complex CAPTCHAs. Instead of utilizing unreliable OCR libraries to bypass security, this architecture splits the workflow into two phases:
1. **Attended Session Collection:** A human operator logs in manually and solves the initial authorization gate. The authenticated session is serialized and saved locally.
2. **Headless/Automated Execution:** The core automation script injects this serialized session. This mirrors enterprise RPA strategies, guaranteeing 100% authorization success during the session lifespan and allowing high-throughput processing without hardcoding credentials in the source code.

### Code Quality & Maintainability
- **Page Object Model:** DOM selectors are strictly isolated from business logic. If the portal UI changes, modifications are localized to a single file.
- **Robust Error Handling:** Explicit DOM-aware timeouts, resilient retry wrappers (`Retry.ts`) for transient network failures, and download integrity verification (checking for >0 bytes) are implemented to ensure the script fails gracefully.
- **Structured Logging:** A Winston-backed logger records all execution states, timeouts, and network errors to persistent files, paired with automatic screenshots on failure for post-mortem debugging.

## 2. Challenges Encountered

### Cross-Domain Navigation & Session Persistence
- **Challenge:** The portal segregates authentication (`registration.telangana.gov.in`) and application logic (`tgigrs.telangana.gov.in`). Direct headless navigation to the execution subdomain immediately strips the origin session cookies, resulting in "Unauthorised Access" 403 errors.
- **Resolution:** The automation simulates human navigation. It routes through a gateway page on the origin domain and programmatically triggers a native form POST. This leverages the browser's native capability to securely transfer the authenticated token across the domain boundary.

### Dynamic Autocomplete Fields
- **Challenge:** The Sub-Registrar Office (SRO) input is not a standard HTML `<select>`. It is a dynamic jQuery UI autocomplete widget, causing standard `selectOption()` commands to fail.
- **Resolution:** A targeted utility (`Helpers.safeFill`) was developed to simulate sequential human keystrokes, triggering the underlying jQuery keyup events necessary to populate the widget's hidden input fields.

### Asynchronous PDF Generation Latency
- **Challenge:** The server-side PDF generation can take anywhere from 1 to 30 seconds. Polling the file system for a `.crdownload` file introduces dangerous race conditions.
- **Resolution:** We utilized Playwright's native `waitForEvent('download')`, guaranteeing successful stream capture regardless of server latency.

## 3. Assumptions Made
1. **User Supervision:** The system operates under an Attended Automation paradigm; a human operator is available to resolve CAPTCHAs. We assume this is acceptable over using third-party API solving services (like 2Captcha) for this evaluation.
2. **Session Validity:** Authenticated sessions have a sufficient lifespan to complete at least one end-to-end automation cycle before the server drops the token.
3. **Environment:** Node.js v16+ and Chromium are accessible in the execution environment.

## 4. Limitations & Future Improvements

### Known Limitations
- **Manual CAPTCHA Verification:** The script cannot run 100% headlessly in a continuous integration environment without a human operator present to solve the search form CAPTCHA.
- **Session Expiration:** The automation is bound by the server's natural expiration policy and will eventually require the user to rerun the session collector.

### Future Improvements (Scaling Strategy)
If deployed into a production Jaaga.ai environment, the following scaling enhancements would be prioritized:
1. **Batch Execution (CSV/Excel):** Implement utility parsers to read bulk processing requirements from `.csv` files, executing hundreds of EC retrievals concurrently within a single authenticated session loop.
2. **REST API Wrapper:** Expose the automation services via an Express.js server, allowing external enterprise systems to trigger EC retrievals synchronously via JSON payloads.
3. **Docker Integration:** Containerize the Node.js application alongside Playwright Chromium binaries to guarantee environmental parity across deployment clusters.
4. **Background Worker Queues:** Integrate a message broker (e.g., BullMQ with Redis) to queue thousands of incoming retrieval requests and process them continuously in the background without overwhelming server memory.
