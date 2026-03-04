export function buildReport({ mode, scannedLinks, internalBroken, externalFailures, retryStats }) {
  const internalByStatus = aggregateByCategory(internalBroken);
  const externalByStatus = aggregateByCategory(externalFailures);
  const topExternalHosts = aggregateHosts(externalFailures);

  return {
    mode,
    scannedLinks,
    internalBroken,
    internalBrokenByStatus: internalByStatus,
    internalBrokenTotal: internalBroken.length,
    externalFailures,
    externalFailuresByStatus: externalByStatus,
    topExternalHosts,
    retryStats,
  };
}

export function printReport(report) {
  console.log("URL CHECK REPORT");
  console.log(`mode: ${report.mode}`);
  console.log(`scanned_links: ${report.scannedLinks}`);
  console.log("");

  console.log("internal_broken:");
  printMap(report.internalBrokenByStatus);
  console.log("");

  console.log("external_failures:");
  printMap(report.externalFailuresByStatus);
  console.log("");

  console.log("top_external_hosts_by_failures:");
  if (Object.keys(report.topExternalHosts).length === 0) {
    console.log("  none: 0");
  } else {
    for (const host of Object.keys(report.topExternalHosts).sort()) {
      const data = report.topExternalHosts[host];
      console.log(`  ${host}: ${JSON.stringify(data)}`);
    }
  }
  console.log("");

  console.log("retries:");
  console.log(`  total_retries: ${report.retryStats.totalRetries}`);
  console.log("  by_host:");
  const hosts = Object.keys(report.retryStats.byHost);
  if (hosts.length === 0) {
    console.log("    none: 0");
  } else {
    for (const host of hosts.sort()) {
      console.log(`    ${host}: ${report.retryStats.byHost[host]}`);
    }
  }
}

function aggregateByCategory(items) {
  const out = {};
  for (const item of items) {
    const key = item.category || String(item.status || "unknown");
    out[key] = (out[key] || 0) + 1;
  }
  return out;
}

function aggregateHosts(items) {
  const out = {};
  for (const item of items) {
    const host = item.host || "unknown";
    if (!out[host]) {
      out[host] = { total: 0 };
    }
    out[host].total += 1;
    const key = item.category || String(item.status || "unknown");
    out[host][key] = (out[host][key] || 0) + 1;
  }
  return out;
}

function printMap(map) {
  const keys = Object.keys(map);
  if (keys.length === 0) {
    console.log("  none: 0");
    return;
  }
  for (const key of keys.sort()) {
    console.log(`  ${key}: ${map[key]}`);
  }
}
