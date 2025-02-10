import { NextResponse } from "next/server";
import connectdb from "@/app/DataBaseConnectDB/mongodb";
import TeamModel from "@/app/model/teams/schema";

const API_KEY = process.env.NEXT_PUBLIC_API_AUTH_KEY;

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const teamId = searchParams.get("teamId");

    console.log("Received teamId in API:", teamId);  // ✅ Debugging log

    if (!teamId) {
      return NextResponse.json({ success: false, error: "Team ID is required" }, { status: 400 });
    }

    const reqApiKey = req.headers.get("x-api-key");
    if (reqApiKey !== API_KEY) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    await connectdb();
    const deletedTeam = await TeamModel.findByIdAndDelete(teamId);

    if (!deletedTeam) {
      return NextResponse.json({ success: false, error: "Team not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Team deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting team:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
