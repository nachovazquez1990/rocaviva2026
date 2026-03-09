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
    throttling: isMobile
      ? undefined
      : {
          rttMs: 0,
          throughputKbps: 0,
          requestLatencyMs: 0,
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0,
          cpuSlowdownMultiplier: 1,
        },
    throttlingMethod: isMobile ? "simulate" : "provided",
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
        const desc = a.description ? ` — ${a.description.slice(0, 120)}` : "";
        console.log(`  - ${a.title} (score: ${Math.round((a.score || 0) * 100)})${desc}`);
      });
    console.log("");
  }

  // Show LCP details
  const lcpAudit = audits["largest-contentful-paint-element"];
  if (lcpAudit?.details?.items?.length) {
    console.log("  LCP element:");
    lcpAudit.details.items.forEach((item) => {
      console.log(`  - ${item.node?.snippet || item.node?.selector || "unknown"}`);
      if (item.node?.nodeLabel) console.log(`    Label: ${item.node.nodeLabel}`);
    });
    console.log("");
  }

  // Show LCP timing
  const lcpMetric = audits["largest-contentful-paint"];
  if (lcpMetric) {
    console.log(`  LCP timing: ${lcpMetric.displayValue}`);
    console.log("");
  }

  // Show CLS details
  const clsAudit = audits["layout-shift-elements"];
  if (clsAudit?.details?.items?.length) {
    console.log("  Layout shift elements:");
    clsAudit.details.items.forEach((item) => {
      console.log(`  - snippet: ${item.node?.snippet || "none"}`);
      console.log(`    selector: ${item.node?.selector || "none"}`);
      console.log(`    nodeLabel: ${item.node?.nodeLabel || "none"}`);
      console.log(`    score: ${item.score?.toFixed?.(4) || JSON.stringify(item.score)}`);
      console.log(`    all keys: ${Object.keys(item).join(", ")}`);
    });
    console.log("");
  }

  // Show layout-shifts audit (individual shifts)
  const layoutShifts = audits["layout-shifts"];
  if (layoutShifts?.details?.items?.length) {
    console.log("  Individual layout shifts:");
    layoutShifts.details.items.forEach((item, i) => {
      console.log(`  Shift #${i + 1}: score=${item.score?.toFixed?.(4)} ts=${item.startTime?.toFixed?.(0)}ms`);
      if (item.subItems?.items) {
        item.subItems.items.forEach((sub) => {
          console.log(`    - ${sub.node?.snippet || sub.node?.selector || "unknown"}`);
        });
      }
    });
    console.log("");
  }

  // Show CLS metric
  const clsMetric = audits["cumulative-layout-shift"];
  if (clsMetric) {
    console.log(`  CLS value: ${clsMetric.displayValue}`);
    console.log("");
  }

  // Show TTFB
  const ttfb = audits["server-response-time"];
  if (ttfb) {
    console.log(`  TTFB: ${ttfb.displayValue}`);
    console.log("");
  }

  // Show console errors
  const errorsAudit = audits["errors-in-console"];
  if (errorsAudit?.details?.items?.length) {
    console.log("  Browser console errors:");
    errorsAudit.details.items.slice(0, 5).forEach((item) => {
      console.log(`  - ${(item.description || item.source || "").slice(0, 200)}`);
    });
    console.log("");
  }

  // Show render-blocking resources
  const renderBlocking = audits["render-blocking-resources"];
  if (renderBlocking?.details?.items?.length) {
    console.log("  Render-blocking resources:");
    renderBlocking.details.items.forEach((item) => {
      console.log(`  - ${item.url} (${item.wastedMs}ms wasted)`);
    });
    console.log("");
  }

  // Show unused JS
  const unusedJs = audits["unused-javascript"];
  if (unusedJs?.details?.items?.length) {
    console.log("  Unused JavaScript (top 5):");
    unusedJs.details.items.slice(0, 5).forEach((item) => {
      const wasted = (item.wastedBytes / 1024).toFixed(1);
      const total = (item.totalBytes / 1024).toFixed(1);
      console.log(`  - ${item.url?.split("/").pop() || item.url} — ${wasted}KB / ${total}KB unused`);
    });
    console.log("");
  }

  // Show canonical audit details
  const canonAudit = audits["canonical"];
  if (canonAudit) {
    console.log("  Canonical audit:");
    console.log(`  - score: ${canonAudit.score}`);
    console.log(`  - explanation: ${canonAudit.explanation || "none"}`);
    if (canonAudit.details?.items) {
      canonAudit.details.items.forEach((item) => {
        console.log(`  - ${JSON.stringify(item)}`);
      });
    }
    console.log("");
  }

  // Dump layout-shift-elements raw data
  if (clsAudit?.details) {
    console.log("  CLS raw details:");
    console.log(`  ${JSON.stringify(clsAudit.details).slice(0, 500)}`);
    console.log("");
  }

  // Dump layout-shifts raw data
  if (layoutShifts?.details) {
    console.log("  Layout shifts raw:");
    console.log(`  ${JSON.stringify(layoutShifts.details).slice(0, 800)}`);
    console.log("");
  }

  // Show SEO failures specifically
  const seoFailures = Object.values(audits).filter(
    (a) => a.score !== null && a.score < 1 && categories["seo"]?.auditRefs?.some((ref) => ref.id === a.id)
  );
  if (seoFailures.length > 0) {
    console.log("  SEO issues:");
    seoFailures.forEach((a) => {
      console.log(`  - ${a.title} (score: ${Math.round((a.score || 0) * 100)})`);
    });
    console.log("");
  }

  // Save full report for debugging
  const fs = await import("fs");
  fs.writeFileSync("lighthouse-report.json", JSON.stringify(result.lhr, null, 2));
  console.log("  Full report saved to lighthouse-report.json\n");

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
