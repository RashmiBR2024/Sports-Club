import React from "react";
import { Prosto_One } from "next/font/google";

const prostoOne = Prosto_One({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

const FollowUs = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      {/* Heading */}
      <h2 className={`${prostoOne.className} text-black text-2xl mb-6`}>
        Follow Us
      </h2>

      {/* Social Icons */}
      <div className="flex space-x-6">
        {/* Facebook Icon */}
        <a
          href="https://facebook.com/sandhutsportsclub"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://cdn2.iconfinder.com/data/icons/social-media-2285/512/1_Facebook_colored_svg_copy-512.png" // Replace with the actual path to the Facebook icon
            alt="Facebook"
            className="w-12 h-12 hover:scale-110 transition duration-300"
          />
        </a>

        {/* Instagram Icon */}
        <a
          href="https://instagram.com/sandhutsportsclub"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://cdn3.iconfinder.com/data/icons/2018-social-media-logotypes/1000/2018_social_media_popular_app_logo_instagram-1024.png" // Replace with the actual path to the Instagram icon
            alt="Instagram"
            className="w-12 h-12 hover:scale-110 transition duration-300"
          />
        </a>

        {/* YouTube Icon */}
        <a
          href="https://www.youtube.com/@SandHutSportsClub"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://cdn3.iconfinder.com/data/icons/2018-social-media-logotypes/1000/2018_social_media_popular_app_logo_youtube-1024.png" // Replace with the actual path to the YouTube icon
            alt="YouTube"
            className="w-12 h-12 hover:scale-110 transition duration-300"
          />
        </a>
      </div>
    </div>
  );
};

export default FollowUs;
