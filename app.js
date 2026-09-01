// Keep public launch information here so it is easy to update later.
// Until Nexon publishes exact opening times, each countdown targets the
// beginning of that calendar day in the visitor's own timezone.
const milestones = [
  {
    id: "founder-sale",
    title: "Founder’s Packages",
    date: "2026-09-02T00:00:00",
    label: "Sep 2, 2026",
    countdown: false,
    description: "Founder’s Package sales begin."
  },
  {
    id: "founder-access",
    title: "Founder’s Access",
    date: "2026-10-06T00:00:00",
    label: "Oct 6, 2026",
    description: "Eligible Founder players enter Classic World. Progress carries into Grand Launch."
  },
  {
    id: "grand-launch",
    title: "Grand Launch",
    date: "2026-10-21T00:00:00",
    label: "Oct 21, 2026",
    description: "Classic World opens to everyone."
  }
];

const timerIds = ["days", "hours", "minutes", "seconds"];
const timerElements = Object.fromEntries(timerIds.map(id => [id, document.getElementById(id)]));
const titleElement = document.getElementById("nextMilestoneTitle");
const dateElement = document.getElementById("nextMilestoneDate");
const timelineElement = document.getElementById("timeline");
const buttonStatus = document.getElementById("buttonStatus");
const installButton = document.getElementById("installButton");
let deferredInstallPrompt = null;

function nextMilestone(now = new Date()) {
  return milestones.find(item => item.countdown !== false && new Date(item.date) > now)
    ?? milestones[milestones.length - 1];
}

function renderTimeline() {
  const now = new Date();
  const next = nextMilestone(now);
  timelineElement.innerHTML = milestones.map(item => {
    const state = new Date(item.date) <= now ? "past" : item.id === next.id ? "next" : "future";
    return `
      <li class="timeline-item ${state}">
        <time class="timeline-date" datetime="${item.date}">${item.label}</time>
        <span class="timeline-dot" aria-hidden="true"></span>
        <div class="timeline-copy">
          <h3>${item.title}</h3>
          <p>${item.description}</p>
        </div>
      </li>`;
  }).join("");
}

function updateCountdown() {
  const now = new Date();
  const target = nextMilestone(now);
  const targetDate = new Date(target.date);
  const distance = Math.max(0, targetDate - now);
  const values = {
    days: Math.floor(distance / 86_400_000),
    hours: Math.floor(distance / 3_600_000) % 24,
    minutes: Math.floor(distance / 60_000) % 60,
    seconds: Math.floor(distance / 1_000) % 60
  };

  titleElement.textContent = target.title;
  dateElement.textContent = targetDate.toLocaleDateString(undefined, {
    year: "numeric", month: "long", day: "numeric"
  });
  for (const id of timerIds) timerElements[id].textContent = String(values[id]).padStart(2, "0");
}

window.addEventListener("beforeinstallprompt", event => {
  event.preventDefault();
  deferredInstallPrompt = event;
});

installButton.addEventListener("click", async () => {
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    return;
  }
  document.getElementById("installHelp").scrollIntoView({ behavior: "smooth", block: "center" });
});

document.getElementById("notifyButton").addEventListener("click", async () => {
  const standalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  if (isIOS && !standalone) {
    buttonStatus.textContent = "On iPhone, first add this site to your Home Screen and open it from the new icon.";
    document.getElementById("installHelp").scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  buttonStatus.textContent = "The countdown is ready. We’ll connect real push delivery in the notification step.";
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("service-worker.js"));
}

renderTimeline();
updateCountdown();
setInterval(updateCountdown, 1000);
