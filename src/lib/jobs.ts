import { prisma } from "./prisma";

export type JobListQuery = {
  search?: string;
  category?: string;
  budgetMin?: string;
  budgetMax?: string;
  status?: string;
  sort?: string;
  page?: string;
  perPage?: string;
};

export async function listJobs(query: JobListQuery) {
  const page = Math.max(1, parseInt(query.page || "1", 10) || 1);
  const perPage = Math.min(
    50,
    Math.max(1, parseInt(query.perPage || "9", 10) || 9)
  );
  const skip = (page - 1) * perPage;

  const where: {
    title?: { contains: string };
    category?: { name: string };
    status?: string;
    budgetMax?: { gte: number };
    budgetMin?: { lte: number };
  } = {};

  if (query.search?.trim()) {
    where.title = { contains: query.search.trim() };
  }

  if (query.category?.trim()) {
    where.category = { name: query.category.trim() };
  }

  if (query.status === "open" || query.status === "closed") {
    where.status = query.status;
  }

  const minBudget = parseFloat(query.budgetMin || "");
  if (!Number.isNaN(minBudget)) {
    where.budgetMax = { gte: minBudget };
  }

  const maxBudget = parseFloat(query.budgetMax || "");
  if (!Number.isNaN(maxBudget)) {
    where.budgetMin = { lte: maxBudget };
  }

  let orderBy: { createdAt?: "desc" | "asc"; budgetMax?: "desc" } = {
    createdAt: "desc",
  };

  if (query.sort === "budget") {
    orderBy = { budgetMax: "desc" };
  } else if (query.sort === "oldest") {
    orderBy = { createdAt: "asc" };
  }

  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      orderBy,
      skip,
      take: perPage,
      include: {
        category: true,
        _count: { select: { bids: true } },
      },
    }),
    prisma.job.count({ where }),
  ]);

  return {
    data: jobs.map((job) => ({
      id: job.id,
      title: job.title,
      companyName: job.companyName,
      shortDescription: job.shortDescription,
      budgetMin: job.budgetMin,
      budgetMax: job.budgetMax,
      deadline: job.deadline,
      status: job.status,
      category: job.category.name,
      bidsCount: job._count.bids,
      postedAt: job.createdAt,
    })),
    meta: {
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage),
    },
  };
}

export async function getJobById(id: number) {
  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      category: true,
      _count: { select: { bids: true } },
    },
  });

  if (!job) return null;

  return {
    id: job.id,
    title: job.title,
    companyName: job.companyName,
    shortDescription: job.shortDescription,
    fullDescription: job.fullDescription,
    budgetMin: job.budgetMin,
    budgetMax: job.budgetMax,
    deadline: job.deadline,
    status: job.status,
    requiredSkills: job.requiredSkills,
    deliveryTime: job.deliveryTime,
    attachmentsNote: job.attachmentsNote,
    category: job.category.name,
    bidsCount: job._count.bids,
    postedAt: job.createdAt,
  };
}
