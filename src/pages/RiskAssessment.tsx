import React, { useState, useEffect } from 'react';
import { Form, Radio, Card, Button, Progress, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Typography } from 'antd';

const { Title } = Typography;

interface Question {
  id: number;
  question: string;
  options: {
    label: string;
    value: string;
    score: number;
  }[];
}

const questions: Question[] = [
  {
    id: 1,
    question: '您的投资经验有多少年？',
    options: [
      { label: '无经验', value: 'none', score: 1 },
      { label: '1-3年', value: 'beginner', score: 2 },
      { label: '3-5年', value: 'intermediate', score: 3 },
      { label: '5年以上', value: 'expert', score: 4 }
    ]
  },
  {
    id: 2,
    question: '您能承受的最大投资损失是多少？',
    options: [
      { label: '不能承受任何损失', value: 'none', score: 1 },
      { label: '本金的10%以内', value: 'low', score: 2 },
      { label: '本金的30%以内', value: 'medium', score: 3 },
      { label: '本金的50%以内', value: 'high', score: 4 }
    ]
  },
  {
    id: 3,
    question: '您的投资目标是什么？',
    options: [
      { label: '保本保守', value: 'conservative', score: 1 },
      { label: '稳健增值', value: 'stable', score: 2 },
      { label: '追求收益', value: 'growth', score: 3 },
      { label: '激进增长', value: 'aggressive', score: 4 }
    ]
  },
  {
    id: 4,
    question: '您的投资期限偏好是？',
    options: [
      { label: '短期（1年以内）', value: 'short', score: 1 },
      { label: '中短期（1-3年）', value: 'medium_short', score: 2 },
      { label: '中长期（3-5年）', value: 'medium_long', score: 3 },
      { label: '长期（5年以上）', value: 'long', score: 4 }
    ]
  },
  {
    id: 5,
    question: '您对金融市场的了解程度？',
    options: [
      { label: '几乎不了解', value: 'none', score: 1 },
      { label: '了解基础知识', value: 'basic', score: 2 },
      { label: '较为了解', value: 'intermediate', score: 3 },
      { label: '非常了解', value: 'expert', score: 4 }
    ]
  }
];

const RiskAssessment: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{[key: number]: string}>({});
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const hasCompletedAssessment = localStorage.getItem('riskAssessment');
    if (hasCompletedAssessment) {
      navigate('/');
    }
  }, [navigate]);

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestion].id]: value
    }));

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      calculateRiskProfile();
    }
  };

  const calculateRiskProfile = () => {
    let totalScore = 0;
    Object.entries(answers).forEach(([questionId, answer]) => {
      const question = questions.find(q => q.id === parseInt(questionId));
      const option = question?.options.find(opt => opt.value === answer);
      if (option) {
        totalScore += option.score;
      }
    });

    const averageScore = totalScore / questions.length;
    let riskProfile = '';
    let recommendedStocks = [];

    if (averageScore <= 1.5) {
      riskProfile = 'conservative';
      recommendedStocks = ['招商银行', '中国移动', '中国平安'];
    } else if (averageScore <= 2.5) {
      riskProfile = 'stable';
      recommendedStocks = ['贵州茅台', '美团', '京东集团'];
    } else if (averageScore <= 3.5) {
      riskProfile = 'growth';
      recommendedStocks = ['阿里巴巴', '腾讯控股', '比亚迪'];
    } else {
      riskProfile = 'aggressive';
      recommendedStocks = ['宁德时代', '比亚迪', '阿里巴巴'];
    }

    localStorage.setItem('riskAssessment', JSON.stringify({
      profile: riskProfile,
      recommendedStocks,
      score: averageScore,
      answers
    }));

    message.success('风险评估完成！');
    navigate('/');
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#f0f2f5'
    }}>
      <Card style={{ width: 600, padding: '20px' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2}>投资风险评估</Title>
          <Progress
            percent={((currentQuestion + 1) / questions.length) * 100}
            style={{ marginBottom: 24 }}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <Title level={4}>{questions[currentQuestion].question}</Title>
        </div>

        <Form form={form}>
          <Form.Item>
            <Radio.Group
              onChange={(e) => handleAnswer(e.target.value)}
              style={{ width: '100%' }}
            >
              {questions[currentQuestion].options.map((option) => (
                <Radio.Button
                  key={option.value}
                  value={option.value}
                  style={{
                    display: 'block',
                    height: '40px',
                    lineHeight: '40px',
                    marginBottom: '10px',
                    width: '100%',
                    textAlign: 'left',
                    paddingLeft: '20px'
                  }}
                >
                  {option.label}
                </Radio.Button>
              ))}
            </Radio.Group>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default RiskAssessment;