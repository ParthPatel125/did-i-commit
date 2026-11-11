#!/usr/bin/env node
// did-i-commit: checks whether you contributed on github today, and nags you
// if you haven't. zero dependencies; auth is borrowed from the gh cli.
//
//   node did-i-commit.js          print status, exit 0 if safe, 1 if not
//   node did-i-commit.js --nag    also send a desktop notification when at risk

const { execFileSync } = require("node:child_process");

const QUERY = `query($from: DateTime!, $to: DateTime!) {
  viewer {
    login
    contributionsCollection(from: $from, to: $to) {
      contributionCalendar { totalContributions }
    }
  }
}`;

function todayWindow() {
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  return { from: start.toISOString(), to: now.toISOString() };
}

function fetchToday() {
  const { from, to } = todayWindow();
  const out = execFileSync(
    "gh",
    ["api", "graphql", "-f", `query=${QUERY}`, "-f", `from=${from}`, "-f", `to=${to}`],
    { encoding: "utf8" }
  );
  const data = JSON.parse(out).data.viewer;
  return {
    login: data.login,
    total: data.contributionsCollection.contributionCalendar.totalContributions,
  };
}

function notify(title, body) {
  try {
    if (process.platform === "darwin") {
      execFileSync("osascript", [
        "-e",
        `display notification ${JSON.stringify(body)} with title ${JSON.stringify(title)} sound name "Basso"`,
      ]);
    } else {
      execFileSync("notify-send", ["-u", "critical", title, body]);
    }
  } catch {
    // no notifier available; the printed warning will have to do
  }
}

function hoursLeft() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return ((midnight - now) / 3.6e6).toFixed(1);
}

function main() {
  let res;
  try {
    res = fetchToday();
  } catch (err) {
    console.error("could not reach github. is the gh cli installed and logged in? (gh auth login)");
    process.exit(2);
  }

  if (res.total > 0) {
    console.log(`✓ ${res.login}: ${res.total} contribution${res.total === 1 ? "" : "s"} today. streak safe.`);
    process.exit(0);
  }

  const left = hoursLeft();
  console.log(`✗ ${res.login}: no contributions yet today. ${left}h until midnight.`);
  if (process.argv.includes("--nag")) {
    notify("did you commit today?", `no contributions yet. ${left}h left to keep the streak.`);
  }
  process.exit(1);
}

main();
