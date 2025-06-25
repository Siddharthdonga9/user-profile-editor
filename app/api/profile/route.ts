import { type NextRequest, NextResponse } from "next/server";
import { getProfile, updateProfile } from "@/lib/profile-service";

export async function GET() {
  try {
    const profile = await getProfile();
    return NextResponse.json(
      {
        success: true,
        data: profile,
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("API GET error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch profile",
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
    const body = await request.json();
    const updatedProfile = await updateProfile(body);

    return NextResponse.json(
      {
        success: true,
        data: updatedProfile,
        message: "Profile updated successfully",
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("API PUT error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update profile",
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
