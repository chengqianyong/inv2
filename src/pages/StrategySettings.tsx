import React, { useState } from 'react';
import { Card, Form, Input, InputNumber, Select, Switch, Button, Row, Col, message, Space, Divider } from 'antd';
import { SaveOutlined, SyncOutlined } from '@ant-design/icons';

// 模拟策略数据
const mockStrategies = [
  { id: 1, name: '趋势跟踪策略', description: '基于价格趋势的交易策略', enabled: true },
  { id: 2, name: '反转策略', description: '基于价格反转信号的交易策略', enabled: false },
  { id: 3, name: '价值投资策略', description: '基于基本面分析的交易策略', enabled: true },
  { id: 4, name: '动量策略', description: '基于价格动量的交易策略', enabled: false },
  { id: 5, name: '均值回归策略', description: '基于价格回归均值的交易策略', enabled: true },
];

const StrategySettings: React.FC = () => {
  const [strategies, setStrategies] = useState(mockStrategies);
  const [currentStrategy, setCurrentStrategy] = useState<any>(mockStrategies[0]);
  const [form] = Form.useForm();

  // 切换策略
  const handleStrategyChange = (strategyId: number) => {
    const strategy = strategies.find(s => s.id === strategyId);
    if (strategy) {
      setCurrentStrategy(strategy);
      form.resetFields();
    }
  };

  // 启用/禁用策略
  const handleToggleStrategy = (strategyId: number, enabled: boolean) => {
    const updatedStrategies = strategies.map(strategy => {
      if (strategy.id === strategyId) {
        return { ...strategy, enabled };
      }
      return strategy;
    });
    setStrategies(updatedStrategies);
    if (currentStrategy.id === strategyId) {
      setCurrentStrategy({ ...currentStrategy, enabled });
    }
    message.success(`${enabled ? '启用' : '禁用'}策略成功`);
  };

  // 保存策略设置
  const handleSaveStrategy = () => {
    form.validateFields().then(values => {
      message.success('策略设置已保存');
    }).catch(error => {
      message.error('请检查表单填写是否正确');
    });
  };

  const renderStrategyForm = () => {
    switch (currentStrategy.id) {
      case 1: // 趋势跟踪策略
        return (
          <>
            <Divider orientation="left">基本参数</Divider>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="timeframe"
                  label="时间周期"
                  rules={[{ required: true, message: '请选择时间周期' }]}
                >
                  <Select
                    options={[
                      { value: '1min', label: '1分钟' },
                      { value: '5min', label: '5分钟' },
                      { value: '15min', label: '15分钟' },
                      { value: '30min', label: '30分钟' },
                      { value: 'hourly', label: '1小时' },
                      { value: 'daily', label: '日线' },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="ma_period"
                  label="均线周期"
                  rules={[{ required: true, message: '请输入均线周期' }]}
                >
                  <InputNumber min={1} max={200} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="ma_type"
                  label="均线类型"
                  rules={[{ required: true, message: '请选择均线类型' }]}
                >
                  <Select
                    options={[
                      { value: 'sma', label: '简单移动平均' },
                      { value: 'ema', label: '指数移动平均' },
                      { value: 'wma', label: '加权移动平均' },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left">高级参数</Divider>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="trend_strength"
                  label="趋势强度阈值"
                  rules={[{ required: true, message: '请设置趋势强度阈值' }]}
                >
                  <InputNumber min={0} max={100} step={1} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="volume_filter"
                  label="成交量过滤"
                  rules={[{ required: true, message: '请设置成交量过滤' }]}
                >
                  <InputNumber min={1} max={10} step={0.1} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="signal_confirmation"
                  label="信号确认周期"
                  rules={[{ required: true, message: '请设置信号确认周期' }]}
                >
                  <InputNumber min={1} max={10} />
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left">风险控制</Divider>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="stop_loss"
                  label="止损比例"
                  rules={[{ required: true, message: '请设置止损比例' }]}
                >
                  <InputNumber min={0.01} max={0.1} step={0.01} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="take_profit"
                  label="止盈比例"
                  rules={[{ required: true, message: '请设置止盈比例' }]}
                >
                  <InputNumber min={0.02} max={0.5} step={0.01} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="position_size"
                  label="仓位比例"
                  rules={[{ required: true, message: '请设置仓位比例' }]}
                >
                  <InputNumber min={0.1} max={1} step={0.1} />
                </Form.Item>
              </Col>
            </Row>
          </>
        );
      case 2: // 反转策略
        return (
          <>
            <Divider orientation="left">基本参数</Divider>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="timeframe"
                  label="时间周期"
                  rules={[{ required: true, message: '请选择时间周期' }]}
                >
                  <Select
                    options={[
                      { value: '5min', label: '5分钟' },
                      { value: '15min', label: '15分钟' },
                      { value: '30min', label: '30分钟' },
                      { value: 'hourly', label: '1小时' },
                      { value: 'daily', label: '日线' },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="rsi_period"
                  label="RSI周期"
                  rules={[{ required: true, message: '请输入RSI周期' }]}
                >
                  <InputNumber min={5} max={50} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="rsi_overbought"
                  label="RSI超买阈值"
                  rules={[{ required: true, message: '请设置RSI超买阈值' }]}
                >
                  <InputNumber min={50} max={90} />
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left">高级参数</Divider>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="rsi_oversold"
                  label="RSI超卖阈值"
                  rules={[{ required: true, message: '请设置RSI超卖阈值' }]}
                >
                  <InputNumber min={10} max={50} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="volume_threshold"
                  label="成交量阈值"
                  rules={[{ required: true, message: '请设置成交量阈值' }]}
                >
                  <InputNumber min={1} max={10} step={0.1} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="price_change_threshold"
                  label="价格变化阈值"
                  rules={[{ required: true, message: '请设置价格变化阈值' }]}
                >
                  <InputNumber min={0.01} max={0.1} step={0.01} />
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left">风险控制</Divider>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="stop_loss"
                  label="止损比例"
                  rules={[{ required: true, message: '请设置止损比例' }]}
                >
                  <InputNumber min={0.01} max={0.1} step={0.01} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="take_profit"
                  label="止盈比例"
                  rules={[{ required: true, message: '请设置止盈比例' }]}
                >
                  <InputNumber min={0.02} max={0.5} step={0.01} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="max_position_size"
                  label="最大仓位比例"
                  rules={[{ required: true, message: '请设置最大仓位比例' }]}
                >
                  <InputNumber min={0.1} max={1} step={0.1} />
                </Form.Item>
              </Col>
            </Row>
          </>
        );
      case 3: // 价值投资策略
        return (
          <>
            <Divider orientation="left">基本面指标</Divider>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="pe_ratio"
                  label="市盈率阈值"
                  rules={[{ required: true, message: '请设置市盈率阈值' }]}
                >
                  <InputNumber min={1} max={100} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="pb_ratio"
                  label="市净率阈值"
                  rules={[{ required: true, message: '请设置市净率阈值' }]}
                >
                  <InputNumber min={0.1} max={10} step={0.1} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="roe"
                  label="净资产收益率阈值"
                  rules={[{ required: true, message: '请设置ROE阈值' }]}
                >
                  <InputNumber min={1} max={50} step={1} />
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left">估值指标</Divider>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="dividend_yield"
                  label="股息率阈值"
                  rules={[{ required: true, message: '请设置股息率阈值' }]}
                >
                  <InputNumber min={0} max={20} step={0.1} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="debt_ratio"
                  label="资产负债率阈值"
                  rules={[{ required: true, message: '请设置资产负债率阈值' }]}
                >
                  <InputNumber min={0} max={100} step={1} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="profit_growth"
                  label="利润增长率阈值"
                  rules={[{ required: true, message: '请设置利润增长率阈值' }]}
                >
                  <InputNumber min={-50} max={100} step={1} />
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left">风险控制</Divider>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="stop_loss"
                  label="止损比例"
                  rules={[{ required: true, message: '请设置止损比例' }]}
                >
                  <InputNumber min={0.01} max={0.1} step={0.01} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="position_limit"
                  label="单只股票持仓比例"
                  rules={[{ required: true, message: '请设置单只股票持仓比例' }]}
                >
                  <InputNumber min={0.01} max={0.5} step={0.01} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="holding_period"
                  label="最短持有期（天）"
                  rules={[{ required: true, message: '请设置最短持有期' }]}
                >
                  <InputNumber min={1} max={365} step={1} />
                </Form.Item>
              </Col>
            </Row>
          </>
        );
      case 4: // 动量策略
        return (
          <>
            <Divider orientation="left">基本参数</Divider>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="timeframe"
                  label="时间周期"
                  rules={[{ required: true, message: '请选择时间周期' }]}
                >
                  <Select
                    options={[
                      { value: '5min', label: '5分钟' },
                      { value: '15min', label: '15分钟' },
                      { value: '30min', label: '30分钟' },
                      { value: 'hourly', label: '1小时' },
                      { value: 'daily', label: '日线' },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="momentum_period"
                  label="动量周期"
                  rules={[{ required: true, message: '请输入动量周期' }]}
                >
                  <InputNumber min={5} max={50} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="momentum_threshold"
                  label="动量阈值"
                  rules={[{ required: true, message: '请设置动量阈值' }]}
                >
                  <InputNumber min={0} max={100} step={1} />
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left">趋势确认</Divider>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="macd_fast"
                  label="MACD快线周期"
                  rules={[{ required: true, message: '请设置MACD快线周期' }]}
                >
                  <InputNumber min={5} max={20} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="macd_slow"
                  label="MACD慢线周期"
                  rules={[{ required: true, message: '请设置MACD慢线周期' }]}
                >
                  <InputNumber min={10} max={40} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="macd_signal"
                  label="MACD信号周期"
                  rules={[{ required: true, message: '请设置MACD信号周期' }]}
                >
                  <InputNumber min={5} max={15} />
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left">风险控制</Divider>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="stop_loss"
                  label="止损比例"
                  rules={[{ required: true, message: '请设置止损比例' }]}
                >
                  <InputNumber min={0.01} max={0.1} step={0.01} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="profit_target"
                  label="目标收益率"
                  rules={[{ required: true, message: '请设置目标收益率' }]}
                >
                  <InputNumber min={0.02} max={0.5} step={0.01} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="position_sizing"
                  label="仓位计算系数"
                  rules={[{ required: true, message: '请设置仓位计算系数' }]}
                >
                  <InputNumber min={0.1} max={2} step={0.1} />
                </Form.Item>
              </Col>
            </Row>
          </>
        );
      case 5: // 均值回归策略
        return (
          <>
            <Divider orientation="left">均值计算</Divider>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="timeframe"
                  label="时间周期"
                  rules={[{ required: true, message: '请选择时间周期' }]}
                >
                  <Select
                    options={[
                      { value: '5min', label: '5分钟' },
                      { value: '15min', label: '15分钟' },
                      { value: '30min', label: '30分钟' },
                      { value: 'hourly', label: '1小时' },
                      { value: 'daily', label: '日线' },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="mean_period"
                  label="均值周期"
                  rules={[{ required: true, message: '请输入均值周期' }]}
                >
                  <InputNumber min={5} max={100} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="std_multiplier"
                  label="标准差倍数"
                  rules={[{ required: true, message: '请设置标准差倍数' }]}
                >
                  <InputNumber min={0.5} max={3} step={0.1} />
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left">回归信号</Divider>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="entry_threshold"
                  label="入场阈值"
                  rules={[{ required: true, message: '请设置入场阈值' }]}
                >
                  <InputNumber min={0.01} max={0.1} step={0.01} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="exit_threshold"
                  label="出场阈值"
                  rules={[{ required: true, message: '请设置出场阈值' }]}
                >
                  <InputNumber min={0.01} max={0.1} step={0.01} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="confirmation_period"
                  label="确认周期"
                  rules={[{ required: true, message: '请设置确认周期' }]}
                >
                  <InputNumber min={1} max={10} />
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left">风险控制</Divider>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="stop_loss"
                  label="止损比例"
                  rules={[{ required: true, message: '请设置止损比例' }]}
                >
                  <InputNumber min={0.01} max={0.1} step={0.01} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="max_holding_time"
                  label="最大持仓时间(小时)"
                  rules={[{ required: true, message: '请设置最大持仓时间' }]}
                >
                  <InputNumber min={1} max={72} step={1} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="position_ratio"
                  label="仓位比例"
                  rules={[{ required: true, message: '请设置仓位比例' }]}
                >
                  <InputNumber min={0.1} max={1} step={0.1} />
                </Form.Item>
              </Col>
            </Row>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title="策略设置"
        extra={
          <Space>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSaveStrategy}
            >
              保存设置
            </Button>
          </Space>
        }
      >
        <Row gutter={[16, 16]}>
          {strategies.map(strategy => (
            <Col span={8} key={strategy.id}>
              <Card
                size="small"
                title={strategy.name}
                extra={
                  <Switch
                    checked={strategy.enabled}
                    onChange={(checked) => handleToggleStrategy(strategy.id, checked)}
                  />
                }
                onClick={() => handleStrategyChange(strategy.id)}
                style={{ cursor: 'pointer' }}
              >
                <p>{strategy.description}</p>
              </Card>
            </Col>
          ))}
        </Row>

        <Divider />

        <Form
          form={form}
          layout="vertical"
          disabled={!currentStrategy.enabled}
        >
          {renderStrategyForm()}
        </Form>
      </Card>
    </div>
  );
};

export default StrategySettings;