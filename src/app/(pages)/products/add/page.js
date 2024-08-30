"use client";
import { useState } from 'react';
import { Form, Input, Button, Upload, Row, Col, Card, message, Space, Modal, Select, InputNumber, Divider, Tabs } from 'antd';
import { UploadOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

const AddProduct = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [activeTabKey, setActiveTabKey] = useState("1");

  const handleAddVariant = () => {
    setVariants([...variants, { color: '', images: [], sizes: [], material: '', weight: '', dimensions: { length: '', width: '' }, isStatus: 'true' }]);
  };

  const handleAddSize = (index) => {
    const newVariants = [...variants];
    newVariants[index].sizes.push({ size: '', mrp: '', sellingPrice: '', discount: '', quantity: '', barcode: '', sku: '' });
    setVariants(newVariants);
  };

  const handleImageUpload = async (fileList, variantIndex) => {
    const newVariants = [...variants];

    const uploadedUrls = await Promise.all(
      fileList.map(async (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        return new Promise((resolve, reject) => {
          reader.onloadend = async () => {
            try {
              const base64data = reader.result.split(',')[1];
              const fileType = file.originFileObj.type;
              const response = await fetch('https://testapi.trueledger.in/api/uploadFilesS3', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ file: base64data, fileType }),
              });

              if (response.ok) {
                const result = await response.json();
                resolve(result.data);
              } else {
                message.error('Failed to upload image');
                reject('Failed to upload image');
              }
            } catch (error) {
              console.error('Error during file upload:', error);
              message.error('An error occurred during file upload');
              reject(error);
            }
          };
        });
      })
    );

    newVariants[variantIndex].images = uploadedUrls;
    setVariants(newVariants);
  };

  const handleRemoveVariant = (index) => {
    const newVariants = [...variants];
    newVariants.splice(index, 1);
    setVariants(newVariants);
  };

  const handleSubmit = async () => {
    try {
      await form.validateFields();

      // Check for empty variants or sizes
      for (let i = 0; i < variants.length; i++) {
        if (!variants[i].color) {
          message.error(`Please enter color for variant ${i + 1}`);
          return;
        }
        for (let j = 0; j < variants[i].sizes.length; j++) {
          const size = variants[i].sizes[j];
          if (!size.size || !size.mrp || !size.sellingPrice || !size.discount || !size.quantity) {
            message.error(`Please fill all fields for size ${j + 1} of variant ${i + 1}`);
            return;
          }
        }
      }

      setLoading(true);
      const values = await form.validateFields();
      const productData = {
        ...values,
        variants,
        isStatus: 'active',
        tags: values.tags ? values.tags.split(',').map(tag => tag.trim()) : [],
        ratings: { average: values.averageRating, count: values.ratingCount },
        additionalInfo: {
          warranty: values.warranty,
          careInstructions: values.careInstructions
        }
      };

      const response = await fetch('https://api.sandhutsportsclub.com/api/postProductData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': '4c297349128e778505576f6045efb963'
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        setSuccessModalVisible(true);
      } else {
        const errorData = await response.json();
        message.error(`Failed to add product: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (key) => {
    setActiveTabKey(key);
  };

  const handleNext = () => {
    if (activeTabKey === "1") {
      setActiveTabKey("2");
    } else if (activeTabKey === "2") {
      setActiveTabKey("3");
    }
  };

  const handleBack = () => {
    if (activeTabKey === "2") {
      setActiveTabKey("1");
    } else if (activeTabKey === "3") {
      setActiveTabKey("2");
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Card title="Add Product">
        <Tabs activeKey={activeTabKey} onChange={handleTabChange}>
          <TabPane tab="Basic Info" key="1">
            <Form form={form} layout="vertical">
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="name"
                    label="Product Name"
                    rules={[{ required: true, message: 'Please input the Product Name!' }]}
                  >
                    <Input placeholder="Product Name" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="brand"
                    label="Brand"
                    rules={[{ required: true, message: 'Please input the brand!' }]}
                  >
                    <Input placeholder="Brand" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="category"
                    label="Category"
                    rules={[{ required: true, message: 'Please select a category!' }]}
                  >
                    <Select placeholder="Select a category">
                      <Option value="Sports Equipment">Sports Equipment</Option>
                      <Option value="Electronics">Electronics</Option>
                      <Option value="Apparel">Apparel</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="tags"
                    label="Tags"
                    extra="Enter tags separated by commas"
                  >
                    <Input placeholder="e.g. cricket, bat, sports" />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true, message: 'Please input the description!' }]}
              >
                <TextArea rows={4} placeholder="Description" />
              </Form.Item>
              <Space style={{ marginTop: 20 }}>
                <Button onClick={handleNext} type="primary">Next</Button>
              </Space>
            </Form>
          </TabPane>
          <TabPane tab="Variants" key="2">
            {variants.map((variant, variantIndex) => (
              <Card
                key={variantIndex}
                title={`Variant ${variantIndex + 1}`}
                extra={<Button icon={<DeleteOutlined />} onClick={() => handleRemoveVariant(variantIndex)}>Remove Variant</Button>}
                style={{ marginBottom: '16px', border: '1px solid #e8e8e8' }}
              >
                <Form layout="vertical">
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={8}>
                      <Form.Item
                        label="Color"
                        required
                      >
                        <Input
                          value={variant.color}
                          onChange={(e) => {
                            const newVariants = [...variants];
                            newVariants[variantIndex].color = e.target.value;
                            setVariants(newVariants);
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={8}>
                      <Form.Item
                        label="Material"
                      >
                        <Input
                          value={variant.material}
                          onChange={(e) => {
                            const newVariants = [...variants];
                            newVariants[variantIndex].material = e.target.value;
                            setVariants(newVariants);
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={8}>
                      <Form.Item
                        label="Weight"
                      >
                        <Input
                          value={variant.weight}
                          onChange={(e) => {
                            const newVariants = [...variants];
                            newVariants[variantIndex].weight = e.target.value;
                            setVariants(newVariants);
                          }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Dimensions (Length x Width)"
                      >
                        <Input.Group compact>
                          <Input
                            style={{ width: '50%' }}
                            placeholder="Length"
                            value={variant.dimensions.length}
                            onChange={(e) => {
                              const newVariants = [...variants];
                              newVariants[variantIndex].dimensions.length = e.target.value;
                              setVariants(newVariants);
                            }}
                          />
                          <Input
                            style={{ width: '50%' }}
                            placeholder="Width"
                            value={variant.dimensions.width}
                            onChange={(e) => {
                              const newVariants = [...variants];
                              newVariants[variantIndex].dimensions.width = e.target.value;
                              setVariants(newVariants);
                            }}
                          />
                        </Input.Group>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Images"
                      >
                        <Upload
                          listType="picture"
                          multiple
                          beforeUpload={() => false}
                          onChange={({ fileList }) => handleImageUpload(fileList, variantIndex)}
                        >
                          <Button icon={<UploadOutlined />}>Upload Images</Button>
                        </Upload>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Divider>Sizes</Divider>
                  {variant.sizes.map((size, sizeIndex) => (
                    <Row gutter={[16, 16]} key={sizeIndex}>
                      <Col xs={24} sm={4}>
                        <Form.Item
                          label="Size"
                          required
                        >
                          <Input
                            value={size.size}
                            onChange={(e) => {
                              const newVariants = [...variants];
                              newVariants[variantIndex].sizes[sizeIndex].size = e.target.value;
                              setVariants(newVariants);
                            }}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={4}>
                        <Form.Item
                          label="MRP"
                          required
                        >
                          <Input
                            value={size.mrp}
                            onChange={(e) => {
                              const newVariants = [...variants];
                              newVariants[variantIndex].sizes[sizeIndex].mrp = e.target.value;
                              setVariants(newVariants);
                            }}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={4}>
                        <Form.Item
                          label="Selling Price"
                          required
                        >
                          <Input
                            value={size.sellingPrice}
                            onChange={(e) => {
                              const newVariants = [...variants];
                              newVariants[variantIndex].sizes[sizeIndex].sellingPrice = e.target.value;
                              setVariants(newVariants);
                            }}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={4}>
                        <Form.Item
                          label="Discount"
                          required
                        >
                          <Input
                            value={size.discount}
                            onChange={(e) => {
                              const newVariants = [...variants];
                              newVariants[variantIndex].sizes[sizeIndex].discount = e.target.value;
                              setVariants(newVariants);
                            }}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={4}>
                        <Form.Item
                          label="Quantity"
                          required
                        >
                          <Input
                            value={size.quantity}
                            onChange={(e) => {
                              const newVariants = [...variants];
                              newVariants[variantIndex].sizes[sizeIndex].quantity = e.target.value;
                              setVariants(newVariants);
                            }}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={4}>
                        <Form.Item
                          label="Barcode"
                        >
                          <Input
                            value={size.barcode}
                            onChange={(e) => {
                              const newVariants = [...variants];
                              newVariants[variantIndex].sizes[sizeIndex].barcode = e.target.value;
                              setVariants(newVariants);
                            }}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={4}>
                        <Form.Item
                          label="SKU"
                        >
                          <Input
                            value={size.sku}
                            onChange={(e) => {
                              const newVariants = [...variants];
                              newVariants[variantIndex].sizes[sizeIndex].sku = e.target.value;
                              setVariants(newVariants);
                            }}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  ))}
                  <Button type="dashed" onClick={() => handleAddSize(variantIndex)} block icon={<PlusOutlined />}>
                    Add Size
                  </Button>
                </Form>
              </Card>
            ))}
            <Button type="dashed" onClick={handleAddVariant} block icon={<PlusOutlined />}>
              Add Variant
            </Button>
            <Space style={{ marginTop: 20 }}>
              <Button onClick={handleBack}>Back</Button>
              <Button onClick={handleNext} type="primary">Next</Button>
            </Space>
          </TabPane>
          <TabPane tab="Ratings & Additional Info" key="3">
            <Form form={form} layout="vertical">
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={8}>
                  <Form.Item
                    name="averageRating"
                    label="Average Rating"
                    rules={[{ required: true, message: 'Please input the average rating!' }]}
                  >
                    <InputNumber min={0} max={5} step={0.1} placeholder="Average Rating" style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item
                    name="ratingCount"
                    label="Rating Count"
                    rules={[{ required: true, message: 'Please input the rating count!' }]}
                  >
                    <InputNumber min={0} placeholder="Rating Count" style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item
                    name="warranty"
                    label="Warranty"
                    rules={[{ required: true, message: 'Please input the warranty information!' }]}
                  >
                    <Input placeholder="Warranty information" />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                name="careInstructions"
                label="Care Instructions"
                rules={[{ required: true, message: 'Please input the care instructions!' }]}
              >
                <TextArea placeholder="Care Instructions" rows={3} />
              </Form.Item>
              <Space style={{ marginTop: 20 }}>
                <Button onClick={handleBack}>Back</Button>
                <Button type="primary" onClick={handleSubmit} loading={loading}>
                  Add Product
                </Button>
              </Space>
            </Form>
          </TabPane>
        </Tabs>
      </Card>

      {/* Success Modal */}
      <Modal
        title="Success"
        visible={successModalVisible}
        onOk={() => router.push('/products')}
        onCancel={() => setSuccessModalVisible(false)}
        okText="Go to Products"
      >
        <p>Product added successfully!</p>
      </Modal>
    </div>
  );
};

export default AddProduct;
