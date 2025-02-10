"use client";
import { useState, useEffect } from 'react';
import { Layout, Menu, Breadcrumb, Modal, Space } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import ProductList from '../dashBoard/products/page';
import Banner from '../dashBoard/banners/addBanner/page';
import ViewBanner from '../dashBoard/banners/viewBanners/page';
import Users from '../dashBoard/users/addUsers/page';
import { MoreOutlined, SettingOutlined, LogoutOutlined } from "@ant-design/icons";
import { Dropdown } from "antd";

const { Header, Content, Sider } = Layout;

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedContent, setSelectedContent] = useState('home'); // State to track selected content
  const [breadcrumbPath, setBreadcrumbPath] = useState(['Home', 'Dashboard']); // State to track breadcrumb path
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
      setSelectedContent(menu.key);
      updateBreadcrumb(menu); // Update breadcrumb when a menu item is selected
    }
  };

  const updateBreadcrumb = (menu) => {
    let newBreadcrumbPath = ['Home', 'Dashboard']; // Base breadcrumb path
    if (menu.key === '1' || menu.key === '2' || menu.key === '3') {
      newBreadcrumbPath = [...newBreadcrumbPath, 'User', menu.key === '1' ? 'Add Users' : menu.key === '2' ? 'Bill' : 'Alex'];
    } else if (menu.key === '4' || menu.key === '5') {
      newBreadcrumbPath = [...newBreadcrumbPath, 'Product', menu.key === '4' ? 'Product List' : 'Team 2'];
    } else if (menu.key === '6' || menu.key === '7') {
      newBreadcrumbPath = [...newBreadcrumbPath, 'Website', menu.key === '6' ? 'Add Banner' : 'All Banners'];
    } else if (menu.key === '8' || menu.key === '9') {
      newBreadcrumbPath = [...newBreadcrumbPath, 'Teams', menu.key === '8' ? 'Add Banner' : 'All Banners'];
    } else if (menu.key === '10' || menu.key === '11') {
      newBreadcrumbPath = [...newBreadcrumbPath, 'Managements', menu.key === '10' ? 'Add Banner' : 'All Banners'];
    }
    setBreadcrumbPath(newBreadcrumbPath); // Update the breadcrumb state
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
        return <div><Users/></div>;
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

  const menu = (
    <Menu>
      <Menu.Item key="11" icon={<UserOutlined />}>Profile</Menu.Item>
      <Menu.Item key="22" icon={<SettingOutlined />}>Settings</Menu.Item>
      <Menu.Item key="33" icon={<LogoutOutlined />} onClick={showLogoutModal}>Logout</Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: '100vh', marginTop: '-65px' }}>
      {/* Top Navbar */}
      <Header className="header" style={{ backgroundColor: '#fff', padding: 0 }}>
        <div className="logo" style={{ float: 'left', marginLeft: '20px', fontSize: '20px', fontWeight: 'bold', display:'flex', flexDirection: 'row' }}>
          <img src="https://cdn-icons-png.flaticon.com/128/15135/15135113.png" style={{ width:"20px", height:"20px", marginTop:"22px", marginRight: "5px"}}></img>
          Dashboard
        </div>
        <Menu theme="light" mode="horizontal" style={{ float: 'right', marginRight: '15px' , marginTop: '15px', outline: 'none' }}>
          <Dropdown overlay={menu} trigger={["hover"]}>
            <MoreOutlined style={{ fontSize: "25px", cursor: "pointer" }} />
          </Dropdown>
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
            // defaultSelectedKeys={['1']}
            // defaultOpenKeys={['sub1']}
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
            <Menu.SubMenu key="sub3" icon={<NotificationOutlined />} title="Website">
              <Menu.Item key="6">Add Banner</Menu.Item>
              <Menu.Item key="7">All Banners</Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu key="sub4" icon={<NotificationOutlined />} title="Teams">
              <Menu.Item key="8">Add Banner</Menu.Item>
              <Menu.Item key="9">All Banners</Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu key="sub5" icon={<NotificationOutlined />} title="Managments">
              <Menu.Item key="10">Add Banner</Menu.Item>
              <Menu.Item key="11">All Banners</Menu.Item>
            </Menu.SubMenu>
          </Menu>
        </Sider>

        {/* Content Area */}
        <Layout style={{ padding: '0 24px 24px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            {breadcrumbPath.map((item, index) => (
              <Breadcrumb.Item key={index}>{item}</Breadcrumb.Item>
            ))}
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
