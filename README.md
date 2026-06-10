# Balcony Music Club Upcoming Shows

Mobile-first, GitHub Pages-ready version of the Balcony Music Club “Upcoming Shows” page.

## Files

- `index.html` — the live page.
- `styles.css` — the visual redesign and responsive layout.
- `script.js` — renders the schedule and sends height updates to the Bandzoogle embed.
- `shows.json` — editable schedule data, included for future maintenance/reference.
- `bandzoogle-embed-snippet.html` — paste this into Bandzoogle’s HTML Code feature after publishing the GitHub Pages repo.

## GitHub Pages setup

1. Create a new public repo named `bmc-upcoming-shows`.
2. Upload these files to the repo root.
3. In GitHub, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select branch `main` and folder `/root`, then save.
6. Your page should publish at:

   `https://YOUR-GITHUB-USERNAME.github.io/bmc-upcoming-shows/`

## Bandzoogle embed

After the GitHub Pages link works, open `bandzoogle-embed-snippet.html`.

Replace both instances of:

`YOUR-GITHUB-USERNAME`

with your GitHub username, then paste the snippet into Bandzoogle’s **HTML Code** feature.

The snippet uses `postMessage` height updates so the iframe grows to fit the page. That is the main fix for the “two vertical scroll bars” problem.

## Font note: BUDMO

The CSS currently uses this title stack:

`"Budmo Jiggler", "Budmo Solid", Impact, Haettenschweiler, "Arial Black", sans-serif`

That means the page will use BUDMO if the visitor’s system/browser can access it; otherwise it falls back to Impact-style lettering.

To use the actual BUDMO font for everyone, add a legally licensed webfont file to:

`assets/fonts/budmo.woff2`

Then add this near the top of `styles.css`:

```css
@font-face {
  font-family: "Budmo Jiggler";
  src: url("./assets/fonts/budmo.woff2") format("woff2");
  font-display: swap;
}
```

Do not commit random font files unless you have the right to host them.

## Image note

Some current artist images are hotlinked from third-party URLs, including social/CDN image URLs. Those can break or expire. The best long-term version is to save approved promo images inside the repo under `assets/artists/` and point the schedule data to those local files.
