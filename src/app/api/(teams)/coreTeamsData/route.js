import { NextResponse } from "next/server";
import connectdb from "@/app/DataBaseConnectDB/mongodb";
import TeamModel from "@/app/model/teams/schema";
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
    try {
        // Extract query parameters using nextUrl.searchParams
        const name = req.nextUrl.searchParams.get("name");
        const owner = req.nextUrl.searchParams.get("owner");
        const coachName = req.nextUrl.searchParams.get("coachName");
        const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
        const limit = parseInt(req.nextUrl.searchParams.get("limit") || "10", 10);

        // Construct filters based on query parameters
        const filters = {};
        if (name) filters.name = { $regex: name, $options: "i" };
        if (owner) filters.owner = { $regex: owner, $options: "i" };
        if (coachName) filters.coachName = { $regex: coachName, $options: "i" };

        // Connect to MongoDB
        await connectdb();

        // Fetch the filtered and paginated teams
        const skip = (page - 1) * limit;
        const teams = await TeamModel.find(filters)
            .skip(skip)
            .limit(limit)
            .sort({ createYear: -1 });

        // Get the total count of teams matching the filters
        const totalTeams = await TeamModel.countDocuments(filters);

        // Return response
        return NextResponse.json({
            success: true,
            data: teams,
            pagination: {
                total: totalTeams,
                page,
                limit,
                totalPages: Math.ceil(totalTeams / limit),
            },
        });
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
