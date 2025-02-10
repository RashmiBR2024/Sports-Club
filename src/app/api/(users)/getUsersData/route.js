import { NextResponse } from "next/server";
import connectdb from "@/app/DataBaseConnectDB/mongodb";
import UserModel from "@/app/model/users/schema";

export const dynamic = 'force-dynamic';

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

export const GET = async (req) => {
    console.log("GET REQUEST");

    try {
        // Extract API key from headers or query params
        const reqApiKey = req.headers.get("x-api-key");
        const gXkey = req.nextUrl.searchParams.get("authkey");

        if (xkey !== reqApiKey && xkey !== gXkey) {
            return NextResponse.json({ success: false, error: "Invalid API Auth Key" }, { status: 403 });
        }

        // Connect to the database
        await connectdb();

        // Parse query parameters
        const searchParams = req.nextUrl.searchParams;
        const phoneNumber = searchParams.get("phoneNumber");
        const id = searchParams.get("id");

        // Check if neither phoneNumber nor id are provided
        if (!phoneNumber && !id) {
            return NextResponse.json({ success: false, error: "At least one of 'phoneNumber' or 'id' must be provided" }, { status: 400 });
        }

        // Build filters dynamically
        const filters = {};
        if (phoneNumber) filters.phoneNumber = phoneNumber; // Exact match for phoneNumber
        if (id) filters._id = id; // Exact match for MongoDB's `_id`

        console.log("Filters:", filters);

        // Fetch users from the database
        const users = await UserModel.find(filters).sort({ createdAt: -1 }); // Sort by newest first

        // Check if users array is empty
        if (users.length === 0) {
            return NextResponse.json({
                success: false,
                message: "No matching data found for the given filters",
            });
        }

        // Respond with user data
        return NextResponse.json({
            success: true,
            data: users,
        });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
};

export default corsMiddleware(async (req, res) => {
    if (req.method === "GET") {
        return GET(req);
    }
    return NextResponse.json({ success: false, message: "Method Not Allowed" }, { status: 405 });
});
