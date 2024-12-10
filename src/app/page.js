import BannerSlider from "./components/banner";
import WhatAreYouLookingFor from "./components/whatAreYouLookingFor";
import Location from "./components/Location";
import FollowUs from "./components/FollowUs";
import NewsMediaSection from "./components/newsMedia";
import SponsorsAndDeals from "./components/sponsorsAndDeals";

const Home = () => {
  return (
    <>
      <BannerSlider/>
      <WhatAreYouLookingFor/>
      <NewsMediaSection/>
      <SponsorsAndDeals/>
      <Location/>
      <FollowUs/>
    </>
  )
}

export default Home;