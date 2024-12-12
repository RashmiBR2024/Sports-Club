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
      <h1 className={`${prostoOne.className} topperformer-heading`}>Top Performers</h1>

      <div className="topperformer-content">
        {/* Player Image Section */}
        <div className="topperformer-image">
          <img
            src="https://i.pinimg.com/736x/e5/34/b6/e534b615e917b44129d86b28fa8a6a48.jpg"
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
