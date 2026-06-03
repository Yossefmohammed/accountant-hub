import {
  createSession,
  verifyPassword,
  ValidationError,
} from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (!email || !password) {
      throw new ValidationError("Validation failed", {
        email: !email ? ["Email is required"] : [],
        password: !password ? ["Password is required"] : [],
      });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await verifyPassword(password, user.password))) {
      throw new ValidationError("Invalid credentials", {
        email: ["Email or password is incorrect"],
      });
    }

    const sessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
    };
    await createSession(sessionUser);

    return jsonOk({ user: sessionUser, message: "Login successful" });
  } catch (error) {
    return jsonError(error);
  }
}
