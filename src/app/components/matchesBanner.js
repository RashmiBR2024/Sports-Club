"use client";

import React, { useState, useEffect, useRef } from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const MatchesBannerSlider = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMuted, setIsMuted] = useState(false); // Start unmuted
  const iframeRef = useRef(null);

  // Fetch banners from the backend
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
      setBanners(newBanners); // Update banners dynamically
    };

    eventSource.onerror = () => {
      console.error("Error with event source");
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const checkIfVideo = (url) => {
    const youtubeRegex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.be)\/.+$/;
    return youtubeRegex.test(url);
  };

  const getVideoId = (url) => {
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]+)/;
    const match = url.match(youtubeRegex);
    return match ? match[1] : null;
  };

  const shouldDisplayBanner = (displayOnPages) => {
    return displayOnPages && displayOnPages.includes("matches");
  };

  // Filter banners before rendering
  const filteredBanners = banners.filter((banner) =>
    shouldDisplayBanner(banner.displayOnPages)
  );

  // Auto-scroll logic to loop banners
  useEffect(() => {
    if (filteredBanners.length > 0) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredBanners.length);
      }, filteredBanners[currentIndex]?.displayDuration * 1000 || 5000);

      return () => clearInterval(timer); // Cleanup interval
    }
  }, [currentIndex, filteredBanners]);

  const nextSlide = () => {
    if (filteredBanners.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredBanners.length);
    }
  };

  const prevSlide = () => {
    if (filteredBanners.length > 0) {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? filteredBanners.length - 1 : prevIndex - 1
      );
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  if (loading) return <div>Loading banners...</div>;
  if (error) return <div>Error: {error}</div>;
  if (filteredBanners.length === 0) return <div>No banners available.</div>;

  return (
    <div className="matches-banner-slider">
      {filteredBanners[currentIndex] && (
        <div className="matches-banner-container">
          {checkIfVideo(filteredBanners[currentIndex].content_url) ? (
            <>
              <iframe
                ref={iframeRef}
                width="100%"
                height="100%"
                src={`${filteredBanners[currentIndex].content_url.replace(
                  "watch?v=",
                  "embed/"
                )}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=1`}
                frameBorder="0"
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
                title="Video Banner"
              />
              {/* Text Overlay on Video */}
            <div className="matches-banner-overlay">
                <h2>{filteredBanners[currentIndex].title}</h2>
                <p>{filteredBanners[currentIndex].description}</p>
                <a href={filteredBanners[currentIndex].button_url} className="banner-button">
                    {filteredBanners[currentIndex].buttonName}
                </a>
            </div>
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
                {isMuted ? "Unmute" : "Mute"}
              </button>
            </>
          ) : (
            <>
              <div
                className="matches-banner-background"
                style={{
                  backgroundImage: `url(${filteredBanners[currentIndex].content_url})`,
                }}
              ></div>
              <img
                src={filteredBanners[currentIndex].content_url}
                alt="Banner"
                className="matches-banner-image"
              />
              {/* Text and button overlay */}
              <div className="matches-banner-overlay">
                <h2>{filteredBanners[currentIndex].title || "Default Title"}</h2>
                <p>{filteredBanners[currentIndex].description || "Default description"}</p>
                {filteredBanners[currentIndex].buttonName && (
                  <a
                    href={filteredBanners[currentIndex].button_url || "#"}
                    className="banner-button"
                  >
                    {filteredBanners[currentIndex].buttonName}
                  </a>
                )}
              </div>
            </>
          )}
        </div>
      )}

      <button className="matches-banner-arrow left" onClick={prevSlide}>
        <LeftOutlined style={{ fontSize: "24px" }} />
      </button>
      <button className="matches-banner-arrow right" onClick={nextSlide}>
        <RightOutlined style={{ fontSize: "24px" }} />
      </button>
    </div>
  );
};

export default MatchesBannerSlider;
