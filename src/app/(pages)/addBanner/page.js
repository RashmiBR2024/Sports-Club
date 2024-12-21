"use client";

import { useState } from "react";
import { Form, Input, Button, Checkbox, Row, Col, message, Card } from "antd";
import axios from "axios";

export default function BannerForm() {
  const [form] = Form.useForm(); // Use Ant Design's Form instance
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);

      if (values.type !== "video" && values.type !== "image") {
        message.error(
          "Invalid type value! Please ensure 'type' is either 'video' or 'image'."
        );
        setLoading(false);
        return;
      }

      const response = await axios.post(
        "http://localhost:3001/api/postBannerData",
        values,
        {
          headers: {
            "x-api-key": "4c297349128e778505576f6045efb963", // Replace with your actual API key
          },
        }
      );

      message.success("Banner information submitted successfully!");
      console.log("Response:", response.data);

      form.resetFields(); // Ensure all form fields are cleared
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      message.error("Failed to submit banner information.");
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        marginTop: "5rem",
        maxWidth: "900px",
        margin: "0 auto",
        padding: "1rem",
        boxSizing: "border-box",
      }}
    >
      <Card
        title="Insert Banner Information"
        style={{
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          borderRadius: "10px",
        }}
        bodyStyle={{ padding: "1rem" }}
      >
        <Form
          layout="vertical"
          form={form} // Bind form instance here
          onFinish={onFinish}
          initialValues={{
            isStatus: true,
            isButton: true,
            isText: true,
          }} // Set initial values for checkboxes
        >
          {/* Title and Subtitle */}
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Title"
                name="title"
                rules={[{ required: true, message: "Please enter the title!" }]}
              >
                <Input placeholder="Enter banner title" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Subtitle"
                name="subTitle"
                rules={[
                  { required: true, message: "Please enter the subtitle!" },
                ]}
              >
                <Input placeholder="Enter banner subtitle" />
              </Form.Item>
            </Col>
          </Row>

          {/* Status and Button Options */}
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item name="isStatus" valuePropName="checked">
                <Checkbox>Is Active?</Checkbox>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="isButton" valuePropName="checked">
                <Checkbox>Include Button?</Checkbox>
              </Form.Item>
            </Col>
          </Row>

          {/* Type and Button Name */}
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Type"
                name="type"
                rules={[
                  { required: true, message: "Please enter the banner type!" },
                ]}
              >
                <Input placeholder="Enter banner type (e.g., video or image)" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Button Name"
                name="buttonName"
                rules={[
                  { required: true, message: "Please enter the button name!" },
                ]}
              >
                <Input placeholder="Enter button name" />
              </Form.Item>
            </Col>
          </Row>

          {/* Content and Button URLs */}
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Content URL"
                name="content_url"
                rules={[
                  {
                    required: true,
                    message: "Please enter the content URL!",
                  },
                ]}
              >
                <Input placeholder="Enter content URL" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="Button URL" name="button_url">
                <Input placeholder="Enter button URL (optional)" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Display Duration (in seconds)"
                name="displayDuration"
                rules={[
                  {
                    required: true,
                    message:
                      "Please enter the display duration between 2 to 25 seconds!",
                  },
                ]}
              >
                <Input
                  type="number"
                  placeholder="Enter display duration (2-25 seconds)"
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Include Text */}
          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <Form.Item name="isText" valuePropName="checked">
                <Checkbox>Include Text?</Checkbox>
              </Form.Item>
            </Col>
          </Row>

          {/* Submit Button */}
          <Row justify="center" gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block>
                  Submit
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
}
