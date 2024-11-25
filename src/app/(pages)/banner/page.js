"use client";

import { Layout, Carousel, Button, Typography, Spin } from "antd";
import { useEffect, useState, useRef } from "react";
const { Content } = Layout;
const { Title, Text } = Typography;

const Banner = () => {
  const [heroData, setHeroData] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef(null);

  const getEmbedUrl = (url) => {
    try {
      // Match the video ID in YouTube links
      const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/;
      const match = url.match(youtubeRegex);
      if (match && match[1]) {
        // Return the embed URL with the video ID
        return `https://www.youtube.com/embed/${match[1]}`;
      }
      return url; // Return the original URL if not a valid YouTube link
    } catch (error) {
      console.error("Error parsing URL:", url, error);
      return url; // In case of an error, return the original URL
    }
  };
  

  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/api/getBannerDataByStatus?authkey=4c297349128e778505576f6045efb963&isStatus=true"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();

        if (Array.isArray(result.data)) {
          setHeroData(
            result.data.map((item) => ({
              ...item,
              content_url: getEmbedUrl(item.content_url),
            }))
          );
        } else {
          console.error("Expected result.data to be an array, but got:", result);
        }
      } catch (error) {
        console.error("Error fetching banner data:", error);
      }
    };

    fetchBannerData();
  }, []);

  useEffect(() => {
    const intervalTime = heroData[currentSlide]?.type === "video" ? 60000 : 20000;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroData.length);
    }, intervalTime);

    return () => clearInterval(interval);
  }, [currentSlide, heroData]);

  const handleBeforeChange = (from, to) => {
    const current = heroData[from];
    if (current?.type === "video") {
      // Prevent slide change if a video is playing
      return false;
    }
  };

  return (
    <Layout>
      <Content style={{ padding: "90px 0 10px" }}>
        <div
          style={{
            textAlign: "center",
            backgroundColor: "rgba(50, 1, 23, 1)",
            padding: "10px",
            width: "100%",
            maxWidth: "2000px",
            position: "relative",
          }}
          className="hero-section"
        >
          {heroData.length > 0 ? (
            <Carousel
              autoplay={false}
              effect="fade"
              ref={carouselRef}
              arrows
              beforeChange={handleBeforeChange}
              afterChange={(current) => setCurrentSlide(current)}
            >
              {heroData.map((item) => (
                <div key={item._id} style={{ position: "relative" }}>
                  {item.type === "image" ? (
                    <img
                      src={item.content_url}
                      alt={item.title}
                      style={{
                        width: "100%",
                        height: "500px",
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    <iframe
                    src={getEmbedUrl(item.content_url)} // This will correctly convert the YouTube URL
                    title={item.title}
                    style={{
                      width: "100%",
                      height: "500px",
                      border: "none",
                    }}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  ></iframe>
                  
                  )}
                  {item.isText && (
                    <div
                      style={{
                        position: "absolute",
                        top: "80%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        zIndex: 10,
                        color: "white",
                        textAlign: "center",
                        padding: "20px",
                        borderRadius: "8px",
                      }}
                    >
                      <Title
                        level={4}
                        style={{
                          color: "#fff",
                          fontWeight: "bold",
                          textAlign: "center",
                        }}
                      >
                        {item.title}
                      </Title>
                      <Text style={{ color: "white", fontSize: "18px" }}>
                        {item.subTitle}
                      </Text>
                      {item.isButton && item.buttonName && item.button_url && (
                        <Button
                          type="primary"
                          href={item.button_url}
                          target="_blank"
                          style={{
                            marginTop: "10px",
                            backgroundColor: "rgba(50, 1, 23, 1)",
                            color: "white",
                          }}
                        >
                          {item.buttonName}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </Carousel>
          ) : (
            <Spin size="large" style={{ color: "#fff", margin: "20px auto" }} />
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default Banner;
