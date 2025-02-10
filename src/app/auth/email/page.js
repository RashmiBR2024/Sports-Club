"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, message, Alert } from 'antd';
import Cookies from 'js-cookie';

export default function EmailLogin() {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check if the cookie 'lG' is set to 'true'
    const loginStatus = Cookies.get('lG');
    if (loginStatus === 'true') {
      router.push('/dashBoard'); // Redirect to Dashboard if already logged in
    }
  }, [router]);

  const onFinish = (values) => {
    const hardCodedUsername = 'user@example.com';
    const hardCodedPassword = '7337649008';

    if (values.email === hardCodedUsername && values.password === hardCodedPassword) {
      setLoading(true);
      Cookies.set('lG', 'true');
      message.success('Login successful!');
      setAlert({ type: 'success', message: 'Login successful!' });
      setLoading(false);
      router.push('/dashBoard'); // Redirect to Dashboard on successful login
    } else {
      message.error('Incorrect email or password!');
      setAlert({ type: 'error', message: 'Incorrect email or password!' });
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f0f2f5', marginTop: "-65px" }}>
      <div style={{ width: '300px', padding: '2rem', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' }}>
        <img src="/sports_logo/app_bar_logo_B.png" alt="Logo" style={{ display: 'block', margin: '0 auto 1rem', width: '150px' }} />
        <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Login</h2>
        
        {alert && (
          <Alert
            style={{ marginBottom: '1rem' }}
            message={alert.message}
            type={alert.type}
            showIcon
          />
        )}
        
        <Form
          name="login_form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
