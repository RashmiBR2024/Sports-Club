"use client";


import { useState, useEffect } from 'react';
import { Layout, Menu, Breadcrumb, Modal } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import ProductList from '../products/page';
import Banner from '../addBanner/page';
import ViewBanner from '../viewBanners/page';

const { Header, Content, Sider } = Layout;

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedContent, setSelectedContent] = useState('home'); // State to track selected content
  const router = useRouter();

  useEffect(() => {
    // Check if the cookie 'lG' is set to 'true'
    const loginStatus = Cookies.get('lG');
    if (loginStatus !== 'true') {
      router.push('/auth/email'); 
    }
  }, [router]);

  const handleMenuClick = (menu) => {
    if (menu.key === '33') {
      showLogoutModal();
    } else {
      console.log(`Clicked on ${menu.key}`);
      setSelectedContent(menu.key); 
    }
  };

  const showLogoutModal = () => {
    setIsModalVisible(true);
  };

  const handleLogout = () => {
    Cookies.remove('lG');
    router.push('/auth/email');
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Function to render content based on selected menu item
  const renderContent = () => {
    switch (selectedContent) {
      case '1':
        return <div><User /></div>;
      case '2':
        return <div>User Profile: Bill</div>;
      case '3':
        return <div>User Profile: Alex</div>;
      case '4':
        return <div><ProductList/></div>;
      case '5':
        return <div>Team 2 Details</div>;
      case '6':
        return <div><Banner/></div>;
      case '7':
        return <div><ViewBanner/></div>;
      default:
        return <div>Welcome to the Dashboard!</div>;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Top Navbar */}
      <Header className="header" style={{ backgroundColor: '#fff', padding: 0 }}>
        <div className="logo" style={{ float: 'left', marginLeft: '20px', fontSize: '20px', fontWeight: 'bold' }}>
          Dashboard
        </div>
        <Menu theme="light" mode="horizontal" defaultSelectedKeys={['1']} style={{ float: 'right' }}>
          <Menu.Item key="11">Profile</Menu.Item>
          <Menu.Item key="22">Settings</Menu.Item>
          <Menu.Item key="33" onClick={showLogoutModal}>Logout</Menu.Item>
        </Menu>
      </Header>

      <Layout>
        {/* Side Menu */}
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          width={200}
          breakpoint="lg"
          collapsedWidth="0"
          style={{ backgroundColor: '#fff' }}
        >
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderRight: 0 }}
            onClick={handleMenuClick}
          >
            <Menu.SubMenu key="sub1" icon={<UserOutlined />} title="User">
              <Menu.Item key="1">Add Users</Menu.Item>
              <Menu.Item key="2">Bill</Menu.Item>
              <Menu.Item key="3">Alex</Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu key="sub2" icon={<LaptopOutlined />} title="Product">
              <Menu.Item key="4">Product List </Menu.Item>
              <Menu.Item key="5">Team 2</Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu key="sub3" icon={<NotificationOutlined />} title="Managments">
              <Menu.Item key="6">Banner</Menu.Item>
              <Menu.Item key="7">All Banners</Menu.Item>
            </Menu.SubMenu>
          </Menu>
        </Sider>

        {/* Content Area */}
        <Layout style={{ padding: '0 24px 24px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
            <Breadcrumb.Item></Breadcrumb.Item>
          </Breadcrumb>
          <Content
            style={{
              background: '#fff',
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            {renderContent()}
          </Content>
        </Layout>
      </Layout>

      {/* Logout Confirmation Modal */}
      <Modal
        title="Confirm Logout"
        visible={isModalVisible}
        onOk={handleLogout}
        onCancel={handleCancel}
        okText="Yes"
        cancelText="No"
      >
        <p>Are you sure you want to logout?</p>
      </Modal>
    </Layout>
  );
}
