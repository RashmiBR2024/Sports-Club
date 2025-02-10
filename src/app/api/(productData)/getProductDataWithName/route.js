import { NextResponse } from "next/server";
import connectdb from "@/app/DataBaseConnectDB/mongodb";
import productDataModel from "@/app/model/productDataModel/schema";
import { headers } from "next/headers";

// CORS Middleware
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

// Function to get data by productName with pagination
async function getPosts({ name, reqApiKey, gXkey, page, size }) {
  try {
    // Validate API keys
    if (xkey !== reqApiKey && xkey !== gXkey) {
      return "Invalid API Auth Key";
    }

    await connectdb();

    const limit = size ? parseInt(size) : 10; // Default size is 10
    const skip = page ? (parseInt(page) - 1) * limit : 0;

    // Fetch data by productName with pagination
    const data = await productDataModel.find({ productName: name })
      .sort({ date: 'desc' })
      .skip(skip)
      .limit(limit)
      .lean();

    return data;
  } catch (error) {
    console.error('Error fetching API data:', error);
    throw new Error('Database query failed');
  }
}

// GET handler
export const GET = async (req, res) => {
  const headerList = headers();
  const reqApiKey = headerList.get("x-api-key");
  const name = req.nextUrl.searchParams.get('name');
  const gXkey = req.nextUrl.searchParams.get('authkey');
  const page = req.nextUrl.searchParams.get('page');
  const size = req.nextUrl.searchParams.get('size');

  console.log("GET REQUEST");

  // Validate the product name
  if (!name) {
    return NextResponse.json({
      success: false,
      message: "The 'name' parameter must be provided in the URL."
    }, { status: 400 });
  }

  // Validate page and size parameters
  const pageNum = page ? parseInt(page) : 1;
  const sizeNum = size ? parseInt(size) : 10;

  if (isNaN(pageNum) || isNaN(sizeNum) || pageNum <= 0 || sizeNum <= 0) {
    return NextResponse.json({
      success: false,
      message: "Invalid 'page' or 'size' parameter. Both must be positive integers greater than zero."
    }, { status: 400 });
  }

  try {
    const data = await getPosts({ name, reqApiKey, gXkey, page: pageNum, size: sizeNum });
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

// Exporting with CORS middleware
export default corsMiddleware(async (req, res) => {
  if (req.method === "GET") {
    return GET(req, res);
  }
  return NextResponse.json({
    success: false,
    message: "Method Not Allowed"
  }, { status: 405 });
});
