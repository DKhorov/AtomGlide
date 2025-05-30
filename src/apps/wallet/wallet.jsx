import React, { useState, useEffect } from 'react';
import axios from '../../axios';
import { Modal, Button, List, Avatar, Input, Select, Divider, Spin, message } from 'antd';
import { ArrowRightOutlined, HistoryOutlined, WalletOutlined, SwapOutlined } from '@ant-design/icons';
import './Wallet.css';

const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [transferModalVisible, setTransferModalVisible] = useState(false);
  const [transferAmount, setTransferAmount] = useState('');
  const [transferUsername, setTransferUsername] = useState('');
  const [transferDescription, setTransferDescription] = useState('');
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('balance');
  const [isTransferring, setIsTransferring] = useState(false);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      setIsLoading(true);
      const [balanceRes, transactionsRes] = await Promise.all([
        axios.get('/balance'),
        axios.get('/balance/transactions?limit=20')
      ]);
      
      setBalance(balanceRes.data.balance);
      setTransactions(transactionsRes.data);
      setIsLoading(false);
    } catch (err) {
      message.error('Ошибка загрузки данных кошелька');
      setIsLoading(false);
    }
  };

  const fetchUsers = async (search) => {
    try {
      const res = await axios.get('/users');
      setUsers(res.data.filter(user => user._id !== localStorage.getItem('userId')));
    } catch (err) {
      message.error('Ошибка загрузки пользователей');
    }
  };

  const handleTransfer = async () => {
    if (!transferAmount || !transferUsername) {
      message.error('Заполните все поля');
      return;
    }
  
    const amount = parseFloat(transferAmount);
    if (isNaN(amount) ){
      message.error('Введите корректную сумму');
      return;
    }
  
    if (amount <= 0) {
      message.error('Сумма должна быть больше 0');
      return;
    }
  
    try {
      setIsTransferring(true);
      const response = await axios.post('/balance/transfer', {
        amount,
        username: transferUsername,
        description: transferDescription || "Перевод средств",
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // если используется JWT
        },
      });
  
      console.log(response.data); // посмотри ответ сервера
      message.success('Перевод выполнен успешно');
      setTransferModalVisible(false);
      setTransferAmount('');
      setTransferUsername('');
      setTransferDescription('');
      fetchWalletData();
    } catch (err) {
      console.error('Ошибка перевода:', err.response?.data || err.message);
      message.error(err.response?.data?.message || 'Ошибка перевода');
    } finally {
      setIsTransferring(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const formatAmount = (amount) => {
    return amount > 0 ? `+${amount.toFixed(2)}` : amount.toFixed(2);
  };

  const getTransactionColor = (amount) => {
    return amount > 0 ? '#4CAF50' : '#F44336';
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'transfer_in':
        return <ArrowRightOutlined style={{ color: '#4CAF50', transform: 'rotate(180deg)' }} />;
      case 'transfer_out':
        return <ArrowRightOutlined style={{ color: '#F44336' }} />;
      case 'withdrawal':
        return <WalletOutlined style={{ color: '#F44336' }} />;
      default:
        return <WalletOutlined style={{ color: '#4CAF50' }} />;
    }
  };

  return (
    <div className="wallet-container">
      <div className="wallet-header">
        <h2>Кошелек</h2>
        <div className="wallet-balance">
          <span>Ваш баланс:</span>
          <span className="balance-amount">{balance.toFixed(2)}</span>
        </div>
      </div>

      <div className="wallet-actions">
        <Button 
          type="primary" 
          icon={<SwapOutlined />}
          onClick={() => setTransferModalVisible(true)}
        >
          Перевести
        </Button>
        <Button 
          type={activeTab === 'balance' ? 'primary' : 'default'}
          onClick={() => setActiveTab('balance')}
        >
          Баланс
        </Button>
        <Button 
          type={activeTab === 'history' ? 'primary' : 'default'}
          onClick={() => setActiveTab('history')}
        >
          История
        </Button>
      </div>



      <div className="wallet-content">
        {isLoading ? (
          <div className="loading-container">
            <Spin size="large" />
          </div>
        ) : activeTab === 'balance' ? (
           <>
             <div className="balance-section">
            <div className="balance-card">
              <div className="balance-card-header">
                <WalletOutlined style={{ fontSize: '24px', color: '#1890ff'}} />
                <span>Доступные средства</span>
              </div>
              <div className="balance-card-amount">
                {balance.toFixed(2)}
              </div>
              <div className="balance-card-footer">
                <Button type="link" onClick={() => setActiveTab('history')}>
                  Посмотреть историю
                </Button>
              </div>
            </div>
          </div>

           </>
        ) : (
          <div className="history-section">
            <List
              className='cdf'
              itemLayout="horizontal"
              dataSource={transactions}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta

                    title={
                      <div style={{ color: getTransactionColor(item.amount) }}>
                        {formatAmount(item.amount)}
                      </div>
                    }
                    
                    description={
                      <>
                        <div>{item.description}</div>
                        <div style={{ fontSize: '12px', color: '#888' }}>
                          {formatDate(item.createdAt)}
                        </div>
                        {item.relatedUser && (
                          <div style={{ fontSize: '12px' }}>
                            {item.type === 'transfer_out' ? 'Получатель: ' : 'Отправитель: '}
                            {item.relatedUser.fullName}
                          </div>
                        )}
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        )}
      </div>

      <Modal
        title="Перевод средств"
        visible={transferModalVisible}
        onOk={handleTransfer}
        onCancel={() => setTransferModalVisible(false)}
        confirmLoading={isTransferring}
        okText="Перевести"
        cancelText="Отмена"
      >
        <div className="transfer-form">
          <div className="form-group">
            <label>Сумма перевода</label>
            <Input
              type="number"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              placeholder="Введите сумму"
             
            />
          </div>
          <div className="form-group">
            <label>Получатель</label>
            <Select
              showSearch
              value={transferUsername}
              placeholder="Выберите пользователя"
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              onSearch={fetchUsers}
              onChange={(value) => setTransferUsername(value)}
              notFoundContent={null}
            >
              {users.map(user => (
                <Select.Option key={user._id} value={user.username}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar src={user.avatarUrl} style={{ marginRight: '8px' }} />
                    {user.fullName} (@{user.username})
                  </div>
                </Select.Option>
              ))}
            </Select>
          </div>
          <div className="form-group">
            <label>Описание (необязательно)</label>
            <Input.TextArea
              value={transferDescription}
              onChange={(e) => setTransferDescription(e.target.value)}
              placeholder="Назначение платежа"
              rows={2}
            />
          </div>
          <Divider />
          <div className="transfer-summary">
            <div>Комиссия: <span>0.00</span></div>
            <div>Итого к списанию: <span>{transferAmount || '0.00'}</span></div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Wallet;