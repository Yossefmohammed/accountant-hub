import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.bid.deleteMany();
  await prisma.job.deleteMany();
  await prisma.jobCategory.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("password123", 10);

  const demoAccountant = await prisma.user.create({
    data: {
      name: "Sarah Mitchell",
      email: "accountant@demo.com",
      password: passwordHash,
    },
  });

  const categories = await Promise.all(
    [
      "Tax Preparation",
      "Bookkeeping",
      "Financial Audit",
      "Payroll",
      "CFO Advisory",
    ].map((name) => prisma.jobCategory.create({ data: { name } }))
  );

  const cat = (name: string) =>
    categories.find((c) => c.name === name)!.id;

  const jobs = [
    {
      title: "Q4 Corporate Tax Filing",
      companyName: "Northwind Logistics",
      shortDescription:
        "Prepare and file corporate tax returns for Q4 with multi-state nexus review.",
      fullDescription:
        "We need an experienced CPA to complete our Q4 corporate tax filing. Scope includes reconciling GL accounts, reviewing multi-state nexus, preparing federal and state returns, and coordinating with our internal finance team. Prior experience with logistics companies is a plus.",
      budgetMin: 2500,
      budgetMax: 4500,
      deadline: new Date("2026-04-15"),
      status: "open",
      requiredSkills: "CPA, Corporate Tax, Multi-state filing",
      deliveryTime: "3–4 weeks",
      attachmentsNote: "2025 trial balance and prior-year returns will be shared after award.",
      categoryId: cat("Tax Preparation"),
    },
    {
      title: "Monthly Bookkeeping — SaaS Startup",
      companyName: "BrightLedger Inc.",
      shortDescription:
        "Ongoing monthly bookkeeping for a 12-person SaaS startup using QuickBooks Online.",
      fullDescription:
        "Looking for a part-time bookkeeper to manage monthly close, bank reconciliations, expense categorization, and management reports. We use QuickBooks Online and Stripe. You will work directly with our founder and should be comfortable with SaaS revenue recognition basics.",
      budgetMin: 800,
      budgetMax: 1200,
      deadline: new Date("2026-03-30"),
      status: "open",
      requiredSkills: "QuickBooks Online, SaaS metrics, Bank reconciliation",
      deliveryTime: "Ongoing monthly",
      attachmentsNote: "Chart of accounts export available upon request.",
      categoryId: cat("Bookkeeping"),
    },
    {
      title: "Annual Financial Audit Support",
      companyName: "Harbor Manufacturing Co.",
      shortDescription:
        "Support external auditors with PBC schedules and variance analysis for FY2025 audit.",
      fullDescription:
        "Harbor Manufacturing is entering our annual audit. We need an accountant to prepare PBC schedules, tie out balance sheet accounts, document significant transactions, and respond to auditor inquiries. Experience with manufacturing inventory and COGS is required.",
      budgetMin: 5000,
      budgetMax: 8000,
      deadline: new Date("2026-05-01"),
      status: "open",
      requiredSkills: "Audit support, Manufacturing, Inventory",
      deliveryTime: "6 weeks",
      attachmentsNote: "Auditor request list (PDF) provided at kickoff.",
      categoryId: cat("Financial Audit"),
    },
    {
      title: "Payroll Setup & Processing",
      companyName: "Urban Eats Group",
      shortDescription:
        "Set up payroll for 3 restaurant locations and process bi-weekly payroll runs.",
      fullDescription:
        "We are opening three restaurant locations and need payroll configured in Gusto (or similar), including tip reporting compliance. After setup, process bi-weekly payroll for ~45 employees. Must understand hospitality payroll rules.",
      budgetMin: 1500,
      budgetMax: 3000,
      deadline: new Date("2026-03-20"),
      status: "open",
      requiredSkills: "Payroll, Gusto, Hospitality compliance",
      deliveryTime: "2 weeks setup, then ongoing",
      categoryId: cat("Payroll"),
    },
    {
      title: "Fractional CFO — Growth Stage",
      companyName: "NovaHealth Systems",
      shortDescription:
        "Part-time CFO to build financial model, board reporting, and fundraising support.",
      fullDescription:
        "NovaHealth is raising a Series A. We need a fractional CFO for 10–15 hours/month to refine our 3-year model, prepare board decks, review cap table scenarios, and support due diligence. Healthcare or regulated industry experience preferred.",
      budgetMin: 4000,
      budgetMax: 7000,
      deadline: new Date("2026-04-01"),
      status: "open",
      requiredSkills: "Financial modeling, Fundraising, Healthcare",
      deliveryTime: "3 months initial engagement",
      categoryId: cat("CFO Advisory"),
    },
    {
      title: "1099 Contractor Cleanup",
      companyName: "Pixel Studio Agency",
      shortDescription:
        "Review contractor payments and prepare 1099-NEC filings before deadline.",
      fullDescription:
        "Creative agency with 30+ contractors needs help validating W-9s, reconciling 1099 thresholds, and filing 1099-NEC forms. Quick turnaround before IRS deadline.",
      budgetMin: 600,
      budgetMax: 1000,
      deadline: new Date("2026-01-31"),
      status: "closed",
      requiredSkills: "1099 compliance, QuickBooks",
      deliveryTime: "1 week",
      categoryId: cat("Tax Preparation"),
    },
    {
      title: "Nonprofit Grant Reporting",
      companyName: "GreenFuture Foundation",
      shortDescription:
        "Prepare grant financial reports and fund accounting reconciliations.",
      fullDescription:
        "Nonprofit with three active grants needs quarterly financial reports, restricted fund tracking, and donor-restricted revenue schedules for grantors.",
      budgetMin: 1200,
      budgetMax: 2000,
      deadline: new Date("2026-04-10"),
      status: "open",
      requiredSkills: "Nonprofit accounting, Grant reporting",
      deliveryTime: "2 weeks per quarter",
      categoryId: cat("Bookkeeping"),
    },
    {
      title: "Sales Tax Nexus Review",
      companyName: "CloudCart Retail",
      shortDescription:
        "E-commerce sales tax nexus analysis and registration recommendations.",
      fullDescription:
        "Growing e-commerce brand shipping nationwide. Need nexus study, registration roadmap, and filing calendar for top 15 states. Experience with Shopify and TaxJar/Avalara integrations.",
      budgetMin: 2000,
      budgetMax: 3500,
      deadline: new Date("2026-03-25"),
      status: "open",
      requiredSkills: "Sales tax, E-commerce, Nexus analysis",
      deliveryTime: "3 weeks",
      categoryId: cat("Tax Preparation"),
    },
  ];

  for (const job of jobs) {
    await prisma.job.create({ data: job });
  }

  const firstOpenJob = await prisma.job.findFirst({
    where: { status: "open" },
    orderBy: { id: "asc" },
  });

  if (firstOpenJob) {
    await prisma.bid.create({
      data: {
        jobId: firstOpenJob.id,
        userId: demoAccountant.id,
        proposedPrice: 3200,
        estimatedDelivery: "3 weeks",
        coverLetter:
          "I have 8+ years preparing corporate returns for logistics and distribution clients. I can start immediately and deliver before your deadline.",
        experienceSummary:
          "CPA, 8 years corporate tax, 20+ logistics clients",
      },
    });
  }

  console.log("Seed complete.");
  console.log("Demo login: accountant@demo.com / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
