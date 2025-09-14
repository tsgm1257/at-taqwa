import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Project from "@/models/Project";
import Donation from "@/models/Donation";
import MembershipRequest from "@/models/MembershipRequest";
import Fee from "@/models/Fee";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    await dbConnect();

    // Get active projects count
    const activeProjects = await Project.countDocuments({ status: "active" });

    // Get total funds raised from successful donations
    const totalDonations = await Donation.aggregate([
      { $match: { status: "succeeded" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // Get total funds from monthly fees paid
    const totalFeesPaid = await Fee.aggregate([
      { $match: { status: "paid" } },
      { $group: { _id: null, total: { $sum: "$paidAmount" } } },
    ]);

    // Calculate combined total raised (donations + fees)
    const totalRaised = (totalDonations[0]?.total || 0) + (totalFeesPaid[0]?.total || 0);

    // Get approved members count
    const activeMembers = await MembershipRequest.countDocuments({
      status: "approved",
    });

    // Get donors this month
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const donorsThisMonth = await Donation.distinct("userId", {
      status: "succeeded",
      createdAt: { $gte: thisMonth },
    });

    return NextResponse.json({
      ok: true,
      stats: {
        activeProjects,
        totalRaised,
        activeMembers,
        donorsThisMonth: donorsThisMonth.length,
        totalDonations: totalDonations[0]?.total || 0,
        totalFeesPaid: totalFeesPaid[0]?.total || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
