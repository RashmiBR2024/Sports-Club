import BannerSlider from "./components/banner";
import WhatAreYouLookingFor from "./components/whatAreYouLookingFor";
import Location from "./components/Location";
import FollowUs from "./components/FollowUs";
import NewsMediaSection from "./components/newsMedia";

const Home = () => {
  return (
    <>
      <BannerSlider/>
      <WhatAreYouLookingFor/>
      <NewsMediaSection/>
      <Location/>
      <FollowUs/>
    </>
  )
}

export default Home;