import "server-only";

import { getDb } from "../db/client.js";
import { auditLogs } from "../db/schema.js";

export async function recordAuditLog({ action, resourceType, resourceId = null, metadata = {} }) {
  const [row] = await getDb()
    .insert(auditLogs)
    .values({
      action,
      resourceType,
      resourceId,
      metadata,
    })
    .returning();

  return {
    id: row.id,
    action: row.action,
    resource_type: row.resourceType,
    resource_id: row.resourceId,
    metadata: row.metadata,
    created_at: row.createdAt.toISOString(),
  };
}
