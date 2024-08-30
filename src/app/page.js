// pages/Home.js
"use client";
import { Layout, Typography, Row, Col, Card } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from './components/navBar';
import { EnvironmentOutlined, PhoneOutlined } from '@ant-design/icons';

const { Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

const Home = () => {
  return (
    <Layout>
      <div style={{ position: "fixed", width: "100%", zIndex: 1000, top: 0 }}>
        <Navbar />
      </div>

      <Content style={{ padding: '100px 20px 0' }}> {/* Added top padding to prevent content from being hidden behind the fixed navbar */}
        {/* Hero Banner */}
        <div style={{ position: 'relative', textAlign: 'center', color: '#fff' }}>
          <Image
            src="/hero_img/S11.png"
            alt="Hero Image"
            layout="responsive"
            width={2000}
            height={800}
            objectFit="cover"
            quality={100}
          />
        </div>

        {/* About Us Section */}
        <div id="about" style={{ marginTop: '40px', padding: '60px 20px', backgroundColor: '#000', color: '#fff' }}>
          <Row gutter={[32, 32]} justify="center" align="middle">
            <Col xs={24} md={12}>
              <Title level={2} style={{ color: '#BEFE45' }}>About SandHut Sports Club</Title>
              <Paragraph style={{ fontSize: '16px', lineHeight: '1.6', color: '#FFF' }}>
                Founded in 2023 by a group of passionate cricket enthusiasts, SandHut Sports Club has grown into one of the premier cricket clubs in the region, hosting tournaments and events that draw players from all over India and beyond.
              </Paragraph>
              <Paragraph style={{ fontSize: '16px', lineHeight: '1.6', color: '#FFF' }}>
                Our mission is to promote sportsmanship, teamwork, and fair play both on and off the field. We believe cricket is more than just a game; it's a way to bring people together, foster community, and build lifelong friendships.
              </Paragraph>
            </Col>
            <Col xs={24} md={12}>
              <Image src="/tema.png" alt="Team Photo" width={600} height={400} layout="responsive" />
            </Col>
          </Row>
        </div>

        {/* Membership Benefits Section */}
        <div id="benefits" style={{ marginTop: '40px', textAlign: 'center', backgroundColor: '#fff', color: '#000', padding: '40px 20px' }}>
          <Title level={2}>Membership Benefits</Title>
          <Row gutter={[16, 16]} justify="center">
            <Col xs={24} sm={12} md={8}>
              <Card title="Expert Coaching" bordered={false}>
                Train with the best coaches to enhance your cricketing skills.
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card title="State-of-the-Art Facilities" bordered={false}>
                Access top-quality facilities and equipment for optimal training.
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card title="Community Events" bordered={false}>
                Participate in events and tournaments to compete and network.
              </Card>
            </Col>
          </Row>
        </div>

        {/* Testimonials Section */}
        <div id="testimonials" style={{ marginTop: '40px', textAlign: 'center', backgroundColor: '#000', color: '#fff', padding: '40px 20px' }}>
          <Title level={2} style={{ color: '#BEFE45' }}>What Our Members Say</Title>
          <Row gutter={[16, 16]} justify="center">
            <Col xs={24} sm={12} md={8}>
              <Card bordered={false} style={{ backgroundColor: '#1c1c1c', color: '#fff' }}>
                <Paragraph style={{ color: '#FFF' }}>"The coaching here is top-notch, and I've greatly improved my skills. Highly recommend!"</Paragraph>
                <strong style={{ color: '#FFF' }}>- Rajesh Kumar</strong>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card bordered={false} style={{ backgroundColor: '#1c1c1c', color: '#fff' }}>
                <Paragraph style={{ color: '#FFF' }}>"A wonderful community and excellent facilities. It's my go-to place for all things cricket!"</Paragraph>
                <strong style={{ color: '#FFF' }}>- Sita Patel</strong>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Location Section */}
        <div id="location" style={{ marginTop: '40px', textAlign: 'center', backgroundColor: '#fff', color: '#000', padding: '40px 20px' }}>
          <Title level={2}>Our Location</Title>
          <Row gutter={[16, 16]} justify="center" align="middle">
            <Col xs={24} md={12} style={{ textAlign: 'left' }}>
              <Paragraph>
                <EnvironmentOutlined style={{ fontSize: '18px', color: '#000' }} />{' '}
                SandHut Sports Club, Nelamangala Rd, Kadabagere Cross, Kadabagere, Bengaluru, Karnataka 562130
              </Paragraph>
              <Paragraph>
                <PhoneOutlined style={{ fontSize: '18px', color: '#000' }} /> +91-7353119393 / +91-7353119898
              </Paragraph>
            </Col>
            <Col xs={24} md={12}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.638014206735!2d77.44045377536138!3d12.994989087322473!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3bd30e84477b%3A0xdcbba42ea22ce51c!2sSandHut%20Sports%20Club!5e0!3m2!1sen!2sin!4v1724748343815!5m2!1sen!2sin"
                width="100%"
                height="300"
                style={{ border: '0' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </Col>
          </Row>
        </div>
      </Content>

      {/* Footer */}
      <Footer style={{ textAlign: 'center', backgroundColor: '#000', color: '#fff', padding: '20px 10px' }}>
        SandHut Sports Club ©2024 | Follow us on
        <a href="#" style={{ color: '#BEFE45', marginLeft: '10px' }}>Facebook</a>,
        <a href="#" style={{ color: '#BEFE45', marginLeft: '10px' }}>Instagram</a>,
        <a href="#" style={{ color: '#BEFE45', marginLeft: '10px' }}>Twitter</a>
        <p style={{ color: '#BEFE45', marginLeft: '10px' }}>
          <Link href="/auth/email" scroll={false}>
            Login
          </Link></p>
      </Footer>

      <style jsx>{`
        @media (max-width: 768px) {
          .ant-layout-content {
            padding: 0 10px;
          }
          iframe {
            width: 100%;
            height: 300px;
          }
          #location {
            text-align: center;
          }
        }
      `}</style>
    </Layout>
  );
};

export default Home;
