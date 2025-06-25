import { type NextRequest, NextResponse } from "next/server";
import { getProfile, updateProfile } from "@/lib/profile-service";

export async function GET() {
  try {
    console.log("API GET: Fetching profile data...");
    const profile = await getProfile();

    const response = {
      success: true,
      data: profile,
      timestamp: new Date().toISOString(),
    };

    console.log("API GET: Profile fetched successfully", profile);

    return NextResponse.json(response, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("API GET error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch profile",
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log("API PUT: Updating profile...");
    const body = await request.json();
    console.log("API PUT: Received data:", body);

    const updatedProfile = await updateProfile(body);

    const response = {
      success: true,
      data: updatedProfile,
      message: "Profile updated successfully",
      timestamp: new Date().toISOString(),
    };

    console.log("API PUT: Profile updated successfully", updatedProfile);

    return NextResponse.json(response, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("API PUT error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update profile",
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
