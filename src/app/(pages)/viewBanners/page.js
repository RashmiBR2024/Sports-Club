import React, { useEffect, useState } from "react";
import { Table, Button, Pagination, Tooltip, Tag } from "antd";
import { EditOutlined } from "@ant-design/icons";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ViewBanner() {
    const router = useRouter();
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `http://localhost:3001/api/coreBannerData?page=${currentPage}&limit=${itemsPerPage}&authkey=4c297349128e778505576f6045efb963`
                );
                setBanners(response.data.data || []);
                setTotalItems(response.data.pagination.totalItems || 0);
            } catch (error) {
                console.error("Error fetching banners:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBanners();
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const columns = [
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
        },
        {
            title: "Subtitle",
            dataIndex: "subTitle",
            key: "subTitle",
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            render: (type) => (
                <Tag color={type === "video" ? "blue" : "green"}>{type}</Tag>
            ),
        },
        {
            title: "Button Name",
            dataIndex: "buttonName",
            key: "buttonName",
        },
        {
            title: "Content URL",
            dataIndex: "content_url",
            key: "content_url",
            render: (url) => (
                <Tooltip title="Open URL">
                    <a href={url} target="_blank" rel="noopener noreferrer">
                        Open
                    </a>
                </Tooltip>
            ),
        },
        {
            title: "Is Text",
            dataIndex: "isText",
            key: "isText",
            render: (isText) => (isText ? "Yes" : "No"),
        },
        {
            title: "Is Button",
            dataIndex: "isButton",
            key: "isButton",
            render: (isButton) => (isButton ? "Yes" : "No"),
        },
        {
            title: "Status",
            dataIndex: "isStatus",
            key: "isStatus",
            render: (isStatus) =>
                isStatus ? (
                    <Tag color="green">Active</Tag>
                ) : (
                    <Tag color="red">Inactive</Tag>
                ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <div style={{ display: "flex", gap: "10px" }}>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => router.push(`/viewBanners/${record._id}`)}
                    >
                        Edit
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div style={{ padding: "20px" }}>
            <h1>Banner Management</h1>
            <div
                style={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    overflow: "hidden",
                    marginBottom: "20px",
                }}
            >
                <Table
                    columns={columns}
                    dataSource={banners}
                    rowKey="_id"
                    loading={loading}
                    pagination={false}
                    rowClassName={(record) =>
                        record.isStatus ? "active-row" : "inactive-row"
                    }
                    style={{ margin: 0 }}
                />
            </div>
            <Pagination
                current={currentPage}
                total={totalItems}
                pageSize={itemsPerPage}
                onChange={handlePageChange}
                style={{ textAlign: "center" }}
                showSizeChanger={false}
            />
        </div>
    );
}
