# Engineering Documentation

This document details the technical approach, architecture, challenges, assumptions, and future scaling strategies for the Telangana Registration Portal EC Automation, addressing the Jaaga.ai evaluation criteria.

---

## 1. Overall Approach & Architecture

The primary objective was to build an enterprise-grade, highly resilient automation framework. Rather than relying on fragile web-scraping techniques or circumventing security measures, this project embraces **attended automation principles**—establishing an authenticated session securely via manual handover and orchestrating subsequent interactions programmatically.

### Technology Stack
| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment for executing the automation scripts. |
| **TypeScript** | Enforces static typing to prevent runtime errors and ensure code maintainability. |
| **Playwright** | Core automation framework for browser context management and network interception. |
| **Winston** | Structured file and console logging for execution auditing. |
| **dotenv & Zod** | Environment variable management and strict schema validation. |

### System Architecture
The system is built on a modular architecture separating orchestration, browser management, and page-specific interactions. 

```mermaid
graph TD
    A[Execution Entry / index.ts] --> B[AutomationService]
    B --> C[BrowserManager]
    B --> D[HomePage]
    B --> E[ECSearchPage]
    B --> F[ResultPage]
    C --> G[(Playwright Browser Context)]
    D --> G
    E --> G
    F --> G
    F --> H[DownloadManager]
```

### Engineering Decisions
- **Page Object Model (POM):** Decouples fragile CSS/XPath selectors from the core business logic. If the portal UI changes, modifications are localized to a single file, ensuring high maintainability.
- **Session Reuse Strategy:** Government portals deploy strict anti-bot mechanisms. Instead of utilizing unreliable OCR libraries to bypass security, this architecture splits the workflow into two phases (Session Collection and Headless Execution). This mirrors enterprise RPA strategies, guaranteeing 100% authorization success during the session lifespan.
- **Robust Error Handling:** Explicit DOM-aware timeouts, resilient retry wrappers (`Retry.ts`) for transient network failures, and download integrity verification are implemented to ensure the script fails gracefully.
- **Structured Logging:** A Winston-backed logger records all execution states to persistent files, paired with automatic screenshots on failure for post-mortem debugging.

---

## 2. Challenges Encountered & Technical Resolutions

Automating government portals presents unique challenges due to legacy infrastructure and aggressive anti-bot mechanisms. 

### A. Cross-Domain Navigation & Session Persistence
- **Challenge:** The portal segregates authentication (`registration.telangana.gov.in`) and application logic (`tgigrs.telangana.gov.in`). Direct headless navigation to the execution subdomain strips origin session cookies, resulting in immediate "Unauthorised Access" 403 errors.
- **Resolution:** The automation strictly simulates human navigation. It routes through a gateway page on the origin domain and programmatically triggers a native form POST. This leverages the browser's native capability to securely transfer the authenticated token across the domain boundary.

### B. Dynamic Autocomplete Fields
- **Challenge:** The Sub-Registrar Office (SRO) input on the EC Search form is not a standard HTML `<select>`. It is a dynamic jQuery UI autocomplete widget, causing standard `selectOption()` commands to instantly fail.
- **Resolution:** A targeted utility (`Helpers.safeFill`) was developed to simulate sequential human keystrokes, triggering the underlying jQuery keyup events necessary to populate the widget's hidden input fields.

### C. Double CAPTCHA Implementation
- **Challenge:** The portal requires CAPTCHA resolution during the initial login and again immediately prior to executing the document search.
- **Resolution:** The `CaptchaHandler` component was engineered to gracefully suspend the Node.js event loop using the `readline` module. This pauses Playwright's execution state, allowing the human operator to interface with the browser, solve the CAPTCHA, and signal the Node process to resume execution seamlessly.

### D. Asynchronous PDF Generation Latency
- **Challenge:** The server-side PDF generation can take anywhere from 1 to 30 seconds. Polling the file system for a `.crdownload` file introduces dangerous race conditions and flaky executions.
- **Resolution:** We utilized Playwright's native `waitForEvent('download')`, guaranteeing successful stream capture regardless of server latency, and immediately verifying the file integrity (checking for >0 bytes).

---

## 3. Assumptions Made

1. **User Supervision:** The system operates under an Attended Automation paradigm; a human operator is available to resolve CAPTCHAs. We assume this is preferable over relying on third-party API solving services (like 2Captcha) for this evaluation.
2. **Session Validity:** Authenticated sessions have a sufficient lifespan to complete at least one end-to-end automation cycle before the server drops the token.
3. **Environment Parity:** Node.js v16+ and Chromium are accessible in the deployment environment.

---

## 4. Limitations & Future Improvements

### Known Limitations
- **Manual CAPTCHA Verification:** Because CAPTCHAs are not bypassed, the script cannot run 100% headlessly in continuous integration without a human operator present during the execution phase.
- **Session Expiration:** The automation is bound by the server's natural expiration policy and will eventually require the user to rerun the session collector.
- **Government Portal Availability:** The automation is entirely dependent on the uptime and performance of the upstream government servers.

### Future Improvements (Scaling Strategy)
If deployed into a production Jaaga.ai environment, the following scaling enhancements would be prioritized:

1. **Batch Execution (CSV/Excel):** Develop utility parsers to read bulk processing requirements from `.csv` or `.xlsx` files, mapping hundreds of document parameters to the `ECSearchCriteria` interfaces for continuous execution.
2. **REST API Wrapper:** Expose the automation services via an Express.js or Fastify HTTP server. This allows external enterprise systems to trigger EC retrievals synchronously or asynchronously via JSON payloads.
3. **Docker Integration:** Containerize the Node.js application alongside the Playwright Chromium binaries to guarantee environmental parity across deployment clusters.
4. **Background Worker Queues:** Integrate a message broker (e.g., BullMQ with Redis) to queue thousands of incoming retrieval requests and process them continuously in the background without overwhelming server memory.
5. **Monitoring & Metrics:** Expose a `/metrics` endpoint for Prometheus scraping, allowing DevOps teams to visualize the automation cluster's health and latency via real-time Grafana dashboards.
