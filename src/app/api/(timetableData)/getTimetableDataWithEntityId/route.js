import { NextResponse } from "next/server";
import connectdb from "@/app/DataBaseConnectDB/mongodb";
import TimetableDataModel from "@/app/model/timetableDataModel/schema";
import { headers } from "next/headers";

const corsMiddleware = (handler) => (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, X-Amz-Date, Authorization, X-Api-Key, X-Amz-Security-Token, locale");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  return handler(req, res);
};

const xkey = process.env.API_AUTH_KEY;

async function getPosts({ reqApiKey, gXkey, entityID }) {
  try {
    if (xkey !== reqApiKey && xkey !== gXkey) {
      return "Invalid API Auth Key";
    }

    await connectdb();

    let data;

    if (entityID) {
      data = await TimetableDataModel.find({ entityID }).lean();
    } else {
      return "No entityID provided";
    }

    return data;
  } catch (error) {
    console.error("Error fetching API data:", error);
    throw new Error("Database query failed");
  }
}

export const GET = async (req, res) => {
  console.log("GET REQUEST");

  const headerList = headers();
  const reqApiKey = headerList.get("x-api-key");
  const gXkey = req.nextUrl.searchParams.get("authkey");
  const entityID = req.nextUrl.searchParams.get("entityID");

  try {
    if (!entityID) {
      return NextResponse.json({ success: false, message: "entityID is required" }, { status: 400 });
    }

    const data = await getPosts({ reqApiKey, gXkey, entityID });
    if (data && data.length > 0) {
      return NextResponse.json({ success: true, message: "Data fetched successfully", data }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, message: "No data found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
};

export default corsMiddleware(async (req, res) => {
  if (req.method === "GET") {
    return GET(req, res);
  }
  return NextResponse.json({ success: false, message: "Method Not Allowed" }, { status: 405 });
});