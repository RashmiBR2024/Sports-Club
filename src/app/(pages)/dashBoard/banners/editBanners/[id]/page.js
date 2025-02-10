"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";  
import { 
  Form, Input, Button, Checkbox, Row, Col, DatePicker, message, Card, Radio, Select, Spin, Alert 
} from "antd";
import axios from "axios";
import ViewBanner from "../../viewBanners/page";
import dayjs from "dayjs";

const { Option } = Select;
const { RangePicker } = DatePicker; // For selecting start & end date

export default function BannerDetails({ bannerId }) {
  const router = useRouter();
  console.log("Received ID:", bannerId);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [banner, setBanner] = useState(null);
  const [error, setError] = useState(null);
  const [isButtonChecked, setIsButtonChecked] = useState(true);
  const [selectedType, setSelectedType] = useState("video"); 

  const handleCancel = () => {
    router.push("");
  }

  const rgbToHex = (rgb) => {
    if (rgb.startsWith("#")) return rgb; // If already hex, return it
    const result = rgb.match(/\d+/g);
    if (!result) return "#ffffff"; // Default to white if conversion fails
    return `#${result.map((x) => parseInt(x).toString(16).padStart(2, "0")).join("")}`;
  };

  useEffect(() => {
    if (!bannerId) return;

    const fetchBanner = async () => {
      try {
        setBannerLoading(true);
        setError(null);

        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getBannerDataById?id=${bannerId}&authkey=${process.env.NEXT_PUBLIC_API_AUTH_KEY}`);
        
        if (response.data?.data) {
          setBanner(response.data.data);
          form.setFieldsValue(response.data.data); // Prefill form with fetched data
          setIsButtonChecked(response.data.data.isButton);
          setSelectedType(response.data.data.type);
        } else {
          setError("Banner details not found.");
        }
      } catch (error) {
        setError(error.response?.data?.error || "Error fetching banner details.");
      } finally {
        setBannerLoading(false);
      }
    };

    fetchBanner();
  }, [bannerId]);

  const onFinish = async (values) => {
    try {
      setLoading(true);
  
      const requestData = { bannerId, ...values }; // ✅ Include ID in the request body
  
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/putBannerDataById`, // ✅ Corrected endpoint
        requestData, 
        {
          headers: { "x-api-key": process.env.NEXT_PUBLIC_API_AUTH_KEY },
        }
      );
  
      message.success("Banner updated successfully!");
      console.log("Response:", response.data);
  
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      message.error("Failed to update banner.");
      setLoading(false);
    }
  };  

  if (bannerLoading) {
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

  const allowedPages = selectedType === "image"
    ? ["home", "matches", "sponsors"]
    : ["home", "matches", "news"];

  return (
    <div style={{ marginTop: "10%", maxWidth: "950px", margin: "0 auto", padding: "1rem" }}>
      <Card
        title="Edit Banner Information"
        style={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", borderRadius: "10px" }}
        bodyStyle={{ padding: "1rem" }}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          initialValues={{ isStatus: true, isButton: true, isText: true, type: "video", displayOnPages: [] }}
        >
          {/* Title and Subtitle */}
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item label="Title" name="title" rules={[{ required: true, message: "Please enter the title!" }]}>
                <Input placeholder="Enter banner title" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="Subtitle" name="subTitle" rules={[{ required: true, message: "Please enter the subtitle!" }]}>
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
                <Checkbox onChange={(e) => setIsButtonChecked(e.target.checked)}>Include Button?</Checkbox>
              </Form.Item>
            </Col>
          </Row>

           {/* Type Selection (Radio) */}
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item label="Type" name="type" rules={[{ required: true, message: "Please select the type!" }]}>
                <Radio.Group
                  onChange={(e) => {
                    setSelectedType(e.target.value); // ✅ Update selected type
                    form.setFieldsValue({ displayOnPages: [] }); // ✅ Reset selected pages
                  }}
                >
                  <Radio value="video">Video</Radio>
                  <Radio value="image">Image</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          {/* Button Name (Conditional) */}
          {isButtonChecked && (
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Button Name"
                  name="buttonName"
                  rules={[{ required: isButtonChecked, message: "Please enter the button name!" }]}
                >
                  <Input placeholder="Enter button name" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Button URL"
                  name="button_url"
                  rules={[{ required: isButtonChecked, message: "Please enter the button URL!" }]}
                >
                  <Input placeholder="Enter button URL" />
                </Form.Item>
              </Col>
            </Row>
          )}

          {/* Content and Button URLs */}
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item label="Content URL" name="content_url" rules={[{ required: true, message: "Please enter the content URL!" }]}>
                <Input placeholder="Enter content URL" />
              </Form.Item>
            </Col>
          </Row>

          {/* Display Duration */}
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item label="Display Duration (in seconds)" name="displayDuration" rules={[{ required: true, message: "Enter display duration (2-25 seconds)!" }]}>
                <Input type="number" placeholder="Enter display duration (2-25 seconds)" />
              </Form.Item>
            </Col>
          </Row>

          {/* Display On Pages (Dropdown with Checkboxes) */}
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item label="Display on Pages" name="displayOnPages">
                <Select mode="multiple" placeholder="Select pages" allowClear style={{ width: "100%" }}>
                  {allowedPages.includes("home") && <Option value="home">🏠 Home</Option>}
                  {allowedPages.includes("matches") && <Option value="matches">🏏 Matches</Option>}
                  {allowedPages.includes("news") && <Option value="news">📰 News / Media</Option>}
                  {allowedPages.includes("sponsors") && <Option value="sponsors">🤝 Sponsors & Deals</Option>}
                </Select>
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
                  Update Banner
                </Button>
              </Form.Item>
            </Col>
          </Row>

          <Row justify={"center"} gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <Form.Item>
                <Button type="default" onClick={handleCancel} block>
                  Cancel
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
}
