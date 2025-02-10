import { NextResponse } from "next/server";
import connectdb from "@/app/DataBaseConnectDB/mongodb";
import bannerdataModel from "@/app/model/banners/schema";

const xkey = process.env.API_AUTH_KEY;

export const DELETE = async (req) => {
    console.log("DELETE REQUEST");

    try {
        const reqApiKey = req.headers.get("x-api-key");
        const gXkey = req.nextUrl.searchParams.get("authkey");

        if (xkey !== reqApiKey && xkey !== gXkey) {
            return NextResponse.json(
                { success: false, error: "Invalid API Auth Key" },
                { status: 403 }
            );
        }

        const { id: bannerId } = await req.json(); // Extract the banner ID from the body

        if (!bannerId) {
            return NextResponse.json(
                { success: false, error: "Banner ID must be provided" },
                { status: 400 }
            );
        }

        await connectdb();

        // Attempt to find and delete the banner by ID
        const deletedBanner = await bannerdataModel.findByIdAndDelete(bannerId);

        if (!deletedBanner) {
            return NextResponse.json({ success: false, error: "Banner not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Banner deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
};
