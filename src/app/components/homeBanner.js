"use client";

import React, { useState, useEffect, useRef } from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const BannerSlider = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMuted, setIsMuted] = useState(true); // Default to muted
  const iframeRef = useRef(null);

  // Fetch banners from backend
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
          setBanners(result.data);
          setCurrentIndex(0); // Reset to first banner when fetched
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

    // Subscribe to server-sent events for real-time updates
    const eventSource = new EventSource(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/subscribe`);
    eventSource.onmessage = (event) => {
      const newBanners = JSON.parse(event.data);
      setBanners(newBanners);
      setCurrentIndex(0); // Reset to first banner when new data arrives
    };

    eventSource.onerror = () => {
      console.error("Error with event source");
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  // Check if content is a YouTube video
  const checkIfVideo = (url) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.youtube\.com|youtu\.be)\/.+$/;
    return youtubeRegex.test(url);
  };

  // Extract YouTube video ID
  const getVideoId = (url) => {
    const youtubeRegex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]+)/;
    const match = url.match(youtubeRegex);
    return match ? match[1] : null;
  };

  // Navigate to next banner
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  // Navigate to previous banner
  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1
    );
  };

  // Auto-play next slide based on display duration
  useEffect(() => {
    if (banners.length > 0) {
      const timer = setTimeout(() => {
        nextSlide();
      }, banners[currentIndex]?.displayDuration * 1000 || 5000);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, banners]);

  // Toggle mute for YouTube video
  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  // Ensure only banners meant for "home" page are displayed
  const shouldDisplayBanner = (displayOnPages) => {
    if (!displayOnPages || displayOnPages.length === 0) return true;
    return displayOnPages.includes("home");
  };

  if (loading) return <div>Loading banners...</div>;
  if (error) return <div>Error: {error}</div>;
  if (banners.length === 0) return <div>No banners available.</div>;

  // Filter banners before rendering
  const filteredBanners = banners.filter((banner) =>
    shouldDisplayBanner(banner.displayOnPages)
  );

  return (
    <div className="banner-slider">
      {filteredBanners.length > 0 && filteredBanners[currentIndex] && (
        <div className="main-banner-container">
          {checkIfVideo(filteredBanners[currentIndex].content_url) ? (
            <>
              <iframe
                key={currentIndex} // Forces React to reload iframe on slide change
                ref={iframeRef}
                width="100%"
                height="500px"
                src={`${filteredBanners[currentIndex].content_url.replace(
                  "watch?v=",
                  "embed/"
                )}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=1&playsinline=1`}
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
                  backgroundImage: `url(${filteredBanners[currentIndex].content_url})`,
                }}
              ></div>
              <img
                src={filteredBanners[currentIndex].content_url}
                alt="Banner"
                className="main-banner-image"
              />
            </>
          )}

          {filteredBanners[currentIndex].isText && (
            <div
              className="main-banner-content"
              style={{
                position: "absolute",
                bottom: "10px",
                left: "50px",
                color: "white",
                zIndex: 10,
                padding: "10px",
              }}
            >
              <h1
                style={{
                  fontSize: "26px",
                  fontFamily: "Prosto One, sans-serif",
                  margin: 0,
                }}
              >
                {filteredBanners[currentIndex].title}
              </h1>
              <h2 style={{ fontSize: "14px", margin: "10px 0" }}>
                {filteredBanners[currentIndex].subTitle}
              </h2>
              {filteredBanners[currentIndex].isButton && (
                <a
                  href={
                    checkIfVideo(filteredBanners[currentIndex].content_url)
                      ? `https://www.youtube.com/watch?v=${getVideoId(
                          filteredBanners[currentIndex].content_url
                        )}`
                      : filteredBanners[currentIndex].button_url || "#"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    marginBottom: "35px",
                    padding: "12px 20px",
                    backgroundColor: "white",
                    color: "black",
                    fontWeight: "bold",
                    borderRadius: "4px",
                    fontSize: "16px",
                    textDecoration: "none",
                  }}
                >
                  {filteredBanners[currentIndex].buttonName}
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
