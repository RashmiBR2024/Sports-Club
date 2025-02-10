"use client";
import {
  Card,
  List,
  Spin,
  Input,
  Select,
  Rate,
  Button,
  Pagination,
} from "antd";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import { ShoppingCartOutlined, SearchOutlined } from "@ant-design/icons";

const { Search } = Input;
const { Option } = Select;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [brands, setBrands] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const router = useRouter(); // Initialize useRouter
  const [pageSize, setPageSize] = useState(8); // Number of items per page

          // "http://localhost:3001/api/coreProductData?size=100&page=1&authkey=4c297349128e778505576f6045efb963"

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://api.sandhutsportsclub.com/api/coreProductData?size=100&page=1&authkey=4c297349128e778505576f6045efb963");        const result = await res.json();

        if (result.sucess) {
          const activeProducts = result.data.filter(
            (product) => product.isStatus === "active"
          );
          setProducts(activeProducts);
          setFilteredProducts(activeProducts);

          // Extract unique brands
          const uniqueBrands = [
            ...new Set(activeProducts.map((product) => product.brand)),
          ];
          setBrands(uniqueBrands);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  const handleSearchChange = debounce((value) => {
    setSearchTerm(value.toLowerCase());
  }, 300);

  const handleBrandChange = (value) => {
    setSelectedBrand(value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (value) => {
    if (value === "all") {
      setPageSize(filteredProducts.length);
    } else {
      setPageSize(Number(value));
    }
    setCurrentPage(1);
  };

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    let filtered = products;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.brand.toLowerCase().includes(searchTerm) ||
          product.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Filter by selected brand
    if (selectedBrand) {
      filtered = filtered.filter((product) => product.brand === selectedBrand);
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedBrand, products]);  

  const handleProductClick = (productId) => {
    // Navigate to the kitOpen page and pass the productId
    router.push(`/buyProducts/kitOpen/${productId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  const handleCartClick = () => {
    router.push("/cart"); // Navigate to the cart page
  };

  return (
    <div className="container mx-auto" style={{ maxWidth: "1150px", padding: "20px 0px" }}>
    <div className="flex items-center justify-between gap-6 mb-4">
      <h1 className="text-3xl font-bold mb-4 font-prosto pb-4">Sports Products</h1>
      {/* Page Size Selector */}
      <Select
          defaultValue="8"
          style={{ color: "grey" }}
          onChange={handlePageSizeChange}
          className="md:w-1/6"
      >
          <Option value="8" style={{ color: "grey"}} >8 / page</Option>
          <Option value="16">16 / page</Option>
          <Option value="all">All </Option>
          {/* ({filteredProducts.length}) */}
      </Select>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4 w-full">
        <div className="w-[50%] flex justify-center gap-6 pt-4 pb-8">
          <Input
            placeholder="Search by name, brand, or tags"
            onChange={(e) => handleSearchChange(e.target.value)}
            allowClear
            className="md:w-1/2"
            suffix={<SearchOutlined className="text-gray-500" />}
          />
          <Select
            placeholder="Filter by brand"
            onChange={handleBrandChange}
            allowClear
            className="md:w-1/4"
          >
            {brands.map((brand) => (
              <Option key={brand} value={brand}>
                {brand}
              </Option>
            ))}
          </Select>
        </div>

        <Button
          type="primary"
          icon={<ShoppingCartOutlined />}
          onClick={handleCartClick}
          className="md:w-auto"
        >
          Cart
        </Button>
      </div>
      {paginatedProducts.length > 0 ? (
        <>
          <List
            grid={{ gutter: 16, column: 4 }}
            dataSource={paginatedProducts}
            renderItem={(item) => (
              <List.Item>
                <Card
                  hoverable
                  style={{ width: "100%", height: "400px" }} // Standard card size
                  cover={
                    <div className="w-full flex justify-center items-center bg-gray-100">
                      <img
                        alt={item.name}
                        src={item.variants[0]?.images[0] || "/placeholder.jpg"}
                        className="object-contain max-h-56 w-full" // Dynamically adjusts within constraints
                        style={{  }}
                      />
                    </div>
                  }
                  onClick={() => handleProductClick(item._id)} // Handle click to route
                >
                <Card.Meta
                  title={<span style={{ fontSize: "15px", fontWeight: "bold" }}>{item.name}</span>} // ✅ Title: 18px
                  description={<span style={{ fontSize: "12px", color: "gray" }}>{`${item.brand} - ${item.category}`}</span>} // ✅ Description: 14px
                />
                  {/* Display ratings */}
                  <div className="mt-2 flex items-center">
                    <Rate
                      value={item.ratings.average}
                      allowHalf
                      disabled
                      style={{ color: "#faad14" }}
                    />
                    <span className="ml-2 text-gray-500">
                      ({item.ratings.count})
                    </span>
                  </div>
                  {/* Display selling price, MRP, and discount */}
                  {item.variants[0]?.sizes[0] && (
                    <div className="mt-2">
                      <div className="text-xl font-semibold text-green-600">
                        ₹{item.variants[0].sizes[0].sellingPrice}
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 line-through">
                          M.R.P: ₹{item.variants[0].sizes[0].mrp}
                        </span>
                        <span className="ml-2 text-sm text-red-600">
                          ({item.variants[0].sizes[0].discount}% off)
                        </span>
                      </div>
                    </div>
                  )}
                </Card>
              </List.Item>
            )}
          />
          <div className="flex justify-center mt-4">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredProducts.length}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        </>
      ) : (
        <p className="text-center text-gray-600">No products found.</p>
      )}
    </div>
  );
};

export default Products;
