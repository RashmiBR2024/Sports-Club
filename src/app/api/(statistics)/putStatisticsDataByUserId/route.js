import { NextResponse } from "next/server";
import connectdb from "@/app/DataBaseConnectDB/mongodb";
import statisticsdataModel from "@/app/model/statistics/schema";

const xkey = process.env.API_AUTH_KEY;

export const PUT = async (req) => {
    console.log("PUT REQUEST");

    try {
        // Get the API key from headers and query parameters
        const reqApiKey = req.headers.get("x-api-key");  // For API route headers
        const gXkey = req.nextUrl.searchParams.get("authkey"); // Get authkey from query params

        // Check if the provided API key matches the expected one
        if (xkey !== reqApiKey && xkey !== gXkey) {
            return NextResponse.json({ success: false, error: "Invalid API Auth Key" }, { status: 403 });
        }

        // Retrieve the 'id' query parameter
        const { userid: userId, ...updateData } = await req.json();

        // If 'id' parameter is not provided, return an error
        if (!userId) {
            return NextResponse.json({ success: false, error: "User ID must be provided in the query parameters" }, { status: 400 });
        }

        // Retrieve the data to be updated from the request body
        

        // Connect to the database
        await connectdb();

        // Find the tournament by ID and update the data
        const updatedStatistics = await statisticsdataModel.findOneAndUpdate({userid:userId}, updateData, { new: true });

        // If no tournament is found with the provided ID, return a 404 error
        if (!updatedStatistics) {
            return NextResponse.json({ success: false, error: "Statistics not found" }, { status: 404 });
        }

        // Respond with the updated tournament data
        return NextResponse.json({ success: true, data: updatedStatistics }, { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
};
