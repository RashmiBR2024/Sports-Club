import { NextResponse } from "next/server";
import connectdb from "@/app/DataBaseConnectDB/mongodb";
import productDataModel from "@/app/model/productDataModel/schema";
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

async function getPosts({ reqApiKey, gXkey }) {
  try {
    if (xkey !== reqApiKey && xkey !== gXkey) {
      return "Invalid API Auth Key";
    }

    await connectdb();

    // Fetch all data without pagination
    const data = await productDataModel.find().lean();
    return data;

  } catch (error) {
    console.error('Error fetching API data:', error);
    throw new Error('Database query failed');
  }
}

export const GET = async (req, res) => {
  console.log("GET REQUEST");

  const headerList = headers();
  const reqApiKey = headerList.get("x-api-key");
  const gXkey = req.nextUrl.searchParams.get('authkey');

  console.log("GET REQUEST");

  try {
    const data = await getPosts({ reqApiKey, gXkey });
    if (data && data.length > 0) {
      return NextResponse.json({ success: true, message: "Data fetched successfully", data }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, message: "No data found" }, { status: 404 });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.error(error);
  }
}

export default corsMiddleware(async (req, res) => {
  if (req.method === "GET") {
    return GET(req, res);
  }
  return NextResponse.json({ success: false, message: "Method Not Allowed" }, { status: 405 });
});