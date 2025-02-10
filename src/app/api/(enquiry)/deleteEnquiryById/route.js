import { NextResponse } from "next/server";
import connectdb from "@/app/DataBaseConnectDB/mongodb";
import Enquiry from "@/app/model/enquirySchema";
import mongoose from "mongoose";

const API_KEY = process.env.API_AUTH_KEY;

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-api-key",
};

// ✅ Handle preflight OPTIONS request
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers });
}

// ✅ DELETE ENQUIRY BY ID (deleteEnquiryById)
export async function DELETE(req) {
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

    // ✅ Find and delete enquiry
    const deletedEnquiry = await Enquiry.findByIdAndDelete(enquiryId);

    if (!deletedEnquiry) {
      return NextResponse.json({ success: false, error: "Enquiry not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Enquiry deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting enquiry:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
