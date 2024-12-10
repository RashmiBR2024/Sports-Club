"use client";

import React, { useState, useEffect } from "react";

const VideoScroll = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVideos = async () => {
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
          setVideos(result.data.filter((banner) => checkIfVideo(banner.content_url)));
        } else {
          setError(result.error || "Failed to fetch videos.");
        }
      } catch (err) {
        setError(err.message || "An error occurred while fetching videos.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
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

  const handleVideoClick = (url) => {
    const videoId = getVideoId(url);
    if (videoId) {
      window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank");
    }
  };

  if (loading) return <div>Loading videos...</div>;
  if (error) return <div>Error: {error}</div>;
  if (videos.length === 0) return <div>No videos available.</div>;

  return (
    <section>
      <div className="horizontal-scroll">
      <div className="header">
        <h1 style={{ fontFamily: "'Prosto One', sans-serif", fontSize: "30px" }}>News / Media</h1>
      </div>
      <div className="news-block">
        <div className={`new-slider ${videos.length <= 4 ? "paused" : ""}`}>
          <div className="video-scroll-wrapper">
            {/* Original set of videos */}
            {videos.map((video, index) => (
              <div
                key={`video-${index}`}
                className="video-container"
                onClick={() => handleVideoClick(video.content_url)}
              >
                <img
                  src={`https://img.youtube.com/vi/${getVideoId(video.content_url)}/0.jpg`}
                  alt={`Video ${index + 1}`}
                  className="video-thumbnail"
                />
              </div>
            ))}
            {/* Duplicate set of videos for infinite scrolling */}
            {videos.map((video, index) => (
              <div
                key={`duplicate-video-${index}`}
                className="video-container"
                onClick={() => handleVideoClick(video.content_url)}
              >
                <img
                  src={`https://img.youtube.com/vi/${getVideoId(video.content_url)}/0.jpg`}
                  alt={`Video Duplicate ${index + 1}`}
                  className="video-thumbnail"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </section>
  );
};

export default VideoScroll;
