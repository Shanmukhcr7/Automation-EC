# Challenges Encountered & Technical Resolutions

Automating government portals presents unique challenges due to legacy infrastructure, aggressive anti-bot mechanisms, and non-standard DOM implementations. This document outlines the primary technical hurdles and their respective resolutions.

## 1. Cross-Domain Navigation & Session Persistence
**The Challenge:** 
The portal segregates authentication and execution across two distinct subdomains (`registration.telangana.gov.in` and `tgigrs.telangana.gov.in`). Standard headless navigation directly to the execution subdomain strips the origin session cookies, resulting in immediate "Unauthorised Access" HTTP 403 errors.

**The Resolution:**
We implemented a strict sequential navigation flow that mirrors human behavior. The automation navigates to a gateway page on the origin domain and programmatically triggers a native form POST. This leverages the browser's native capability to securely transfer the authenticated token across the domain boundary.

**Rejected Approach:** Manually extracting the `JSESSIONID` cookie and attempting to inject it into the target domain headers. This was rejected because the portal utilizes server-side origin validation, which rejects cross-domain cookie injection.

## 2. Dynamic DOM & Autocomplete Fields
**The Challenge:**
The Sub-Registrar Office (SRO) input on the EC Search Form is not a standard HTML `<select>` element. It is a dynamic jQuery UI autocomplete widget. Standard `element.selectOption()` commands instantly fail.

**The Resolution:**
We developed a targeted utility within `Helpers.ts` to simulate human keystrokes. The `safeFill` method was adapted to focus the element, type the string sequentially, and trigger the underlying jQuery keyup events necessary to populate the hidden input fields associated with the widget.

## 3. Double CAPTCHA Implementation
**The Challenge:**
The portal requires CAPTCHA resolution during the initial login and again immediately prior to executing the document search.

**The Resolution:**
The `CaptchaHandler` component was engineered to gracefully suspend the Node.js event loop using the `readline` module. This pauses Playwright's execution state, allowing the human operator to interface with the browser instance, solve the CAPTCHA, and signal the Node process to resume execution seamlessly.

## 4. Asynchronous Download Handling
**The Challenge:**
Government portals often suffer from high latency. Clicking the download button initiates a server-side PDF generation process that can take anywhere from 1 to 30 seconds. Relying on fixed timeouts or polling the file system for a `.crdownload` file introduces race conditions and flaky tests.

**The Resolution:**
We utilized Playwright's native event listener `page.waitForEvent('download')`. This creates a localized promise that perfectly aligns with the browser's internal download stream, guaranteeing successful capture regardless of server latency, and immediately verifies file integrity (checking for >0 bytes).

## 5. Destructive Session Invalidation
**The Challenge:**
During initial testing, executing the automation with a valid session unexpectedly redirected to the login wall.

**The Resolution:**
Network analysis revealed that navigating to the portal's naked root (`/`) while authenticated forces the server to issue a new anonymous `JSESSIONID`, effectively destroying the user's session. The orchestration layer was refactored to specifically target deep links, bypassing the homepage entirely and preserving session integrity.
