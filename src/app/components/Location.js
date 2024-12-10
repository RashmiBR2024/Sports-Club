"use client";

import React from "react";
import { Typography } from "antd";

const { Title, Text } = Typography;

const Location = () => {
  return (
    <div className="relative grid grid-rows-8 md:grid-rows-1 md:grid-cols-8 h-[500px] sm:h-[500px] lg:h-[300px] tablet:h-[300px] md:h-[300px] bg-white shadow-md overflow-hidden">
      {/* Left Section: Location Details */}
      <div className="relative z-10 flex flex-col justify-center p-4 sm:p-6 lg:p-8 space-y-4 bg-white row-span-3 md:col-span-3 ml-[50px]">
        <Title
          level={4}
          className="text-gray-800 text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl"
          style={{ fontFamily: "'Prosto One', Trebuchet MS" }}
        >
          SandHut Sports Club
        </Title>
        <Text className="text-gray-600 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl leading-6">
          Nelamangala Rd, Kadabagere Cross, Kadabagere, Bengaluru, Karnataka
          562130
        </Text>
        <a
          href="https://www.google.com/maps/dir/?api=1&destination=SandHut+Sports+Club,+Bengaluru,+Karnataka+562130"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gray-800 tablet:w-[170px] md:w-[170px] text-white w-[120px] sm:w-36 lg:w-40 h-9 text-xs sm:text-sm md:text-base lg:text-s lg:w-[170px] py-2 sm:py-3 px-4 sm:px-6 lg:px-8 rounded-lg hover:bg-gray-900 flex text-center justify-center items-center"
        >
          How to Arrive
        </a>
      </div>

      {/* Map Section */}
      <div className="relative row-span-5 md:col-span-5" style={{marginRight: "50px"}}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15553.249416580196!2d77.443029!3d12.994989!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3bd30e84477b%3A0xdcbba42ea22ce51c!2sSandHut%20Sports%20Club!5e0!3m2!1sen!2sin!4v1733234618451!5m2!1sen!2sin&zoom=15"
          style={{
            border: 0,
            objectFit: "cover",
            width: "100%",
            height: "100%",
          }}
          allowFullScreen=""
          loading="lazy"
          className="absolute inset-0"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

export default Location;
