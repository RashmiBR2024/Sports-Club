import { NextResponse } from "next/server";
import connectdb from "@/app/DataBaseConnectDB/mongodb";
import TeamModel from "@/app/model/teams/schema";

const corsMiddleware = (handler) => async (req) => {
    const res = NextResponse.next();
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.headers.set("Access-Control-Allow-Headers", "Origin, Content-Type, X-Amz-Date, Authorization, X-Api-Key, X-Amz-Security-Token, locale");
    res.headers.set("Access-Control-Allow-Credentials", "true");

    if (req.method === "OPTIONS") {
        return res;
    }

    return handler(req, res);
};

const xkey = process.env.API_AUTH_KEY;

export const POST = async (req) => {
    console.log("POST REQUEST RECEIVED");

    try {
        // Get headers directly from req.headers (for API routes)
        const reqApiKey = req.headers.get("x-api-key");
        const gXkey = req.nextUrl.searchParams.get("authkey");

        // Check if either of the keys match the expected API key
        if (xkey !== reqApiKey && xkey !== gXkey) {
            console.error("Invalid API Auth Key");
            return NextResponse.json({ success: false, error: "Invalid API Auth Key" }, { status: 403 });
        }

        // Retrieve the data from the body of the request
        const dataReceived = await req.json();
        console.log("Data Received:", dataReceived);

        // Ensure required fields are provided
        const { name, logo_url, owner, coachName, createYear, teamColor } = dataReceived;
        if (!name || !owner || !coachName || !createYear) {
            console.error("Missing required fields");
            return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
        }

        // Validate image_url if provided
        if (logo_url) {
            const urlPattern = /^(https?:\/\/[^\s/$.?#].[^\s]*)$/;
            if (!urlPattern.test(logo_url)) {
                console.error("Invalid image URL format");
                return NextResponse.json({ success: false, error: "Invalid image URL format" }, { status: 400 });
            }
        }

        // Validate teamColor
        const colorPattern = /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/;
        if (teamColor && !colorPattern.test(teamColor)) {
            console.error("Invalid team color format");
            return NextResponse.json({ success: false, error: "Invalid team color format" }, { status: 400 });
        }

        // Connect to the database
        try {
            await connectdb();
        } catch (dbError) {
            console.error("Database connection failed:", dbError);
            return NextResponse.json({ success: false, error: "Database connection failed" }, { status: 500 });
        }

        const newTeam = new TeamModel({
            name,
            owner,
            coachName,
            createYear,
            logo_url: logo_url || "/default-logo.png", // Default logo if none is provided
            teamColor: teamColor || "#090F13", // Default color if none is provided
        });

        // Save the new team to the database
        const savedTeam = await newTeam.save();

        console.log("New Team Created:", savedTeam);

        // Respond with the saved data
        return NextResponse.json({ success: true, data: savedTeam }, { status: 200 });
    } catch (error) {
        console.error("Error occurred:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
};

export default corsMiddleware(async (req) => {
    if (req.method === "POST") {
        return POST(req);
    }
    console.error("Method Not Allowed");
    return NextResponse.json({ success: false, message: "Method Not Allowed" }, { status: 405 });
});
