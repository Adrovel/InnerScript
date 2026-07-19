import { ZodError } from "zod";

export async function readJson(request) {
  try {
    return await request.json();
  } catch {
    throw new BadRequestError("Request body must be valid JSON");
  }
}

export class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = "BadRequestError";
    this.status = 400;
  }
}

export class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.status = 404;
  }
}

export function errorResponse(error) {
  if (error instanceof ZodError) {
    return Response.json(
      { error: "Invalid request", details: error.issues },
      { status: 400 },
    );
  }

  const status = error.status ?? 500;
  const message = status === 500 ? "Internal server error" : error.message;

  return Response.json({ error: message }, { status });
}
