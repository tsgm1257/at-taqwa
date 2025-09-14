import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("photo") as File;

    if (!file) {
      return NextResponse.json(
        { ok: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { ok: false, error: "File must be an image" },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { ok: false, error: "File size must be less than 5MB" },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "uploads", "profiles");
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split(".").pop();
    const fileName = `${session.user.email.replace(
      /[^a-zA-Z0-9]/g,
      "_"
    )}_${timestamp}.${fileExtension}`;
    const filePath = join(uploadsDir, fileName);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Update user profile with new photo URL
    await dbConnect();
    const photoUrl = `/uploads/profiles/${fileName}`;

    console.log("Uploading photo for user:", session.user.email);
    console.log("Photo URL:", photoUrl);
    console.log("File saved to:", filePath);

    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        avatarUrl: photoUrl,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    ).lean();

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "User not found" },
        { status: 404 }
      );
    }

    console.log("Updated user profile:", user);
    console.log("Avatar URL in database:", user.avatarUrl);

    return NextResponse.json({
      ok: true,
      profile: user,
      message: "Profile photo updated successfully",
    });
  } catch (error) {
    console.error("Failed to upload profile photo:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to upload photo" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await dbConnect();

    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        avatarUrl: null,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    ).lean();

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      profile: user,
      message: "Profile photo removed successfully",
    });
  } catch (error) {
    console.error("Failed to remove profile photo:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to remove photo" },
      { status: 500 }
    );
  }
}
