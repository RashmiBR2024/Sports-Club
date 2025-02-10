import { NextResponse } from "next/server";
import connectdb from "@/app/DataBaseConnectDB/mongodb"; // ✅ Connect to database
import EnquiryType from "@/app/model/enquiryTypeSchema"; // ✅ Import enquiry type model

const API_KEY = process.env.API_AUTH_KEY; // ✅ Load API key from environment variables

export async function POST(req) {
    try {
        await connectdb(); // ✅ Ensure database connection

        // ✅ Validate API key
        const reqApiKey = req.headers.get("x-api-key");
        if (!reqApiKey || reqApiKey !== API_KEY) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        // ✅ Parse request body
        const { name } = await req.json();
        if (!name) {
            return NextResponse.json({ success: false, error: "Enquiry type name is required" }, { status: 400 });
        }

        // ✅ Check if enquiry type already exists
        const existingType = await EnquiryType.findOne({ name });
        if (existingType) {
            return NextResponse.json({ success: false, error: "Enquiry type already exists" }, { status: 400 });
        }

        // ✅ Save new enquiry type
        const newEnquiryType = new EnquiryType({ name });
        await newEnquiryType.save();

        return NextResponse.json({ success: true, message: "Enquiry type added successfully", data: newEnquiryType });
    } catch (error) {
        console.error("Error adding enquiry type:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
