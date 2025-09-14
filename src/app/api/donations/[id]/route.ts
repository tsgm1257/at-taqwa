import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import Donation from "@/models/Donation";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  if (!userId) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  await dbConnect();
  const { id } = await params;

  try {
    const donation = await Donation.findById(id)
      .populate("projectId", "title slug")
      .lean();

    if (!donation) {
      return NextResponse.json(
        { ok: false, error: "Donation not found" },
        { status: 404 }
      );
    }

    // Check if user owns this donation or is admin
    if (
      String(donation.userId) !== userId &&
      (session?.user as any)?.role !== "Admin"
    ) {
      return NextResponse.json(
        { ok: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      ok: true,
      donation: {
        _id: donation._id,
        amount: donation.amount,
        currency: donation.currency,
        method: donation.method,
        status: donation.status,
        createdAt: donation.createdAt,
        projectId: donation.projectId,
      },
    });
  } catch (error) {
    console.error("Error fetching donation:", error);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
