# Architecture

This project follows **Clean Architecture** principles and the **Page Object Model (POM)**.

## Core Principles
1. **Separation of Concerns:** Business logic (orchestration) is separated from interaction logic (browser manipulation).
2. **Robustness:** Built-in retry mechanisms, explicit waits, and configurable timeouts.
3. **Security Compliance:** CAPTCHAs and OTPs are explicitly handled via manual intervention pauses rather than bypassed.

## Module Responsibilities

### 1. `config/`
Provides strongly-typed, Zod-validated configuration ensuring the application fails fast if misconfigured.

### 2. `browser/BrowserManager.ts`
Encapsulates the Playwright lifecycle. It initializes contexts with specific configurations (like ignoring HTTPS errors common in government portals).

### 3. `pages/`
Page Object Models encapsulating specific DOM interactions for specific pages.
- `HomePage.ts`: Navigation entry.
- `ECSearchPage.ts`: Form manipulation for Encumbrance Certificate search.
- `ResultPage.ts`: Result table manipulation and download triggering.

### 4. `components/`
Reusable UI components or functional modules.
- `Dropdown.ts`: Handles dynamically populated dropdowns with retry/wait logic.
- `CaptchaHandler.ts`: Halts Node execution for manual CAPTCHA/OTP resolution.
- `DownloadManager.ts`: Intercepts and validates browser downloads.

### 5. `services/`
Orchestrators that wire up BrowserManager and Page Objects to execute workflows (e.g., `AutomationService.ts`).

### 6. `utils/`
Stateless helpers.
- `Selectors.ts`: Centralized CSS selectors dictionary.
- `Wait.ts`, `Retry.ts`, `Helpers.ts`: Fault tolerance mechanisms.
- `Logger.ts`: Enterprise logging using Winston.
