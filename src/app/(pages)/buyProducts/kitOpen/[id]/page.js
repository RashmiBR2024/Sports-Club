"use client";

import { useParams } from "next/navigation";
import {
  Card,
  Spin,
  Rate,
  Button,
  Tag,
  Divider,
  Row,
  Col,
  Modal,
  Input,
  message,
} from "antd";
import { useState, useEffect } from "react";

const KitOpenPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
  });

  useEffect(() => {
    if (id) {
      const fetchProductDetails = async () => {
        try {
          const res = await fetch(
            `https://api.sandhutsportsclub.com/api/getProductDataWithId?productID=${id}&authkey=4c297349128e778505576f6045efb963`
            // `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getProductDataWithId?authkey=4c297349128e778505576f6045efb963&productID=${id}`
          );
          const result = await res.json();

          if (result.success) {
            setProduct(result.data[0]);
            setSelectedColor(result.data[0].variants[0]);
            setSelectedImage(result.data[0].variants[0].images[0]);
            setSelectedSize(result.data[0].variants[0].sizes[0]);
          }
        } catch (error) {
          console.error("Error fetching product details:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchProductDetails();
    }
  }, [id]);

  useEffect(() => {
    if (selectedColor && selectedSize) {
      setSelectedImage(selectedColor.images[0]);
    }
  }, [selectedColor, selectedSize]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!product) {
    return <div className="text-center">Product not found</div>;
  }

  const handleBuyNowClick = () => {
    const userId = localStorage.getItem("userId");

    if (userId) {
      console.log("User ID:", userId); // Log the userId if it's in localStorage
      console.log("Product ID:", id); // Log the productId (already available from useParams)
      console.log("Variant ID:", selectedColor._id); // Log the selected variant ID
      console.log("Selected Size:", selectedSize.size); // Log the selected size
      console.log("Selling Price:", selectedSize.sellingPrice); // Log the selling price
      console.log("MRP:", selectedSize.mrp); // Log the MRP
      console.log("Discount:", selectedSize.discount); // Log the discount
    } else {
      setIsModalVisible(true); // Open the modal if no userId is in localStorage
    }
  };

  const handleSubmit = () => {
    // Here you would handle the form submission (e.g., store user data)
    console.log("User Data:", userData);
    setIsModalVisible(false); // Close the modal after submitting the data
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Function for Add to Cart logic
  const handleAddToCart = async () => {
    const userId = localStorage.getItem("userId");

    if (userId) {
      await addToCart(userId);
    } else {
      // Open modal if userId is not available in local storage
      setIsModalVisible(true);
    }
  };

  // Function to perform API call to add item to cart
  const addToCart = async (userId) => {
    const data = {
      variantId: selectedColor._id,
      productId: product._id,
      userId: userId,
      sizeId: selectedSize._id,
      quantity: 1, // Default quantity
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/postCartData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "4c297349128e778505576f6045efb963",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        console.log("Item added to cart successfully:", result);
        message.success("Item added to cart successfully");
        // Optionally show success feedback (e.g., Toast, Modal, etc.)
      } else {
        console.error("Failed to add item to cart:", result.message);
        message.error("Failed to add item to cart");
      }
    } catch (error) {
      console.error("Error posting to cart API:", error);
    }
  };

  return (
    <div className="container mx-auto mt-24 p-4">
      <Row gutter={[16, 16]}>
        {/* Main Image Section */}
        <Col xs={24} md={12} className="text-center">
          <Card
            cover={
              <img
                src={selectedImage}
                alt="Main Display"
                style={{ maxHeight: "400px", objectFit: "contain" }}
              />
            }
          >
            <div className="flex justify-center gap-2 mt-4">
              {selectedColor.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  style={{
                    width: "50px",
                    height: "50px",
                    border:
                      selectedImage === image
                        ? "2px solid #1890ff"
                        : "1px solid #ccc",
                    cursor: "pointer",
                    objectFit: "cover",
                  }}
                  onClick={() => setSelectedImage(image)}
                />
              ))}
            </div>
          </Card>
        </Col>

        {/* Product Details Section */}
        <Col xs={24} md={12}>
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <Tag color="blue" className="mb-4">
            Brand: {product.brand}
          </Tag>

          <div className="mb-4 mt-4">
            <Rate value={product.ratings.average} allowHalf disabled />
            <span className="ml-2">({product.ratings.count} reviews)</span>
          </div>

          {/* Color Selection */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Select Color</h3>
            <div className="flex gap-2 mt-2">
              {product.variants
                .filter((variant) => variant.isStatus)
                .map((variant) => (
                  <Button
                    key={variant._id}
                    onClick={() => {
                      setSelectedColor(variant);
                      setSelectedSize(variant.sizes[0]);
                    }}
                    style={{
                      backgroundColor: variant.color.toLowerCase(),
                      borderColor:
                        selectedColor._id === variant._id
                          ? "#1890ff"
                          : "#d9d9d9",
                      color: "#fff",
                    }}
                  >
                    {variant.color}
                  </Button>
                ))}
            </div>
          </div>

          {/* Size Selection */}
          {selectedColor && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Select Size</h3>
              <div className="flex gap-2 mt-2">
                {selectedColor.sizes.map((size) => (
                  <Button
                    key={size._id}
                    onClick={() => setSelectedSize(size)}
                    type={selectedSize._id === size._id ? "primary" : "default"}
                  >
                    {size.size}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Pricing Section */}
          {selectedSize && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Pricing</h3>
              <p className="text-xl text-green-600 font-bold">
                ₹{selectedSize.sellingPrice}
              </p>
              <p className="text-gray-500 line-through">
                M.R.P: ₹{selectedSize.mrp}
              </p>
              <p className="text-red-500">({selectedSize.discount}% off)</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 mt-4">
            <Button type="primary" size="large" onClick={handleBuyNowClick}>
              Buy Now
            </Button>
            <Button size="large" onClick={handleAddToCart}>
              Add to Cart
            </Button>
          </div>
        </Col>
      </Row>
      <Modal
        title="Enter Your Details"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSubmit}
      >
        <Input
          placeholder="Name"
          name="name"
          value={userData.name}
          onChange={handleInputChange}
          style={{ marginBottom: "10px" }}
        />
        <Input
          placeholder="Phone Number"
          name="phoneNumber"
          value={userData.phoneNumber}
          onChange={handleInputChange}
          style={{ marginBottom: "10px" }}
        />
        <Input
          placeholder="Email"
          name="email"
          value={userData.email}
          onChange={handleInputChange}
          style={{ marginBottom: "10px" }}
        />
      </Modal>
      <Divider />

      {/* Variant Details Section */}
      <Row gutter={[16, 16]}>
        {selectedColor && (
          <Col span={24}>
            <Card title="Product Details" bordered>
              {selectedColor.material && (
                <p>
                  <strong>Material:</strong> {selectedColor.material}
                </p>
              )}
              {selectedColor.weight && (
                <p>
                  <strong>Weight:</strong> {selectedColor.weight}
                </p>
              )}
              {selectedColor.dimensions && (
                <p>
                  <strong>Dimensions: </strong>
                  {selectedColor.dimensions.length} x{" "}
                  {selectedColor.dimensions.width}
                </p>
              )}
            </Card>
          </Col>
        )}

        {/* Description Section */}
        <Col span={24}>
          <Card title="Product Description" bordered>
            <p>{product.description || "No description available."}</p>
          </Card>
        </Col>

        {/* Additional Info */}
        {product.additionalInfo &&
          (product.additionalInfo.warranty ||
            product.additionalInfo.careInstructions) && (
            <Col span={24}>
              <Card title="Additional Information" bordered>
                {product.additionalInfo.warranty && (
                  <p>
                    <strong>Warranty:</strong> {product.additionalInfo.warranty}
                  </p>
                )}
                {product.additionalInfo.careInstructions && (
                  <p>
                    <strong>Care Instructions:</strong>{" "}
                    {product.additionalInfo.careInstructions}
                  </p>
                )}
              </Card>
            </Col>
          )}
      </Row>
    </div>
  );
};

export default KitOpenPage;
