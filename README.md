# Wedding Invitation — Rameesa & Sabeel

A premium, cinematic wedding invitation site built with HTML5, CSS3, and
vanilla JS, using GSAP, ScrollTrigger, and Lenis for the smooth-scroll and
animation layer. No frameworks.

## Files
- `index.html` — the whole invitation, one long page
- `yes.html` / `no.html` — RSVP confirmation pages
- `style.css` — all design tokens (colors, fonts, spacing) and layout
- `main.js` — all interactivity: envelope, countdown, Moments photo-book,
  RSVP, wishes, music toggle, custom cursor, petals
- `images/` — your 6 real Moments photos are already dropped in here
  (`moment-1.jpg` through `moment-6.jpg`), plus a placeholder hero background
- `audio/` — drop your instrumental track in here (see below)

## To make this your own

**1. Edit the CONFIG object at the top of `main.js`.**
That's the only place you need to touch for text: bride/groom names,
parents' names, wedding date/time/venue, Hijri date, map link, and the
Arabic verses. Everything on the page pulls from there automatically —
you don't need to hunt through the HTML.

**2. Add your venue.**
`CONFIG.wedding.venue` and `CONFIG.wedding.location` currently say
"Venue To Be Announced" — update these once you've confirmed the venue,
along with `CONFIG.mapEmbedSrc` and `CONFIG.mapLink` (your venue's actual
Google Maps embed URL and share link).

**3. Swap in more/different photos if you like.**
Your 6 photos are already placed at `images/moment-1.jpg` through
`images/moment-6.jpg` for the "Moments" scroll-locked photo book. To
change the order, just rename the files — the code always loads them in
numeric order (1 → 6).
- `images/hero-bg.svg` → replace with a real hero background photo if you
  have one (keep the filename, or update the `src` in `index.html`)

**4. Add your music.**
Drop an MP3 into `audio/bg_music.mp3`. The site already points to it via
`CONFIG.musicSrc`. If the file isn't there yet, the site still works —
it just fails silently and the music button simply won't play anything.

**5. Deploy.**
Same as your other projects — drag the whole folder into Netlify Drop.
Everything is self-contained and works from local files too (just open
`index.html` in a browser).

## About the "Moments" section
This is the centerpiece: guests land on a stacked photo pile and scroll is
temporarily locked while they swipe/scroll through all 6 photos one at a
time, like turning pages in a photo book. After the last photo, it fades
out and scroll unlocks automatically. No captions or numbers — just the
photos.

## What was removed from the base template
Per your request, this version does **not** include:
- The Gallery section (grid + lightbox)
- The Dress Code detail card
- A separate Nikah / Reception split — there's now a single "Wedding
  Ceremony" detail card instead

## Notes
- Everything is a single global `CONFIG` object, same pattern as your other
  invitation sites — easy to hand off or reuse for future invitations.
- RSVP responses and wishes save to the browser's `localStorage`, same
  approach as your other invitation sites (no backend required).