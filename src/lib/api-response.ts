import { NextResponse } from "next/server";
import {
  AuthError,
  ConflictError,
  NotFoundError,
  ValidationError,
} from "./auth";

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function jsonError(error: unknown) {
  if (error instanceof ValidationError) {
    return NextResponse.json(
      { message: error.message, errors: error.errors },
      { status: error.status }
    );
  }
  if (
    error instanceof AuthError ||
    error instanceof ConflictError ||
    error instanceof NotFoundError
  ) {
    const e = error as { message: string; status: number };
    return NextResponse.json({ message: e.message }, { status: e.status });
  }

  console.error(error);
  return NextResponse.json(
    { message: "Internal server error" },
    { status: 500 }
  );
}
