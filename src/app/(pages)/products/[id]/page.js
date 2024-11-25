"use client";
import { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, Row, Col, Card, message, Space, Select, InputNumber, Switch, Collapse, Tabs } from 'antd';
import { UploadOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useRouter, usePathname } from 'next/navigation';

const { TextArea } = Input;
const { Option } = Select;
const { Panel } = Collapse;
const { TabPane } = Tabs;

const UpdateProduct = () => {
  const router = useRouter();
  const pathname = usePathname();
  const productId = pathname;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               ame.split('/').pop();
  const [form] = Form.useForm();
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isStatus, setIsStatus] = useState(false);

  useEffect(() => {
    // Fetch the product data based on the productId
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://api.sandhutsportsclub.com/api/getProductDataWithId?productID=${productId}&authkey=4c297349128e778505576f6045efb963`);
        const data = await response.json();

        if (data.success) {
          const productData = data.data[0]; // Assuming the API returns the product data in an array
          setVariants(productData.variants);
          setIsStatus(productData.isStatus === "active");
          form.setFieldsValue({
            ...productData,
            tags: productData.tags.join(', '),
            averageRating: productData.ratings.average,
            ratingCount: productData.ratings.count,
            warranty: productData.additionalInfo?.warranty,
            careInstructions: productData.additionalInfo?.careInstructions,
          });
        } else {
          message.error('Failed to fetch product data');
        }
      } catch (error) {
        console.error('Error fetching product data:', error);
        message.error('An error occurred while fetching product data');
      }
    };

    fetchProduct();
  }, [productId, form]);

  const handleAddVariant = () => {
    setVariants([...variants, { color: '', images: [], sizes: [], material: '', weight: '', dimensions: { length: '', width: '' }, isStatus: true }]);
  };

  const handleAddSize = (index) => {
    const newVariants = [...variants];
    newVariants[index].sizes.push({ size: '', mrp: '', sellingPrice: '', discount: '', quantity: '', barcode: '', sku: '' });
    setVariants(newVariants);
  };

  const handleRemoveSize = (variantIndex, sizeIndex) => {
    const newVariants = [...variants];
    newVariants[variantIndex].sizes.splice(sizeIndex, 1);
    setVariants(newVariants);
  };

  const handleImageUpload = async (fileList, variantIndex) => {
    const newVariants = [...variants];

    if (fileList.length === 0) {
      newVariants[variantIndex].images = [];
      setVariants(newVariants);
      return;
    }

    const uploadedUrls = await Promise.all(
      fileList.map(async (file) => {
        if (file.url) {
          return file.url; // If the image URL already exists, just return it
        }
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
                resolve(result.data); // Assuming the API returns the URL in result.data
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

  const handleVariantStatusChange = (variantIndex, status) => {
    const newVariants = [...variants];
    newVariants[variantIndex].isStatus = status;
    setVariants(newVariants);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const updatedProductData = { 
        ...values, 
        variants,
        isStatus: isStatus ? 'active' : 'inactive',
        tags: values.tags ? values.tags.split(',').map(tag => tag.trim()) : [],
        ratings: { average: values.averageRating, count: values.ratingCount },
        additionalInfo: {
          warranty: values.warranty,
          careInstructions: values.careInstructions
        }
      };

      const response = await fetch(`https://api.sandhutsportsclub.com/api/putProductData?productID=${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': '4c297349128e778505576f6045efb963',
        },
        body: JSON.stringify(updatedProductData),
      });

      const result = await response.json();

      if (result.success) {
        message.success('Product updated successfully!');
        router.push('/products');
      } else {
        message.error('Failed to update product');
      }
    } catch (error) {
      console.error('Error:', error);
      message.error('Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Tabs defaultActiveKey="1" type="card">
        <TabPane tab="General Information" key="1">
          <Card title="General Information">
            <Form form={form} layout="vertical">
              <Row gutter={16}>
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
              <Form.Item
                name="description"
                label="Description"
              >
                <TextArea rows={4} placeholder="Description" />
              </Form.Item>
              <Row gutter={16}>
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
                      {/* Add more categories as needed */}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item label="Product Status">
                    <Switch checked={isStatus} onChange={setIsStatus} checkedChildren="Active" unCheckedChildren="Inactive" />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                name="tags"
                label="Tags"
                extra="Enter tags separated by commas"
              >
                <Input placeholder="e.g. cricket, bat, sports" />
              </Form.Item>
            </Form>
          </Card>
        </TabPane>
        <TabPane tab="Variants" key="2">
          {variants.map((variant, variantIndex) => (
            <Card 
              key={variantIndex} 
              title={`Variant ${variantIndex + 1}`} 
              extra={<Switch checked={variant.isStatus} onChange={(status) => handleVariantStatusChange(variantIndex, status)} checkedChildren="Active" unCheckedChildren="Inactive" />}
            >
              <Row gutter={16}>
                <Col xs={24} sm={12}>
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
                      disabled={!variant.isStatus}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
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
                      disabled={!variant.isStatus}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} sm={12}>
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
                      disabled={!variant.isStatus}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Dimensions"
                  >
                    <Row gutter={8}>
                      <Col xs={12}>
                        <Input
                          placeholder="Length"
                          value={variant.dimensions.length}
                          onChange={(e) => {
                            const newVariants = [...variants];
                            newVariants[variantIndex].dimensions.length = e.target.value;
                            setVariants(newVariants);
                          }}
                          disabled={!variant.isStatus}
                        />
                      </Col>
                      <Col xs={12}>
                        <Input
                          placeholder="Width"
                          value={variant.dimensions.width}
                          onChange={(e) => {
                            const newVariants = [...variants];
                            newVariants[variantIndex].dimensions.width = e.target.value;
                            setVariants(newVariants);
                          }}
                          disabled={!variant.isStatus}
                        />
                      </Col>
                    </Row>
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label="Images">
                <Upload
                  listType="picture"
                  multiple
                  defaultFileList={variant.images.map((url, index) => ({
                    uid: index,
                    name: `image${index + 1}.jpg`,
                    url,
                    status: 'done'
                  }))}
                  beforeUpload={() => false} // Prevent automatic upload
                  onChange={({ fileList }) => handleImageUpload(fileList, variantIndex)}
                  onRemove={(file) => {
                    const newFileList = variant.images.filter((url) => url !== file.url);
                    const newVariants = [...variants];
                    newVariants[variantIndex].images = newFileList;
                    setVariants(newVariants);
                  }}
                  disabled={!variant.isStatus}
                >
                  <Button icon={<UploadOutlined />} disabled={!variant.isStatus}>Upload Images</Button>
                </Upload>
              </Form.Item>
              <Collapse>
                <Panel header="Sizes" key="1">
                  {variant.sizes.map((size, sizeIndex) => (
                    <Card
                      key={sizeIndex}
                      style={{ marginBottom: '16px' }}
                      title={`Size ${size.size || sizeIndex + 1}`}
                      extra={
                        <Button
                          type="danger"
                          icon={<DeleteOutlined />}
                          onClick={() => handleRemoveSize(variantIndex, sizeIndex)}
                          disabled={!variant.isStatus}
                        >
                          Remove
                        </Button>
                      }
                    >
                      <Row gutter={16}>
                        <Col xs={24} sm={8}>
                          <Form.Item label="Size" required>
                            <Input
                              value={size.size}
                              onChange={(e) => {
                                const newVariants = [...variants];
                                newVariants[variantIndex].sizes[sizeIndex].size = e.target.value;
                                setVariants(newVariants);
                              }}
                              disabled={!variant.isStatus}
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={8}>
                          <Form.Item label="MRP" required>
                            <InputNumber
                              value={size.mrp}
                              onChange={(value) => {
                                const newVariants = [...variants];
                                newVariants[variantIndex].sizes[sizeIndex].mrp = value;
                                setVariants(newVariants);
                              }}
                              min={0}
                              style={{ width: '100%' }}
                              disabled={!variant.isStatus}
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={8}>
                          <Form.Item label="Selling Price" required>
                            <InputNumber
                              value={size.sellingPrice}
                              onChange={(value) => {
                                const newVariants = [...variants];
                                newVariants[variantIndex].sizes[sizeIndex].sellingPrice = value;
                                setVariants(newVariants);
                              }}
                              min={0}
                              style={{ width: '100%' }}
                              disabled={!variant.isStatus}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <Col xs={24} sm={8}>
                          <Form.Item label="Discount" required>
                            <InputNumber
                              value={size.discount}
                              onChange={(value) => {
                                const newVariants = [...variants];
                                newVariants[variantIndex].sizes[sizeIndex].discount = value;
                                setVariants(newVariants);
                              }}
                              min={0}
                              max={100}
                              style={{ width: '100%' }}
                              disabled={!variant.isStatus}
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={8}>
                          <Form.Item label="Quantity" required>
                            <InputNumber
                              value={size.quantity}
                              onChange={(value) => {
                                const newVariants = [...variants];
                                newVariants[variantIndex].sizes[sizeIndex].quantity = value;
                                setVariants(newVariants);
                              }}
                              min={0}
                              style={{ width: '100%' }}
                              disabled={!variant.isStatus}
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={8}>
                          <Form.Item label="Barcode">
                            <Input
                              value={size.barcode}
                              onChange={(e) => {
                                const newVariants = [...variants];
                                newVariants[variantIndex].sizes[sizeIndex].barcode = e.target.value;
                                setVariants(newVariants);
                              }}
                              disabled={!variant.isStatus}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <Col xs={24} sm={12}>
                          <Form.Item label="SKU">
                            <Input
                              value={size.sku}
                              onChange={(e) => {
                                const newVariants = [...variants];
                                newVariants[variantIndex].sizes[sizeIndex].sku = e.target.value;
                                setVariants(newVariants);
                              }}
                              disabled={!variant.isStatus}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Card>
                  ))}
                  <Button type="dashed" onClick={() => handleAddSize(variantIndex)} block icon={<PlusOutlined />} disabled={!variant.isStatus}>
                    Add Size
                  </Button>
                </Panel>
              </Collapse>
            </Card>
          ))}
          <Button type="dashed" onClick={handleAddVariant} block icon={<PlusOutlined />}>
            Add Variant
          </Button>
        </TabPane>
        <TabPane tab="Additional Info" key="3">
          <Card title="Additional Information">
            <Form form={form} layout="vertical">
              <Form.Item
                name="averageRating"
                label="Average Rating"
              >
                <InputNumber min={0} max={5} step={0.1} placeholder="Average Rating" />
              </Form.Item>
              <Form.Item
                name="ratingCount"
                label="Rating Count"
              >
                <InputNumber min={0} placeholder="Rating Count" />
              </Form.Item>
              <Form.Item
                name="warranty"
                label="Warranty"
              >
                <Input placeholder="Warranty information" />
              </Form.Item>
              <Form.Item
                name="careInstructions"
                label="Care Instructions"
              >
                <TextArea placeholder="Care Instructions" rows={3} />
              </Form.Item>
            </Form>
          </Card>
        </TabPane>
      </Tabs>
      <div style={{ position: 'sticky', bottom: 0, backgroundColor: '#fff', padding: '16px 0', textAlign: 'center', boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1)' }}>
        <Space>
          <Button type="primary" onClick={handleSubmit} loading={loading}>
            Save Changes
          </Button>
          <Button onClick={() => router.push('/products')}>Cancel</Button>
        </Space>
      </div>
    </div>
  );
};

export default UpdateProduct;
