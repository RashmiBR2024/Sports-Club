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




async function getPosts({ reqApiKey, gXkey, page, size }) {
    try {
      if (xkey !== reqApiKey && xkey !== gXkey) {
        return "Invalid API Auth Key";
      }
  
      await connectdb();
  
      let data;
      const limit = size ? parseInt(size) : 10; // Default size is 10
      const skip = page ? (parseInt(page) - 1) * limit : 0;
  
   
        data = await TimetableDataModel.find().skip(skip).limit(limit).lean();
     
  
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
    const page = req.nextUrl.searchParams.get('page');
    const size = req.nextUrl.searchParams.get('size');
  
  
    console.log("GET REQUEST");
  
      // Validate page and size
      const pageNum = parseInt(page);
      const sizeNum = parseInt(size);
    
      if (isNaN(pageNum) || isNaN(sizeNum) || pageNum <= 0 || sizeNum <= 0) {
        return NextResponse.json({sucess:false, message: "Invalid page or size parameter. Both must be positive integers greater than zero." }, { status: 400 });
      }
    
    try {
      const data = await getPosts({ reqApiKey, gXkey ,page, size});
      if (data && data.length > 0) {
        return NextResponse.json({ sucess:true, message: "Data fetched successfully", data }, { status: 200 });
      } else {
        return NextResponse.json({ sucess:false, message: "No data found" }, { status: 404 });
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
    return NextResponse.json({ sucess: false,message: "Method Not Allowed" }, { status: 405 });
});

