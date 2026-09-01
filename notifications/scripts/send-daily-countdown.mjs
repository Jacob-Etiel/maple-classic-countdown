import { createHash } from "node:crypto";

const APP_ID = process.env.ONESIGNAL_APP_ID;
const API_KEY = process.env.ONESIGNAL_REST_API_KEY;
const DRY_RUN = process.env.DRY_RUN === "true";
const TIME_ZONE = "Asia/Jerusalem";
const SITE_URL = "https://jacob-etiel.github.io/maple-classic-countdown/";
const TARGET = { year: 2026, month: 10, day: 6 };

function localDateParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date);

  return Object.fromEntries(parts.filter(part => part.type !== "literal").map(part => [part.type, Number(part.value)]));
}

function calendarDaysUntil(target, today) {
  const targetDay = Date.UTC(target.year, target.month - 1, target.day);
  const currentDay = Date.UTC(today.year, today.month - 1, today.day);
  return Math.round((targetDay - currentDay) / 86_400_000);
}

function notificationCopy(days) {
  if (days === 0) {
    return {
      heading: "🍁 Founder’s Access starts today!",
      message: "The wait is over—MapleStory Classic World Founder’s Access begins today!"
    };
  }

  if (days === 1) {
    return {
      heading: "🍁 Founder’s Access starts tomorrow!",
      message: "One more sleep until the return to Victoria Island."
    };
  }

  return {
    heading: `🍁 ${days} days until Founder’s Access!`,
    message: "Victoria Island is getting closer. Tap to open the countdown."
  };
}

function idempotencyKey(today) {
  const dateKey = `${today.year}-${String(today.month).padStart(2, "0")}-${String(today.day).padStart(2, "0")}`;
  const hex = createHash("sha256").update(`maple-founder-access-${dateKey}`).digest("hex").slice(0, 32);
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-a${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
}

const today = localDateParts();
const days = calendarDaysUntil(TARGET, today);

if (days < 0) {
  console.log("Founder’s Access has already started. No notification sent.");
  process.exit(0);
}

const copy = notificationCopy(days);
const payload = {
  app_id: APP_ID,
  included_segments: ["Total Subscriptions"],
  target_channel: "push",
  headings: { en: copy.heading },
  contents: { en: copy.message },
  web_url: SITE_URL,
  idempotency_key: idempotencyKey(today)
};

if (DRY_RUN) {
  console.log("Dry run—notification was not sent:");
  console.log(JSON.stringify(payload, null, 2));
  process.exit(0);
}

if (!APP_ID || !API_KEY) {
  throw new Error("Missing ONESIGNAL_APP_ID or ONESIGNAL_REST_API_KEY.");
}

const response = await fetch("https://api.onesignal.com/notifications?c=push", {
  method: "POST",
  headers: {
    Authorization: `Key ${API_KEY}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify(payload)
});

const result = await response.text();
if (!response.ok) {
  throw new Error(`OneSignal returned ${response.status}: ${result}`);
}

console.log(`Sent: ${copy.heading}`);
console.log(result);
