import { NextResponse } from "next/server";
import connectdb from "@/app/DataBaseConnectDB/mongodb";
import EnquiryType from "@/app/model/enquiryTypeSchema";

const API_KEY = process.env.API_AUTH_KEY; // Store API key in .env.local

export async function GET(req) {
    try {
        await connectdb();

        // ✅ Validate API key
        const reqApiKey = req.headers.get("x-api-key");
        if (!reqApiKey || reqApiKey !== API_KEY) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const enquiryTypes = await EnquiryType.find();
        return NextResponse.json({ success: true, data: enquiryTypes });
    } catch (error) {
        console.error("Error fetching enquiry types:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
