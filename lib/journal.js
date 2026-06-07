export function getLocalDayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getEntryDayKey(entry) {
  const date = entry.occurred_at ? new Date(entry.occurred_at) : new Date(entry.created_at);

  return getLocalDayKey(date);
}

export function findTodayJournalEntry(entries) {
  const today = getLocalDayKey();

  return (
    entries.find(
      (entry) => entry.entry_type === "journal" && getEntryDayKey(entry) === today,
    ) ?? null
  );
}

export function getEntryLabel(entry) {
  if (entry.title?.trim()) {
    return entry.title.trim();
  }

  return "Untitled";
}

export function getNextUntitledNoteTitle(entries) {
  const highestExistingNumber = entries.reduce((highest, entry) => {
    const match = entry.title?.trim().match(/^Untitled (\d+)$/);

    if (!match) {
      return highest;
    }

    return Math.max(highest, Number(match[1]));
  }, 0);

  return `Untitled ${highestExistingNumber + 1}`;
}

export function formatEntryDate(iso) {
  const date = new Date(iso);
  const now = new Date();

  return new Intl.DateTimeFormat("en-GB", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  }).format(date);
}

export function formatTodayHeading(date = new Date()) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}

export function formatEntryCreated(iso) {
  const date = new Date(iso);

  return new Intl.DateTimeFormat("en-GB", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function formatRelativeEditTime(date = new Date()) {
  const now = Date.now();
  const then = date instanceof Date ? date.getTime() : new Date(date).getTime();
  const diffSeconds = Math.max(0, Math.floor((now - then) / 1000));

  if (diffSeconds < 60) {
    return "just now";
  }

  const diffMinutes = Math.floor(diffSeconds / 60);

  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export function countWords(text) {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

export function getEntryTypeTag(entryType) {
  return entryType === "note" ? "#NOTE" : "#JOURNAL";
}

export async function fetchEntries() {
  const response = await fetch("/api/entries");

  if (!response.ok) {
    throw new Error("Failed to load entries");
  }

  const data = await response.json();
  return data.entries;
}

export async function createEntry(payload) {
  const response = await fetch("/api/entries", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to create entry");
  }

  const data = await response.json();
  return data.entry;
}

export async function updateEntry(id, payload) {
  const response = await fetch(`/api/entries/${id}`, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to update entry");
  }

  const data = await response.json();
  return data.entry;
}

export async function deleteEntry(id) {
  const response = await fetch(`/api/entries/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete entry");
  }
}
