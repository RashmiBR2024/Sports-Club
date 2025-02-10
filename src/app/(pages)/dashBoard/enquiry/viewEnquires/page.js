"use client";

import { useEffect, useState } from "react";
import { Table, Button, message, Popconfirm, Space } from "antd";
import axios from "axios";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const ViewEnquiries = () => {
  const router = useRouter();
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10; // Number of enquiries per page

  useEffect(() => {
    fetchEnquiries(currentPage);
  }, [currentPage]);

  // ✅ Fetch all enquiries with pagination
  const fetchEnquiries = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/coreEnquiryData?page=${page}&limit=${pageSize}`,
        {
          headers: { "x-api-key": process.env.NEXT_PUBLIC_API_AUTH_KEY },
        }
      );

      if (response.data.success) {
        setEnquiries(response.data.data);
        setTotalItems(response.data.pagination.totalItems);
      } else {
        message.error("Failed to fetch enquiries.");
      }
    } catch (error) {
      console.error("Error fetching enquiries:", error);
      message.error("Error fetching data. Try again.");
    }
    setLoading(false);
  };

  // ✅ Handle Delete Enquiry
  const deleteEnquiry = async (id) => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/deleteEnquiryById?enquiryId=${id}`,
        {
          headers: { "x-api-key": process.env.NEXT_PUBLIC_API_AUTH_KEY },
        }
      );

      if (response.data.success) {
        message.success("Enquiry deleted successfully!");
        fetchEnquiries(currentPage); // Refresh data
      } else {
        message.error(response.data.error || "Failed to delete enquiry.");
      }
    } catch (error) {
      console.error("Error deleting enquiry:", error);
      message.error("Error deleting enquiry. Try again.");
    }
  };

  // ✅ Handle Edit Enquiry (Redirects to Edit Page)
  // const editEnquiry = (id) => {
  //   router.push(`/dashBoard/enquiry/edit/${id}`);
  // };

  // ✅ Define table columns
  const columns = [
    { title: "Full Name", dataIndex: "fullName", key: "fullName" },
    { title: "Phone", dataIndex: "phoneNumber", key: "phoneNumber" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Type", dataIndex: "enquiryType", key: "enquiryType" },
    { title: "Message", dataIndex: "message", key: "message", ellipsis: true },
    { title: "Entered By", dataIndex: "enteredBy", key: "enteredBy" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          {/* <Button type="primary" icon={<EditOutlined />} onClick={() => editEnquiry(record._id)} > </Button> */}

          <Popconfirm
            title="Are you sure to delete this enquiry?"
            onConfirm={() => deleteEnquiry(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />}></Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{marginBottom: "20px", fontSize: "18px", fontWeight: "700" }}>All Enquiries</h2>
      
      <Table
        columns={columns}
        dataSource={enquiries}
        rowKey="_id"
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalItems,
          onChange: (page) => setCurrentPage(page),
        }}
      />
    </div>
  );
};

export default ViewEnquiries;
