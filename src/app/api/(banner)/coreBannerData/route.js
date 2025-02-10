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

        await connectdb();

        const page = parseInt(req.nextUrl.searchParams.get("page")) || 1;
        const limit = parseInt(req.nextUrl.searchParams.get("limit")) || 10;
        const skip = (page - 1) * limit;

        const banners = await bannerdataModel.find().skip(skip).limit(limit);
        const totalBanners = await bannerdataModel.countDocuments();
        const totalPages = Math.ceil(totalBanners / limit);

        return NextResponse.json(
            {
                success: true,
                data: banners,
                pagination: {
                    totalItems: totalBanners,
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
