import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Donation from "@/models/Donation";
import Fee from "@/models/Fee";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month"); // "YYYY-MM" format
    
    if (!month) {
      return NextResponse.json(
        { ok: false, error: "Month parameter is required (YYYY-MM format)" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Calculate start and end of month
    const startOfMonth = new Date(`${month}-01T00:00:00.000Z`);
    const endOfMonth = new Date(`${month}-01T00:00:00.000Z`);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0); // Last day of the month
    endOfMonth.setHours(23, 59, 59, 999);

    console.log("Calculating income for month:", month, {
      startOfMonth: startOfMonth.toISOString(),
      endOfMonth: endOfMonth.toISOString()
    });

    // Get donations for the month
    const donationsForMonth = await Donation.aggregate([
      {
        $match: {
          status: "succeeded",
          createdAt: {
            $gte: startOfMonth,
            $lte: endOfMonth
          }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      }
    ]);

    // Get fees paid for the month (fees with paidAt in the month)
    const feesPaidForMonth = await Fee.aggregate([
      {
        $match: {
          status: "paid",
          paidAt: {
            $gte: startOfMonth,
            $lte: endOfMonth
          }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$paidAmount" },
          count: { $sum: 1 }
        }
      }
    ]);

    const totalDonations = donationsForMonth[0]?.total || 0;
    const totalFeesPaid = feesPaidForMonth[0]?.total || 0;
    const totalIncome = totalDonations + totalFeesPaid;

    console.log("Income calculation results:", {
      month,
      totalDonations,
      totalFeesPaid,
      totalIncome,
      donationsCount: donationsForMonth[0]?.count || 0,
      feesCount: feesPaidForMonth[0]?.count || 0
    });

    return NextResponse.json({
      ok: true,
      month,
      income: {
        donations: {
          amount: totalDonations,
          count: donationsForMonth[0]?.count || 0
        },
        fees: {
          amount: totalFeesPaid,
          count: feesPaidForMonth[0]?.count || 0
        },
        total: totalIncome
      }
    });

  } catch (error) {
    console.error("Error calculating monthly income:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to calculate income" },
      { status: 500 }
    );
  }
}
