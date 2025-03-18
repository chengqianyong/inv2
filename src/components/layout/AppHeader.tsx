import React from 'react';
import { Layout, Typography } from 'antd';
import { StockOutlined } from '@ant-design/icons';

const { Header } = Layout;
const { Title } = Typography;

const AppHeader: React.FC = () => {
  return (
    <Header className="app-header">
      <div className="app-logo">
        <StockOutlined style={{ marginRight: 8 }} />
        <span>智能股票交易系统</span>
      </div>
    </Header>
  );
};

export default AppHeader;