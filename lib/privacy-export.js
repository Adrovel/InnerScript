import "server-only";

import { listEntries } from "./entries.js";
import { listPeople } from "./people.js";
import { recordAuditLog } from "./audit.js";

export async function buildPrivacyExport() {
  const [entries, people] = await Promise.all([listEntries({ limit: 100 }), listPeople()]);

  await recordAuditLog({
    action: "privacy_export",
    resourceType: "account",
    metadata: {
      entry_count: entries.length,
      people_count: people.length,
    },
  });

  return {
    exported_at: new Date().toISOString(),
    product: "InnerScript",
    entries,
    people,
  };
}
