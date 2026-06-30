# Challenges

Building automation for the Telangana Registration Portal involves several systemic challenges typical of government infrastructure:

## 1. Authentication Walls
**Challenge:** The EC search is placed behind a strict Login/OTP/CAPTCHA wall.
**Solution:** A CLI-based manual intervention pause (`CaptchaHandler`) allows the operator to authenticate natively in the browser before handing control back to the script.

## 2. Dynamic Cascading Dropdowns
**Challenge:** Selecting a "District" triggers an AJAX request to populate "SRO" (Sub-Registrar Office), which then populates "Village". Native Playwright `fill` or `selectOption` can fail if the DOM hasn't updated.
**Solution:** The `Dropdown` component explicitly waits for network idle and uses retry logic to ensure the DOM is stable before proceeding.

## 3. Selector Volatility
**Challenge:** UI structures in these portals can change without notice.
**Solution:** Centralized `Selectors.ts`.

## 4. Slow Server Responses (Timeouts)
**Challenge:** Portal servers often hang or drop connections during peak hours.
**Solution:** Configurable global timeouts (defaulting to 60s), coupled with exponential backoff retry mechanisms (`Retry.execute`) for critical navigation steps.

## 5. Download Management
**Challenge:** Popups or unexpected headers can disrupt standard file downloads.
**Solution:** We intercept the Playwright `download` event natively, which bypasses UI-level popup blockers, streams the file directly to disk, and immediately verifies file integrity.
