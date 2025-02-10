"use client";
import { useEffect, useState } from "react";
import { Table, Button, Input, Modal, message, Space, Tag, Avatar, Select } from "antd";
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const { confirm } = Modal;
const { Option } = Select;

const ViewTeams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10); // Default: 10 teams per page
  const router = useRouter();

  // Fetch Teams from API
  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/coreTeamsData?authkey=${process.env.NEXT_PUBLIC_API_AUTH_KEY}`
        );
        const data = await response.json();

        if (data.success) {
          setTeams(data.data);
        } else {
          message.error("Failed to fetch teams");
        }
      } catch (error) {
        console.error("Error fetching teams:", error);
        message.error("Error fetching team data");
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  // Handle Delete Team
  const handleDelete = async (teamId) => {
    try {
      console.log("Deleting team with ID:", teamId);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/deleteTeamById?teamId=${teamId}`,
        {
          method: "DELETE",
          headers: {
            "x-api-key": process.env.NEXT_PUBLIC_API_AUTH_KEY,
          },
        }
      );

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      console.log("API Response:", data);

      if (data.success) {
        message.success("Team deleted successfully!");
        setTeams(teams.filter((team) => team._id !== teamId));
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Error deleting team:", error);
      message.error("Failed to delete team");
    }
  };

  // Show Confirmation Modal Before Deleting
  const showDeleteConfirm = (teamId) => {
    confirm({
      title: "Are you sure you want to delete this team?",
      icon: <ExclamationCircleOutlined />,
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "No",
      onOk() {
        console.log("Confirmed delete for ID:", teamId);
        handleDelete(teamId);
      },
    });
  };

  // Handle Edit Team
  const handleEdit = (teamId) => {
    router.push(`/dashboard/teams/edit/${teamId}`);
  };

  // Filter Teams Based on Search Query
  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Table Columns
  const columns = [
    {
      title: "Logo",
      dataIndex: "logo_url",
      key: "logo_url",
      render: (logo_url) => (
        <Avatar src={logo_url || "/default-team-logo.jpg"} size="large" />
      ),
    },
    {
      title: "Team Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Owner",
      dataIndex: "owner",
      key: "owner",
    },
    {
      title: "Coach",
      dataIndex: "coachName",
      key: "coachName",
    },
    {
      title: "Created Year",
      dataIndex: "createYear",
      key: "createYear",
    },
    {
      title: "Team Color",
      dataIndex: "teamColor",
      key: "teamColor",
      render: (color) => <Tag color={color}>{color}</Tag>,
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
      <h2 className="text-2xl font-bold mb-4">All Teams</h2>

      {/* Search and Page Size Dropdown */}
      <div className="flex justify-between items-center mb-4">
        {/* Page Size Dropdown */}
        <Select
          defaultValue={10}
          style={{ width: 120 }}
          onChange={(value) => setPageSize(value)}
        >
          <Option value={10}>10 Teams</Option>
          <Option value={20}>20 Teams</Option>
          <Option value={50}>50 Teams</Option>
          <Option value={teams.length}>All</Option>
        </Select>

        {/* Search Input */}
        <Input
          placeholder="Search teams by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: "250px" }}
        />
      </div>

      {/* Teams Table */}
      <Table
        columns={columns}
        dataSource={filteredTeams}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize }}
      />
    </div>
  );
};

export default ViewTeams;
