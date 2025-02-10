"use client";
import { useEffect, useState } from "react";
import { Table, Button, Input, Modal, message, Space, Tag, Avatar, Select } from "antd";
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const { confirm } = Modal;

const ViewUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10); // Default to 10 players per page
  const router = useRouter();

  // Fetch Users from API
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/coreUsersData?authkey=${process.env.NEXT_PUBLIC_API_AUTH_KEY}`);
        const data = await response.json();
        
        if (data.success) {
          setUsers(data.data);
        } else {
          message.error("Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        message.error("Error fetching user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle Delete User
  const handleDelete = async (userId) => {
    try {
      console.log("Deleting user with ID:", userId);  // ✅ Debugging log
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/deleteUserById?userId=${userId}`, {
        method: "DELETE", // ✅ Use DELETE method
        headers: {
          "x-api-key": process.env.NEXT_PUBLIC_API_AUTH_KEY,
        },
      });
  
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  
      const data = await response.json();
      console.log("API Response:", data);  // ✅ Log API response
  
      if (data.success) {
        message.success("User deleted successfully!");
        setUsers(users.filter((user) => user._id !== userId));
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      message.error("Failed to delete user");
    }
  };
  
  
  // Show Confirmation Modal Before Deleting
  const showDeleteConfirm = (userId) => {
    confirm({
      title: "Are you sure you want to delete this user?",
      icon: <ExclamationCircleOutlined />,
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "No",
      onOk() {
        console.log("Confirmed delete for ID:", userId);  // ✅ Debugging log
        handleDelete(userId);
      },
    });
  };   

  // Handle Edit User
  const handleEdit = (userId) => {
    router.push(`/dashBoard/users/edit/${userId}`);
  };

  // Filter Users Based on Search Query
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Table Columns
  const columns = [
    {
      title: "Profile",
      dataIndex: "profilePicture",
      key: "profilePicture",
      render: (profilePicture) => (
        <Avatar src={profilePicture || "/default-profile.jpg"} size="large" />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      render: (gender) => <Tag color={gender === "Male" ? "blue" : "pink"}>{gender}</Tag>,
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Specialization",
      dataIndex: "specialization",
      key: "specialization",
      render: (specialization) => specialization?.join(", ") || "N/A",
    },
    {
      title: "Active Year",
      dataIndex: "activeYear",
      key: "activeYear",
      render: (years) => years?.join(", ") || "N/A",
    },
    {
        title: "Actions",
        key: "actions",
        render: (_, record) => (
          <Space>
            <Button icon={<EditOutlined />} onClick={() => handleEdit(record._id)} />
            <Button icon={<DeleteOutlined />} danger onClick={() => showDeleteConfirm(record._id)} />
          </Space>
        ),
    },      
  ];

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">All Users</h2>

        <div className="flex justify-end mb-4"> 
            {/* Search Input */}
            <Input
                placeholder="Search users by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mb-4"
                style={{ width: 200, marginRight: "auto" }}
            />

            <Select
                defaultValue={10}
                style={{ width: 120 }}
                onChange={(value) => setPageSize(value)}
            >
        {/* <Option value={5}>5 Players</Option> */}
        <Option value={10}>10 Players</Option>
        <Option value={20}>20 Players</Option>
        <Option value={50}>50 Players</Option>
        <Option value={users.length}>All</Option>
        </Select>
        </div>

      {/* Users Table */}
      <Table
        columns={columns}
        dataSource={filteredUsers}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize }}
      />
    </div>
  );
};

export default ViewUsers;
