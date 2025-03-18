import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Tag, Divider } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, LineChartOutlined, DollarOutlined, RiseOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';

// 模拟数据 - 实际应用中应从API获取
const mockPerformanceData = [
  { date: '2023-01', return: 5.2 },
  { date: '2023-02', return: -2.1 },
  { date: '2023-03', return: 3.4 },
  { date: '2023-04', return: 1.8 },
  { date: '2023-05', return: 4.5 },
  { date: '2023-06', return: -1.2 },
  { date: '2023-07', return: 6.7 },
  { date: '2023-08', return: 2.3 },
];

const mockRecentTrades = [
  { id: 1, stock: '贵州茅台', code: '600519', action: '买入', price: 1800.50, amount: 10, date: '2023-08-15', strategy: '趋势跟踪', feedback: '正向' },
  { id: 2, stock: '腾讯控股', code: '00700', action: '卖出', price: 320.80, amount: 50, date: '2023-08-14', strategy: '反转策略', feedback: '中立' },
  { id: 3, stock: '阿里巴巴', code: '09988', action: '买入', price: 85.60, amount: 100, date: '2023-08-13', strategy: '价值投资', feedback: '正向' },
  { id: 4, stock: '比亚迪', code: '002594', action: '卖出', price: 240.30, amount: 20, date: '2023-08-12', strategy: '动量策略', feedback: '负向' },
];

const mockFeedbackStats = {
  positive: 65,
  neutral: 25,
  negative: 10,
};

const Dashboard: React.FC = () => {
  const [performanceData, setPerformanceData] = useState(mockPerformanceData);
  const [recentTrades, setRecentTrades] = useState(mockRecentTrades);
  const [feedbackStats, setFeedbackStats] = useState(mockFeedbackStats);
  const [totalProfit, setTotalProfit] = useState(12580.50);
  const [monthlyReturn, setMonthlyReturn] = useState(3.8);
  const [winRate, setWinRate] = useState(68);

  // 图表配置
  const getPerformanceOption = () => {
    return {
      tooltip: {
        trigger: 'axis',
        formatter: '{b}: {c}%'
      },
      xAxis: {
        type: 'category',
        data: performanceData.map(item => item.date),
        axisLabel: {
          rotate: 45
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value}%'
        }
      },
      series: [
        {
          data: performanceData.map(item => item.return),
          type: 'line',
          smooth: true,
          lineStyle: {
            width: 3,
            color: '#1890ff'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(24,144,255,0.3)'
                },
                {
                  offset: 1,
                  color: 'rgba(24,144,255,0.1)'
                }
              ]
            }
          }
        }
      ]
    };
  };

  const getFeedbackOption = () => {
    return {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: ['正向反馈', '中立反馈', '负向反馈']
      },
      series: [
        {
          type: 'pie',
          radius: '70%',
          center: ['50%', '50%'],
          data: [
            { value: feedbackStats.positive, name: '正向反馈', itemStyle: { color: '#52c41a' } },
            { value: feedbackStats.neutral, name: '中立反馈', itemStyle: { color: '#1890ff' } },
            { value: feedbackStats.negative, name: '负向反馈', itemStyle: { color: '#f5222d' } }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  };

  // 表格列配置
  const columns = [
    {
      title: '股票名称',
      dataIndex: 'stock',
      key: 'stock',
    },
    {
      title: '代码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (text: string) => (
        <Tag color={text === '买入' ? '#87d068' : '#f50'}>{text}</Tag>
      ),
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      render: (text: number) => `¥${text.toFixed(2)}`,
    },
    {
      title: '数量',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: '策略',
      dataIndex: 'strategy',
      key: 'strategy',
    },
    {
      title: '反馈',
      dataIndex: 'feedback',
      key: 'feedback',
      render: (text: string) => {
        let color = '';
        if (text === '正向') {
          color = 'success';
        } else if (text === '中立') {
          color = 'processing';
        } else {
          color = 'error';
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
  ];

  // 模拟API调用获取数据
  useEffect(() => {
    // 实际应用中，这里应该调用API获取数据
    // 例如：
    // const fetchData = async () => {
    //   const performanceResponse = await fetch('/api/performance');
    //   const performanceData = await performanceResponse.json();
    //   setPerformanceData(performanceData);
    //   ...
    // };
    // fetchData();
  }, []);

  return (
    <div>
      <h2>交易系统仪表盘</h2>
      <Divider />
      
      {/* 统计卡片 */}
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="总收益"
              value={totalProfit}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix={<DollarOutlined />}
              suffix="元"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="月收益率"
              value={monthlyReturn}
              precision={1}
              valueStyle={{ color: monthlyReturn >= 0 ? '#3f8600' : '#cf1322' }}
              prefix={monthlyReturn >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="胜率"
              value={winRate}
              precision={0}
              valueStyle={{ color: '#1890ff' }}
              prefix={<RiseOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      <Divider />      

      {/* 图表区域 */}
      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={16}>
          <Card title="策略表现" extra={<LineChartOutlined />}>
            <ReactECharts option={getPerformanceOption()} style={{ height: 350 }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="用户反馈统计">
            <ReactECharts option={getFeedbackOption()} style={{ height: 350 }} />
          </Card>
        </Col>
      </Row>

      <Divider />      

      {/* 最近交易 */}
      <Card title="最近交易" style={{ marginTop: 24 }}>
        <Table 
          columns={columns} 
          dataSource={recentTrades} 
          rowKey="id" 
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default Dashboard;