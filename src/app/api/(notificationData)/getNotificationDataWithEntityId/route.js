import { NextResponse } from "next/server";
import connectdb from "@/app/DataBaseConnectDB/mongodb";
import NotificationDataModel from "@/app/model/notifactionDataModel/schema";
import { headers } from "next/headers";
export const dynamic = 'force-dynamic';

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

export const GET = async (req, res) => {
  console.log("GET REQUEST");
  
  try {
    // Extract API key and other parameters
    const headerList = headers();
    const reqApiKey = headerList.get("x-api-key");
    const gXkey = new URL(req.url).searchParams.get('authkey');
    const { searchParams } = new URL(req.url);
    const entityID = searchParams.get("entityID");

    // Validate API key
    if (xkey !== reqApiKey && xkey !== gXkey) {
      return NextResponse.json({ message: "Invalid API Auth Key" }, { status: 403 });
    }

    if (!entityID) {
      return NextResponse.json({ message: "entityID is required" }, { status: 400 });
    }

    await connectdb();

    // Find document by entityID
    const notification = await NotificationDataModel.findOne({ entityID });

    if (!notification) {
      return NextResponse.json({ message: "No document found with this entityID" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: notification }, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
};

export default corsMiddleware(async (req, res) => {
  if (req.method === "GET") {
    return GET(req, res);
  }
  return NextResponse.json({ success: false, message: "Method Not Allowed" }, { status: 405 });
});