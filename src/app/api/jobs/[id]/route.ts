import { getSessionUser, NotFoundError } from "@/lib/auth";
import { jsonError, jsonOk } from "@/lib/api-response";
import { getJobById } from "@/lib/jobs";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const jobId = parseInt(id, 10);
    if (Number.isNaN(jobId)) throw new NotFoundError("Job not found");

    const job = await getJobById(jobId);
    if (!job) throw new NotFoundError("Job not found");

    const user = await getSessionUser();
    let userHasBid = false;
    if (user) {
      const bid = await prisma.bid.findUnique({
        where: { jobId_userId: { jobId, userId: user.id } },
      });
      userHasBid = !!bid;
    }

    return jsonOk({ data: job, userHasBid, user });
  } catch (error) {
    return jsonError(error);
  }
}
