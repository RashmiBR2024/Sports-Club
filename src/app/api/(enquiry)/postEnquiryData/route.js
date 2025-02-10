import { NextResponse } from "next/server";
import connectdb from "@/app/DataBaseConnectDB/mongodb";
import Enquiry from "@/app/model/enquiryModel/schema";

const API_KEY = process.env.API_AUTH_KEY;

export async function POST(req) {
  try {
    console.log("POST REQUEST RECEIVED");

    const reqApiKey = req.headers.get("x-api-key");
    if (reqApiKey !== API_KEY) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    await connectdb();
    const body = await req.json();
    const { fullName, phoneNumber, email, enquiryType, message, additionalNotes, enteredBy } = body;

    if (!fullName || !phoneNumber || !enquiryType || !message || !enteredBy) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const newEnquiry = new Enquiry({ fullName, phoneNumber, email, enquiryType, message, additionalNotes, enteredBy });
    await newEnquiry.save();

    return NextResponse.json({ success: true, message: "Enquiry added successfully!", data: newEnquiry }, { status: 200 });
  } catch (error) {
    console.error("Error adding enquiry:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
