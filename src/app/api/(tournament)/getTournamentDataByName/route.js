import { NextResponse } from "next/server";
import connectdb from "@/app/DataBaseConnectDB/mongodb";
import tournamentdataModel from "@/app/model/tournament/schema";
export const dynamic = 'force-dynamic';

const xkey = process.env.API_AUTH_KEY;

export const GET = async (req) => {
    console.log("GET REQUEST");

    try {
        // Get the API key from headers and query parameters
        const reqApiKey = req.headers.get("x-api-key");  // For API route headers
        const gXkey = req.nextUrl.searchParams.get("authkey"); // Get authkey from query params

        // Check if the provided API key matches the expected one
        if (xkey !== reqApiKey && xkey !== gXkey) {
            return NextResponse.json({ success: false, error: "Invalid API Auth Key" }, { status: 403 });
        }

        // Retrieve the 'name' query parameter
        const tournamentName = req.nextUrl.searchParams.get("name");

        // If 'name' parameter is not provided, return an error
        if (!tournamentName) {
            return NextResponse.json({ success: false, error: "Tournament name must be provided in the query parameters" }, { status: 400 });
        }

        // Connect to the database
        await connectdb();

        // Fetch tournaments by name if the 'name' query parameter is provided
        const tournaments = await tournamentdataModel.find({
            name: { $regex: tournamentName, $options: 'i' } // Case-insensitive search
        });

        // If no tournaments are found, return an empty array with a success status
        if (tournaments.length === 0) {
            return NextResponse.json({ success: true, data: [] }, { status: 200 });
        }

        // Respond with the retrieved tournament data
        return NextResponse.json({ success: true, data: tournaments }, { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
};
