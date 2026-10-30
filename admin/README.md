# BMC GitHub-native calendar admin

**Purpose:** Culley can add, reschedule, copy, and remove performances; upload or reuse band photographs; publish calendar announcements; and mark closed days. No Cloudflare backend or additional GitHub identity is required.

## Publishing architecture

- Public editor page: \`https://shows.balconymusicclub.com/admin/\` once the default branch is published to GitHub Pages. This URL is public; **publishing access is NOT granted by visiting it**.
- Canonical writable data: \`floydclaptonblues/UpcomingShows\` → \`shows.json\`.
- Band pictures: \`assets/artists/admin/\` in the same repository.
- Readers: BMC Upcoming Shows reads \`shows.json\`; BMC Homepage and Live Stream already consume it. The BMC PWA needs its companion read-through integration from pull request in \`Balcony-Music-Club-PWA\` before its schedule automatically follows new updates.
- Sierra's independent admin is in \`SierraGreen/admin/\` and writes only \`SierraGreen/shows.json\`. One existing GitHub account can issue a token scoped to **only these two selected repositories**.

## One-time setup on Culley's device

1. On **your own GitHub account**, create a **fine-grained personal access token**, select only the \`UpcomingShows\` repository (or also \`SierraGreen\` if you want to use one token for both), and set **Repository permissions → Contents → Read and write**. Do not grant additional scopes. Use an expiration date. This token can update all files in the selected repositories, **not just calendar files**; GitHub doesn't offer per-file Contents write scope on the static API.
2. Open the BMC admin page over **HTTPS** in a trusted browser. Enter the token and choose a unique, strong passphrase of at least 14 characters.
3. The page derives a local AES-256-GCM key from the passphrase with PBKDF2-SHA-256 (600,000 iterations), generates random salt/IV, encrypts the token, and stores **only the ciphertext** in that browser's localStorage. The plaintext token is held only in the active tab's JavaScript memory while unlocked; Lock removes that reference. No GitHub token, encrypted token, or passphrase is committed to this repository.
4. Next visits on the same device require the passphrase to decrypt the credential. To switch token or revoke access, use **Reset stored token** in the editor, and revoke the original token at GitHub. Clearing site data also removes the encrypted credential.
5. Enter or edit shows and press **Save and publish**. GitHub receives a repository commit with the updated JSON. If somebody else changed \`shows.json\` since you loaded it, its GitHub blob SHA prevents a silent overwrite; reload and apply the intended edit again.
6. To add a photo, choose the artist on the form, upload a JPEG/PNG/WebP (max 2 MB), then save the show. Images are added as uniquely named repository files. Optional "use this photo for all scheduled shows by the same artist" updates that artist's other events in the same calendar.

**Important security limitations:** This is a client-side convenience lock, **not a private server-side login or independent Culley identity**. Anyone who obtains the encrypted data *and* passphrase can decrypt and use the token; a malicious browser extension or malicious script served from this origin while unlocked could steal it. Publishing will appear in GitHub history under the token's account. A token with Contents write to the selected repo can change **any path in that repo**, including site code, irrespective of the intended admin interface. Use a trusted device, short token expiry and strong passphrase. To enforce separate user identities and server-side authorization later, use GitHub OAuth with a trusted backend or Cloudflare Access. **Never use the main account password in this form.**

## Functional contract

- BMC: existing \`shows.json\` metadata/day lists/show objects are preserved; additions use \`isoDate\` (so January in another year works), \`date\`, \`shows\`, \`closed\`, and \`notice\`. Event start/end times must be on the same day. The website reads exact artist names and explicit photo paths.
- The editor **does not invent ending times**. Existing 2.5-hour show slots were inherited from the source schedule and are not confirmed performance durations; new edits require the editor to enter an ending time.
- A closure may only be entered if all shows for that day have been rescheduled or removed. It publishes a closure notice rather than a fake band.
- Public calendar/homepage/livestream readers use the existing \`shows.json\`; the companion PWA change fetches that same file with its hardcoded historical schedule as the network-failure fallback.
- Original site, past schedules and Git history remain intact. No code changes are required for routine additions or cancellations **after** companion readers are deployed.

## Verification

\`node --check admin/admin.js\`, \`node --check script.js\`, and \`node tests/verify-admin.mjs\`. CI checks syntax, basic JSON schema/uniqueness, token-handling boundaries and page wiring. **CI cannot validate actual GitHub token scope, credential encryption in a real browser, Cloudflare-free Pages publication, picture uploads or mobile behavior.** Those require an authorized editor to set up a short-lived token and complete a real publish/revert test.

There is no runtime cloud service, D1 database, R2 bucket, or separate GitHub account in this implementation.
