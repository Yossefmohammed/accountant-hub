import { AuthError, getSessionUser } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) throw new AuthError("Authentication required");

    const bids = await prisma.bid.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            companyName: true,
            status: true,
            budgetMin: true,
            budgetMax: true,
          },
        },
      },
    });

    return jsonOk({
      data: bids.map((b) => ({
        id: b.id,
        proposedPrice: b.proposedPrice,
        estimatedDelivery: b.estimatedDelivery,
        coverLetter: b.coverLetter,
        experienceSummary: b.experienceSummary,
        submittedAt: b.createdAt,
        job: b.job,
      })),
    });
  } catch (error) {
    return jsonError(error);
  }
}
