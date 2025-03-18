import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Tag, Input, Select, Modal, Form, InputNumber, Radio, message, Tooltip } from 'antd';
import { SearchOutlined, SyncOutlined, RiseOutlined, FallOutlined, LineChartOutlined, RobotOutlined } from '@ant-design/icons';

// 模拟数据 - 实际应用中应从API获取
const mockStocks = [
  { id: 1, name: '贵州茅台', code: '600519', price: 1802.50, change: 2.35, volume: 1245678, pe: 32.5, marketCap: 22650.8, autoTrading: true, strategy: '趋势跟踪' },
  { id: 2, name: '腾讯控股', code: '00700', price: 321.60, change: -1.25, volume: 3456789, pe: 28.7, marketCap: 30789.2, autoTrading: true, strategy: '价值投资' },
  { id: 3, name: '阿里巴巴', code: '09988', price: 86.30, change: 0.85, volume: 5678901, pe: 18.9, marketCap: 18456.3, autoTrading: false, strategy: '无' },
  { id: 4, name: '比亚迪', code: '002594', price: 241.80, change: 3.45, volume: 2345678, pe: 42.3, marketCap: 7023.5, autoTrading: true, strategy: '动量策略' },
  { id: 5, name: '宁德时代', code: '300750', price: 198.45, change: -2.10, volume: 1987654, pe: 35.8, marketCap: 4632.1, autoTrading: false, strategy: '无' },
  { id: 6, name: '招商银行', code: '600036', price: 35.20, change: 0.45, volume: 3214567, pe: 8.2, marketCap: 8912.4, autoTrading: true, strategy: '价值投资' },
  { id: 7, name: '美团', code: '03690', price: 125.80, change: 1.75, volume: 2876543, pe: 45.6, marketCap: 7689.3, autoTrading: false, strategy: '无' },
  { id: 8, name: '中国平安', code: '601318', price: 48.65, change: -0.35, volume: 4321098, pe: 9.8, marketCap: 8901.2, autoTrading: true, strategy: '价值投资' },
];

// 可用的交易策略
const tradingStrategies = [
  { value: 'trend_following', label: '趋势跟踪' },
  { value: 'value_investing', label: '价值投资' },
  { value: 'momentum', label: '动量策略' },
  { value: 'mean_reversion', label: '均值回归' },
  { value: 'breakout', label: '突破策略' },
];

