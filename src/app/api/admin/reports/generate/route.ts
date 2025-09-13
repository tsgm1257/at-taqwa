import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import Report from "@/models/Report";
import Donation from "@/models/Donation";
import Fee from "@/models/Fee";

function monthRange(month: string) {
  // month = "YYYY-MM"
  const [y, m] = month.split("-").map(Number);
  const start = new Date(Date.UTC(y, m - 1, 1, 0, 0, 0));
  const end = new Date(Date.UTC(y, m, 1, 0, 0, 0)); // exclusive
  return { start, end };
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "Admin") {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  const { month, openingBalance, overwrite } = await req.json();
  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return NextResponse.json({ ok: false, error: "month must be YYYY-MM" }, { status: 400 });
  }

  await dbConnect();

  // Sum donations (succeeded) within createdAt in month
  const { start, end } = monthRange(month);
  const donationsAgg = await Donation.aggregate([
    { $match: { status: "succeeded", createdAt: { $gte: start, $lt: end } } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  const donationsTotal = donationsAgg[0]?.total || 0;

  // Sum fees where month matches and status in ["paid","partial"] using paidAmount
  const feesAgg = await Fee.aggregate([
    { $match: { month, status: { $in: ["paid", "partial"] } } },
    { $group: { _id: null, total: { $sum: "$paidAmount" } } },
  ]);
  const feesTotal = feesAgg[0]?.total || 0;

  // Build income lines
  const income = [
    { category: "Donations", amount: donationsTotal, note: "" },
    { category: "Monthly Fees", amount: feesTotal, note: "" },
  ];

  // Find existing report
  let report = await Report.findOne({ month });
  if (!report) {
    report = new Report({
      title: `Financial Report — ${month}`,
      month,
      openingBalance: Number(openingBalance) || 0,
      income,
      expense: [], // Admin can add expenses later
      currency: "BDT",
      published: true,
      preparedBy: session.user?.email || "admin",
    });
  } else {
    if (overwrite) {
      report.income = income;
      if (openingBalance !== undefined) report.openingBalance = Number(openingBalance);
    } else {
      // Merge: update/replace categories Donations & Monthly Fees only
      const others = (report.income || []).filter(
        (i: any) => !["Donations", "Monthly Fees"].includes(i.category)
      );
      report.income = [...others, ...income];
      if (openingBalance !== undefined) report.openingBalance = Number(openingBalance);
    }
  }

  await report.save(); // recalculates totals via pre-save hook
  return NextResponse.json({
    ok: true,
    item: {
      id: String(report._id),
      month: report.month,
      totalIncome: report.totalIncome,
      totalExpense: report.totalExpense,
      closingBalance: report.closingBalance,
    },
  });
}
