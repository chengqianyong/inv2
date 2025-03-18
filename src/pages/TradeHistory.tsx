import React, { useState, useEffect } from 'react';
import { Table, Card, Tag, DatePicker, Button, Select, Space, Tooltip, Modal, Radio, message } from 'antd';
import { SyncOutlined, FilterOutlined, LikeOutlined, DislikeOutlined, QuestionOutlined } from '@ant-design/icons';
import type { RangePickerProps } from 'antd/es/date-picker';
import dayjs from 'dayjs';

// 模拟数据 - 实际应用中应从API获取
const mockTradeHistory = [
  { id: 1, stock: '贵州茅台', code: '600519', action: '买入', price: 1800.50, amount: 10, total: 18005.00, date: '2023-08-15 10:30:45', strategy: '趋势跟踪', feedback: '正向', reason: '价格突破前期高点，成交量放大' },
  { id: 2, stock: '腾讯控股', code: '00700', action: '卖出', price: 320.80, amount: 50, total: 16040.00, date: '2023-08-14 14:22:33', strategy: '反转策略', feedback: '中立', reason: '价格接近阻力位，技术指标超买' },
  { id: 3, stock: '阿里巴巴', code: '09988', action: '买入', price: 85.60, amount: 100, total: 8560.00, date: '2023-08-13 09:45:12', strategy: '价值投资', feedback: '正向', reason: '基本面良好，估值处于历史低位' },
  { id: 4, stock: '比亚迪', code: '002594', action: '卖出', price: 240.30, amount: 20, total: 4806.00, date: '2023-08-12 15:10:28', strategy: '动量策略', feedback: '负向', reason: '价格跌破支撑位，成交量萎缩' },
  { id: 5, stock: '宁德时代', code: '300750', action: '买入', price: 198.45, amount: 30, total: 5953.50, date: '2023-08-11 11:05:36', strategy: '均值回归', feedback: '正向', reason: '价格回调至均线支撑位' },
  { id: 6, stock: '招商银行', code: '600036', action: '买入', price: 35.20, amount: 200, total: 7040.00, date: '2023-08-10 13:40:22', strategy: '价值投资', feedback: '正向', reason: '股息率高，估值合理' },
  { id: 7, stock: '美团', code: '03690', action: '卖出', price: 125.80, amount: 40, total: 5032.00, date: '2023-08-09 10:15:48', strategy: '趋势跟踪', feedback: '负向', reason: '价格跌破趋势线，成交量放大' },
  { id: 8, stock: '中国平安', code: '601318', action: '买入', price: 48.65, amount: 100, total: 4865.00, date: '2023-08-08 14:30:55', strategy: '价值投资', feedback: '中立', reason: '基本面稳定，估值处于中位' },
  { id: 9, stock: '京东集团', code: '09618', action: '买入', price: 125.40, amount: 30, total: 3762.00, date: '2023-08-07 09:50:33', strategy: '动量策略', feedback: null, reason: '价格突破阻力位，成交量放大' },
  { id: 10, stock: '中国移动', code: '00941', action: '卖出', price: 65.25, amount: 150, total: 9787.50, date: '2023-08-06 11:25:18', strategy: '均值回归', feedback: null, reason: '价格超过均线上轨' },
];

const { RangePicker } = DatePicker;

