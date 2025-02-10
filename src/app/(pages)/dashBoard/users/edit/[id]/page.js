"use client";

import { useState, useEffect } from "react";
import { 
  Form, Input, Button, DatePicker, Select, Upload, Checkbox, Row, Col, message, Card, Radio, Modal, 
  Space, Collapse, Typography ,
} from "antd";
import { UploadOutlined, DownOutlined, UpOutlined } from "@ant-design/icons";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import dayjs from "dayjs";

const { Option } = Select;
const { Panel } = Collapse;
const { Text: AntText } = Typography; // Renamed to avoid naming conflict


export default function EditUserForm() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [userData, setUserData] = useState(null);
  const router = useRouter();
  const { id } = useParams(); // ✅ Get userId from URL path

  useEffect(() => {
    if (id) {
      console.log("Extracted User ID:", id);
      fetchUserData(id);
    }
  }, [id]); // ✅ Fetch data when `id` changes

  // ✅ Fetch user data
  const fetchUserData = async (userId) => {
    try {
      console.log("Fetching user data for ID:", userId);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getUsersData?id=${userId}`,
        {
          headers: {
            "x-api-key": process.env.NEXT_PUBLIC_API_AUTH_KEY
          }
        }
      );

      if (response.data.success && response.data.data.length > 0) {
        const user = response.data.data[0];
        setUserData(user);
        form.setFieldsValue({
          ...user,
          dateOfBirth: user.dateOfBirth ? dayjs(user.dateOfBirth) : null,
          dateOfJoining: user.dateOfJoining ? dayjs(user.dateOfJoining) : null,
        });
        setImageUrl(user.profilePicture);
      } else {
        message.error("User not found!");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      message.error("Failed to load user data.");
    }
  };

    // Function to handle image upload
    const handleImageUpload = async (file) => {
      try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        
        return new Promise((resolve, reject) => {
          reader.onloadend = async () => {
            try {
              const base64data = reader.result.split(',')[1];
              const fileType = file.type;
  
              // Send the image to the backend
              const response = await fetch("https://testapi.trueledger.in/api/uploadFilesS3", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ file: base64data, fileType }),
              });
  
              if (response.ok) {
                const result = await response.json();
                setImageUrl(result.data); // Store the image URL
                form.setFieldsValue({ profilePicture: result.data });
                message.success("Image uploaded successfully!");
                resolve(result.data);
              } else {
                message.error("Failed to upload image.");
                reject("Upload failed");
              }
            } catch (error) {
              console.error("Error uploading image:", error);
              message.error("An error occurred during file upload.");
              reject(error);
            }
          };
        });
      } catch (error) {
        console.error("File upload error:", error);
      }
    };

  // ✅ Handle form submission (Edit/Update user)
  const onFinish = async (values) => {
    try {
      setLoading(true);
  
      // Convert date formats
      const formattedData = {
        _id: id,  // Ensure _id is sent
        ...values,
        dateOfBirth: values.dateOfBirth ? dayjs(values.dateOfBirth).format("YYYY-MM-DD") : null,
        dateOfJoining: values.dateOfJoining ? dayjs(values.dateOfJoining).format("YYYY-MM-DD") : null,
        profilePicture: imageUrl || "",
        government_ids: values.government_ids ? values.government_ids.split(",").map(id => id.trim()) : [],
        government_urls: values.government_urls ? values.government_urls.split(",").map(url => url.trim()) : [],
      };
      
  
      // Check if any changes have been made
      if (JSON.stringify(formattedData) === JSON.stringify(userData)) {
        message.info("No changes detected.");
        setLoading(false);
        return;
      }
  
      console.log("📤 Updating User Data:", JSON.stringify(formattedData, null, 2));
  
      // Make API call to update user data
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/putUsersData?id=${id}`,
        formattedData,
        {
          headers: {
            "x-api-key": process.env.NEXT_PUBLIC_API_AUTH_KEY,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.data.success) {
        message.success("User updated successfully!");
        router.push("/dashboard/users"); // ✅ Redirect after update
      } else {
        throw new Error(response.data.error);
      }
    } catch (error) {
      message.error(error.response?.data?.error || "Failed to update user data.");
    } finally {
      setLoading(false);
    }
  };
  

  const handleModalClose = () => {
    setModalVisible(false);
    setShowMoreDetails(false);
  };

  return (
    <div style={{ marginTop: "5%", maxWidth: "950px", margin: "0 auto", padding: "1rem" }}>
      <Card title="Edit User Information">
        <Form layout="vertical" form={form} onFinish={onFinish}>
          {/* Name & DOB */}
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item label="Name" name="name" rules={[{ required: true, message: "Enter user name!" }]}>
                <Input placeholder="Enter user name" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="Date of Birth" name="dateOfBirth">
                <DatePicker className="w-full" />
              </Form.Item>
            </Col>
          </Row>

          {/* Auto-Filled Age Field */}
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item label="Age" name="age" rules={[{ required: true, message: "Age will be auto-calculated!" }]}>
                <Input placeholder="Age" readOnly />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="Gender" name="gender" rules={[{ required: true, message: "Select Gender!" }]}>
                <Radio.Group>
                  <Radio value="Male">Male</Radio>
                  <Radio value="Female">Female</Radio>
                  <Radio value="Other">Other</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          {/* Subscription ID & Date of Joining */}
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item label="Subscription ID" name="subscription_id" rules={[{ required: true, message: "Enter Subscription ID!" }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="Date of Joining" name="dateOfJoining" rules={[{ required: true, message: "Select Joining Date!" }]}>
                <DatePicker className="w-full" />
              </Form.Item>
            </Col>
          </Row>

          {/* Specialization (Multi-Select Dropdown) */}
          <Row gutter={[16, 16]}>
            {/* <Col xs={24} sm={12}> */}
              {/* <Form.Item label="User Code" name="userCode">
                <Input placeholder="User Code" readOnly />
              </Form.Item> */}
            {/* </Col> */}
            <Col xs={24} sm={12}>
              <Form.Item label="Phone Number" name="phoneNumber" rules={[{ required: true, pattern: /^\d{10}$/, message: "Enter a valid 10-digit number!" }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Specialization"
                name="specialization"
                rules={[{ required: false, message: "Please select specialization(s)!" }]}
              >
                <Select mode="multiple" placeholder="Specialization(s)">
                  <Option value="Opener">Opener</Option>
                  <Option value="Middle-Order Batsman">Middle-Order Batsman</Option>
                  <Option value="Finisher">Finisher</Option>
                  <Option value="Fast Bowler">Fast Bowler</Option>
                  <Option value="Spin Bowler">Spin Bowler</Option>
                  <Option value="All-Rounder">All-Rounder</Option>
                  <Option value="Wicketkeeper">Wicketkeeper</Option>
                  <Option value="Batsman">Batsman</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Profile Picture Upload */}
          <Row gutter={[16, 16]}>
            <Col xs={24}>
              <Form.Item label="Profile Picture">
                <Upload
                  listType="picture"
                  maxCount={1}
                  customRequest={({ file, onSuccess }) => {
                    handleImageUpload(file)
                      .then(() => onSuccess("ok"))
                      .catch(() => message.error("Upload failed"));
                  }}
                  fileList={imageUrl ? [{ url: imageUrl, name: "Profile Picture" }] : []} // ✅ Show uploaded image
                >
                  <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>

          
          {/* Statistics_id & Crickheros Url */}
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item label="Government IDs (comma-separated)" name="government_ids" rules={[{ required: true, message: "Enter Statistics ID!" }]}>
                <Input placeholder="Aadhar / PAN" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="Government Docs URLs (comma-separated)" name="government_urls">
                <Input placeholder="https://link1.com, https://link2.com" />
              </Form.Item>
            </Col>
          </Row>

          {/* Statistics_id & Crickheros Url */}
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item label="Statistics ID" name="statistics_id" rules={[{ required: true, message: "Enter Statistics ID!" }]}>
                <Input placeholder="Statistics Id" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label={
                  <span style={{ display: "flex"}} >
                    <img 
                      width="20px"
                      src="https://cricheroes-media-mumbai.s3.ap-south-1.amazonaws.com/cricheroes_website_new/images/other/cricheroes-logo@2x.png?width=1920&quality=75&format=auto" 
                      alt="CricHeroes Logo" 
                      style={{ marginRight: "8px" }} // Optional: Add margin to space out logo and text
                    />
                    <p>CrickHeros URL</p>
                  </span>
                } 
                name="crickheros_url"
              >
                <Input placeholder="CrickHeros URL" />
              </Form.Item>
            </Col>
          </Row>

          {/* Active Player Checkbox */}
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item name="isActive" valuePropName="checked">
                <Checkbox onChange={(e) => {
                  const currentYear = dayjs().year();
                  const existingYears = form.getFieldValue("activeYear") || [];

                  if (e.target.checked) {
                    // Add the current year only if it's not already in the array
                    if (!existingYears.includes(currentYear)) {
                      form.setFieldsValue({ activeYear: [...existingYears, currentYear] });
                    }
                  } else {
                    // Remove the current year when unchecked
                    form.setFieldsValue({ activeYear: existingYears.filter(year => year !== currentYear) });
                  }
                }}>
                  Active Player
                </Checkbox>
              </Form.Item>
            </Col>
          </Row>

          {/* Submit Button */}
          <Row justify="center">
            <Col>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block>
                  Update User
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* Modal to Display User Data */}{/* Updated Modal */}
      <Modal 
        title={<span style={{ color: "green", textAlign: "center" }}>User Added Successfully!</span>}
        visible={modalVisible} 
        onCancel={handleModalClose} 
        footer={null} 
        centered
        width={600}
        bodyStyle={{ padding: "24px" }}
      >
        {userData && (
          <div style={{ textAlign: "center" }}>

            {/* Profile Picture and Name */}
            <div style={{ marginBottom: "16px" }}>
              {userData.profilePicture ? (
                <img 
                  src={userData.profilePicture} 
                  alt="Profile" 
                  style={{ 
                    textAlign: "center",
                    borderRadius: "50%", 
                    width: "100px", 
                    height: "100px", 
                    objectFit: "cover",
                    border: "2px solid #1890ff",
                  }} 
                />
              ) : (
                <div style={{ 
                  width: "100px", 
                  height: "100px", 
                  borderRadius: "50%", 
                  backgroundColor: "#f0f2f5", 
                  margin: "0 auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid #1890ff",
                }}>
                  <UploadOutlined style={{ fontSize: "32px", color: "#bfbfbf" }} />
                </div>
              )}
              <h1 style={{ fontSize: "20px", fontWeight: "500", marginTop: "12px" }}>{userData.name}</h1>
            </div>

            {/* Essential Information */}
            <div style={{ textAlign: "left", marginBottom: "16px" }}>
              <AntText strong>Phone Number:</AntText> <AntText>{userData.phoneNumber}</AntText><br />
              <AntText strong>Gender:</AntText> <AntText>{userData.gender}</AntText><br />
              <AntText strong>Age:</AntText> <AntText>{userData.age}</AntText><br />
              <AntText strong>Subscription ID:</AntText> <AntText>{userData.subscription_id}</AntText>
            </div>

            {/* More Details Section */}
            <Collapse 
              bordered={false} 
              activeKey={showMoreDetails ? "moreDetails" : undefined} 
              onChange={() => setShowMoreDetails(!showMoreDetails)}
              style={{ backgroundColor: "#fafafa", borderRadius: "8px" }}
            >
              <Panel 
                key="moreDetails" 
                header={
                  <div style={{ textAlign: "center" }}>
                    <Button type="link" style={{ color: "#1890ff" }}>
                      {showMoreDetails ? <UpOutlined /> : <DownOutlined />} 
                      {showMoreDetails ? "Less Details" : "More Details"}
                    </Button>
                  </div>
                }
                showArrow={false}
              >
                <div style={{ textAlign: "left" }}>
                  <AntText strong>Date of Birth:</AntText> <AntText>{dayjs(userData.dateOfBirth).format("DD MMM YYYY")}</AntText><br />
                  <AntText strong>Date of Joining:</AntText> <AntText>{dayjs(userData.dateOfJoining).format("DD MMM YYYY")}</AntText><br />
                  <AntText strong>Specialization(s):</AntText> <AntText>{userData.specialization.join(", ")}</AntText><br />
                  <AntText strong>Statistics ID:</AntText> <AntText>{userData.statistics_id}</AntText><br />
                  <AntText strong>CrickHeros URL:</AntText> <AntText>{userData.crickheros_url}</AntText><br />
                  <AntText strong>Government IDs:</AntText> <AntText>{userData.government_ids.join(", ")}</AntText><br />
                  <AntText strong>Active Year(s):</AntText> <AntText>{userData.activeYear.join(", ")}</AntText><br />
                  <AntText strong>Government Docs URLs:</AntText> <AntText>{userData.government_urls.join(", ")}</AntText>
                </div>
              </Panel>
            </Collapse>

            {/* Buttons */}
            <div style={{ marginTop: "24px", display: "flex", justifyContent: "center", gap: "12px" }}>
              <Button type="primary" onClick={() => window.location.href = `/playerOverview/${userData._id}`}>
                Open User Page
              </Button>
              <Button onClick={() => window.location.href = `/dashBoard/users/addUsers`}>+ Add User</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
