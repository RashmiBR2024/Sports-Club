import React from "react";
import { Prosto_One } from "next/font/google";

const prostoOne = Prosto_One({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

const FollowUs = () => {
  return (
    <div className="followus-container">
      {/* Heading */}
      <h2 className={`${prostoOne.className} followus-heading`}>
        Follow Us
      </h2>

      {/* Social Icons */}
      <div className="followus-icons">
        {/* Facebook Icon */}
        <a
          href="https://facebook.com/sandhutsportsclub"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://cdn2.iconfinder.com/data/icons/social-media-2285/512/1_Facebook_colored_svg_copy-512.png"
            alt="Facebook"
            className="followus-icon"
          />
        </a>

        {/* Instagram Icon */}
        <a
          href="https://instagram.com/sandhutsportsclub"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://cdn3.iconfinder.com/data/icons/2018-social-media-logotypes/1000/2018_social_media_popular_app_logo_instagram-1024.png"
            alt="Instagram"
            className="followus-icon"
          />
        </a>

        {/* YouTube Icon */}
        <a
          href="https://www.youtube.com/@SandHutSportsClub"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://cdn3.iconfinder.com/data/icons/2018-social-media-logotypes/1000/2018_social_media_popular_app_logo_youtube-1024.png"
            alt="YouTube"
            className="followus-icon"
          />
        </a>
      </div>
    </div>
  );
};

export default FollowUs;
