import { NextResponse } from "next/server";
import connectdb from "@/app/DataBaseConnectDB/mongodb";
import bannerdataModel from "@/app/model/banners/schema";

export const dynamic = 'force-dynamic';

const xkey = process.env.API_AUTH_KEY;

export const GET = async (req) => {
    console.log("GET REQUEST for Banner");

    try {
        // Validate API Key
        const reqApiKey = req.headers.get("x-api-key");
        const gXkey = req.nextUrl.searchParams.get("authkey");

        if (xkey !== reqApiKey && xkey !== gXkey) {
            return NextResponse.json(
                { success: false, error: "Invalid API Auth Key" },
                { status: 403 }
            );
        }

        // Extract ID from query parameters
        const id = req.nextUrl.searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { success: false, error: "Banner ID is required." },
                { status: 400 }
            );
        }

        await connectdb();

        // Find banner by ID
        const banner = await bannerdataModel.findById(id);
        if (!banner) {
            return NextResponse.json(
                { success: false, error: "Banner not found." },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: banner }, { status: 200 });
    } catch (error) {
        console.error("Error fetching banner by ID:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
};
