# Broadcaster's Clock

A clock that tells the time the way broadcasters say it: "coming up to 10 past 8", "quarter to 4", "12 seconds to 9".

Hosts get the hour wrong, or lose the time completely when the studio is busy. This shows the time in words, with a progress bar for the minute and a countdown in the last minute of the hour.

It began as a Delphi app in 2004, built for Geoff Robinson on Radio New Zealand's Morning Report. This is the third version, in plain modern JavaScript with no build step and no dependencies.

The clock shows your PC's time, so the PC should be locked to your station's master clock. It does not use network time.

## Telling time

- In the first 30 seconds of a minute the time is that minute: `+ 10 past 8`.
- After 30 seconds it is "coming up to" the next minute: `− 10 past 8`.
- Past the half hour, it counts "to" the next hour.
- In the last minute of the hour it counts down in seconds, and the bar turns red for the final 10.

The **Classic** setting drops the rounding and the signs, and always shows the current minute.

## Running it

Open the site, or run it yourself. The modules need a web server, not `file://`:

```sh
npm start        # serves http://localhost:8000
```

Settings are saved in the browser. A URL can set them too, for bookmarks on a studio PC:

`?rounding=classic&lang=en&hour12=0`

## Project layout

```
js/core/    what to say, with no DOM and no wording (spokenTime.js is the heart)
js/i18n/    one file per language, turning that data into words
js/ui/      timer, settings, and the only code that touches the page
css/        styles
test/       node --test
```

## Adding a language

Copy `js/i18n/en.js`, write a `format(t)` that returns `{ sign, text }`, and add it to `js/i18n/index.js`. Each language builds its own phrase, so word order and grammar are up to it. Look at `js/core/spokenTime.js` for the data it receives.

## Tests

```sh
npm test
```

## Licence

MIT. See `LICENSE`.
