"use client";

import React from "react";
import { Layout, Row, Col, Typography, Space } from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  FacebookOutlined,
  InstagramOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";

const { Footer } = Layout;
const { Title, Text } = Typography;

const CustomFooter = () => {
  return (
    <Footer
      style={{
        background: "#07093A",
        color: "#ffffff", // White text for all elements inside the Footer
      }}
    >
      <div className="max-w-full mx-auto px-0 sm:px-4"> {/* Further reduced padding on mobile */}
        <Row gutter={[32, 16]} className="footer-row">
          {/* Left Column - Logo and About Section */}
          <Col xs={24} sm={12} md={8} className="footer-column flex flex-col items-start p-4">
            <div className="logo-container mb-3">
              <img
                src="/footer_img.svg" // Replace with your actual logo path
                alt="Sandhut Sports Club Logo"
                className="footer-logo w-[70%]"
              />
            </div>
            <Title level={4} className="text-#ffffff text-xl mb-3" style={{ color: "#ffffff" }}>
              About Us
            </Title>
            <Text
              className="footer-text text-[#ffffff] text-sm leading-7 block max-w-xl mx-auto mr-10"
              style={{ color: "#ffffff", textAlign: 'justify' }}
            >
              Sandhut Sports Club is dedicated to promoting sportsmanship and excellence in the
              community. We strive to inspire and empower individuals to achieve greatness in every
              field of play.
            </Text>
          </Col>

          {/* Center Column - Contact & Links */}
          <Col xs={24} sm={12} md={8} className="footer-column flex flex-col items-start p-5">
            <Title
              level={4}
              className="text-white text-xl font-prosto-one mb-3"
              style={{ color: "#ffffff" }}
            >
              Contact Us
            </Title>
            <Space direction="vertical" className="contact-info space-y-2">
              <Text className="text-[#bbb] text-sm" style={{ color: "#ffffff" }}>
                <MailOutlined className="footer-icon mr-2 text-[#bbb] text-lg" />
                <a
                  href="mailto:info@sandhutsportsclub.com"
                  className="text-[#bbb] hover:text-white"
                  style={{ color: "#ffffff", textDecoration: "underline" }}
                >
                  info@sandhut.in
                </a>
              </Text>
              <Text className="text-[#bbb] text-sm" style={{ color: "#ffffff" }}>
                <PhoneOutlined className="footer-icon mr-2 text-[#bbb] text-lg" />
                +91-7353119393 / +91-7353119898
              </Text>
            </Space>
            <br />
            <br />
            <br />
            <Title
              level={4}
              className="text-white text-xl font-prosto-one mb-3"
              style={{ color: "#ffffff" }}
            >
              Follow Us
            </Title>
            <Space size="middle" className="flex justify-start space-x-4">
              <a
                href="https://facebook.com/sandhutsportsclub"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#ffffff" }}
              >
                <FacebookOutlined className="social-icon text-[#bbb] text-xl hover:text-white transition" />
              </a>
              <a
                href="https://instagram.com/sandhutsportsclub"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#ffffff" }}
              >
                <InstagramOutlined className="social-icon text-[#bbb] text-xl hover:text-white transition" />
              </a>
              <a
                href="https://www.youtube.com/@SandHutSportsClub"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#ffffff" }}
              >
                <YoutubeOutlined className="social-icon text-[#bbb] text-xl hover:text-white transition" />
              </a>
            </Space>
          </Col>

          {/* New Column - Quick Links */}
          <Col xs={24} sm={12} md={8} className="footer-column flex flex-col items-start p-5">
            <Title
              level={4}
              className="text-white text-xl font-prosto-one mb-3"
              style={{ color: "#ffffff" }}
            >
              Quick Links
            </Title>
            <Space direction="vertical" className="space-y-2">
              <Text className="text-[#bbb] text-sm">
                <a href="/about-us" className="text-[#bbb] hover:text-white" style={{ color: "#ffffff" }}>
                  About Us
                </a>
              </Text>
              <Text className="text-[#bbb] text-sm">
                <a
                  href="/contact-us"
                  className="text-[#bbb] hover:text-white"
                  style={{ color: "#ffffff" }}
                >
                  Contact Us
                </a>
              </Text>
              <Text className="text-[#bbb] text-sm">
                <a href="/services" className="text-[#bbb] hover:text-white" style={{ color: "#ffffff" }}>
                  Services
                </a>
              </Text>
              <Text className="text-[#bbb] text-sm">
                <a href="/news" className="text-[#bbb] hover:text-white" style={{ color: "#ffffff" }}>
                  News
                </a>
              </Text>
              <Text className="text-[#bbb] text-sm">
                <a href="/auth/email" className="text-[#bbb] hover:text-white" style={{ color: "#ffffff", textDecoration: "underline"}}>
                  Login
                </a>
              </Text>
            </Space>
          </Col>
        </Row>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom mt-6 pt-4 border-t border-gray-700">
        <div className="max-w-full mx-auto px-2 sm:px-4 flex justify-between items-center">
          {/* First Column - Sandhut Sports Club &copy; */}
          <div className="text-xs text-white">Sandhut Sports Club &copy;2024</div>

          {/* Second Column - Links like Privacy Policy, Terms & Conditions */}
          <div className="text-xs text-gray-400">
            <a
              href="/privacyPolicy"
              className="text-white hover:text-white underline mr-4"
            >
              Privacy Policy
            </a>
            <a
              href="/terms-and-conditions"
              className="text-white hover:text-white underline mr-4"
            >
              Terms and Conditions
            </a>
          </div>
        </div>
      </div>
    </Footer>
  );
};

export default CustomFooter;