const TradeHistory: React.FC = () => {
  const [tradeHistory, setTradeHistory] = useState(mockTradeHistory);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [actionFilter, setActionFilter] = useState<string | null>(null);
  const [strategyFilter, setStrategyFilter] = useState<string | null>(null);
  const [feedbackFilter, setFeedbackFilter] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentTrade, setCurrentTrade] = useState<any>(null);
  const [feedbackValue, setFeedbackValue] = useState<string | null>(null);

  // 模拟获取交易历史数据
  const fetchTradeHistory = () => {
    setLoading(true);
    // 实际应用中，这里应该调用API获取数据
    setTimeout(() => {
      setLoading(false);
      message.success('交易历史数据已更新');
    }, 1000);
  };

  // 过滤交易历史
  const getFilteredTradeHistory = () => {
    return tradeHistory.filter(trade => {
      // 日期过滤
      if (dateRange) {
        const tradeDate = dayjs(trade.date);
        if (tradeDate < dateRange[0] || tradeDate > dateRange[1]) {
          return false;
        }
      }

      // 操作类型过滤
      if (actionFilter && trade.action !== actionFilter) {
        return false;
      }

      // 策略过滤
      if (strategyFilter && trade.strategy !== strategyFilter) {
        return false;
      }

      // 反馈过滤
      if (feedbackFilter) {
        if (feedbackFilter === 'none' && trade.feedback !== null) {
          return false;
        } else if (feedbackFilter !== 'none' && trade.feedback !== feedbackFilter) {
          return false;
        }
      }

      return true;
    });
  };

  // 打开反馈模态框
  const openFeedbackModal = (trade: any) => {
    setCurrentTrade(trade);
    setFeedbackValue(trade.feedback);
    setIsModalVisible(true);
  };

  // 保存反馈
  const handleSaveFeedback = () => {
    const updatedTradeHistory = tradeHistory.map(trade => {
      if (trade.id === currentTrade.id) {
        return {
          ...trade,
          feedback: feedbackValue
        };
      }
      return trade;
    });
    
    setTradeHistory(updatedTradeHistory);
    setIsModalVisible(false);
    message.success('反馈已提交，系统将根据您的反馈优化交易策略');
  };

  // 日期范围选择器配置
  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    return current && current > dayjs().endOf('day');
  };

  // 表格列配置
  const columns = [
    {
      title: '日期时间',
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
      title: '数量',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: '总额',
      dataIndex: 'total',
      key: 'total',
      render: (text: number) => `¥${text.toFixed(2)}`,
    },
    {
      title: '策略',
      dataIndex: 'strategy',
      key: 'strategy',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: '交易理由',
      dataIndex: 'reason',
      key: 'reason',
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
      title: '反馈',
      dataIndex: 'feedback',
      key: 'feedback',
      render: (text: string | null, record: any) => {
        if (text === null) {
          return (
            <Button 
              type="link" 
              onClick={() => openFeedbackModal(record)}
              icon={<QuestionOutlined />}
            >
              提交反馈
            </Button>
          );
        }
        
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
        
        return (
          <Button 
            type="link" 
            onClick={() => openFeedbackModal(record)}
          >
            <Tag color={color} icon={icon}>{text}</Tag>
          </Button>
        );
      },
    },
  ];

  // 初始加载数据
  useEffect(() => {
    fetchTradeHistory();
  }, []);

  return (
    <div>
      <Card
        title="交易历史"
        extra={
          <Button 
            type="primary" 
            icon={<SyncOutlined />} 
            onClick={fetchTradeHistory}
            loading={loading}
          >
            刷新数据
          </Button>
        }
      >
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <RangePicker 
              style={{ marginRight: 16 }}
              onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])} 
              disabledDate={disabledDate}
            />
            <Select
              style={{ width: 120, marginRight: 16 }}
              placeholder="操作类型"
              allowClear
              onChange={setActionFilter}
            >
              <Select.Option value="买入">买入</Select.Option>
              <Select.Option value="卖出">卖出</Select.Option>
            </Select>
            <Select
              style={{ width: 120, marginRight: 16 }}
              placeholder="交易策略"
              allowClear
              onChange={setStrategyFilter}
            >
              <Select.Option value="趋势跟踪">趋势跟踪</Select.Option>
              <Select.Option value="反转策略">反转策略</Select.Option>
              <Select.Option value="价值投资">价值投资</Select.Option>
              <Select.Option value="动量策略">动量策略</Select.Option>
              <Select.Option value="均值回归">均值回归</Select.Option>
            </Select>
            <Select
              style={{ width: 120 }}
              placeholder="反馈状态"
              allowClear
              onChange={setFeedbackFilter}
            >
              <Select.Option value="正向">正向反馈</Select.Option>
              <Select.Option value="中立">中立反馈</Select.Option>
              <Select.Option value="负向">负向反馈</Select.Option>
              <Select.Option value="none">未反馈</Select.Option>
            </Select>
          </div>
        </div>

        <Table 
          columns={columns} 
          dataSource={getFilteredTradeHistory()} 
          rowKey="id"
          loading={loading}
        />
      </Card>

      <Modal
        title="交易反馈"
        open={isModalVisible}
        onOk={handleSaveFeedback}
        onCancel={() => setIsModalVisible(false)}
      >
        <p>请对此次交易进行评价：</p>
        <Radio.Group value={feedbackValue} onChange={e => setFeedbackValue(e.target.value)}>
          <Space direction="vertical">
            <Radio value="正向">
              <Tag color="success" icon={<LikeOutlined />}>正向反馈</Tag>
              <span style={{ marginLeft: 8 }}>交易决策正确，获得预期收益</span>
            </Radio>
            <Radio value="中立">
              <Tag color="processing" icon={<QuestionOutlined />}>中立反馈</Tag>
              <span style={{ marginLeft: 8 }}>交易结果符合预期，但仍有改进空间</span>
            </Radio>
            <Radio value="负向">
              <Tag color="error" icon={<DislikeOutlined />}>负向反馈</Tag>
              <span style={{ marginLeft: 8 }}>交易决策有误，需要调整策略</span>
            </Radio>
          </Space>
        </Radio.Group>
      </Modal>
    </div>
  );
};

export default TradeHistory;