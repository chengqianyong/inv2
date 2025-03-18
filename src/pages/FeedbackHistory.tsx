import React, { useState, useEffect } from 'react';
import { Table, Card, Tag, DatePicker, Button, Select, Space, Tooltip, Divider, Row, Col, Statistic } from 'antd';
import { SyncOutlined, FilterOutlined, LikeOutlined, DislikeOutlined, QuestionOutlined, LineChartOutlined } from '@ant-design/icons';
import type { RangePickerProps } from 'antd/es/date-picker';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';

// 模拟数据 - 实际应用中应从API获取
const mockFeedbackHistory = [
  { id: 1, stock: '贵州茅台', code: '600519', action: '买入', price: 1800.50, date: '2023-08-15', strategy: '趋势跟踪', feedback: '正向', adjustments: '增加趋势跟踪策略权重', impact: '正面' },
  { id: 2, stock: '腾讯控股', code: '00700', action: '卖出', price: 320.80, date: '2023-08-14', strategy: '反转策略', feedback: '中立', adjustments: '无调整', impact: '中性' },
  { id: 3, stock: '阿里巴巴', code: '09988', action: '买入', price: 85.60, date: '2023-08-13', strategy: '价值投资', feedback: '正向', adjustments: '增加价值投资策略权重', impact: '正面' },
  { id: 4, stock: '比亚迪', code: '002594', action: '卖出', price: 240.30, date: '2023-08-12', strategy: '动量策略', feedback: '负向', adjustments: '降低动量策略权重', impact: '正面' },
  { id: 5, stock: '宁德时代', code: '300750', action: '买入', price: 198.45, date: '2023-08-11', strategy: '均值回归', feedback: '正向', adjustments: '调整均值回归参数', impact: '正面' },
  { id: 6, stock: '招商银行', code: '600036', action: '买入', price: 35.20, date: '2023-08-10', strategy: '价值投资', feedback: '正向', adjustments: '增加价值投资策略权重', impact: '正面' },
  { id: 7, stock: '美团', code: '03690', action: '卖出', price: 125.80, date: '2023-08-09', strategy: '趋势跟踪', feedback: '负向', adjustments: '调整趋势跟踪参数', impact: '正面' },
  { id: 8, stock: '中国平安', code: '601318', action: '买入', price: 48.65, date: '2023-08-08', strategy: '价值投资', feedback: '中立', adjustments: '无调整', impact: '中性' },
];

// 模拟反馈统计数据
const mockFeedbackStats = {
  total: 120,
  positive: 78,
  neutral: 25,
  negative: 17,
  byStrategy: [
    { strategy: '趋势跟踪', positive: 28, neutral: 8, negative: 6 },
    { strategy: '价值投资', positive: 25, neutral: 10, negative: 3 },
    { strategy: '动量策略', positive: 15, neutral: 4, negative: 5 },
    { strategy: '均值回归', positive: 10, neutral: 3, negative: 3 },
  ],
  adjustmentImpact: {
    positive: 85,
    neutral: 10,
    negative: 5,
  }
};

const { RangePicker } = DatePicker;

