import { NextResponse } from "next/server";
import connectdb from "@/app/DataBaseConnectDB/mongodb";
import playersDataModel from "@/app/model/playerlists/schema";
export const dynamic = 'force-dynamic';

const xkey = process.env.API_AUTH_KEY;

export const GET = async (req) => {
    console.log("GET REQUEST: Fetch Player by Player ID");

    try {
        // Retrieve API Key from headers and query parameters
        const reqApiKey = req.headers.get("x-api-key");
        const gXkey = req.nextUrl.searchParams.get("authkey");

        // Validate API Key
        if (xkey !== reqApiKey && xkey !== gXkey) {
            return NextResponse.json(
                { success: false, error: "Invalid API Auth Key" },
                { status: 403 }
            );
        }

        // Retrieve `player_id` from query parameters
        const player_id = req.nextUrl.searchParams.get("player_id");

        if (!player_id) {
            return NextResponse.json(
                { success: false, error: "player_id parameter is required." },
                { status: 400 }
            );
        }

        // Connect to the database
        await connectdb();

        // Fetch player list by player_id
        const playerData = await playersDataModel.findOne({ "players": player_id });

        if (!playerData) {
            return NextResponse.json(
                { success: true, data: null, message: "Player not found." },
                { status: 200 }
            );
        }

        // Respond with the retrieved player data
        return NextResponse.json({ success: true, data: playerData }, { status: 200 });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
};
