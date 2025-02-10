import { NextResponse } from "next/server";
import connectdb from "@/app/DataBaseConnectDB/mongodb";
import PaymentDataModel from "@/app/model/paymentDataModel/schema";
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

export const POST = async (req, res) => {
  console.log("POST REQUEST");
  const headerList = headers();
  const reqApiKey = headerList.get("x-api-key");
if(xkey !== reqApiKey){
  return NextResponse.json({ message: "Invalid API Auth Key" }, { status: 200 });
}
  try {
    const dataReceived = await req.json();
    console.log(dataReceived);
    const checkPhone = dataReceived.phone;

    await connectdb();

    const post = await PaymentDataModel.create(dataReceived);

    return NextResponse.json({ success: true, data: post }, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
};

export default corsMiddleware(async (req, res) => {
  if (req.method === "POST") {
    return POST(req, res);
  }
  return NextResponse.json({success:false, message: "Method Not Allowed" }, { status: 405 });
});