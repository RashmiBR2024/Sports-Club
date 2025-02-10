import { NextResponse } from "next/server";
import connectdb from "@/app/DataBaseConnectDB/mongodb";
import TimetableDataModel from "@/app/model/timetableDataModel/schema";
import { headers } from "next/headers";

const corsMiddleware = (handler) => (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Origin,Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,locale");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  return handler(req, res);
};

const xkey = process.env.API_AUTH_KEY;

async function getPosts({ TimetableID, reqApiKey, gXkey }) {
  try {
    if (xkey !== reqApiKey && xkey !== gXkey) {
      return "Invalid API Auth Key";
    }

    await connectdb();

    // Fetch data based on productID only
    const data = await TimetableDataModel.find({ _id: TimetableID })
      .sort({ date: 'desc' })
      .lean();

    return data;
  } catch (error) {
    console.error('Error fetching API data:', error);
    throw new Error('Database query failed');
  }
}

export const GET = async (req, res) => {
  const headerList = headers();
  const reqApiKey = headerList.get("x-api-key");
  const TimetableID = req.nextUrl.searchParams.get('TimetableID');
  const gXkey = req.nextUrl.searchParams.get('authkey');

  console.log("GET REQUEST");

  // Validate productID
  if (!TimetableID) {
    return NextResponse.json({
      success: false,
      message: "TimetableID must be provided in the URL."
    }, { status: 400 });
  }

  try {
    const data = await getPosts({ TimetableID, reqApiKey, gXkey });
    if (data && data.length > 0) {
      return NextResponse.json({
        success: true,
        message: "Data fetched successfully",
        data
      }, { status: 200 });
    } else {
      return NextResponse.json({
        success: false,
        message: "No data found"
      }, { status: 404 });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({
      success: false,
      message: "Internal Server Error"
    }, { status: 500 });
  }
};

export default corsMiddleware(async (req, res) => {
  if (req.method === "GET") {
    return GET(req, res);
  }
  return NextResponse.json({
    success: false,
    message: "Method Not Allowed"
  }, { status: 405 });
});
