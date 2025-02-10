import { NextResponse } from "next/server";
import connectdb from "@/app/DataBaseConnectDB/mongodb";
import matchdataModel from "@/app/model/matches/schema";
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

        // Connect to the database
        await connectdb();

        // Extract pagination parameters
        const page = parseInt(req.nextUrl.searchParams.get("page")) || 1; // Default to page 1
        const limit = parseInt(req.nextUrl.searchParams.get("limit")) || 20; // Default to 10 items per page

        // Calculate the number of items to skip
        const skip = (page - 1) * limit;

        // Fetch matches with pagination
        const matches = await matchdataModel.find().skip(skip).limit(limit);

        // Get the total count of documents
        const totalMatches = await matchdataModel.countDocuments();

        // Calculate the total number of pages
        const totalPages = Math.ceil(totalMatches / limit);

        // Respond with paginated data
        return NextResponse.json(
            {
                success: true,
                data: matches,
                pagination: {
                    totalItems: totalMatches,
                    totalPages,
                    currentPage: page,
                    itemsPerPage: limit,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
};
