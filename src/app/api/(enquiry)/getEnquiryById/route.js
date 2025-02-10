import { NextResponse } from "next/server";
import connectdb from "@/app/DataBaseConnectDB/mongodb";
import Enquiry from "@/app/model/enquirySchema";
import mongoose from "mongoose";

const API_KEY = process.env.API_AUTH_KEY;

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-api-key",
};

// ✅ Handle preflight OPTIONS request
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers });
}

// ✅ GET ENQUIRY BY ID (getEnquiryById)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const enquiryId = searchParams.get("enquiryId");

    console.log("Received enquiryId in API:", enquiryId);

    if (!enquiryId) {
      return NextResponse.json({ success: false, error: "Enquiry ID is required" }, { status: 400 });
    }

    // ✅ Validate API Key
    const reqApiKey = req.headers.get("x-api-key");
    if (reqApiKey !== API_KEY) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    // ✅ Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(enquiryId)) {
      return NextResponse.json({ success: false, error: "Invalid Enquiry ID" }, { status: 400 });
    }

    // ✅ Connect to DB
    await connectdb();

    // ✅ Find enquiry by ID
    const enquiry = await Enquiry.findById(enquiryId);

    if (!enquiry) {
      return NextResponse.json({ success: false, error: "Enquiry not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: enquiry }, { status: 200 });
  } catch (error) {
    console.error("Error fetching enquiry:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
