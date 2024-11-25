// components/Navbar.js
"use client";
import { useState } from 'react';
import { Menu, Layout, Drawer, Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import Image from 'next/image';
import Link from 'next/link';

const { Header } = Layout;

const Navbar = () => {
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  return (
    <>
      <Header
        style={{
          backgroundColor: '#fff', // Changed to white background
          padding: '0 20px',
          borderBottom: '1px solid #eee',
          height: '90px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >

<div
    style={{
      position: 'absolute',
      top: '50%', // Adjust to place it behind the logo
      left: 0,
       marginTop: '20px',
      width: '100%',
      height: '1px',
      backgroundColor: '#ccc', // Line color
      zIndex: 0, // Ensure it stays behind the logo
    }}
  ></div>
       <div style={{ zIndex: 1,marginTop: '60px', textAlign: 'center' }}>
          <Image
            src="/sports_logo/sandhut_sports_club_W.png"
            alt="SandHut Sports Club Logo"
            width={200}
            height={40}
            objectFit="contain"
          />
        </div>
        <div
  style={{
    display: 'flex',
    justifyContent: 'center', // Centers the menu horizontally
    alignItems: 'center',    // Centers content vertically (optional, if needed)
    height: '100%',          // Ensures vertical centering works properly
  }}
>
  <div className="desktop-menu" style={{ position: 'relative', left: '-170px' }} > {/* Removed unnecessary padding */}
    <Menu
      mode="horizontal"
      defaultSelectedKeys={['1']}
      style={{
        borderBottom: 'none',
        lineHeight: '64px',
        backgroundColor: 'transparent',
        color: '#000',
      }}
    >

      
      <Menu.Item key="1">
        <Link href="#about" scroll={false}>
          Club Players
        </Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Link href="#benefits" scroll={false}>
          Points Table
        </Link>
      </Menu.Item>
      <Menu.Item key="3">
        <Link href="#testimonials" scroll={false}>
          Teams
        </Link>
      </Menu.Item>
      <Menu.Item key="4">
        <Link href="#testimonials" scroll={false}>
          Matches
        </Link>
      </Menu.Item>
      <Menu.Item key="5">
        <Link href="#location" scroll={false}>
          News
        </Link>
      </Menu.Item>
      <Menu.Item key="6">
        <Link href="#contact" scroll={false}>
          More
        </Link>
      </Menu.Item>
    </Menu>
  </div>
</div>


        <div className="mobile-menu">
          <Button
            type="primary"
            icon={<MenuOutlined />}
            onClick={showDrawer}
            style={{ border: 'none', backgroundColor: 'transparent', color: '#000' }} // Changed to black icon for visibility
          />
        </div>
      </Header>

      <Drawer
        title="SandHut Sports Club"
        placement="right"
        closable={true}
        onClose={onClose}
        visible={visible}
        bodyStyle={{ backgroundColor: '#fff', color: '#000' }} // Changed to white background and black text
      >
        <Menu mode="vertical" defaultSelectedKeys={['1']} style={{ backgroundColor: 'transparent', color: '#000' }}>
          <Menu.Item key="1">
            <Link href="#about" scroll={false}>
              About Us
            </Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link href="#benefits" scroll={false}>
              Membership Benefits
            </Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link href="#testimonials" scroll={false}>
              Testimonials
            </Link>
          </Menu.Item>
          <Menu.Item key="4">
            <Link href="#location" scroll={false}>
              Location
            </Link>
          </Menu.Item>
          <Menu.Item key="5">
            <Link href="#contact" scroll={false}>
              Contact Us
            </Link>
          </Menu.Item>
          <Menu.Item key="6">
            <Link href="/auth/email" scroll={false}>
              Login
            </Link>
          </Menu.Item>
        </Menu>
      </Drawer>

      <style jsx>{`
        .desktop-menu {
          display: none;
        }
        .mobile-menu {
          display: block;
        }
        @media (min-width: 768px) {
          .desktop-menu {
            display: block;
          }
          .mobile-menu {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;
