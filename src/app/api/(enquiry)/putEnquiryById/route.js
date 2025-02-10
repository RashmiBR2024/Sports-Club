import { NextResponse } from "next/server";
import connectdb from "@/app/DataBaseConnectDB/mongodb";
import Enquiry from "@/app/model/enquirySchema";
import mongoose from "mongoose";

const API_KEY = process.env.API_AUTH_KEY;

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "PUT, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-api-key",
};

// ✅ Handle preflight OPTIONS request
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers });
}

// ✅ UPDATE ENQUIRY BY ID (putEnquiryById)
export async function PUT(req) {
  try {
    console.log("PUT REQUEST RECEIVED");

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

    await connectdb();
    const body = await req.json();

    const updatedEnquiry = await Enquiry.findByIdAndUpdate(enquiryId, body, { new: true });

    if (!updatedEnquiry) {
      return NextResponse.json({ success: false, error: "Enquiry not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Enquiry updated successfully!", data: updatedEnquiry }, { status: 200 });
  } catch (error) {
    console.error("Error updating enquiry:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
