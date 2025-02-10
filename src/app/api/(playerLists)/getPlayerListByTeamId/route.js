import { NextResponse } from "next/server";
import connectdb from "@/app/DataBaseConnectDB/mongodb";
import playersDataModel from "@/app/model/playerlists/schema";
export const dynamic = 'force-dynamic';

const xkey = process.env.API_AUTH_KEY;

export const GET = async (req) => {
    console.log("GET REQUEST");

    try {
        // Get the API key from headers and query parameters
        const reqApiKey = req.headers.get("x-api-key"); // For API route headers
        const gXkey = req.nextUrl.searchParams.get("authkey"); // Get authkey from query params

        // Check if the provided API key matches the expected one
        if (xkey !== reqApiKey && xkey !== gXkey) {
            return NextResponse.json(
                { success: false, error: "Invalid API Auth Key" },
                { status: 403 }
            );
        }

        // Retrieve `userid` from query parameters
        const teamid = req.nextUrl.searchParams.get("team_id");

        if (!teamid) {
            // Return an error if `userid` is not provided
            return NextResponse.json(
                { success: false, error: "teamid parameter is required." },
                { status: 400 }
            );
        }

        // Connect to the database
        await connectdb();

        // Fetch statistics for the given userid
        const playerlists = await playersDataModel.findOne({ team_id: teamid });

        if (!playerlists) {
            // If no statistics are found, return an empty object
            return NextResponse.json(
                { success: true, data: null },
                { status: 200 }
            );
        }

        // Respond with the retrieved statistics data
        return NextResponse.json({ success: true, data: playerlists }, { status: 200 });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
};
