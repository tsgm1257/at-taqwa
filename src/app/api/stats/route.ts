import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Project from "@/models/Project";
import Donation from "@/models/Donation";
import MembershipRequest from "@/models/MembershipRequest";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    await dbConnect();

    // Get active projects count
    const activeProjects = await Project.countDocuments({ status: "active" });

    // Get total funds raised from successful donations
    const totalRaised = await Donation.aggregate([
      { $match: { status: "succeeded" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

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
        totalRaised: totalRaised[0]?.total || 0,
        activeMembers,
        donorsThisMonth: donorsThisMonth.length,
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
