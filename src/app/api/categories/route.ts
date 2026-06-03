import { jsonOk } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const categories = await prisma.jobCategory.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
  return jsonOk({ data: categories });
}
