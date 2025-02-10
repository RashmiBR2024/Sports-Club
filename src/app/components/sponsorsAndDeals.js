"use client";

import React, { useState, useEffect } from "react";

const SponsorsAndDeals = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        console.log("Fetching media...");
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
        console.log("API Response:", result);

        if (result.success) {
          const filteredMedia = result.data.filter((banner) => {
            return (
              banner.isStatus === true &&
              banner.displayOnPages?.includes("sponsorsanddeals")
            );
          });

          console.log("Filtered Media:", filteredMedia);
          setMedia(filteredMedia);
        } else {
          setError(result.error || "Failed to fetch media.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "An error occurred while fetching media.");
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, []);

  const checkIfVideo = (url) => {
    const youtubeRegex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.be)\/.+$/;
    return youtubeRegex.test(url);
  };

  const getVideoId = (url) => {
    const youtubeRegex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]+)/;
    const match = url.match(youtubeRegex);
    return match ? match[1] : null;
  };

  if (loading) return <div>Loading media...</div>;
  if (error) return <div>Error: {error}</div>;
  if (media.length === 0) return <div>No media available.</div>;

  return (
    <section className="sponsor-section">
      <div className="horizontal-scroll">
        <div className="header">
          <h1
            style={{
              fontFamily: "'Prosto One', sans-serif",
              fontSize: "30px",
              color: "black",
              marginTop: "50px",
            }}
          >
            Sponsors And Deals
          </h1>
        </div>
        <div className="news-block">
          <div className={`new-slider ${media.length <= 4 ? "paused" : ""}`}>
            <div className="sponsor-video-scroll-wrapper">
              {/* Original Set of Media */}
              {media.map((item, index) => (
                <div
                  key={`media-${index}`}
                  className="media-container"
                  onClick={() =>
                    item.content_url && window.open(item.content_url, "_blank")
                  }
                >
                  {/* Handle Videos */}
                  {checkIfVideo(item.content_url) ? (
                    <img
                      src={`https://img.youtube.com/vi/${getVideoId(
                        item.content_url
                      )}/0.jpg`}
                      alt={`Video ${index}`}
                      className="media-thumbnail"
                    />
                  ) : (
                    /* Handle Images */
                    <img
                      src={item.content_url}
                      alt={`Image ${index}`}
                      className="media-thumbnail"
                    />
                  )}

                  {/* Display button if available */}
                  {item.isButton && item.buttonName && item.button_url && (
                    <button
                      className="sponsors-img-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(item.button_url, "_blank");
                      }}
                    >
                      {item.buttonName}
                    </button>
                  )}
                </div>
              ))}

              {/* Duplicate the Entire Set for Infinite Scrolling */}
              {media.map((item, index) => (
                <div
                  key={`duplicate-media-${index}`}
                  className="media-container"
                  onClick={() =>
                    item.content_url && window.open(item.content_url, "_blank")
                  }
                >
                  {/* Handle Videos */}
                  {checkIfVideo(item.content_url) ? (
                    <img
                      src={`https://img.youtube.com/vi/${getVideoId(
                        item.content_url
                      )}/0.jpg`}
                      alt={`Video Duplicate ${index}`}
                      className="media-thumbnail"
                    />
                  ) : (
                    /* Handle Images */
                    <img
                      src={item.content_url}
                      alt={`Image Duplicate ${index}`}
                      className="media-thumbnail"
                    />
                  )}

                  {/* Display button if available */}
                  {item.isButton && item.buttonName && item.button_url && (
                    <button
                      className="sponsors-img-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(item.button_url, "_blank");
                      }}
                    >
                      {item.buttonName}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SponsorsAndDeals;