const FeedbackHistory: React.FC = () => {
  const [feedbackHistory, setFeedbackHistory] = useState(mockFeedbackHistory);
  const [feedbackStats, setFeedbackStats] = useState(mockFeedbackStats);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [feedbackFilter, setFeedbackFilter] = useState<string | null>(null);
  const [strategyFilter, setStrategyFilter] = useState<string | null>(null);
  const [impactFilter, setImpactFilter] = useState<string | null>(null);

  // 模拟获取反馈历史数据
  const fetchFeedbackHistory = () => {
    setLoading(true);
    // 实际应用中，这里应该调用API获取数据
    setTimeout(() => {
      setLoading(false);
      // 这里可以更新数据
    }, 1000);
  };

  // 过滤反馈历史
  const getFilteredFeedbackHistory = () => {
    return feedbackHistory.filter(item => {
      // 日期过滤
      if (dateRange) {
        const itemDate = dayjs(item.date);
        if (itemDate < dateRange[0] || itemDate > dateRange[1]) {
          return false;
        }
      }

      // 反馈类型过滤
      if (feedbackFilter && item.feedback !== feedbackFilter) {
        return false;
      }

      // 策略过滤
      if (strategyFilter && item.strategy !== strategyFilter) {
        return false;
      }

      // 影响过滤
      if (impactFilter && item.impact !== impactFilter) {
        return false;
      }

      return true;
    });
  };

  // 日期范围选择器配置
  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    return current && current > dayjs().endOf('day');
  };

  // 获取反馈分布图表配置
  const getFeedbackDistributionOption = () => {
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

  // 获取策略反馈图表配置
  const getStrategyFeedbackOption = () => {
    const strategies = feedbackStats.byStrategy.map(item => item.strategy);
    const positiveData = feedbackStats.byStrategy.map(item => item.positive);
    const neutralData = feedbackStats.byStrategy.map(item => item.neutral);
    const negativeData = feedbackStats.byStrategy.map(item => item.negative);

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['正向反馈', '中立反馈', '负向反馈']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: strategies
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '正向反馈',
          type: 'bar',
          stack: 'total',
          emphasis: {
            focus: 'series'
          },
          itemStyle: { color: '#52c41a' },
          data: positiveData
        },
        {
          name: '中立反馈',
          type: 'bar',
          stack: 'total',
          emphasis: {
            focus: 'series'
          },
          itemStyle: { color: '#1890ff' },
          data: neutralData
        },
        {
          name: '负向反馈',
          type: 'bar',
          stack: 'total',
          emphasis: {
            focus: 'series'
          },
          itemStyle: { color: '#f5222d' },
          data: negativeData
        }
      ]
    };
  };

  // 获取调整影响图表配置
  const getAdjustmentImpactOption = () => {
    return {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '18',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { value: feedbackStats.adjustmentImpact.positive, name: '正面影响', itemStyle: { color: '#52c41a' } },
            { value: feedbackStats.adjustmentImpact.neutral, name: '中性影响', itemStyle: { color: '#1890ff' } },
            { value: feedbackStats.adjustmentImpact.negative, name: '负面影响', itemStyle: { color: '#f5222d' } }
          ]
        }
      ]
    };
  };

  // 表格列配置
  const columns = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      sorter: (a: any, b: any) => dayjs(a.date).unix() - dayjs(b.date).unix(),
      defaultSortOrder: 'descend' as const,
    },
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
      title: '策略',
      dataIndex: 'strategy',
      key: 'strategy',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: '反馈',
      dataIndex: 'feedback',
      key: 'feedback',
      render: (text: string) => {
        let icon, color;
        if (text === '正向') {
          icon = <LikeOutlined />;
          color = 'success';
        } else if (text === '中立') {
          icon = <QuestionOutlined />;
          color = 'processing';
        } else {
          icon = <DislikeOutlined />;
          color = 'error';
        }
        
        return <Tag color={color} icon={icon}>{text}</Tag>;
      },
    },
    {
      title: '策略调整',
      dataIndex: 'adjustments',
      key: 'adjustments',
      ellipsis: {
        showTitle: false,
      },
      render: (text: string) => (
        <Tooltip placement="topLeft" title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: '调整影响',
      dataIndex: 'impact',
      key: 'impact',
      render: (text: string) => {
        let color;
        if (text === '正面') {
          color = 'success';
        } else if (text === '中性') {
          color = 'processing';
        } else {
          color = 'error';
        }
        
        return <Tag color={color}>{text}</Tag>;
      },
    },
  ];

  // 初始加载数据
  useEffect(() => {
    fetchFeedbackHistory();
  }, []);

  return (
    <div>
      <h2>反馈历史与策略调整</h2>
      <Divider />
      
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总反馈数"
              value={feedbackStats.total}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="正向反馈"
              value={feedbackStats.positive}
              valueStyle={{ color: '#52c41a' }}
              prefix={<LikeOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="中立反馈"
              value={feedbackStats.neutral}
              valueStyle={{ color: '#1890ff' }}
              prefix={<QuestionOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="负向反馈"
              value={feedbackStats.negative}
              valueStyle={{ color: '#f5222d' }}
              prefix={<DislikeOutlined />}
            />
          </Card>
        </Col>
      </Row>
      
      {/* 图表和表格 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card title="反馈分布">
            <ReactECharts option={getFeedbackDistributionOption()} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="策略反馈">
            <ReactECharts option={getStrategyFeedbackOption()} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="调整影响">
            <ReactECharts option={getAdjustmentImpactOption()} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>
      
      <Card
        title="反馈历史记录"
        extra={
          <Button 
            type="primary" 
            icon={<SyncOutlined />} 
            onClick={fetchFeedbackHistory}
            loading={loading}
          >
            刷新数据
          </Button>
        }
      >
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Space size="middle" style={{ marginBottom: 8 }}>
            <span><FilterOutlined /> 筛选：</span>
            <RangePicker 
              disabledDate={disabledDate} 
              onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs] | null)} 
              placeholder={['开始日期', '结束日期']}
            />
            <Select
              placeholder="反馈类型"
              allowClear
              style={{ width: 120 }}
              onChange={value => setFeedbackFilter(value)}
              options={[
                { value: '正向', label: '正向' },
                { value: '中立', label: '中立' },
                { value: '负向', label: '负向' },
              ]}
            />
            <Select
              placeholder="交易策略"
              allowClear
              style={{ width: 120 }}
              onChange={value => setStrategyFilter(value)}
              options={[
                { value: '趋势跟踪', label: '趋势跟踪' },
                { value: '价值投资', label: '价值投资' },
                { value: '动量策略', label: '动量策略' },
                { value: '均值回归', label: '均值回归' },
                { value: '反转策略', label: '反转策略' },
              ]}
            />
            <Select
              placeholder="调整影响"
              allowClear
              style={{ width: 120 }}
              onChange={value => setImpactFilter(value)}
              options={[
                { value: '正面', label: '正面' },
                { value: '中性', label: '中性' },
                { value: '负面', label: '负面' },
              ]}
            />
          </Space>
          <div>
            <span>共 {getFilteredFeedbackHistory().length} 条反馈记录</span>
          </div>
        </div>
        
        <Table 
          columns={columns} 
          dataSource={getFilteredFeedbackHistory()} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
          loading={loading}
        />
      </Card>
    </div>
  );
};

export default FeedbackHistory;