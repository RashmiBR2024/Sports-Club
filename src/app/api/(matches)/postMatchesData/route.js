import { NextResponse } from "next/server";
import connectdb from "@/app/DataBaseConnectDB/mongodb";
import matchdataModel from "@/app/model/matches/schema";

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

export const POST = async (req, res) => {
    console.log("POST REQUEST");

    try {
        // Get headers directly from req.headers (for API routes)
        const reqApiKey = req.headers.get("x-api-key");  // req.headers.get() for API route headers
        const gXkey = req.nextUrl.searchParams.get("authkey"); // Get the query param key

        //console.log("Received Headers:", req.headers);

        // Check if either of the keys match the expected API key
        if (xkey !== reqApiKey && xkey !== gXkey) {
            return NextResponse.json({ success: false, error: "Invalid API Auth Key" }, { status: 403 });
        }

        // Retrieve the data from the body of the request
        const dataReceived = await req.json();
        console.log("Data Received:", dataReceived);

        // Connect to the database
        await connectdb();

        // Create a new match record using the received data
        let newMatch = new matchdataModel(dataReceived);
        newMatch = await newMatch.save();

        // Respond with the saved data
        return NextResponse.json({ success: true, data: newMatch }, { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        // Respond with error message if something goes wrong
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
};

export default corsMiddleware(async (req, res) => {
    if (req.method === "POST") {
        return POST(req, res);
    }
    return NextResponse.json({ success: false, message: "Method Not Allowed" }, { status: 405 });
});
