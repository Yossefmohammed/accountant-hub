import {
  createSession,
  hashPassword,
  ValidationError,
} from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const errors: Record<string, string[]> = {};

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (!name) errors.name = ["Name is required"];
    if (!email) errors.email = ["Email is required"];
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.email = ["Enter a valid email"];
    if (!password || password.length < 8)
      errors.password = ["Password must be at least 8 characters"];

    if (Object.keys(errors).length) {
      throw new ValidationError("Validation failed", errors);
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ValidationError("Validation failed", {
        email: ["This email is already registered"],
      });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: await hashPassword(password),
      },
      select: { id: true, name: true, email: true },
    });

    await createSession(user);

    return jsonOk({ user, message: "Registration successful" }, 201);
  } catch (error) {
    return jsonError(error);
  }
}
