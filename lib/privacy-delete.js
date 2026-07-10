import "server-only";

import { getPool } from "../db/client.js";
import { recordAuditLog } from "./audit.js";

export const DELETE_CONFIRMATION = "DELETE INNERSCRIPT DATA";

export async function deleteAllLocalData({ confirmation }) {
  if (confirmation !== DELETE_CONFIRMATION) {
    throw new SyntaxError("Deletion confirmation phrase is required");
  }

  await recordAuditLog({
    action: "privacy_delete_requested",
    resourceType: "account",
  });

  await getPool().query(
    "TRUNCATE TABLE chunks, digests, person_mentions, people, entries, sources, folders RESTART IDENTITY CASCADE",
  );

  return {
    deleted: true,
    deleted_at: new Date().toISOString(),
  };
}
