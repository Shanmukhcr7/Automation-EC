# Engineering Approach & Methodology

## Portal Analysis & Research Process
Before writing automation logic, a systematic analysis of the Telangana Registration Portal was conducted to map its underlying behaviors. This phase involved:
1. **Network Analysis:** Inspecting XHR/Fetch requests using Chrome DevTools to identify form submission payloads, session identifiers (`JSESSIONID`), and cross-domain tracking tokens.
2. **DOM Inspection:** Mapping static IDs, dynamic class injections, and identifying non-standard HTML elements (e.g., jQuery UI autocomplete fields).
3. **Security Auditing:** Recognizing the implementation of server-side SHA512 hashing combined with dynamic salts during login, and the deployment of double CAPTCHAs across the authentication and execution workflows.

## Automation Strategy
The primary automation strategy relies on **Attended Automation** with **Session State Persistence**.
Rather than attempting to bypass complex security measures (which leads to fragile deployments and violates acceptable use policies), the strategy shifts the authentication burden to a controlled manual step. Once authenticated, the automation leverages Playwright's native `storageState` to serialize the session context, allowing subsequent headless executions to run purely programmatically.

## Design Decisions

### Why Playwright?
Playwright was chosen over Selenium or Puppeteer due to its architectural superiority for modern web applications:
- **Native Contexts:** Allows rapid injection of authenticated cookies without requiring full browser restarts.
- **Auto-Waiting:** Dramatically reduces the need for explicit `Thread.sleep()` or brittle custom wait functions.
- **Download Interception:** Provides a native, stream-based API for capturing downloads, preventing file-system race conditions inherent in older frameworks.

### Why Page Object Model (POM)?
Government portals frequently undergo UI changes. By encapsulating DOM selectors within specific Page Objects, we isolate the business logic. If an input field ID changes, the fix requires a single line modification in `Selectors.ts` or the respective Page Object, rather than a systemic rewrite.

### Why Session Reuse?
Attempting to utilize OCR libraries (like Tesseract) to solve portal CAPTCHAs natively introduces unacceptable failure rates in production environments. Reusing an authenticated session guarantees 100% authorization success during the session's lifespan, enabling high-throughput bulk processing.

## Alternatives Considered
- **Direct HTTP API Requests:** We explored bypassing the browser entirely by sending raw HTTP POST requests. *Rejected* because the portal utilizes complex, obfuscated JavaScript to generate dynamic request payloads and tokens, making raw API emulation prohibitively difficult to maintain.
- **Fully Headless with OCR:** We evaluated integrating a local OCR library to solve CAPTCHAs. *Rejected* due to low confidence scores caused by the portal's intentionally noisy CAPTCHA images, which would result in unacceptable error rates for an enterprise-grade solution.
