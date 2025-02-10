"use client";

import React, { useState, useEffect, useRef } from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const BannerSlider = () => {
  const [banners, setBanners] = useState([]);
  const [filteredBanners, setFilteredBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMuted, setIsMuted] = useState(true);
  const iframeRef = useRef(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getBannerDataByStatus?isStatus=true`,
          {
            headers: {
              "x-api-key": process.env.NEXT_PUBLIC_API_AUTH_KEY,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        if (result.success) {
          const homeBanners = result.data.filter((banner) =>
            banner.displayOnPages?.includes("home")
          );

          setBanners(homeBanners);
          setFilteredBanners(homeBanners);
          setCurrentIndex(0);
        } else {
          setError(result.error || "Failed to fetch banners.");
        }
      } catch (err) {
        setError(err.message || "An error occurred while fetching banners.");
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    if (filteredBanners.length > 0) {
      const timer = setTimeout(() => {
        nextSlide();
      }, filteredBanners[currentIndex]?.displayDuration * 1000 || 5000);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, filteredBanners]);

  const checkIfVideo = (url) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.youtube\.com|youtu\.be)\/.+$/;
    return youtubeRegex.test(url);
  };

  const getVideoId = (url) => {
    const youtubeRegex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]+)/;
    const match = url.match(youtubeRegex);
    return match ? match[1] : null;
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredBanners.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? filteredBanners.length - 1 : prevIndex - 1
    );
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  if (loading) return <div>Loading banners...</div>;
  if (error) return <div>Error: {error}</div>;
  if (filteredBanners.length === 0) return <div>No banners available.</div>;

  const currentBanner = filteredBanners[currentIndex];

  return (
    <div className="banner-slider">
      {currentBanner && (
        <div className="main-banner-container">
          {checkIfVideo(currentBanner.content_url) ? (
            <>
              <iframe
                key={currentIndex}
                ref={iframeRef}
                width="100%"
                height="500px"
                src={`${currentBanner.content_url.replace(
                  "watch?v=",
                  "embed/"
                )}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=1&playsinline=1&rel=0&modestbranding=1&showinfo=0`}
                frameBorder="0"
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
                title="Video Banner"
                onError={() => console.error("Failed to load video")}
              />
              <button
                className="mute-toggle"
                onClick={toggleMute}
                style={{
                  position: "absolute",
                  bottom: "10px",
                  right: "10px",
                  zIndex: 10,
                  padding: "10px",
                  background: "rgba(0, 0, 0, 0.5)",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {isMuted ? "UnMute" : "Mute"}
              </button>
            </>
          ) : (
            <>
              <div
                className="main-banner-background"
                style={{
                  backgroundImage: `url(${currentBanner.content_url})`,
                }}
              ></div>
              <img
                src={currentBanner.content_url}
                alt="Banner"
                className="main-banner-image"
              />
            </>
          )}

          {currentBanner.isText && (
            <div
              className="main-banner-content"
              style={{
                position: "absolute",
                bottom: "10px",
                left: "50px",
                color: currentBanner.titleFontColor || "#ffffff", // ✅ Title Font Color from DB
                fontFamily: currentBanner.fontStyle || "Prosto One, sans-serif",
                zIndex: 10,
                padding: "10px",
              }}
            >
              <h1
                style={{
                  fontSize: `${currentBanner.titleFontSize || 26}px`, // ✅ Dynamic Font Size
                  color: currentBanner.titleFontColor || "#ffffff", // ✅ Dynamic Font Color
                  fontFamily: currentBanner.fontStyle || "Prosto One, sans-serif",
                  margin: 0,
                }}
              >
                {currentBanner.title}
              </h1>
              <h2
                style={{
                  fontSize: `${currentBanner.subTitleFontSize || 14}px`, // ✅ Dynamic Subtitle Size
                  color: currentBanner.subTitleFontColor || "#ffffff", // ✅ Dynamic Subtitle Color
                  fontFamily: currentBanner.fontStyle || "Prosto One, sans-serif",
                  margin: "10px 0",
                }}
              >
                {currentBanner.subTitle}
              </h2>
              {currentBanner.isButton && (
                <a
                  href={
                    checkIfVideo(currentBanner.content_url)
                      ? `https://www.youtube.com/watch?v=${getVideoId(
                          currentBanner.content_url
                        )}`
                      : currentBanner.button_url || "#"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    marginBottom: "5%",
                    padding: "12px 20px",
                    backgroundColor: currentBanner.buttonBackgroundColor || "white", // ✅ Dynamic Background Color
                    color: currentBanner.buttonFontColor || "black", // ✅ Dynamic Font Color
                    fontWeight: "bold",
                    borderRadius: "4px",
                    fontSize: `${currentBanner.buttonFontSize || 14}px`, // ✅ Dynamic Font Size
                    textDecoration: "none",
                    border: "none",
                    cursor: "pointer",
                    display: "inline-block",
                  }}
                >
                  {currentBanner.buttonName}
                </a>
              )}
            </div>
          )}
        </div>
      )}

      <button className="arrow left" onClick={prevSlide}>
        <LeftOutlined style={{ fontSize: "24px" }} />
      </button>
      <button className="arrow right" onClick={nextSlide}>
        <RightOutlined style={{ fontSize: "24px" }} />
      </button>
    </div>
  );
};

export default BannerSlider;
