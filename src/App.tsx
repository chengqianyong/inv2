import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

// 导入页面组件
import Dashboard from './pages/Dashboard';
import StockList from './pages/StockList';
import TradeHistory from './pages/TradeHistory';
import StrategySettings from './pages/StrategySettings';
import FeedbackHistory from './pages/FeedbackHistory';
import Login from './pages/Login';
import Register from './pages/Register';
import RiskAssessment from './pages/RiskAssessment';

// 导入布局组件
import AppLayout from './components/layout';

import './App.css';

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const publicPaths = ['/login', '/register'];
    const riskAssessment = localStorage.getItem('riskAssessment');
    const currentPath = location.pathname;
    
    if (!token && !publicPaths.includes(currentPath)) {
      navigate('/login');
    } else if (token && !riskAssessment && !['/risk-assessment', '/login', '/register'].includes(currentPath)) {
      navigate('/risk-assessment');
    }
  }, [location.pathname, navigate]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/risk-assessment" element={<RiskAssessment />} />
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="stocks" element={<StockList />} />
        <Route path="history" element={<TradeHistory />} />
        <Route path="strategy" element={<StrategySettings />} />
        <Route path="feedback" element={<FeedbackHistory />} />
      </Route>
    </Routes>
  );
};

export default App;