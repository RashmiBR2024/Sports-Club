"use client";
import { Layout } from "antd";
import Navbar from "./components/navBar";
import Banner from "./(pages)/banner/page";
import Section2 from "./(pages)/lookingFor/page"
const Home = () => {
  return (
    <Layout>
      {/* Fixed Navbar */}
      <div style={{ position: "fixed", width: "100%", zIndex: 1000, top: 0 }}>
        <Navbar />
      </div>
  
        <Banner />
<Section2 />
    </Layout>
  );
};

export default Home;
