import { NextResponse } from "next/server";
import connectdb from "@/app/DataBaseConnectDB/mongodb";
import UserModel from "@/app/model/users/schema";

export const GET = async (req) => {
    try {
        // Connect to the database
        await connectdb();

        // Extract query parameters
        const searchParams = req.nextUrl.searchParams; 
        // const { searchParams } = new URL(req.url, "http://localhost:3000"); 
        const gender = searchParams.get("gender");
        const activeYear = searchParams.get("activeYear");
        const isActive = searchParams.get("isActive");
        const page = parseInt(searchParams.get("page"), 10) || 1;
        const limit = parseInt(searchParams.get("limit"), 10) || 10;

        // Construct the filter object based on query parameters
        const filters = {};
        if (gender) filters.gender = gender; // Filter by gender
        if (activeYear) filters.activeYear = { $in: [activeYear] }; // Match activeYear within an array
        if (isActive !== null) filters.isActive = isActive === "true"; // Convert string to boolean

        console.log("Filters:", filters);

        // Pagination setup
        const skip = (page - 1) * limit;

        // Fetch the filtered and paginated data from MongoDB
        const User = await UserModel.find(filters)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        // Get the total count of matching records
        const totalUser = await UserModel.countDocuments(filters);

        // Return users and pagination details
        return NextResponse.json({
            success: true,
            data: User,
            pagination: {
                total: totalUser,
                page,
                limit,
                totalPages: Math.ceil(totalUser / limit),
            },
        });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
};

export default async (req) => {
    const method = req.method;

    if (method === "GET") {
        return GET(req);
    }

    return NextResponse.json({ success: false, message: "Method Not Allowed" }, { status: 405 });
};