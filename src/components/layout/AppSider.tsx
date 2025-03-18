import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  StockOutlined,
  HistoryOutlined,
  SettingOutlined,
  CommentOutlined
} from '@ant-design/icons';

const { Sider } = Layout;

const AppSider: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  
  // 确定当前选中的菜单项
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path === '/') return ['dashboard'];
    if (path.includes('/stocks')) return ['stocks'];
    if (path.includes('/history')) return ['history'];
    if (path.includes('/strategy')) return ['strategy'];
    if (path.includes('/feedback')) return ['feedback'];
    return ['dashboard'];
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      width={200}
      style={{ background: '#fff' }}
    >
      <div className="logo">
        {!collapsed && '导航菜单'}
      </div>
      <Menu
        mode="inline"
        selectedKeys={getSelectedKey()}
        style={{ height: '100%', borderRight: 0 }}
        items={[
          {
            key: 'dashboard',
            icon: <DashboardOutlined />,
            label: <Link to="/">仪表盘</Link>,
          },
          {
            key: 'stocks',
            icon: <StockOutlined />,
            label: <Link to="/stocks">股票列表</Link>,
          },
          {
            key: 'history',
            icon: <HistoryOutlined />,
            label: <Link to="/history">交易历史</Link>,
          },
          {
            key: 'strategy',
            icon: <SettingOutlined />,
            label: <Link to="/strategy">策略设置</Link>,
          },
          {
            key: 'feedback',
            icon: <CommentOutlined />,
            label: <Link to="/feedback">反馈历史</Link>,
          },
        ]}
      />
    </Sider>
  );
};

export default AppSider;