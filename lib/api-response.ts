import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function created<T>(data: T) {
  return NextResponse.json(data, { status: 201 });
}

export function apiError(error: unknown, status = 500) {
  if (error instanceof ZodError) {
    return NextResponse.json({ error: "Validation failed", issues: error.flatten() }, { status: 422 });
  }

  if (error instanceof Error) {
    return NextResponse.json({ error: error.message }, { status });
  }

  return NextResponse.json({ error: "Unexpected server error" }, { status });
}
