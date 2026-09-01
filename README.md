# Maple Classic Countdown

A static, installable countdown PWA for MapleStory Classic World.

This is an unofficial, noncommercial fan project. MapleStory, Classic World, and the official artwork used on the site are owned by NEXON Korea Corp. and NEXON America Inc. Artwork is sourced from Nexon's official Classic World promotional page and is credited in the website footer.

## Current milestones

- Founder’s Package sales: September 2, 2026
- Founder’s Access: October 6, 2026
- Grand Launch: October 21, 2026

Nexon has not yet announced exact server-opening times. The current timers count down to the beginning of each launch day in the visitor’s local timezone. Edit the `date` values at the top of `app.js` when official times are published.

## Run locally

Service workers do not work reliably by double-clicking `index.html`. Start a local web server in this folder, for example:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

## GitHub Pages

This project uses relative paths, so it works either at a custom domain root or at a GitHub Pages project path.

## Notifications

The service worker can receive push events, but subscription storage and scheduled delivery still need to be connected to a backend. Do not request notification permission until the user presses the notification button.
