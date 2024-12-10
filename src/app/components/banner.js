"use client";

import React, { useState, useEffect, useRef } from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const BannerSlider = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMuted, setIsMuted] = useState(false); // Start unmuted (set to false)
  const iframeRef = useRef(null); // Reference for the iframe

  // Fetch banners from the backend
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/getBannerDataByStatus?isStatus=true`, {
          headers: {
            "x-api-key": process.env.NEXT_PUBLIC_API_AUTH_KEY,
          },
        });

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

  // Check if the content is a YouTube video link
  const checkIfVideo = (url) => {
    const youtubeRegex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.be)\/.+$/;
    return youtubeRegex.test(url);
  };

  // Extract video ID from YouTube URL
  const getVideoId = (url) => {
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]+)/;
    const match = url.match(youtubeRegex);
    return match ? match[1] : null;
  };

  // Generate YouTube thumbnail URL
  const generateThumbnail = (url) => {
    const videoId = getVideoId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/0.jpg` : url;
  };

  // Navigate to the next banner
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  // Navigate to the previous banner
  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1
    );
  };

  // Handle video display logic (play video for `displayDuration` seconds)
  useEffect(() => {
    const banner = banners[currentIndex];
    if (banner) {
      // Set a timer for video or image banner display duration
      const timer = setTimeout(() => {
        nextSlide();
      }, banner.displayDuration * 1000); // Slide after the duration for images and videos
  
      return () => clearTimeout(timer); // Cleanup timeout
    }
  }, [currentIndex, banners]);
  

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  useEffect(() => {
    const iframeElement = iframeRef.current;
  
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // If the iframe is in view, resume the video by setting the autoplay
            iframeElement.src = `${banners[currentIndex].content_url.replace(
              "watch?v=",
              "embed/"
            )}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=1`;
          } else {
            // If the iframe is out of view, stop the video
            iframeElement.src = "";  // This stops the video by clearing the src
          }
        });
      },
      {
        threshold: 0.5, // Trigger the observer when 50% of the iframe is visible
      }
    );
  
    if (iframeElement) {
      observer.observe(iframeElement); // Start observing the iframe
    }
  
    // Cleanup the observer when the component is unmounted
    return () => {
      if (iframeElement) {
        observer.unobserve(iframeElement);
      }
    };
  }, [currentIndex, banners, isMuted]);
  


  if (loading) return <div>Loading banners...</div>;
  if (error) return <div>Error: {error}</div>;
  if (banners.length === 0) return <div>No banners available.</div>;

  return (
    <div className="banner-slider">
      {/* Main banner */}
      {banners.length > 0 && banners[currentIndex] && (
        <div className="main-banner-container">
          {checkIfVideo(banners[currentIndex].content_url) ? (
            <>
              <iframe
                ref={iframeRef}
                width="100%"
                height="500px"
                src={`${banners[currentIndex].content_url.replace(
                  "watch?v=",
                  "embed/"
                )}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=1`}  // Control mute via state
                frameBorder="0"
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
                title="Video Banner"
                muted={isMuted} // Muting is controlled through this state
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
                {isMuted ? "UnMute" : "Mute"} {/* Toggle text */}
              </button>
            </>
          ) : (
            <>
              <div
                className="main-banner-background"
                style={{
                  backgroundImage: `url(${banners[currentIndex].content_url})`,
                }}
              ></div>
              <img
                src={banners[currentIndex].content_url}
                alt="Banner"
                className="main-banner-image"
              />
            </>
          )}

          {/* Banner content with title, subtitle, and button */}
          {banners[currentIndex].isText && (
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
                  fontSize: "36px", // Adjust size as per requirement
                  fontFamily: "Prosto One, sans-serif", // Apply Prosto One font
                  margin: 0,
                }}
              >
                {banners[currentIndex].title}
              </h1>
              <h2
                style={{
                  fontSize: "24px", // Adjust size for subtitle
                  margin: "10px 0",
                }}
              >
                {banners[currentIndex].subTitle}
              </h2>
              {banners[currentIndex].isButton && (
                <a
                  href={
                    checkIfVideo(banners[currentIndex].content_url)
                      ? `https://www.youtube.com/watch?v=${getVideoId(
                          banners[currentIndex].content_url
                        )}`
                      : banners[currentIndex].button_url || "#"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    marginBottom: '35px',
                    width: "auto",
                    padding: "12px 20px",
                    backgroundColor: "white",
                    color: "black",
                    border: "none",
                    fontWeight: "bold",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "16px",
                    textDecoration: "none",
                    display: "inline-block",
                    marginTop: "10px",
                  }}
                >
                  {banners[currentIndex].buttonName}
                </a>
              )}
            </div>
          )}
        </div>
      )}

      {/* Navigation Arrows */}
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
