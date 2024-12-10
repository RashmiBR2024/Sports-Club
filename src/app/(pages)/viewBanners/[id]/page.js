"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { Spin, Alert, Typography } from "antd";

const { Title, Text } = Typography;

export default function BannerDetails() {
    const { id } = useParams(); // Use useParams to get the dynamic route parameter
    const [banner, setBanner] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBannerDetails = async () => {
            try {
                setLoading(true);
                setError(null); // Reset error state
                const response = await axios.get(
                    `http://localhost:3001/api/getBannerById?id=${id}&authkey=4c297349128e778505576f6045efb963`
                );
                console.log("Full API Response:", response); // Debugging log
                if (response.data && response.data.data) {
                    setBanner(response.data.data); // Adjust based on the actual response structure
                } else {
                    setError("Banner details not found.");
                }
            } catch (error) {
                setError(error.response?.data?.message || "An error occurred while fetching the banner details.");
                console.error("Error fetching banner details:", error.response || error.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchBannerDetails();
    }, [id]);

    if (loading) {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                <Spin size="large" />
                <p>Loading banner details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                <Alert message="Error" description={error} type="error" showIcon />
            </div>
        );
    }

    if (!banner) {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                <Alert message="No Data" description="No banner details found." type="warning" showIcon />
            </div>
        );
    }

    return (
        <div style={{ padding: "20px" }}>
            <Title level={2}>Banner Details</Title>
            <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "20px", marginTop: "20px" }}>
                <Text strong>Title:</Text> <Text>{banner.title}</Text>
                <br />
                <Text strong>Subtitle:</Text> <Text>{banner.subTitle}</Text>
                <br />
                <Text strong>Type:</Text> <Text>{banner.type}</Text>
                <br />
                <Text strong>Button Name:</Text> <Text>{banner.buttonName}</Text>
                <br />
                <Text strong>Content URL:</Text>{" "}
                <a href={banner.content_url} target="_blank" rel="noopener noreferrer">
                    Open
                </a>
                <br />
                <Text strong>Is Text:</Text> <Text>{banner.isText ? "Yes" : "No"}</Text>
                <br />
                <Text strong>Is Button:</Text> <Text>{banner.isButton ? "Yes" : "No"}</Text>
                <br />
                <Text strong>Status:</Text>{" "}
                <Text style={{ color: banner.isStatus ? "green" : "red" }}>
                    {banner.isStatus ? "Active" : "Inactive"}
                </Text>
            </div>
        </div>
    );
}
