import { NextResponse } from "next/server";
import connectdb from "@/app/DataBaseConnectDB/mongodb";
import TeamModel from "@/app/model/teams/schema";
export const dynamic = 'force-dynamic';

const corsMiddleware = (handler) => (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, X-Amz-Date, Authorization, X-Amz-Security-Token, locale");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    return handler(req, res);
};

const xkey = process.env.API_AUTH_KEY;

export const GET = async (req) => {
    try {
        const teamId = req.nextUrl.searchParams.get('team_id'); // Extract 'team_id' from query params
        const authKey = req.nextUrl.searchParams.get('authkey'); // Extract 'authkey'

        // // Validate the authkey
        // if (authKey !== xkey) {
        //     return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        // }

        // Connect to the database
        await connectdb();

        if (teamId) {
            // Fetch a specific team by ID
            const team = await TeamModel.findById(teamId);
            if (!team) {
                return NextResponse.json({ success: false, error: "Team not found" }, { status: 404 });
            }
            return NextResponse.json({ success: true, data: team });
        }

        // If no teamId is provided, fetch all teams
        const teams = await TeamModel.find().sort({ createYear: -1 }); // Sort teams by creation year
        return NextResponse.json({ success: true, data: teams });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
};

export default corsMiddleware(async (req, res) => {
    if (req.method === "GET") {
        return GET(req, res);
    }
    return NextResponse.json({ success: false, message: "Method Not Allowed" }, { status: 405 });
});
