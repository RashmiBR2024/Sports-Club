import { NextResponse } from "next/server";
import connectdb from "@/app/DataBaseConnectDB/mongodb";
import bannerdataModel from "@/app/model/banners/schema";

const xkey = process.env.API_AUTH_KEY;

export const PUT = async (req) => {
    console.log("PUT REQUEST");

    try {
        const reqApiKey = req.headers.get("x-api-key");
        const gXkey = req.nextUrl.searchParams.get("authkey");

        if (xkey !== reqApiKey && xkey !== gXkey) {
            return NextResponse.json(
                { success: false, error: "Invalid API Auth Key" },
                { status: 403 }
            );
        }

        const { id: bannerId, ...updateData } = await req.json();

        if (!bannerId) {
            return NextResponse.json(
                { success: false, error: "Banner ID must be provided" },
                { status: 400 }
            );
        }

        // if (updateData.displayDuration !== undefined && updateData.displayDuration <= 0) {
        //     return NextResponse.json(
        //         { success: false, error: "Display duration must be a positive number" },
        //         { status: 400 }
        //     );
        // }

        await connectdb();
        const updatedBanner = await bannerdataModel.findByIdAndUpdate(bannerId, updateData, { new: true });

        if (!updatedBanner) {
            return NextResponse.json({ success: false, error: "Banner not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updatedBanner }, { status: 200 });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
};
