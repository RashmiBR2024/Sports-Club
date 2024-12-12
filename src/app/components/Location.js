"use client";

import React, { useState } from "react";
import { Typography } from "antd";

const { Title, Text } = Typography;

const Location = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const toggleContactModal = () => {
    setIsContactModalOpen(!isContactModalOpen);
  };

  return (
    <div className="location-container">
      {/* Left Section: Location Details */}
      <div className="location-div1-content">
        <div className="location-details">
          <Title
            level={4}
            className="location-title"
            style={{ fontFamily: "'Prosto One', Trebuchet MS", fontSize: "25px"}}
          >
            SandHut Sports Club
          </Title>
          <Text className="location-address"
                      style={{  fontSize: "15px"}}>
            Nelamangala Rd, Kadabagere Cross, Kadabagere, Bengaluru, Karnataka
            562130
          </Text>
        </div>
        <div className="location-buttons">
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=SandHut+Sports+Club,+Bengaluru,+Karnataka+562130"
            target="_blank"
            rel="noopener noreferrer"
            className="location-arrive-button"
          >
            How to Arrive
          </a>
          <button
            onClick={toggleContactModal}
            className="location-contact-button"
          >
            Contact Us
          </button>
        </div>
      </div>

      <div className="location-div-location">
        {/* Map Section */}
        <div className="location-map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15553.249416580196!2d77.443029!3d12.994989!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3bd30e84477b%3A0xdcbba42ea22ce51c!2sSandHut%20Sports%20Club!5e0!3m2!1sen!2sin!4v1733234618451!5m2!1sen!2sin&zoom=15"
            style={{
              border: 0,
              objectFit: "cover",
              width: "100%",
              height: "300px",
            }}
            allowFullScreen=""
            loading="lazy"
            className="location-iframe"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>

      {/* Contact Us Modal */}
      {isContactModalOpen && (
        <div className="location-modal-overlay">
          <div className="location-modal">
            <h2 className="location-modal-title">Contact Us</h2>
            <div className="location-modal-content">
              <p className="location-modal-text">
                Email: <a href="mailto:info@sandhut.in" className="location-link">info@sandhut.in</a>
              </p>
              <p className="location-modal-text">Phone:</p>
              <ul className="location-modal-list">
                <li>
                  <a href="tel:+917353119393" className="location-link">
                    +91-7353119393
                  </a>
                </li>
                <li>
                  <a href="tel:+917353119898" className="location-link">
                    +91-7353119898
                  </a>
                </li>
              </ul>
            </div>
            <button
              onClick={toggleContactModal}
              className="location-modal-close-button"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Location;