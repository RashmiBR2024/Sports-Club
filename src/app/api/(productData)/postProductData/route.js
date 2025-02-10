import { NextResponse } from "next/server";
import connectdb from "@/app/DataBaseConnectDB/mongodb";
import productDataModel from "@/app/model/productDataModel/schema";
import { headers } from "next/headers";

// Middleware to handle CORS
const corsMiddleware = (handler) =>  (req, res) => {
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

export const POST = async (req, res) => {
    console.log("POST REQUEST");
    const headerList = headers();
    const reqApiKey = headerList.get("x-api-key");
    if (xkey !== reqApiKey) {
        return NextResponse.json({ success: false, message: "Invalid API Auth Key" }, { status: 200 });
    }
    try {
        const dataReceived = await req.json();
        console.log(dataReceived);

        await connectdb();

        let newProduct = new productDataModel(dataReceived);

        newProduct = await newProduct.save();

        return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

// Handle other HTTP methods
export default corsMiddleware (async (req, res) => {
    if (req.method === "POST") {
        return POST(req, res);
    }
    return NextResponse.json({ success: false, message: "Method Not Allowed" }, { status: 405 });
});







