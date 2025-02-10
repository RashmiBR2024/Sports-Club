import { NextResponse } from "next/server";
import connectdb from "@/app/DataBaseConnectDB/mongodb";
import TimetableDataModel from "@/app/model/timetableDataModel/schema";
import { headers } from "next/headers";
import { ObjectId } from "mongodb"; // Import ObjectId to work with MongoDB object IDs

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
            return NextResponse.json({ success: false, message: "Invalid API Auth Key" }, { status: 200 });
        }

        const dataReceived = await req.json();
        const objectId = dataReceived._id; // Get the ObjectId from the request body

        if (!objectId) {
            return NextResponse.json({ success: false, message: "Object ID is missing in the request body" }, { status: 400 });
        }

        await connectdb();

        let existingData = await TimetableDataModel.findOne({ _id: new ObjectId(objectId) }).exec();
        console.log("existingData", existingData);

        if (!existingData) {
            return NextResponse.json({ success: false, message: "Document Not Found in Database" }, { status: 404 });
        }

        const updatedData = await TimetableDataModel.updateOne({ _id: new ObjectId(objectId) }, dataReceived).exec();
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
