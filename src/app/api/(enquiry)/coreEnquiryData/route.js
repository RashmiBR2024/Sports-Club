import { NextResponse } from "next/server";
import connectdb from "@/app/DataBaseConnectDB/mongodb";
import Enquiry from "@/app/model/enquiryModel/schema";
export const dynamic = "force-dynamic";

const xkey = process.env.API_AUTH_KEY; // Secure API Key

// ✅ Helper Function to Validate API Key
const validateApiKey = (req) => {
  const reqApiKey = req.headers.get("x-api-key");
  return reqApiKey === xkey;
};

// ✅ 1️⃣ GET ALL CORE ENQUIRIES WITH PAGINATION (GET)
export async function GET(req) {
  console.log("GET REQUEST");

  try {
    // ✅ Validate API Key
    if (!validateApiKey(req)) {
      return NextResponse.json(
        { success: false, error: "Invalid API Auth Key" },
        { status: 403 }
      );
    }

    await connectdb();

    // ✅ Pagination Parameters
    const page = parseInt(req.nextUrl.searchParams.get("page")) || 1;
    const limit = parseInt(req.nextUrl.searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const coreEnquiries = await Enquiry.find().skip(skip).limit(limit);
    const totalEnquiries = await Enquiry.countDocuments();
    const totalPages = Math.ceil(totalEnquiries / limit);

    return NextResponse.json(
      {
        success: true,
        data: coreEnquiries,
        pagination: {
          totalItems: totalEnquiries,
          totalPages,
          currentPage: page,
          itemsPerPage: limit,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error Fetching Enquiries:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch enquiries" },
      { status: 500 }
    );
  }
}

// ✅ 2️⃣ ADD CORE ENQUIRY (POST)
export async function POST(req) {
  console.log("POST REQUEST");

  try {
    // ✅ Validate API Key
    if (!validateApiKey(req)) {
      return NextResponse.json(
        { success: false, error: "Invalid API Auth Key" },
        { status: 403 }
      );
    }

    await connectdb();
    const body = await req.json();
    const { fullName, phoneNumber, email, enquiryType, message, additionalNotes, enteredBy } = body;

    // ✅ Validate Required Fields
    if (!fullName || !phoneNumber || !enquiryType || !message || !enteredBy) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const newCoreEnquiry = new Enquiry({
      fullName,
      phoneNumber,
      email,
      enquiryType,
      message,
      additionalNotes,
      enteredBy,
    });

    await newCoreEnquiry.save();
    return NextResponse.json(
      { success: true, message: "Core enquiry added successfully!", data: newCoreEnquiry },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error Adding Enquiry:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add core enquiry", error: error.message },
      { status: 500 }
    );
  }
}
