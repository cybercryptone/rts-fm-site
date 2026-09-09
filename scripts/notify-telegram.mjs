// Posts newly added blog posts to the RTS.FM Telegram channel. Run from CI
// (see .github/workflows/notify-telegram.yml) after a push to main that
// touches src/content/blog/**.mdx — only files ADDED in the push range are
// announced, so editing an existing post never re-triggers a channel post.
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHANNEL = process.env.TELEGRAM_CHANNEL || "@rtsfm";
const SITE_URL = process.env.SITE_URL || "https://rts.fm";
const BEFORE = process.env.GITHUB_EVENT_BEFORE;
const SHA = process.env.GITHUB_SHA;

if (!BOT_TOKEN) {
  console.error("Missing TELEGRAM_BOT_TOKEN");
  process.exit(1);
}

function getAddedMdxFiles() {
  // github.event.before is all-zeros on a branch's first-ever push (no
  // prior commit to diff against) — fall back to just the latest commit
  // in that case instead of a diff range that doesn't exist yet.
  const hasBefore = BEFORE && !/^0+$/.test(BEFORE);
  const range = hasBefore ? `${BEFORE} ${SHA}` : `${SHA}~1 ${SHA}`;
  const output = execSync(
    `git diff --name-only --diff-filter=A ${range} -- src/content/blog/*.mdx`,
    { encoding: "utf8" },
  );
  return output
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// The workflow fires on `push`, but Render's deploy takes a minute or two
// to actually go live — posting immediately meant Telegram tried to build
// the link-preview card against a still-404 URL and gave up, leaving the
// message with no title card or image. Block until the URL is really live
// (or a generous timeout elapses) before handing it to sendMessage.
async function waitForLive(url, { timeoutMs = 5 * 60 * 1000, intervalMs = 10 * 1000 } = {}) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url, { method: "GET", cache: "no-store" });
      if (res.ok) return true;
    } catch {
      // network hiccup during deploy — keep polling
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
  return false;
}

async function sendMessage(text) {
  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHANNEL,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: false,
    }),
  });
  const data = await res.json();
  if (!data.ok) {
    throw new Error(`Telegram API error: ${JSON.stringify(data)}`);
  }
  return data;
}

const files = getAddedMdxFiles();
if (files.length === 0) {
  console.log("No new blog posts in this push.");
  process.exit(0);
}

for (const file of files) {
  const slug = path.basename(file, ".mdx");
  const raw = fs.readFileSync(file, "utf8");
  const { data } = matter(raw);
  const title = data.title || slug;
  const excerpt = data.excerpt || "";
  const url = `${SITE_URL}/blog/${slug}`;

  const text = [`<b>${escapeHtml(title)}</b>`, "", escapeHtml(excerpt), "", url].join("\n");

  console.log(`Waiting for ${url} to go live...`);
  const isLive = await waitForLive(url);
  if (!isLive) {
    console.warn(`  ${url} still not returning 200 after the timeout — posting anyway, preview may be missing.`);
  }

  console.log(`Posting to ${CHANNEL}: ${title}`);
  await sendMessage(text);
}
