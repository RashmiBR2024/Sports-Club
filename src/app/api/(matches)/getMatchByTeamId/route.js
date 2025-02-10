import { NextResponse } from "next/server";
import connectdb from "@/app/DataBaseConnectDB/mongodb";
import matchdataModel from "@/app/model/matches/schema";
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
        await connectdb();


        // Retrieve team1 and team2 IDs from query parameters
        const team1Id = req.nextUrl.searchParams.get("team1");
        const team2Id = req.nextUrl.searchParams.get("team2");

        // If both team IDs are provided, filter the matches
        let matches;
        if (team1Id && team2Id) {
            // Fetch matches where both team1 and team2 IDs match
            matches = await matchdataModel.find({
                team_1: team1Id,
                team_2: team2Id
            });
        } else {
            // If team IDs are not provided, return an error
            return NextResponse.json({ success: false, error: "Both team1 and team2 IDs must be provided." }, { status: 400 });
        }

        // If no matches are found, return an empty array
        if (matches.length === 0) {
            return NextResponse.json({ success: true, data: [] }, { status: 200 });
        }

        // Respond with the retrieved match data
        return NextResponse.json({ success: true, data: matches }, { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
};
