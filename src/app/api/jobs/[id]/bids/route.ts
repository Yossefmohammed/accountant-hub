import {
  AuthError,
  ConflictError,
  getSessionUser,
  NotFoundError,
  ValidationError,
} from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  try {
    const user = await getSessionUser();
    if (!user) throw new AuthError("You must be logged in to submit a bid");

    const { id } = await params;
    const jobId = parseInt(id, 10);
    if (Number.isNaN(jobId)) throw new NotFoundError("Job not found");

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) throw new NotFoundError("Job not found");
    if (job.status !== "open") {
      throw new ValidationError("This job is no longer accepting bids", {
        job: ["Job status is closed"],
      });
    }

    const body = await request.json();
    const errors: Record<string, string[]> = {};

    const proposedPrice = parseFloat(String(body.proposedPrice ?? ""));
    const estimatedDelivery = String(body.estimatedDelivery || "").trim();
    const coverLetter = String(body.coverLetter || "").trim();
    const experienceSummary = String(body.experienceSummary || "").trim();

    if (Number.isNaN(proposedPrice) || proposedPrice <= 0)
      errors.proposedPrice = ["Enter a valid proposed price"];
    if (!estimatedDelivery)
      errors.estimatedDelivery = ["Estimated delivery time is required"];
    if (!coverLetter || coverLetter.length < 20)
      errors.coverLetter = ["Cover letter must be at least 20 characters"];
    if (!experienceSummary)
      errors.experienceSummary = ["Experience summary is required"];

    if (Object.keys(errors).length) {
      throw new ValidationError("Validation failed", errors);
    }

    const existing = await prisma.bid.findUnique({
      where: { jobId_userId: { jobId, userId: user.id } },
    });
    if (existing) {
      throw new ConflictError("You have already submitted a bid for this job");
    }

    const bid = await prisma.bid.create({
      data: {
        jobId,
        userId: user.id,
        proposedPrice,
        estimatedDelivery,
        coverLetter,
        experienceSummary,
      },
      include: {
        job: { select: { title: true } },
      },
    });

    return jsonOk(
      {
        message: "Your bid was submitted successfully",
        data: {
          id: bid.id,
          proposedPrice: bid.proposedPrice,
          estimatedDelivery: bid.estimatedDelivery,
          jobTitle: bid.job.title,
          createdAt: bid.createdAt,
        },
      },
      201
    );
  } catch (error) {
    return jsonError(error);
  }
}
