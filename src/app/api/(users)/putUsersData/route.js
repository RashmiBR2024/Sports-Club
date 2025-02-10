import { NextResponse } from "next/server";
import connectdb from "@/app/DataBaseConnectDB/mongodb";
import UserModel from "@/app/model/users/schema";
const xkey = process.env.API_AUTH_KEY;

export const PUT = async (req) => {
    console.log("PUT REQUEST");

    // ✅ Handle CORS Preflight Request
    if (req.method === "OPTIONS") {
        return NextResponse.json({}, { 
            status: 200, 
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS, PUT",
                "Access-Control-Allow-Headers": "Content-Type, x-api-key",
            }
        });
    }

    try {
        // Get headers directly from req.headers
        const reqApiKey = req.headers.get("x-api-key");  
        const gXkey = req.nextUrl.searchParams.get("authkey"); 

        if (xkey !== reqApiKey && xkey !== gXkey) {
            return NextResponse.json({ success: false, error: "Invalid API Auth Key" }, { 
                status: 403,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                }
            });
        }

        const { _id, ...updatedData } = await req.json();

        if (!_id) {
            return NextResponse.json({ success: false, error: "User ID is required in the body" }, { 
                status: 400,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                }
            });
        }

        console.log("Updated Data Received:", updatedData);

        await connectdb();

        const updatedUser = await UserModel.findByIdAndUpdate(
            _id,  
            { $set: updatedData },  
            { new: true }  
        );

        if (!updatedUser) {
            return NextResponse.json({ success: false, error: "User not found" }, { 
                status: 404,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                }
            });
        }

        return NextResponse.json({ success: true, data: updatedUser }, { 
            status: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
            }
        });

    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { 
            status: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
            }
        });
    }
};

export const OPTIONS = async () => {
    return NextResponse.json({}, {
        status: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS, PUT",
            "Access-Control-Allow-Headers": "Content-Type, x-api-key",
        }
    });
};

const putUsersDataHandler = async (req, res) => {
    if (req.method === "PUT") {
        return PUT(req);
    } else if (req.method === "OPTIONS") {
        return OPTIONS();
    }

    return NextResponse.json({ success: false, message: "Method Not Allowed" }, { 
        status: 405,
        headers: {
            "Access-Control-Allow-Origin": "*",
        }
    });
};
  
export default putUsersDataHandler;
