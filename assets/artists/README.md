# Artist image assets

Drop band/artist photos in this folder for the Upcoming Shows page.

The page is wired to look for these clean filenames first:

- `andre-lovett-band.jpg`
- `dapper-dandies.jpg`
- `maurice-cade-ess.jpg`
- `mother-ruckus.jpg`
- `sugar-and-the-daddies.jpg`
- `woodys-rampage.jpg`
- `ashley-paige-soulcial-club.jpg`

For convenience, the page also checks the original upload-style filenames below if they are dropped in without renaming:

- `Andre Lovett Band.jpg`
- `Dapper Dandies.jpg`
- `Maurice Cade.jpg`
- `Mother Ruckus.jpg`
- `Sugar and the Daddies.webp`
- `Woody's Rampage.jpg`
- `Ashley Paige and the Soulcial Club.webp`

Existing external image URLs in `shows.json` are not removed. Local assets act as first choice for blank artist photos and as backup fallbacks for existing remote photos if those remote URLs fail.
