import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import Fee from "@/models/Fee";
import User from "@/models/User";
import { genFeesSchema } from "@/lib/validators/fees";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "Admin") {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = genFeesSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.flatten() }, { status: 400 });
  }
  const { month, amount, roles } = parsed.data;

  await dbConnect();

  const users = await User.find({ role: { $in: roles } }, { _id: 1 }).lean();
  if (users.length === 0) {
    return NextResponse.json({ ok: true, created: 0, message: "No users for selected roles" });
  }

  let created = 0;
  await Promise.all(
    users.map(async (u) => {
      const res = await Fee.updateOne(
        { userId: u._id, month },
        {
          $setOnInsert: {
            userId: u._id,
            month,
            amount,
            status: "unpaid",
          },
        },
        { upsert: true }
      );
      if ((res as any).upsertedCount === 1 || (res as any).upserted) created += 1;
    })
  );

  return NextResponse.json({ ok: true, created, month, amount });
}
