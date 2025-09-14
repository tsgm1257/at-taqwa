import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import MembershipRequest from "@/models/MembershipRequest";
import Fee from "@/models/Fee";

export const dynamic = "force-dynamic";

// Default monthly fee amount (can be made configurable later)
const DEFAULT_MONTHLY_FEE = 100; // BDT

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as { id: string; role: string; email: string; name: string };
    
    // Only admins can trigger fee generation
    if (!user || user.role !== "Admin") {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const currentDate = new Date();
    const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    
    console.log(`Starting monthly fee generation for ${currentMonth}`);

    // Get all approved members
    const approvedMembers = await MembershipRequest.find({ 
      status: "approved" 
    }).lean();

    console.log(`Found ${approvedMembers.length} approved members`);

    let generatedCount = 0;
    let skippedCount = 0;
    const errors = [];

    for (const member of approvedMembers) {
      try {
        // Find the user associated with this membership request
        const user = await User.findOne({ email: member.email }).lean();
        if (!user) {
          console.warn(`User not found for member: ${member.email}`);
          continue;
        }

        // Calculate the start month (month they joined)
        const joinDate = new Date(member.createdAt);
        const joinMonth = `${joinDate.getFullYear()}-${String(joinDate.getMonth() + 1).padStart(2, '0')}`;
        
        console.log(`Processing member ${member.name} (${member.email}) - joined: ${joinMonth}`);

        // Generate fees from join month to current month
        const monthsToGenerate = generateMonthsBetween(joinMonth, currentMonth);
        
        for (const month of monthsToGenerate) {
          // Check if fee already exists for this month
          const existingFee = await Fee.findOne({
            userId: (user as any)._id,
            month: month
          });

          if (existingFee) {
            console.log(`Fee already exists for ${member.name} - ${month}`);
            skippedCount++;
            continue;
          }

          // Create new fee
          await Fee.create({
            userId: (user as any)._id,
            month: month,
            amount: DEFAULT_MONTHLY_FEE,
            status: "unpaid",
            paidAmount: 0,
            notes: `Auto-generated monthly fee for ${month}`
          });

          console.log(`Generated fee for ${member.name} - ${month}: BDT ${DEFAULT_MONTHLY_FEE}`);
          generatedCount++;
        }

      } catch (error) {
        console.error(`Error processing member ${member.email}:`, error);
        errors.push({
          member: member.email,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }

    const result = {
      ok: true,
      message: `Monthly fee generation completed for ${currentMonth}`,
      summary: {
        totalMembers: approvedMembers.length,
        feesGenerated: generatedCount,
        feesSkipped: skippedCount,
        errors: errors.length
      },
      errors: errors.length > 0 ? errors : undefined
    };

    console.log("Fee generation completed:", result.summary);

    return NextResponse.json(result);

  } catch (error) {
    console.error("Error in monthly fee generation:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to generate monthly fees" },
      { status: 500 }
    );
  }
}

/**
 * Generate array of months between start and end month (inclusive)
 * @param startMonth Format: "YYYY-MM"
 * @param endMonth Format: "YYYY-MM"
 * @returns Array of months in "YYYY-MM" format
 */
function generateMonthsBetween(startMonth: string, endMonth: string): string[] {
  const months = [];
  const [startYear, startMonthNum] = startMonth.split('-').map(Number);
  const [endYear, endMonthNum] = endMonth.split('-').map(Number);
  
  let currentYear = startYear;
  let currentMonthNum = startMonthNum;
  
  while (
    currentYear < endYear || 
    (currentYear === endYear && currentMonthNum <= endMonthNum)
  ) {
    months.push(`${currentYear}-${String(currentMonthNum).padStart(2, '0')}`);
    
    currentMonthNum++;
    if (currentMonthNum > 12) {
      currentMonthNum = 1;
      currentYear++;
    }
  }
  
  return months;
}

/**
 * GET endpoint to manually trigger fee generation (for testing)
 */
export async function GET() {
  // Call the same logic as POST
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as { id: string; role: string; email: string; name: string };
    
    // Only admins can trigger fee generation
    if (!user || user.role !== "Admin") {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const currentDate = new Date();
    const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    
    console.log(`Starting monthly fee generation for ${currentMonth}`);

    // Get all approved members
    const approvedMembers = await MembershipRequest.find({ 
      status: "approved" 
    }).lean();

    console.log(`Found ${approvedMembers.length} approved members`);

    let generatedCount = 0;
    let skippedCount = 0;
    const errors = [];

    for (const member of approvedMembers) {
      try {
        // Find the user associated with this membership request
        const user = await User.findOne({ email: member.email }).lean();
        if (!user) {
          console.warn(`User not found for member: ${member.email}`);
          continue;
        }

        // Calculate the start month (month they joined)
        const joinDate = new Date(member.createdAt);
        const joinMonth = `${joinDate.getFullYear()}-${String(joinDate.getMonth() + 1).padStart(2, '0')}`;
        
        console.log(`Processing member ${member.name} (${member.email}) - joined: ${joinMonth}`);

        // Generate fees from join month to current month
        const monthsToGenerate = generateMonthsBetween(joinMonth, currentMonth);
        
        for (const month of monthsToGenerate) {
          // Check if fee already exists for this month
          const existingFee = await Fee.findOne({
            userId: (user as any)._id,
            month: month
          });

          if (existingFee) {
            console.log(`Fee already exists for ${member.name} - ${month}`);
            skippedCount++;
            continue;
          }

          // Create new fee
          await Fee.create({
            userId: (user as any)._id,
            month: month,
            amount: DEFAULT_MONTHLY_FEE,
            status: "unpaid",
            paidAmount: 0,
            notes: `Auto-generated monthly fee for ${month}`
          });

          console.log(`Generated fee for ${member.name} - ${month}: BDT ${DEFAULT_MONTHLY_FEE}`);
          generatedCount++;
        }

      } catch (error) {
        console.error(`Error processing member ${member.email}:`, error);
        errors.push({
          member: member.email,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }

    const result = {
      ok: true,
      message: `Monthly fee generation completed for ${currentMonth}`,
      summary: {
        totalMembers: approvedMembers.length,
        feesGenerated: generatedCount,
        feesSkipped: skippedCount,
        errors: errors.length
      },
      errors: errors.length > 0 ? errors : undefined
    };

    console.log("Fee generation completed:", result.summary);

    return NextResponse.json(result);

  } catch (error) {
    console.error("Error in monthly fee generation:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to generate monthly fees" },
      { status: 500 }
    );
  }
}