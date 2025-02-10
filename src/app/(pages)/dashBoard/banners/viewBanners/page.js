"use client";
import React, { useEffect, useState } from "react";
import { Table, Button, Pagination, Tooltip, Tag, Switch, Select, message, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { useRouter } from "next/navigation";
// import { useRouter } from "next/router";
import { Image } from "antd";
import BannerDetails from "../editBanners/[id]/page";

export default function ViewBanner() {
  const router = useRouter();
  const [banners, setBanners] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedBannerId, setSelectedBannerId] = useState(null); // Track selected banner for editing

  const handleEditBanner = (id) => {
    // setSelectedContent("editBanner");
    setSelectedBannerId(id); // Store the selected banner ID
  }; 

  const paginatedBanners =
  itemsPerPage === totalItems
    ? banners // Show all banners if "All" is selected
    : banners.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/coreBannerData?page=${currentPage}&limit=${itemsPerPage}&authkey=${process.env.NEXT_PUBLIC_API_AUTH_KEY}`
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
  }, [currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  const handleItemsPerPageChange = (value) => {
    if (value === "all") {
      setItemsPerPage(totalItems); // Set to totalItems for "All"
    } else {
      setItemsPerPage(value); // Set to the selected value (5, 10, 20, etc.)
    }
    setCurrentPage(1); // Reset to the first page
  };

  const handleStatusChange = async (checked, record) => {
    try {
      setBanners((prev) =>
        prev.map((banner) =>
          banner._id === record._id ? { ...banner, isStatus: checked } : banner
        )
      );

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/putBannerDataById`, 
        {
          id: record._id, 
          isStatus: checked,
        },
        {
          headers: {
            "x-api-key": process.env.NEXT_PUBLIC_API_AUTH_KEY, 
          },
        }
      );

      if (response.status === 200 && response.data.success) {
        message.success("Status updated successfully!");
      } else {
        throw new Error(response.data.error || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      message.error("Failed to update status. Please try again.");

      setBanners((prev) =>
        prev.map((banner) =>
          banner._id === record._id ? { ...banner, isStatus: !checked } : banner
        )
      );
    }
  };

  // Helper Function for YouTube Thumbnails
  const getYouTubeVideoId = (url) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : "";
  };  

  const handleDelete = async (record) => {
    try {
      // Optimistically remove the banner from the UI
      const updatedBanners = banners.filter((banner) => banner._id !== record._id);
      setBanners(updatedBanners);

      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/deleteBannerDataById`,
        {
          headers: {
            "x-api-key": process.env.NEXT_PUBLIC_API_AUTH_KEY,
          },
          data: { id: record._id }, // Pass the ID in the body for deletion
        }
      );

      if (response.status === 200 && response.data.success) {
        message.success("Banner deleted successfully!");
      } else {
        throw new Error(response.data.error || "Failed to delete banner");
      }
    } catch (error) {
      console.error("Error deleting banner:", error);
      message.error("Failed to delete banner. Please try again.");
      
      // Revert the optimistic deletion if it fails
      setBanners((prev) => [...prev, record]);
    }
  };

  const columns = [
    {
      title: <span style={{ fontSize: "21px" }}>Media</span>,
      dataIndex: "content_url", // Assuming the media URL is stored in `content_url`
      key: "content_url",
      render: (content_url, record) => {
        const isVideo = record.type === "video"; // Assuming `type` field indicates video or image
        const thumbnail = isVideo 
          ? `https://img.youtube.com/vi/${getYouTubeVideoId(content_url)}/hqdefault.jpg` // Get YouTube thumbnail
          : content_url || "/placeholder-image.png"; // Default image if not found
    
        return (
          <div style={{ position: "relative", display: "inline-block" }}>
            <Image
              width={80}
              height={50}
              src={thumbnail}
              alt="Media Thumbnail"
              style={{ objectFit: "contain", borderRadius: "5px" }}
            />
            {isVideo && (
              <div 
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "rgba(255, 0, 0, 0.8)",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 24"
                  fill="white"
                >
                  <path d="M3 22V2l18 10L3 22z" />
                </svg>
              </div>
            )}
          </div>
        );
      },
    },           
    {
      title: <span style={{ fontSize: "21px" }}>Title</span>,
      dataIndex: "title",
      key: "title",
    },
    {
      title: <span style={{ fontSize: "21px" }}>SubTitle</span>,
      dataIndex: "subTitle",
      key: "subTitle",
    },
    {
      title: <span style={{ fontSize: "21px" }}>Is Text</span>,
      dataIndex: "isText",
      key: "isText",
      render: (isText) => (isText ? "Yes" : "No"),
    },
    {
      title: <span style={{ fontSize: "21px" }}>Duration</span>,
      dataIndex: "displayDuration",
      key: "displayDuration",
      render: (displayDuration) =>
        `${displayDuration} ${displayDuration === 1 ? "sec" : "secs"}`,
    },
    {
      title: <span style={{ fontSize: "21px" }}>Button Details</span>,
      dataIndex: "buttonName",
      key: "buttonDetails",
      render: (_, record) => (
        <div>
          <p>
            <strong>Is Button:</strong> {record.isButton ? "Yes" : "No"}
          </p>
          <p>
            <strong>Name:</strong> {record.buttonName}
          </p>
          <p>
            <a
              href={record.button_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#1890ff", textDecoration: "underline" }}
            >
              Open
            </a>
          </p>
        </div>
      ),
    },
    {
      title: <span style={{ fontSize: "21px" }}>Appears On</span>,
      dataIndex: "displayOnPages",
      key: "displayOnPages",
      render: (appearsOn) => (
        <div>
          {appearsOn?.length ? (
            <ul style={{ padding: 0, margin: 0 }}>
              {appearsOn.map((page, index) => (
                <li key={index} style={{ listStyle: "none" }}>
                  {page.charAt(0).toUpperCase() + page.slice(1).toLowerCase()}
                </li>
              ))}
            </ul>
          ) : (
            <span>No Pages</span>
          )}
        </div>
      ),
    },
    {
      title: <span style={{ fontSize: "21px" }}>Status</span>,
      dataIndex: "isStatus",
      key: "isStatus",
      render: (isStatus, record) => (
        <Switch
          checked={isStatus}
          onChange={(checked) => handleStatusChange(checked, record)}
        />
      ),
    },
    {
      title: <span style={{ fontSize: "21px" }}>Actions</span>,
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              handleEditBanner(record._id)
              // console.log("Redirecting to:", `/banners/editBanners/${record._id}`);
              // router.push(`/banners/editBanners/${record._id}`);
            }}
          >
          </Button>
          {/* Delete Button with Popconfirm */}
          <Popconfirm
            title="Are you sure you want to delete this banner?"
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="primary"
              style={{ background: "#ff4d4f", borderColor: "#ff4d4f" }}
              icon={<DeleteOutlined />}
            >
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      {/* Show Edit Banner Page when a banner is selected */}
      {selectedBannerId ? (
        <div>
          {/* Back Button
          <Button onClick={handleBackToList} style={{ marginBottom: "10px" }}>
            ⬅ Back to Banners
          </Button> */}

          {/* Render Edit Banner Component */}
          <BannerDetails bannerId={selectedBannerId}/>
        </div>
      ) : (
        <>
          {/* Total Banners Display */}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ marginBottom: "10px" }}>
              <Select 
                value={itemsPerPage === totalItems ? "all" : itemsPerPage} // Set "all" when all items are selected 
                defaultValue = {5}
                style = {{ width: 120 }}
                onChange = {handleItemsPerPageChange}
                options = {[
                  { label: "5 / page", value: 5 },
                  { label: "10 / page", value: 10 },
                  { label: "20 / page", value: 20 },
                  { value: "all", label: "All" },
                ]}
              />
            </div>
            
            <div className="total-banners" style={{ textAlign: "right", marginRight: "20px" }}>
              <span style={{ color: "grey" }}>Total Banners: {totalItems}</span>
            </div>
          </div>

          {/* Banner Table */}
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
            />
          </div>

          {/* Pagination */}
          <Pagination
            current={currentPage}
            total={totalItems}
            pageSize={itemsPerPage}
            onChange={handlePageChange}
            style={{ textAlign: "center" }}
            showSizeChanger={false}
          />
        </>
      )}
    </div>
  );
}
