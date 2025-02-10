"use client";
import { useState, useEffect } from 'react';
import { Card, Input, Button, Space, Pagination, Row, Col, Image, Grid, Table, Typography, message, Collapse, Select } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { useBreakpoint } = Grid;
const { Text, Title } = Typography;
const { Panel } = Collapse;
const { Option } = Select;

const ProductList = () => {
    const router = useRouter();
    const screens = useBreakpoint();
    const [products, setProducts] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10); // Default page size set to 10
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`https://api.sandhutsportsclub.com/api/coreProductData?size=${pageSize}&page=${currentPage}&authkey=4c297349128e778505576f6045efb963`);
                const data = await response.json();

                if (data.sucess) { // Assuming the typo remains in the API response
                    setProducts(data.data);
                    setFilteredProducts(data.data);
                    setTotal(data.data.length); // Assuming `data.data.length` reflects the total count of products
                } else {
                    message.error('Failed to fetch products');
                }
            } catch (error) {
                console.error('Fetch error:', error);
                message.error('An error occurred while fetching products');
            }
        };

        fetchProducts();
    }, [currentPage, pageSize]);

    useEffect(() => {
        // Filter products based on search text
        const filtered = products.filter(product =>
            product.name.toLowerCase().includes(searchText.toLowerCase()) ||
            product.brand.toLowerCase().includes(searchText.toLowerCase())  // Adding brand to the search criteria
        );
        setFilteredProducts(filtered);
    }, [searchText, products]);

    const handleSearch = (e) => {
        setSearchText(e.target.value);
    };

    const handleAddProduct = () => {
        router.push('/dashBoard/products/add');
    };

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    const handlePageSizeChange = (current, size) => {
        setPageSize(size);
        setCurrentPage(1); // Reset to first page whenever page size changes
    };

    const columns = [
        {
            title: 'Product Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
            render: (_, record) => {
                const imageUrl = (record.variants && record.variants[0] && record.variants[0].images && record.variants[0].images[0]) || '/placeholder-image.png';
                return (
                    <Image
                        width={50}
                        src={imageUrl}
                        alt={record.name}
                    />
                );
            },
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: 'Brand',
            dataIndex: 'brand',
            key: 'brand',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: text => (
            <Text ellipsis={{ tooltip: text }} style={{ maxWidth: 80,  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {text}
            </Text>
            ),
        },
        {
            title: 'MRP',
            key: 'mrp',
            render: (_, record) => {
                const mrp = record.variants && record.variants[0] && record.variants[0].sizes && record.variants[0].sizes[0] ? record.variants[0].sizes[0].mrp : 'N/A';
                return `₹${mrp}`;
            },
        },
        {
            title: 'Selling Price',
            key: 'sellingPrice',
            render: (_, record) => {
                const sellingPrice = record.variants && record.variants[0] && record.variants[0].sizes && record.variants[0].sizes[0] ? record.variants[0].sizes[0].sellingPrice : 'N/A';
                return `₹${sellingPrice}`;
            },
        },
        {
            title: 'Discount',
            key: 'discount',
            render: (_, record) => {
                const discount = record.variants && record.variants[0] && record.variants[0].sizes && record.variants[0].sizes[0] ? record.variants[0].sizes[0].discount : 'N/A';
                return `${discount}%`;
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Button onClick={() => router.push(`/dashBoard/products/${record._id}`)}>Edit</Button>
            ),
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <Space style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                <Input
                    placeholder="Search Product or Brand"
                    value={searchText}
                    onChange={handleSearch}
                    prefix={<SearchOutlined />}
                    style={{ maxWidth: 300 }}
                />
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddProduct}>Add Product</Button>
            </Space>

            <div className="product-list">
                {screens.md ? (
                    // Desktop View - Table
                    <Table
                        columns={columns}
                        dataSource={filteredProducts}
                        rowKey="_id"
                        pagination={false}
                        bordered
                        scroll={{ x: "100%", y: "calc(100vh - 250px)" }} // Enables horizontal & vertical scrolling
                        style={{
                            maxWidth: "100%", // Prevents overflow
                            overflowX: "auto",
                            backgroundColor: "#fff",
                            borderRadius: "8px",
                        }}
                    />
                ) : (
                    // Mobile View - Cards
                    <Row gutter={[16, 16]}>
                        {filteredProducts.map(product => (
                            <Col span={24} key={product._id}>
                                <Card
                                    hoverable
                                    cover={
                                        <Image
                                            alt={product.name}
                                            src={(product.variants && product.variants[0] && product.variants[0].images && product.variants[0].images[0]) || '/placeholder-image.png'}
                                            style={{ width: '100%', height: 'auto', borderRadius: '8px 8px 0 0' }}
                                        />
                                    }
                                    style={{
                                        marginBottom: '16px',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        backgroundColor: '#fff',
                                        border: '1px solid #f0f0f0',
                                        padding: '0',
                                    }}
                                >
                                    <div style={{ padding: '16px' }}>
                                        <Title level={5} style={{ margin: '0 0 8px' }}>{product.name}</Title>
                                        <Text type="secondary" style={{ fontSize: '14px' }} ellipsis={{ tooltip: product.description }}>{product.description}</Text>
                                        <div style={{ marginTop: '8px' }}>
                                            <Text strong>MRP: </Text><Text>{product.variants && product.variants[0] && product.variants[0].sizes && product.variants[0].sizes[0] ? `₹${product.variants[0].sizes[0].mrp}` : 'N/A'}</Text><br />
                                            <Text strong>Selling Price: </Text><Text>{product.variants && product.variants[0] && product.variants[0].sizes && product.variants[0].sizes[0] ? `₹${product.variants[0].sizes[0].sellingPrice}` : 'N/A'}</Text><br />
                                            <Text strong>Discount: </Text><Text>{product.variants && product.variants[0] && product.variants[0].sizes && product.variants[0].sizes[0] ? `${product.variants[0].sizes[0].discount}%` : 'N/A'}</Text><br />
                                        </div>
                                        <Collapse ghost>
                                            <Panel header="More Details" key="1">
                                                <Text strong>Category: </Text><Text>{product.category}</Text><br />
                                                <Text strong>Brand: </Text><Text>{product.brand}</Text><br />
                                            </Panel>
                                        </Collapse>
                                    </div>
                                    <Button type="primary" block onClick={() => router.push(`/products/${product._id}`)}>Edit</Button>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </div>

            <Space style={{ marginTop: 16, justifyContent: 'center', display: 'flex' }}>
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={total}
                    onChange={handlePageChange}
                    showSizeChanger
                    onShowSizeChange={handlePageSizeChange}
                    pageSizeOptions={['10', '20', '30', '50']}
                    style={{ marginTop: '16px', textAlign: 'center' }}
                />
            </Space>

            <style jsx>{`
                /* Change font size for table headers */
                .ant-table-thead th {
                    font-size: 10px !important; /* Adjust header font size */
                    font-weight: bold; /* Optional: Make header text bold */
                }

                /* Change font size for table body (rows) */
                .ant-table-tbody td {
                    font-size: 13px !important; /* Adjust row font size */
                }

                /* Optional: Adjust padding for better alignment */
                .ant-table-thead th,
                .ant-table-tbody td {
                    padding: 10px;
                }
                    
                .product-list {
                    display: flex;
                    flex-direction: column;
                    overflow-x: auto;
                }

                .ant-table-wrapper {
                    max-width: 100%;
                    overflow-x: auto;
                }

                .ant-table {
                    width: 100%;
                    border-radius: 8px;
                    overflow: hidden;
                }

                .ant-table-container {
                    border-radius: 8px;
                }

                @media (max-width: 1024px) {
                    .ant-table {
                        font-size: 12px; /* Smaller font for smaller screens */
                    }
                    .ant-table-thead th {
                        font-size: 12px;
                    }
                    .ant-table-tbody td {
                        font-size: 12px;
                    }
                }
            `}</style>
        </div>
    );
}

export default ProductList;
