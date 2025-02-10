import { NextResponse } from 'next/server';
import connectdb from '@/app/DataBaseConnectDB/mongodb';
import PaymentDataModel from '../../../model/paymentDataModel/schema';
import { headers } from 'next/headers';

const corsMiddleware = (handler) => async (req) => {
    const res = NextResponse.next();
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.headers.set("Access-Control-Allow-Headers", "Origin, Content-Type, X-Amz-Date, Authorization, X-Api-Key, X-Amz-Security-Token, locale");
    res.headers.set("Access-Control-Allow-Credentials", "true");

    if (req.method === "OPTIONS") {
        return NextResponse.json({}, { status: 200 });
    }

    return handler(req);
};

const xkey = process.env.API_AUTH_KEY;

async function getExpensesDataWithID({ reqApiKey, userID, gxkey }) {
    try {
        // Check API key validity
        if (xkey !== reqApiKey && xkey !== gxkey) {
            return { success: false, message: "Invalid API Auth key" };
        }

        await connectdb();

        // Validate that userID is provided
        if (!userID) {
            return { success: false, message: "userID must be provided" };
        }

        // Fetch data based on userID
        const data = await PaymentDataModel.find({ userID }).sort({ date: 'desc' }).lean();

        // Check if any data is found
        if (!data.length) {
            return { success: false, message: "No data found for the given userID" };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Error fetching API data:', error);
        return { success: false, message: 'Database query failed' };
    }
}

export async function GET(req) {
    console.log("GET REQUEST");
    const headerList = headers();
    const reqApiKey = headerList.get("x-api-key");
    const gxkey = req.nextUrl.searchParams.get('authkey');
    const userID = req.nextUrl.searchParams.get('userID');
  
    try {
        const result = await getExpensesDataWithID({ reqApiKey, userID, gxkey });
        if (result.success) {
            return NextResponse.json({ success: true, message: "Data fetched successfully", data: result.data }, { status: 200 });
        } else {
            return NextResponse.json({ success: false, message: result.message }, { status: 404 });
        }
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}

export default corsMiddleware(async (req) => {
    if (req.method === "GET") {
        return GET(req);
    }
    return NextResponse.json({ success: false, message: "Method Not Allowed" }, { status: 405 });
});
