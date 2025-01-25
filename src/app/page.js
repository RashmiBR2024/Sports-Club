import BannerSlider from "./components/homeBanner";
import WhatAreYouLookingFor from "./components/whatAreYouLookingFor";
import Location from "./components/Location";
import FollowUs from "./components/FollowUs";
import NewsMediaSection from "./components/newsMedia";
import SponsorsAndDeals from "./components/sponsorsAndDeals";
import TopPerformerForm from "./components/TopPerformers";

const Home = () => {
  return (
    <>
      <BannerSlider/>
      <WhatAreYouLookingFor/>
      <NewsMediaSection/>
      <TopPerformerForm/>
      <SponsorsAndDeals/>
      <Location/>
      <FollowUs/>
    </>
  )
}

export default Home;