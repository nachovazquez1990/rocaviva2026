#!/usr/bin/env node
/**
 * Quality audit script - runs Lighthouse on the local dev server
 * Usage: node scripts/audit.mjs [url] [--mobile]
 * Example: node scripts/audit.mjs http://localhost:3000 --mobile
 */
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";

const url = process.argv[2] || "http://localhost:3000";
const isMobile = process.argv.includes("--mobile");

async function runAudit() {
  const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless"] });

  const options = {
    logLevel: "error",
    output: "json",
    port: chrome.port,
    formFactor: isMobile ? "mobile" : "desktop",
    screenEmulation: isMobile
      ? undefined
      : { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false },
    throttling: isMobile ? undefined : { cpuSlowdownMultiplier: 1 },
  };

  const result = await lighthouse(url, options);
  const { categories } = result.lhr;

  console.log("\n========================================");
  console.log(`  LIGHTHOUSE AUDIT: ${url}`);
  console.log(`  Mode: ${isMobile ? "Mobile" : "Desktop"}`);
  console.log("========================================\n");

  const scores = {};
  for (const [key, cat] of Object.entries(categories)) {
    const score = Math.round(cat.score * 100);
    const emoji = score >= 90 ? "OK" : score >= 50 ? "WARN" : "FAIL";
    scores[key] = score;
    console.log(`  [${emoji}] ${cat.title}: ${score}/100`);
  }

  console.log("\n========================================\n");

  // Show specific failing audits
  const audits = result.lhr.audits;
  const failures = Object.values(audits).filter(
    (a) => a.score !== null && a.score < 0.9 && a.details
  );

  if (failures.length > 0) {
    console.log("  Top issues to fix:");
    failures
      .sort((a, b) => (a.score || 0) - (b.score || 0))
      .slice(0, 10)
      .forEach((a) => {
        console.log(`  - ${a.title} (score: ${Math.round((a.score || 0) * 100)})`);
      });
    console.log("");
  }

  await chrome.kill();

  // Exit with error if any score below 90
  const minScore = Math.min(...Object.values(scores));
  if (minScore < 90) {
    console.log(`  Minimum score: ${minScore}/100 - needs improvement\n`);
    process.exit(1);
  } else {
    console.log(`  All scores 90+ - great job!\n`);
  }
}

runAudit().catch((err) => {
  console.error("Audit failed:", err.message);
  process.exit(1);
});
