import { NextResponse } from "next/server";
import connectdb from "@/app/DataBaseConnectDB/mongodb";
import bannerdataModel from "@/app/model/banners/schema";

const xkey = process.env.API_AUTH_KEY;

export const POST = async (req) => {
    console.log("POST REQUEST");

    try {
        const reqApiKey = req.headers.get("x-api-key");
        const gXkey = req.nextUrl.searchParams.get("authkey");

        console.log("Received API Key (Header):", reqApiKey);
        console.log("Received API Key (Query):", gXkey);
        console.log("Expected API Key:", xkey);

        if (xkey !== reqApiKey && xkey !== gXkey) {
            return NextResponse.json(
                { success: false, error: "Invalid API Auth Key" },
                { status: 403 }
            );
        }

        let dataReceived;
        try {
            dataReceived = await req.json();
            console.log("Received Data:", dataReceived);
        } catch (error) {
            console.error("Error Parsing JSON:", error);
            return NextResponse.json(
                { success: false, error: "Invalid JSON payload" },
                { status: 400 }
            );
        }

        const { 
            title, subTitle, isButton, type, buttonName, 
            content_url, isText, button_url, displayDuration, displayOnPages, 
            schedule, fontStyle, fontColor 
        } = dataReceived;

        if (!title || !content_url || !Array.isArray(displayOnPages) || !schedule) {
            return NextResponse.json(
                { success: false, error: "Missing required fields" },
                { status: 400 }
            );
        }


        // ✅ Declare currentDate BEFORE using it
        const currentDate = new Date(); 

        // ✅ Ensure endDate is properly converted to Date before comparing
        if (dataReceived.endDate) {
            const endDate = new Date(dataReceived.endDate);
            if (currentDate > endDate) {
                dataReceived.isStatus = false; // Automatically disable banner if expired
            }
        }

        const startDate = new Date(schedule.startDate);
        const endDate = new Date(schedule.endDate);

        if (isNaN(startDate) || isNaN(endDate)) {
            return NextResponse.json(
                { success: false, error: "Invalid schedule dates" },
                { status: 400 }
            );
        }

        if (endDate <= startDate) {
            return NextResponse.json(
                { success: false, error: "End date must be after start date" },
                { status: 400 }
            );
        }

        if (currentDate > endDate) {
            dataReceived.isStatus = false; // Automatically set status to false if the current date is past the endDate
        }

        // Auto-set `isStatus` based on the current date
        const isActive = currentDate >= startDate && currentDate <= endDate;

        try {
            await connectdb();
        } catch (error) {
            console.error("Database Connection Error:", error);
            return NextResponse.json(
                { success: false, error: "Failed to connect to database" },
                { status: 500 }
            );
        }

        let newBanner = new bannerdataModel({
            title, subTitle, 
            isStatus: isActive, 
            isButton, type, buttonName, content_url, 
            isText, button_url, displayDuration, displayOnPages, 
            schedule: { startDate, endDate }, 
            fontStyle: fontStyle || "Poppins",  // Default font style
            fontColor: fontColor || "#FFFFFF"   // Default font color (white)
        });

        newBanner = await newBanner.save();

        return NextResponse.json({ success: true, data: newBanner }, { status: 200 });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 400 }
        );
    }
};
