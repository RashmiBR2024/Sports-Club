"use client";

import { useState } from "react";
import { Form, Input, Button, message, DatePicker, Modal } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

const AddTeam = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [color, setColor] = useState("#090F13"); // Default color
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [teamData, setTeamData] = useState(null);
  
  const onFinish = async (values) => {
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/postTeamsData`, // ✅ Uses postTeamsData API
        {
          name: values.name,
          logo_url: values.logo_url || "", // Optional
          owner: values.owner,
          coachName: values.coachName,
          createYear: values.createYear.year(),
          teamColor: color, // Uses selected color
        },
        {
          headers: {
            "x-api-key": process.env.NEXT_PUBLIC_API_AUTH_KEY,
          },
        }
      );

      if (response.data.success) {
        message.success(`Team "${values.name}" added successfully!`);

        setTeamData(response.data.data); 
        setIsModalVisible(true); 
      } else {
        throw new Error(response.data.error);
      }
    } catch (error) {
      message.error(error.response?.data?.error || "Failed to add team");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Add New Team</h2>

      <Form layout="vertical" onFinish={onFinish}>
        {/* Team Name */}
        <Form.Item
          label="Team Name"
          name="name"
          rules={[{ required: true, message: "Team name is required!" }]}
        >
          <Input placeholder="Enter team name" />
        </Form.Item>

        {/* Logo URL */}
        <Form.Item
          label="Logo URL"
          name="logo_url"
          rules={[
            {
              pattern: /^(https?:\/\/[^\s/$.?#].[^\s]*)$/,
              message: "Enter a valid URL!",
            },
          ]}
        >
          <Input placeholder="Enter logo URL (optional)" />
        </Form.Item>

        {/* Owner Name */}
        <Form.Item
          label="Owner Name"
          name="owner"
          rules={[{ required: true, message: "Owner name is required!" }]}
        >
          <Input placeholder="Enter owner name" />
        </Form.Item>

        {/* Coach Name */}
        <Form.Item
          label="Coach Name"
          name="coachName"
          rules={[{ required: true, message: "Coach name is required!" }]}
        >
          <Input placeholder="Enter coach name" />
        </Form.Item>

        {/* Creation Year */}
        <Form.Item
          label="Creation Year"
          name="createYear"
          rules={[{ required: true, message: "Creation year is required!" }]}
        >
          <DatePicker picker="year" placeholder="Select Year" />
        </Form.Item>

        {/* Team Color */}
        <Form.Item label="Team Color" name="teamColor">
          <div className="flex items-center gap-3">
            <Input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              style={{ width: "50px", height: "35px", padding: 0, border: "none" }}
            />
            <Input
              value={color}
              readOnly
              style={{ width: "100px", textAlign: "center", fontWeight: "bold" }}
            />
          </div>
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Add Team
          </Button>
        </Form.Item>
      </Form>

      {/* ✅ Success Modal After Adding Team */}
      <Modal
        title="Team Added Successfully!"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="addNew" onClick={() => setIsModalVisible(false)}>
            Add New Team
          </Button>,
          <Button key="viewTeam" type="primary" onClick={() => router.push("/allTeams")}>
            View Teams
          </Button>
        ]}
      >
        {teamData && (
          <div className="text-center">
            <img
              src={teamData.logo_url || "https://via.placeholder.com/100"} // Default logo if none provided
              alt="Team Logo"
              className="mx-auto mb-4"
              style={{ width: "100px", height: "100px", borderRadius: "50%" }} // ✅ 50% Border Radius
            />
            <h3 className="text-lg font-semibold">{teamData.name}</h3>
            <p><strong>Team Code:</strong> {teamData.teamCode}</p>
            <p><strong>Owner:</strong> {teamData.owner}</p>
            <p><strong>Coach:</strong> {teamData.coachName}</p>
            <p><strong>Created Year:</strong> {teamData.createYear}</p>
            <p><strong>Team Color:</strong> <span style={{ color: teamData.teamColor, fontWeight: "bold" }}>{teamData.teamColor}</span></p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AddTeam;
