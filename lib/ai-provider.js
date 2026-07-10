import "server-only";

export function isChatProviderConfigured() {
  return Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_CHAT_MODEL);
}

export async function generateReflectionQuestionWithProvider({ entry, fallbackQuestion }) {
  if (!isChatProviderConfigured()) {
    return null;
  }

  const response = await fetch(`${process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1"}/chat/completions`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_CHAT_MODEL,
      messages: [
        {
          role: "system",
          content:
            "Ask exactly one reflective journaling question. Do not diagnose. Use only the supplied entry. Keep it under 24 words.",
        },
        {
          role: "user",
          content: `Title: ${entry.title ?? "Untitled"}\n\nEntry:\n${entry.body}`,
        },
      ],
      temperature: 0.4,
    }),
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content?.trim();

  if (!content || content.length > 220) {
    return null;
  }

  return content.endsWith("?") ? content : fallbackQuestion;
}
