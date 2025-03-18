import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';

const { Title } = Typography;

interface LoginForm {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values: LoginForm) => {
    setLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 获取已注册用户信息
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const user = registeredUsers.find(u => u.username === values.username && u.password === values.password);
      
      if (values.username === 'admin' && values.password === 'admin' || user) {
        message.success('登录成功');
        // 存储用户信息和token
        localStorage.setItem('user', JSON.stringify({
          username: values.username,
          role: user ? 'user' : 'admin'
        }));
        localStorage.setItem('token', 'mock-token');
        navigate('/');
      } else {
        message.error('用户名或密码错误');
      }
    } catch (error) {
      message.error('登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#f0f2f5'
    }}>
      <Card style={{ width: 400, padding: '20px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2}>股票交易系统</Title>
          <Title level={4} style={{ color: '#666', fontWeight: 'normal' }}>用户登录</Title>
        </div>
        
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={handleLogin}
          style={{ padding: '0 24px' }}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input 
              prefix={<UserOutlined />}
              placeholder="用户名"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              block
              size="large"
            >
              登录
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Link to="/register">注册新账号</Link>
            <span style={{ margin: '0 8px' }}>|</span>
            <Link to="/forgot-password">忘记密码</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;