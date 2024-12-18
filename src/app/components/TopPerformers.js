import React from "react";
import { Prosto_One } from "next/font/google";

const prostoOne = Prosto_One({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

const TopPerformer = () => {
  return (
    <div className="topperformer-container">
      <h1 className={`${prostoOne.className} topperformer-heading text-left`}>Top Performers</h1>

      <div className="topperformer-content flex justify-center items-center">
      {/* Player Image Section */}
        <div className="topperformer-image">
          <img
            src="https://trueledger.s3.ap-south-1.amazonaws.com/JtnXG-8J0Gr05Lpjz0QpO.png"
            alt="Top Performer"
            className="topperformer-player-img"
          />
        </div>

        {/* Player Details Section */}
        <div className="topperformer-details">
          <button className="topperformer-bestplayer-btn">
            <span role="img" aria-label="Trophy">
              🏆
            </span>{" "}
            Best Player
          </button>
          <p className="topperformer-player-name">Virat Kohli</p>
          <p className="topperformer-total-runs">
            <span className="highlighted-runs">741</span> Runs
          </p>
          <button className="topperformer-profile-btn">Cricheroes Profile</button>
        </div>
      </div>
    </div>
  );
};

export default TopPerformer;
