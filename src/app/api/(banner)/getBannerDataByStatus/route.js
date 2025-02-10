import { NextResponse } from "next/server";
import connectdb from "@/app/DataBaseConnectDB/mongodb";
import bannerdataModel from "@/app/model/banners/schema";
export const dynamic = 'force-dynamic';

const xkey = process.env.API_AUTH_KEY;

export const GET = async (req) => {
    console.log("GET REQUEST");

    try {
        const reqApiKey = req.headers.get("x-api-key");
        const gXkey = req.nextUrl.searchParams.get("authkey");

        if (xkey !== reqApiKey && xkey !== gXkey) {
            return NextResponse.json(
                { success: false, error: "Invalid API Auth Key" },
                { status: 403 }
            );
        }

        const isStatus = req.nextUrl.searchParams.get("isStatus");
        await connectdb();

        if (isStatus === null) {
            return NextResponse.json(
                { success: false, error: "isStatus parameter is required." },
                { status: 400 }
            );
        }

        const statusFilter = isStatus === "true";
        const banners = await bannerdataModel.find({ isStatus: statusFilter });

        return NextResponse.json({ success: true, data: banners }, { status: 200 });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
};
