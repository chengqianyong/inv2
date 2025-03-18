import React from 'react';
import { Layout, Menu, Button, message } from 'antd';
import { useNavigate, Outlet } from 'react-router-dom';
import { LogoutOutlined } from '@ant-design/icons';
import AppSider from './AppSider';

const { Header, Content } = Layout;

const AppLayout: React.FC = () => {
  const navigate = useNavigate();

  // 处理退出登录
  const handleLogout = () => {
    // 清除用户信息和token
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    message.success('退出成功');
    navigate('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px' }}>
        <div style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold' }}>股票交易系统</div>
        <Button 
          type="text" 
          icon={<LogoutOutlined />} 
          onClick={handleLogout}
          style={{ color: '#fff' }}
        >
          退出登录
        </Button>
      </Header>
      <Layout>
        <AppSider />
        <Content style={{ padding: '24px' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;