const StockList: React.FC = () => {
  const [stocks, setStocks] = useState(mockStocks);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentStock, setCurrentStock] = useState<any>(null);
  const [form] = Form.useForm();

  // 模拟获取股票数据
  const fetchStocks = () => {
    setLoading(true);
    // 实际应用中，这里应该调用API获取数据
    setTimeout(() => {
      setLoading(false);
      // 模拟数据更新 - 随机更改价格和涨跌幅
      const updatedStocks = stocks.map(stock => ({
        ...stock,
        price: parseFloat((stock.price + (Math.random() * 2 - 1)).toFixed(2)),
        change: parseFloat((Math.random() * 4 - 2).toFixed(2))
      }));
      setStocks(updatedStocks);
      message.success('股票数据已更新');
    }, 1000);
  };

  // 过滤股票列表
  const getFilteredStocks = () => {
    return stocks.filter(stock => {
      const matchesSearch = 
        stock.name.toLowerCase().includes(searchText.toLowerCase()) ||
        stock.code.toLowerCase().includes(searchText.toLowerCase());
      
      if (filterType === 'all') return matchesSearch;
      if (filterType === 'auto') return matchesSearch && stock.autoTrading;
      if (filterType === 'manual') return matchesSearch && !stock.autoTrading;
      if (filterType === 'rising') return matchesSearch && stock.change > 0;
      if (filterType === 'falling') return matchesSearch && stock.change < 0;
      
      return matchesSearch;
    });
  };

  // 打开自动交易设置模态框
  const openStrategyModal = (stock: any) => {
    setCurrentStock(stock);
    form.setFieldsValue({
      autoTrading: stock.autoTrading,
      strategy: stock.strategy !== '无' ? stock.strategy : undefined,
    });
    setIsModalVisible(true);
  };

  // 保存自动交易设置
  const handleSaveStrategy = () => {
    form.validateFields().then(values => {
      const updatedStocks = stocks.map(stock => {
        if (stock.id === currentStock.id) {
          return {
            ...stock,
            autoTrading: values.autoTrading,
            strategy: values.autoTrading ? values.strategy : '无'
          };
        }
        return stock;
      });
      
      setStocks(updatedStocks);
      setIsModalVisible(false);
      message.success(`${currentStock.name} 的自动交易设置已更新`);
    });
  };

  // 表格列配置
  const columns = [
    {
      title: '股票名称',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
    },
    {
      title: '代码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '当前价格',
      dataIndex: 'price',
      key: 'price',
      render: (text: number) => `¥${text.toFixed(2)}`,
      sorter: (a: any, b: any) => a.price - b.price,
    },
    {
      title: '涨跌幅',
      dataIndex: 'change',
      key: 'change',
      render: (text: number) => (
        <span style={{ color: text > 0 ? '#52c41a' : text < 0 ? '#f5222d' : 'inherit' }}>
          {text > 0 ? <RiseOutlined /> : text < 0 ? <FallOutlined /> : null}
          {text > 0 ? '+' : ''}{text.toFixed(2)}%
        </span>
      ),
      sorter: (a: any, b: any) => a.change - b.change,
    },
    {
      title: '成交量',
      dataIndex: 'volume',
      key: 'volume',
      render: (text: number) => `${(text / 10000).toFixed(2)}万`,
      sorter: (a: any, b: any) => a.volume - b.volume,
    },
    {
      title: '市值(亿)',
      dataIndex: 'marketCap',
      key: 'marketCap',
      render: (text: number) => `${text.toFixed(1)}`,
      sorter: (a: any, b: any) => a.marketCap - b.marketCap,
    },
    {
      title: '自动交易',
      dataIndex: 'autoTrading',
      key: 'autoTrading',
      render: (text: boolean, record: any) => (
        <Tag color={text ? '#87d068' : '#d9d9d9'}>
          {text ? '已启用' : '未启用'}
        </Tag>
      ),
      filters: [
        { text: '已启用', value: true },
        { text: '未启用', value: false },
      ],
      onFilter: (value: any, record: any) => record.autoTrading === value,
    },
    {
      title: '交易策略',
      dataIndex: 'strategy',
      key: 'strategy',
      render: (text: string) => (
        text !== '无' ? (
          <Tag color="blue">{text}</Tag>
        ) : (
          <Tag color="#d9d9d9">无</Tag>
        )
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <span>
          <Tooltip title="查看详情">
            <Button 
              type="text" 
              icon={<LineChartOutlined />} 
              style={{ marginRight: 8 }}
              onClick={() => message.info(`查看 ${record.name} 详情`)}
            />
          </Tooltip>
          <Tooltip title="自动交易设置">
            <Button 
              type="text" 
              icon={<RobotOutlined />} 
              onClick={() => openStrategyModal(record)}
            />
          </Tooltip>
        </span>
      ),
    },
  ];

  // 初始加载数据
  useEffect(() => {
    fetchStocks();
    // 实际应用中，可以设置定时刷新
    const interval = setInterval(fetchStocks, 60000); // 每分钟刷新一次
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Card
        title="股票列表"
        extra={
          <Button 
            type="primary" 
            icon={<SyncOutlined />} 
            onClick={fetchStocks}
            loading={loading}
          >
            刷新数据
          </Button>
        }
      >
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <Input
              placeholder="搜索股票名称或代码"
              prefix={<SearchOutlined />}
              style={{ width: 250, marginRight: 16 }}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
            <Select
              defaultValue="all"
              style={{ width: 150 }}
              onChange={value => setFilterType(value)}
              options={[
                { value: 'all', label: '全部股票' },
                { value: 'auto', label: '自动交易' },
                { value: 'manual', label: '手动交易' },
                { value: 'rising', label: '上涨股票' },
                { value: 'falling', label: '下跌股票' },
              ]}
            />
          </div>
          <div>
            <span style={{ marginRight: 8 }}>共 {getFilteredStocks().length} 只股票</span>
          </div>
        </div>
        
        <Table 
          columns={columns} 
          dataSource={getFilteredStocks()} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
          loading={loading}
        />
      </Card>

      {/* 自动交易策略设置模态框 */}
      <Modal
        title={`${currentStock?.name} - 自动交易设置`}
        open={isModalVisible}
        onOk={handleSaveStrategy}
        onCancel={() => setIsModalVisible(false)}
        okText="保存"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="autoTrading"
            label="是否启用自动交易"
            rules={[{ required: true, message: '请选择是否启用自动交易' }]}
          >
            <Radio.Group>
              <Radio value={true}>启用</Radio>
              <Radio value={false}>不启用</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.autoTrading !== currentValues.autoTrading}
          >
            {({ getFieldValue }) => (
              getFieldValue('autoTrading') ? (
                <Form.Item
                  name="strategy"
                  label="选择交易策略"
                  rules={[{ required: true, message: '请选择交易策略' }]}
                >
                  <Select
                    placeholder="请选择交易策略"
                    options={[
                      { value: '趋势跟踪', label: '趋势跟踪 - 追踪价格趋势方向' },
                      { value: '价值投资', label: '价值投资 - 基于基本面分析' },
                      { value: '动量策略', label: '动量策略 - 追踪价格变化速度' },
                      { value: '均值回归', label: '均值回归 - 预期价格回归均值' },
                      { value: '突破策略', label: '突破策略 - 突破关键价位' },
                    ]}
                  />
                </Form.Item>
              ) : null
            )}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StockList;