"use client";

import React from "react";
import { Card } from "antd";
import Link from "next/link"; // Import Link from Next.js
import { Prosto_One } from "next/font/google";

const prostoOne = Prosto_One({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

const { Meta } = Card;

const WhatAreYouLookingFor = () => {
  const cardData = [
    {
      id: 1,
      image: "https://www.freeiconspng.com/uploads/helping-hand-icon-png-25.png",
      title: "Join the Club",
      link: "/page1",
    },
    {
      id: 2,
      image:
        "https://static.vecteezy.com/system/resources/previews/035/979/025/non_2x/cricket-bat-and-ball-badge-illustration-vector.jpg",
      title: "Matches",
      link: "/matches",
    },
    {
      id: 3,
      image:
        "https://www.shutterstock.com/image-vector/cricket-team-logo-creative-icon-600w-1952590060.jpg",
      title: "Teams",
      link: "/allTeams",
    },
    {
      id: 4,
      image:
        "https://cdn4.iconfinder.com/data/icons/cricket-18/496/team-cricket-athlete-players-sport-512.png",
      title: "All Players",
      link: "/allPlayers",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-start mb-8 px-2 py-5 ">
      {/* Heading */}
      <h2
      className="font-prosto text-[24px] font-semibold mt-10 mb-5 text-[#333] text-center"
      >
        What Are You Looking For?
      </h2>

      {/* Cards */}
      <div className="flex flex-wrap gap-8 justify-center">
        {cardData.map((card) => (
          <div
            key={card.id}
            className="flex justify-center items-center"
          >
            <Link href={card.link} passHref>
              <Card
                hoverable
                className="w-full max-w-[240px] shadow-md rounded-lg text-center"
                cover={
                  <img
                    alt={card.title}
                    src={card.image}
                    className="h-[180px] object-cover"
                  />
                }
              >
                <Meta
                  title={
                    <span
                      className={`${prostoOne.className} text-[18px] text-[#333] block text-center`}
                    >
                      {card.title}
                    </span>
                  }
                />
              </Card>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhatAreYouLookingFor;
