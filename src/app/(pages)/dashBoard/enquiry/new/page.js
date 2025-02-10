"use client";

import { useState } from "react";
import { Form, Input, Button, Select, message, Card, Modal } from "antd";
import axios from "axios";

const { Option } = Select;

const EnquiryForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);


  const handleSubmit = async (values) => {
    setLoading(true);
    const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/postEnquiryData`; // ✅ Corrected variable
    console.log(`API Endpoint: ${apiUrl}`); // ✅ Debugging
  
    try {
      const response = await axios.post(apiUrl, values, {
        headers: { "x-api-key": process.env.NEXT_PUBLIC_API_AUTH_KEY},
      });
  
      if (response.data.success) {
        setSubmittedData(response.data.data);
        setModalVisible(true);
        message.success("Enquiry submitted successfully!");
        form.resetFields();
      } else {
        message.error(response.data.error || "Failed to submit enquiry.");
      }
    } catch (error) {
      console.error("Error in API request:", error.response?.data || error.message);
      message.error("Something went wrong. Please try again.");
    }
    setLoading(false);
  };
  


  return (
    <Card title="Submit an Enquiry" style={{ maxWidth: 500, margin: "auto" }}>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Full Name"
          name="fullName"
          rules={[{ required: true, message: "Please enter your name!" }]}
        >
          <Input placeholder="Enter your full name" />
        </Form.Item>

        <Form.Item
          label="Phone Number"
          name="phoneNumber"
          rules={[
            { required: true, message: "Please enter your phone number!" },
            { pattern: /^[0-9]{10}$/, message: "Enter a valid 10-digit phone number!" },
          ]}
        >
          <Input placeholder="Enter your phone number" />
        </Form.Item>

        <Form.Item label="Email" name="email">
          <Input type="email" placeholder="Enter your email (optional)" />
        </Form.Item>

        <Form.Item
          label="Enquiry Type"
          name="enquiryType"
          rules={[{ required: true, message: "Please select an enquiry type!" }]}
        >
          <Select placeholder="Select an enquiry type">
            <Option value="Membership">Membership</Option>
            <Option value="Match Registration">Match Registration</Option>
            <Option value="Coaching/Training">Coaching/Training</Option>
            <Option value="Sponsorship">Sponsorship</Option>
            <Option value="Facility Booking">Facility Booking</Option>
            <Option value="General Inquiry">General Inquiry</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Message"
          name="message"
          rules={[{ required: true, message: "Please enter your enquiry details!" }]}
        >
          <Input.TextArea rows={4} placeholder="Describe your enquiry" />
        </Form.Item>

        <Form.Item label="Additional Notes" name="additionalNotes">
          <Input.TextArea rows={2} placeholder="Any additional notes (optional)" />
        </Form.Item>

        <Form.Item label="Entered By (Admin)" name="enteredBy" rules={[{ required: true, message: "Admin name is required!" }]}>
          <Input placeholder="Enter admin name" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Submit Enquiry
          </Button>
        </Form.Item>
      </Form>

      {/* ✅ Modal for showing enquiry details */}
      <Modal
        title="Enquiry Created Successfully"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="edit" type="primary" onClick={() => window.location.href = `/dashBoard/enquiry/edit/`}>
            Edit Enquiry
          </Button>,
          <Button key="new" onClick={() => window.location.href = `/dashBoard/enquiry/new`}>
            + New Enquiry
          </Button>,
        ]}
      >
        {submittedData && (
          <div>
            <p><strong>Full Name:</strong> {submittedData.fullName}</p>
            <p><strong>Phone Number:</strong> {submittedData.phoneNumber}</p>
            <p><strong>Email:</strong> {submittedData.email || "N/A"}</p>
            <p><strong>Enquiry Type:</strong> {submittedData.enquiryType}</p>
            <p><strong>Message:</strong> {submittedData.message}</p>
            <p><strong>Additional Notes:</strong> {submittedData.additionalNotes || "N/A"}</p>
            <p><strong>Entered By:</strong> {submittedData.enteredBy}</p>
          </div>
        )}
      </Modal>
    </Card>
  );
};

export default EnquiryForm;
