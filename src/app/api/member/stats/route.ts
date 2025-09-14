import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import Donation from "@/models/Donation";
import Fee from "@/models/Fee";
import Event from "@/models/Event";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    
    if (!userId) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    // Get member's donation statistics
    const donationStats = await Donation.aggregate([
      { $match: { userId, status: "succeeded" } },
      {
        $group: {
          _id: null,
          totalDonations: { $sum: 1 },
          totalContributed: { $sum: "$amount" },
        },
      },
    ]);

    // Get member's fee statistics
    const feeStats = await Fee.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: null,
          totalFees: { $sum: 1 },
          paidFees: { $sum: { $cond: [{ $eq: ["$status", "paid"] }, 1, 0] } },
        },
      },
    ]);

    // Get member's activity duration (years active)
    const memberSince = await Donation.findOne({ userId })
      .sort({ createdAt: 1 })
      .select("createdAt")
      .lean();

    const yearsActive = memberSince
      ? Math.floor(
          (Date.now() - new Date(memberSince.createdAt).getTime()) /
            (1000 * 60 * 60 * 24 * 365)
        )
      : 0;

    // Get events attended (for now, we'll use a placeholder since we don't have event attendance tracking)
    const eventsAttended = 0; // This would need to be implemented with event attendance tracking

    const stats = {
      totalDonations: donationStats[0]?.totalDonations || 0,
      totalContributed: donationStats[0]?.totalContributed || 0,
      eventsAttended,
      yearsActive: Math.max(yearsActive, 0),
      totalFees: feeStats[0]?.totalFees || 0,
      paidFees: feeStats[0]?.paidFees || 0,
    };

    return NextResponse.json({
      ok: true,
      stats,
    });
  } catch (error) {
    console.error("Error fetching member stats:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch member stats" },
      { status: 500 }
    );
  }
}
