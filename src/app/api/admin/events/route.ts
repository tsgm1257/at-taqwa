import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import Event from "@/models/Event";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any)?.role !== "Admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");

    // Build filter object
    const filter: any = {};
    if (category && category !== "all") {
      filter.category = category;
    }
    if (status && status !== "all") {
      filter.status = status;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Fetch events with pagination
    const events = await Event.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await Event.countDocuments(filter);

    return NextResponse.json({
      success: true,
      events,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching admin events:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any)?.role !== "Admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const body = await req.json();
    const {
      title,
      description,
      date,
      time,
      location,
      category,
      maxAttendees,
      registrationRequired,
      contactInfo,
    } = body;

    // Validate required fields
    if (!title || !description || !date || !location) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create new event
    const event = new Event({
      title,
      description,
      date: new Date(date),
      time,
      location,
      category: category || "General",
      maxAttendees: maxAttendees || null,
      registrationRequired: registrationRequired || false,
      contactInfo: contactInfo || null,
      status: "upcoming",
      attendees: [],
      createdBy: session.user.email,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await event.save();

    return NextResponse.json({
      success: true,
      event,
      message: "Event created successfully",
    });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create event" },
      { status: 500 }
    );
  }
}
