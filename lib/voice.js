import "server-only";

export async function transcribeVoiceInput(input) {
  if (input.transcript_text?.trim()) {
    return {
      transcript: input.transcript_text.trim(),
      provider: "manual-review",
      audio_retained: false,
    };
  }

  return {
    transcript: "",
    provider: "unconfigured",
    audio_retained: false,
    unavailable_reason: "No transcription provider is configured in local mode.",
  };
}
