import { ZodError } from "zod";
import { formatValidationError } from "./contracts.js";

export function jsonError(message, status, details) {
  return Response.json(
    {
      error: message,
      ...(details ? { details } : {}),
    },
    { status },
  );
}

export async function readJson(request) {
  try {
    return await request.json();
  } catch {
    throw new SyntaxError("Request body must be valid JSON");
  }
}

export function errorResponse(error) {
  if (error instanceof ZodError) {
    return jsonError("Invalid request", 400, formatValidationError(error));
  }

  if (error instanceof SyntaxError) {
    return jsonError(error.message, 400);
  }

  return jsonError("Internal server error", 500);
}
