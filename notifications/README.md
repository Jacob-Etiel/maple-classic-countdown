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

Web Push is provided through OneSignal. The OneSignal SDK is initialized in `index.html`, while its worker code is imported by the existing PWA `service-worker.js`. Permission is requested only after the user presses the notification button.

### Daily Founder’s Access countdown

The GitHub Actions workflow in `.github/workflows/daily-founder-countdown.yml` runs every day at 9:00 AM in the `Asia/Jerusalem` timezone. It calculates the calendar days remaining until October 6, 2026, sends the countdown to OneSignal's `Total Subscriptions` segment, sends a special launch-day message, and stops sending after Founder’s Access begins.

Before the workflow can send, add the OneSignal App API key to the GitHub repository:

1. In OneSignal, open **Settings → Keys & IDs** and create or copy the **App API Key**.
2. In GitHub, open **Settings → Secrets and variables → Actions**.
3. Choose **New repository secret**.
4. Name it exactly `ONESIGNAL_REST_API_KEY`, paste the key, and save it.

Do not put the API key in any project file. The repository is public, while GitHub Actions secrets remain hidden.

To preview the generated message, open **Actions → Daily Founder Access countdown → Run workflow**, leave **Preview the message without sending it** enabled, and run it. To send a real test notification, run it again with that option disabled.
