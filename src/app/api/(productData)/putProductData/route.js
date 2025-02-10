import { NextResponse } from "next/server";
import connectdb from "@/app/DataBaseConnectDB/mongodb";
import productDataModel from "@/app/model/productDataModel/schema";
import { headers } from "next/headers";

const corsMiddleware = (handler) => async (req, res) => {
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
export const PUT = async (req, res) => {
    console.log("PUT REQUEST");
    const headerList = headers();
    const reqApiKey = headerList.get("x-api-key");
    
    try {
        if (xkey !== reqApiKey) {
            return NextResponse.json({ success: false, message: "Invalid API Auth Key" }, { status: 401 });
        }

        const url = new URL(req.url);
        const productID = url.searchParams.get('productID');
        if (!productID) {
            return NextResponse.json({ success: false, message: "productID is required in the URL" }, { status: 400 });
        }

        const dataReceived = await req.json();

        await connectdb();

        let existingData = await productDataModel.findOne({ _id: productID }).exec();
        console.log("existingData", existingData);

        if (!existingData) {
            return NextResponse.json({ success: false, message: "Product Not Found in Database" }, { status: 404 });
        }

        // Update the existing document with the new data
        const updatedData = await productDataModel.updateOne({ _id: productID }, dataReceived).exec();
        if (updatedData.nModified === 0) {
            return NextResponse.json({ success: false, message: "No Changes Made" }, { status: 200 });
        }

        return NextResponse.json({ success: true, data: updatedData }, { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
};

export default corsMiddleware(async (req, res) => {
    if (req.method === "PUT") {
        return PUT(req, res);
    }
    return NextResponse.json({ success: false, message: "Method Not Allowed" }, { status: 405 });
});
