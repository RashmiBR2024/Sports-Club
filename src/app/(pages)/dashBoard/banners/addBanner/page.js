"use client";

import { useState } from "react";
import { 
  Form, Input, Button, Checkbox, Row, Col, message, Card, Radio, Select, Upload, DatePicker, Modal
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";

const { Option } = Select;
const { RangePicker } = DatePicker; // For selecting start & end date

export default function BannerForm() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isButtonChecked, setIsButtonChecked] = useState(true);
  const [selectedType, setSelectedType] = useState("video");
  const [content_url, setContentUrl] = useState(null); 
  const [modalVisible, setModalVisible] = useState(false);
  const [bannerData, setBannerData] = useState(null);

  // States for colors
  const [titleFontColor, setTitleFontColor] = useState("#ffffff");
  const [subTitleFontColor, setSubTitleFontColor] = useState("#000000");
  const [buttonFontColor, setButtonFontColor] = useState("#000000");
  const [buttonBackgroundColor, setButtonBackgroundColor] = useState("#ffffff");

    // ✅ Function to handle image upload (Reused from UserForm)
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
                setContentUrl(result.data); // ✅ Store uploaded image URL
                form.setFieldsValue({ content_url: result.data }); // ✅ Auto-fill field
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

  // Convert RGB to Hex for color fields
  const rgbToHex = (rgb) => {
    if (rgb.startsWith("#")) return rgb; // If already hex, return it
    const result = rgb.match(/\d+/g);
    if (!result) return "#ffffff"; // Default to white if conversion fails
    return `#${result.map((x) => parseInt(x).toString(16).padStart(2, "0")).join("")}`;
  };

  const handleColorChange = (color, setHex) => {
    setHex(color);
  };

  const onFinish = async (values) => {
    try {
        setLoading(true);

        // Explicitly convert boolean values
        values.isStatus = !!values.isStatus;
        values.isButton = !!values.isButton;
        values.isText = !!values.isText;

        // Ensure display duration is a number
        values.displayDuration = Number(values.displayDuration);

        // Validate that at least one display page is selected
        if (!values.displayOnPages || values.displayOnPages.length === 0) {
            message.error("Please select at least one page for display!");
            setLoading(false);
            return;
        }

        // Extract start & end date from RangePicker
        if (!values.schedule || values.schedule.length !== 2) {
            message.error("Please select a valid schedule range!");
            setLoading(false);
            return;
        }

        const [startDate, endDate] = values.schedule;
        values.schedule = {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
        };

        const bannerData = {
            title: values.title,
            subTitle: values.subTitle,
            fontStyle: values.fontStyle || "Prosto One",
            titleFontColor: values.titleFontColor, // Directly fromstate, now correctly in hex
            subTitleFontColor: values.subTitleFontColor, // Directly from state, now in hex
            buttonFontColor: values.buttonFontColor, // Directly from state, now in hex
            buttonBackgroundColor: values.buttonBackgroundColor, // Directly from state, now in hex
            titleFontSize: values.titleFontSize ? Number(values.titleFontSize) : 26,
            subTitleFontSize: values.subTitleFontSize ? Number(values.subTitleFontSize) : 14,
            buttonFontSize: values.buttonFontSize ? Number(values.buttonFontSize) : 14,
            displayDuration: values.displayDuration,
            isStatus: values.isStatus,
            isButton: values.isButton,
            isText: values.isText,
            schedule: values.schedule,
            displayOnPages: values.displayOnPages,
            type: values.type,
            content_url: values.content_url,
            buttonName: values.buttonName || "",
            button_url: values.button_url || "",
        };

        console.log("📤 Sending Data:", JSON.stringify(bannerData, null, 2));

        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/postBannerData`,
            bannerData,
            {
                headers: {
                    "x-api-key": process.env.NEXT_PUBLIC_API_AUTH_KEY,
                    "Content-Type": "application/json",
                },
            }
        );

        if (response.data.success) {
          message.success("Banner information submitted successfully!");
          setBannerData(bannerData); // ✅ Store submitted data for modal
          setModalVisible(true); // ✅ Show modal
          form.resetFields();
          setContentUrl(null);
        } else {
          throw new Error(response.data.error);
        }
      } catch (error) {
        console.error("❌ Request Failed:", error.response?.data || error.message);
        message.error(error.response?.data?.error || "Failed to submit banner information.");
      } finally {
        setLoading(false);
      }
  };


  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList([...newFileList]); // ✅ Ensure it's always an array
  };  

  return (
    <div
      style={{
        marginTop: "10%",
        maxWidth: "950px",
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
          form={form}
          onFinish={onFinish}
          initialValues={{
            isStatus: true,
            isButton: true,
            isText: true,
            type: "video",
            displayOnPages: [],
            fontStyle: "Prosto One",
            titleFontColor: "#ffffff",
            subTitleFontColor: "#ffffff",
            buttonFontColor: "#000000",
            buttonBackgroundColor: "#ffffff",
            titleFontSize: 26,
            subTitleFontSize: 14,
            buttonFontSize: 14,
          }}
        >

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item name="isStatus" valuePropName="checked">
                <Checkbox>Is Active?</Checkbox>
              </Form.Item>
            </Col>
          </Row>

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
                rules={[{ required: true, message: "Please enter the subtitle!" }]}
              >
                <Input placeholder="Enter banner subtitle" />
              </Form.Item>
            </Col>
          </Row>

          {/* Font Size Fields */}
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item label="Title Font Size (px)" name="titleFontSize">
                <Input type="number" min={10} max={50} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="Subtitle Font Size (px)" name="subTitleFontSize">
                <Input type="number" min={10} max={50} />
              </Form.Item>
            </Col>
          </Row>

          {/* Font Colors */}
          {/* Font Colors */}
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
            {/* title font color */}
              <Form.Item label="Title Font Color" name="titleFontColor">
                <div className = "flex items-center gap-3">
                  <Input
                  type="color"
                  value={titleFontColor}
                  onChange = {(e) => setTitleFontColor(e.target.value)}
                  style={{ width: "50px", height: "35px", padding: 0, border: "none" }}
                />
                <Input 
                value={titleFontColor}
                readOnly
                style = {{ width: "100px", textAlign: "center", fontWeight: "bold" }}
                />
              </div>
              </Form.Item>
            </Col>
            {/* subTitleFontColor */}
            <Col xs={24} sm={12}>
            <Form.Item label="Sub-Title Font Color" name="subTitleFontColor">
                <div className = "flex items-center gap-3">
                  <Input
                  type="color"
                  value={subTitleFontColor}
                  onChange = {(e) => setSubTitleFontColor(e.target.value)}
                  style={{ width: "50px", height: "35px", padding: 0, border: "none" }}
                />
                <Input 
                value={subTitleFontColor}
                readOnly
                style = {{ width: "100px", textAlign: "center", fontWeight: "bold" }}
                />
              </div>
              </Form.Item>
            </Col>
          </Row>

          {/* Font Style */}
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Font Style"
                name="fontStyle"
                rules={[{ required: false, message: "Please select a font style!" }]}
              >
                <Select placeholder="Select font style" onChange={handleTypeChange}>
                  <Option value="Poppins">Poppins</Option>
                  <Option value="Montserrat">Montserrat</Option>
                  <Option value="Raleway">Raleway</Option>
                  <Option value="Roboto">Roboto</Option>
                  <Option value="Prosto One">Prosto One</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <hr style={{ margin: "20px 0", borderTop: "1px solid #ddd" }} />

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item name="isButton" valuePropName="checked">
                <Checkbox
                  onChange={(e) => setIsButtonChecked(e.target.checked)}
                >
                  Include Button?
                </Checkbox>
              </Form.Item>
            </Col>
          </Row>

          {isButtonChecked && (
          <Row gutter={[23, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Button Name"
                name="buttonName"
                rules={[
                  {
                    required: isButtonChecked,
                    message: "Please enter the button name!",
                  },
                ]}
              >
                <Input placeholder="Enter button name" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Button URL"
                name="button_url"
                rules={[
                  {
                    required: isButtonChecked,
                    message: "Please enter the button URL!",
                  },
                ]}
              >
                <Input placeholder="Enter button URL" />
              </Form.Item>
            </Col>
          </Row>
        )}

        {isButtonChecked && (
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item label="Button Font Size (px)" name="buttonFontSize">
                <Input type="number" min={10} max={50} />
              </Form.Item>
            </Col>
          <Col xs={24} sm={12} style={{ display: "flex", flexDirection: "row", gap: "2rem" }}>
              <Form.Item label="Title Font Color" name="buttonFontColor">
                <div className = "flex items-center gap-3">
                  <Input
                    type="color"
                    value={buttonFontColor}
                    onChange = {(e) => setButtonFontColor(e.target.value)}
                    style={{ width: "50px", height: "35px", padding: 0, border: "none" }}
                  />
                  <Input 
                    value={subTitleFontColor}
                    readOnly
                    style = {{ width: "100px", textAlign: "center", fontWeight: "bold" }}
                  />
                </div>
              </Form.Item>
              <Form.Item label="Title Font Color" name="buttonBackgroundColor">
                <div className = "flex items-center gap-3">
                  <Input
                    type="color"
                    value={buttonBackgroundColor}
                    onChange = {(e) => setButtonBackgroundColor(e.target.value)}
                    style={{ width: "50px", height: "35px", padding: 0, border: "none" }}
                  />
                  <Input 
                    value={buttonBackgroundColor}
                    readOnly
                    style = {{ width: "100px", textAlign: "center", fontWeight: "bold" }}
                  />
                </div>
              </Form.Item>
              </Col>
            </Row>
        )}

        <hr style={{ margin: "20px 0", borderTop: "1px solid #ddd" }} />

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Type"
              name="type"
              rules={[{ required: true, message: "Please select the type!" }]}
            >
              <Radio.Group onChange={handleTypeChange} value={selectedType}>
                <Radio value="video">Video</Radio>
                <Radio value="image">Image</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>

        {selectedType === "video" ? (
          <>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="YouTube Link"
                  name="content_url"
                  rules={[
                    {
                      required: true,
                      message: "Please enter the YouTube link!",
                    },
                  ]}
                >
                  <Input placeholder="Enter YouTube video URL" />
                </Form.Item>
              </Col>
            </Row>
          </>
        ) : (
          <>
            <Row gutter={[16, 16]} >
              <Col xs={24} sm={8}>
                <Form.Item
                  label="Image URL"
                  name="content_url"
                  rules={[
                    {
                      required: true,
                      message: "Please enter the image URL!",
                    },
                  ]}
                >
                  <Input placeholder="Enter image URL" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={4}></Col>
              <Col xs={24} sm={8}>
              <Form.Item label="Upload Banner Image" name="upload_image">
                <Upload
                  listType="picture"
                  maxCount={1}
                  customRequest={({ file, onSuccess }) => {
                    handleImageUpload(file)
                      .then(() => onSuccess("ok"))
                      .catch(() => message.error("Upload failed"));
                  }}
                  fileList={content_url ? [{ url: content_url, name: "Banner Image" }] : []} // ✅ Display uploaded image
                >
                  <Button icon={<UploadOutlined />}>Upload Image</Button>
                </Upload>
              </Form.Item>
            </Col>
            </Row>
          </>
        )}

        <hr style={{ margin: "20px 0", borderTop: "1px solid #ddd" }} />

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Display Duration (in seconds)"
              name="displayDuration"
              rules={[
                {
                  required: true,
                  message: "Please enter the display duration!",
                },
              ]}
            >
              <Input type="number" placeholder="Enter display duration (2-25 seconds)" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}></Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item 
              label="Display on Pages" 
              name="displayOnPages" 
              rules={[{ required: true, message: "Please select at least one page!" }]}
            >
              <Select mode="multiple" placeholder="Select pages" allowClear style={{ width: "100%" }}>
                <Option value="home">🏠 Home</Option>
                <Option value="matches">🏏 Matches</Option>
                <Option value="newsmedia">📰 News / Media</Option>
                <Option value="sponsorsanddeals">🤝 Sponsors & Deals</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}></Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <Form.Item name="isText" valuePropName="checked">
              <Checkbox>Include Text?</Checkbox>
            </Form.Item>
          </Col>
        </Row>

        {/* Schedule (Start & End Date) */}
        <Row gutter={[16, 16]} style={{ marginBottom: "1rem" }}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Schedule / Active period (Start & End Date)"
              name="schedule"
              rules={[{ required: true, message: "Please select a schedule range!" }]}
            >
              <RangePicker
                format="YYYY-MM-DD"
                style={{ width: "100%" }}
                disabledDate={(current) => current && current < dayjs().startOf("day")} // Prevent past dates
              />
            </Form.Item>
          </Col>
        </Row>

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

      {/* ✅ Modal After Submission */}
      <Modal title="Banner Added Successfully!" open={modalVisible} onCancel={() => setModalVisible(false)} footer={null}>
        {bannerData && (
          <div className="text-center">
            <h2>{bannerData.title}</h2>
            <p>{bannerData.subTitle}</p>
            <img src={bannerData.content_url} alt="Banner" style={{ width: "100%", borderRadius: "10px", marginBottom: "10px" }} />
            <p>Display Duration: {bannerData.displayDuration} seconds</p>
            <p>Display on Pages: {bannerData.displayOnPages.join(", ")}</p>
            <p>Start Date: {dayjs(bannerData.schedule[0]).format("YYYY-MM-DD")}</p>
            <p>End Date: {dayjs(bannerData.schedule[1]).format("YYYY-MM-DD")}</p>
            <p>Active: {bannerData.isStatus ? "Yes" : "No"}</p>
            <p>Button: {bannerData.isButton ? "Yes" : "No"}</p>
            <p>Text: {bannerData.isText? "Yes" : "No"}</p>
            <p>Button Name: {bannerData.buttonName}</p>
            <p>Button Font Color: {bannerData.buttonFontColor}</p>
            <p>Button Background Color: {bannerData.buttonBackgroundColor}</p>
            <p>Button Font Size: {bannerData.buttonFontSize} px</p>
            <p>Font Style: {bannerData.fontStyle}</p>
            <p>Font Weight: {bannerData.fontWeight}</p>
            <p>Title Font Size: {bannerData.titleFontSize} px</p>
            <p>Sub Title Font Size: {bannerData.subTitleFontSize} px</p>
            <p>Button Font Size: {bannerData.buttonFontSize} px</p>
            <p>Title Font Color: {bannerData.titleFontColor}</p>
            <p>Sub Title Font Color: {bannerData.subTitleFontColor}</p>
            <p>Button Font Color: {bannerData.buttonFontColor}</p>
            <p>Button Background Color: {bannerData.buttonBackgroundColor}</p>
            <p>Type: {bannerData.type}</p>
            <p>YouTube Link: {bannerData.content_url}</p>
            <p>Image URL: {bannerData.content_url}</p>
            <p>Button URL: {bannerData.button_url}</p>
            <br />
            <Button type="primary" onClick={() => window.location.href = "/"}>View Banner</Button>
            <Button onClick={() => setModalVisible(false)}>+ Add Another Banner</Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
