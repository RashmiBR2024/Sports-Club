import { NextResponse } from "next/server";
import connectdb from "@/app/DataBaseConnectDB/mongodb";
import PaymentDataModel from "@/app/model/paymentDataModel/schema";
import { headers } from "next/headers";

// Middleware to handle CORS
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
        // Check API auth key
        if (xkey !== reqApiKey) {
            return NextResponse.json({ success: false, message: "Invalid API Auth Key" }, { status: 200 });
        }

        const dataReceived = await req.json();
        const userID = dataReceived.userID; // userID should be in the request body

        // Validate userID presence
        if (!userID) {
            return NextResponse.json({ success: false, message: "UserID is missing in the request body" }, { status: 400 });
        }

        await connectdb();

        // Find the existing payment record by userID
        let existingData = await PaymentDataModel.findOne({ userID }).exec();
        console.log("existingData", existingData);

        if (!existingData) {
            return NextResponse.json({ success: false, message: "User Not Found in Database" }, { status: 404 });
        }

        // Update the record with the new data
        const updatedData = await PaymentDataModel.updateOne({ userID }, dataReceived).exec();

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
