"use client";
import { useEffect, useState } from "react";
import { message, Button, Empty, Spin } from "antd";
import { useRouter } from "next/navigation";
import { DeleteOutlined } from "@ant-design/icons";

const CartPage = () => {
  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (userId) {
      fetchCartData(userId);
    } else {
      message.warning("Please log in to view your cart");
      router.push("/login");
    }
  }, []);

  const fetchCartData = async (userId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getCartDataWithUserId?authkey=4c297349128e778505576f6045efb963&userId=${userId}`
      );
      const cartResult = await response.json();

      if (cartResult.success) {
        const cartItems = await Promise.all(
          cartResult.data.map(async (item) => {
            const productResponse = await fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getProductDataWithId?authkey=4c297349128e778505576f6045efb963&productID=${item.productId}`
            );
            const productData = await productResponse.json();

            if (productData.success && productData.data.length > 0) {
              const productDetails = productData.data.find(
                (product) => product._id === item.productId
              );
              return {
                ...item,
                productDetails,
                variantDetails: productDetails.variants.find(
                  (variant) => variant._id === item.variantId
                ),
                sizeDetails: productDetails.variants
                  .find((variant) => variant._id === item.variantId)
                  ?.sizes.find((size) => size._id === item.sizeId),
              };
            }
            return item;
          })
        );
        setCartData(cartItems);
      } else {
        setCartData([]);
      }
    } catch (error) {
      console.error("Error fetching cart data:", error);
      message.error("An error occurred while fetching the cart data.");
    } finally {
      setLoading(false);
    }
  };

  const updateCartQuantity = async (item, newQuantity) => {
    if (newQuantity < 1) {
      message.warning("Quantity cannot be less than 1.");
      return;
    }

    const updatedItem = { ...item, quantity: newQuantity };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/putCartData`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "4c297349128e778505576f6045efb963",
        },
        body: JSON.stringify(updatedItem),
      });

      const result = await response.json();
      if (result.success) {
        setCartData((prevData) =>
          prevData.map((cartItem) =>
            cartItem._id === item._id
              ? { ...cartItem, quantity: newQuantity }
              : cartItem
          )
        );
        message.success("Cart updated successfully.");
      } else {
        message.error("Failed to update cart. Please try again.");
      }
    } catch (error) {
      console.error("Error updating cart quantity:", error);
      message.error("An error occurred while updating the cart.");
    }
  };

  const deleteCartItem = async (itemId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/deleteCartData`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "4c297349128e778505576f6045efb963",
        },
        body: JSON.stringify({ _id: itemId }),
      });

      const result = await response.json();

      if (result.success) {
        setCartData((prevData) =>
          prevData.filter((item) => item._id !== itemId)
        );
        message.success("Item deleted successfully.");
      } else {
        message.error("Failed to delete the item. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting cart item:", error);
      message.error("An error occurred while deleting the item.");
    }
  };

  const calculateTotalAmount = () => {
    return cartData.reduce((total, item) => {
      const sellingPrice = item.sizeDetails?.sellingPrice || 0;
      const quantity = item.quantity || 1;
      return total + sellingPrice * quantity;
    }, 0);
  };

  const handleBuyNow = () => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      // Calculate the total amount
      const totalAmount = calculateTotalAmount();

      // Combine all details into a single object
      const orderDetails = {
        userId: userId,
        totalAmount: totalAmount,
        cartData: cartData,
      };

      // Print all details in the console
      console.log("Order Details:", orderDetails);
    } else {
      message.warning("Please log in to proceed with the order.");
      router.push("/login");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (cartData.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <Empty
          description={
            <span className="text-lg text-gray-700">
              Your cart is currently empty
            </span>
          }
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-40">
      <h1 className="text-2xl font-semibold mb-6">Your Cart</h1>
      {cartData.map((item) => {
        const { productDetails, variantDetails, sizeDetails } = item;
        return (
          <div
            key={item._id}
            className="flex items-center justify-between border-b pb-4 mb-4"
          >
            {/* Product Image */}
            <img
              src={variantDetails?.images[0] || "/placeholder.png"}
              alt={productDetails?.name || "Product"}
              className="w-[200px] h-[200px] object-cover"
            />

            {/* Product Details */}
            <div className="flex-1 ml-4">
              <h2 className="text-lg font-medium">{productDetails?.name}</h2>
              <p className="text-gray-600">{productDetails?.brand}</p>
              <p className="text-gray-700">
                Color: {variantDetails?.color || "N/A"}
              </p>
              <p className="text-gray-700">
                Material: {variantDetails?.material || "N/A"}
              </p>
              <p className="text-gray-700">
                Dimensions:{" "}
                {variantDetails?.dimensions
                  ? `${variantDetails.dimensions.length} x ${variantDetails.dimensions.width}`
                  : "N/A"}
              </p>
              <p className="text-gray-700">
                Size: {sizeDetails?.size || "N/A"}
              </p>

              {/* Quantity Controls */}
              <div className="flex items-center gap-6 mt-2">
                {/* Quantity Controls */}
                <div className="flex items-center space-x-4">
                  <button
                    className={`px-3 py-1 border rounded-full text-lg font-bold text-yellow-600 border-yellow-400 ${
                      item.quantity <= 1 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={() => updateCartQuantity(item, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>

                  <span className="text-xl font-medium">{item.quantity}</span>
                  <button
                    className="px-3 py-1 border rounded-full text-lg font-bold text-yellow-600 border-yellow-400"
                    onClick={() => updateCartQuantity(item, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>

                {/* Delete Button */}
                <div className="flex items-center">
                  <Button
                    icon={<DeleteOutlined />}
                    onClick={() => deleteCartItem(item._id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="text-right">
              <p className="text-black font-semibold text-xl">
                ₹{sizeDetails?.sellingPrice || "N/A"}
              </p>
            </div>
          </div>
        );
      })}

      {/* Total Amount */}
      <div className="flex justify-end gap-6 mt-6 mb-12">
        <h2 className="text-2xl font-semibold">
          Total Amount: ₹{calculateTotalAmount()}
        </h2>
        <Button type="primary" onClick={handleBuyNow}>
          Buy Now
        </Button>
      </div>
    </div>
  );
};

export default CartPage;
