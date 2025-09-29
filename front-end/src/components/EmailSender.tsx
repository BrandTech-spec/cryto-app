import React, { useState } from 'react';
import { Send, Mail, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

const EmailSenderForm = () => {
  const [activeTab, setActiveTab] = useState('welcome');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const [welcomeData, setWelcomeData] = useState({
    email: '',
    name: '',
    accountId: ''
  });

  const [depositData, setDepositData] = useState({
    email: '',
    accountId: '',
    amount: '',
    currency: 'USDT',
    transactionHash: ''
  });

  const [withdrawalData, setWithdrawalData] = useState({
    email: '',
    accountId: '',
    amount: '',
    currency: 'USDT',
    traceId: ''
  });

  const API_BASE_URL = 'http://localhost:3000';

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleWelcomeSubmit = async () => {
    if (!validateEmail(welcomeData.email)) {
      showMessage('Please enter a valid email address', 'error');
      return;
    }
    if (!welcomeData.name) {
      showMessage('Please enter the recipient name', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/send_welcome_email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(welcomeData)
      });

      if (response.ok) {
        showMessage('Welcome email sent successfully!', 'success');
        setWelcomeData({ email: '', name: '', accountId: '' });
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      showMessage('Failed to send welcome email. Please try again.', 'error');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDepositSubmit = async () => {
    if (!validateEmail(depositData.email)) {
      showMessage('Please enter a valid email address', 'error');
      return;
    }
    if (!depositData.amount || parseFloat(depositData.amount) <= 0) {
      showMessage('Please enter a valid deposit amount', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/send_deposit_confirmation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(depositData)
      });

      if (response.ok) {
        showMessage('Deposit confirmation email sent successfully!', 'success');
        setDepositData({ email: '', accountId: '', amount: '', currency: 'USDT', transactionHash: '' });
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      showMessage('Failed to send deposit confirmation. Please try again.', 'error');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawalSubmit = async () => {
    if (!validateEmail(withdrawalData.email)) {
      showMessage('Please enter a valid email address', 'error');
      return;
    }
    if (!withdrawalData.amount || parseFloat(withdrawalData.amount) <= 0) {
      showMessage('Please enter a valid withdrawal amount', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/send_withdrawal_confirmation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(withdrawalData)
      });

      if (response.ok) {
        showMessage('Withdrawal confirmation email sent successfully!', 'success');
        setWithdrawalData({ email: '', accountId: '', amount: '', currency: 'USDT', traceId: '' });
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      showMessage('Failed to send withdrawal confirmation. Please try again.', 'error');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'welcome', label: 'Welcome Email', icon: Mail },
    { id: 'deposit', label: 'Deposit Confirmation', icon: CheckCircle },
    { id: 'withdrawal', label: 'Withdrawal Confirmation', icon: AlertCircle }
  ];

  return (
    <div className="min-h-screen bg-transparent py-8 ">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            {/* Logo */}
            <div className="flex flex-col">
              <div className="flex items-end gap-0.5 mb-1">
                <div className="w-2 h-4 bg-green-500 transform -skew-x-12"></div>
                <div className="w-2 h-6 bg-green-500 transform -skew-x-12"></div>
                <div className="w-2 h-8 bg-blue-900 transform -skew-x-12"></div>
              </div>
              <div className="w-8 h-1 bg-green-500"></div>
            </div>
            
            <div>
              <h1 className="text-3xl font-bold text-gray-800">OANDA</h1>
              <p className="text-sm text-gray-600 tracking-wider">EMAIL MANAGEMENT</p>
            </div>
          </div>
          <p className="text-gray-600">Send professional email notifications to your users</p>
        </div>

        {/* Status Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            messageType === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {messageType === 'success' ? 
              <CheckCircle className="w-5 h-5" /> : 
              <AlertCircle className="w-5 h-5" />
            }
            {message}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-transparent rounded-lg shadow-lg overflow-hidden">
          <div className="flex overflow-auto border-b border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-slate-800 border border-border/5 text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-slate-800 hover:border hover:border-border/5'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {/* Welcome Email Form */}
            {activeTab === 'welcome' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Recipient Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={welcomeData.email}
                      onChange={(e) => setWelcomeData({...welcomeData, email: e.target.value})}
                      className="w-full px-4 py-3 border bg-transparent border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="user@example.com"
                      disabled={loading}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={welcomeData.name}
                      onChange={(e) => setWelcomeData({...welcomeData, name: e.target.value})}
                      className="w-full px-4 py-3 border bg-transparent border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="John Doe"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account ID
                  </label>
                  <input
                    type="text"
                    value={welcomeData.accountId}
                    onChange={(e) => setWelcomeData({...welcomeData, accountId: e.target.value})}
                    className="w-full px-4 py-3 border bg-transparent border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="ACC123456 (optional)"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Messages
                  </label>
                  <textarea
                    rows={5}
                    value={welcomeData.accountId}
                    onChange={(e) => setWelcomeData({...welcomeData, accountId: e.target.value})}
                    className="w-full px-4 py-3 border bg-transparent border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Leave your message yes"
                    disabled={loading}
                  />
                </div>

                <button
                  onClick={handleWelcomeSubmit}
                  disabled={loading}
                  className="w-full bg-blue-600  text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Sending Welcome Email...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Welcome Email
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Deposit Email Form */}
            {activeTab === 'deposit' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Recipient Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={depositData.email}
                      onChange={(e) => setDepositData({...depositData, email: e.target.value})}
                      className="w-full px-4 py-3 border bg-transparent border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="user@example.com"
                      disabled={loading}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account ID
                    </label>
                    <input
                      type="text"
                      value={depositData.accountId}
                      onChange={(e) => setDepositData({...depositData, accountId: e.target.value})}
                      className="w-full px-4 py-3 border bg-transparent  border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="user12345"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Deposit Amount *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={depositData.amount}
                      onChange={(e) => setDepositData({...depositData, amount: e.target.value})}
                      className="w-full px-4 py-3 border bg-transparent border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="100.00"
                      disabled={loading}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Currency
                    </label>
                    <select
                      value={depositData.currency}
                      onChange={(e) => setDepositData({...depositData, currency: e.target.value})}
                      className="w-full px-4 py-3 border bg-transparent border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={loading}
                    >
                      <option value="USDT">USDT</option>
                      <option value="USD">USD</option>
                      <option value="BTC">BTC</option>
                      <option value="ETH">ETH</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transaction Hash
                  </label>
                  <input
                    type="text"
                    value={depositData.transactionHash}
                    onChange={(e) => setDepositData({...depositData, transactionHash: e.target.value})}
                    className="w-full px-4 py-3 border bg-transparent border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="bc1qxy2kgdygjrskjhnf0yrf2493p8poifjhx0wlh (optional)"
                    disabled={loading}
                  />
                </div>

                <button
                  onClick={handleDepositSubmit}
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Sending Deposit Confirmation...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Send Deposit Confirmation
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Withdrawal Email Form */}
            {activeTab === 'withdrawal' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Recipient Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={withdrawalData.email}
                      onChange={(e) => setWithdrawalData({...withdrawalData, email: e.target.value})}
                      className="w-full px-4 py-3 border bg-transparent border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="user@example.com"
                      disabled={loading}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account ID
                    </label>
                    <input
                      type="text"
                      value={withdrawalData.accountId}
                      onChange={(e) => setWithdrawalData({...withdrawalData, accountId: e.target.value})}
                      className="w-full px-4 py-3 border bg-transparent border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="user12345"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Withdrawal Amount *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={withdrawalData.amount}
                      onChange={(e) => setWithdrawalData({...withdrawalData, amount: e.target.value})}
                      className="w-full px-4 py-3 border bg-transparent border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="100.00"
                      disabled={loading}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Currency
                    </label>
                    <select
                      value={withdrawalData.currency}
                      onChange={(e) => setWithdrawalData({...withdrawalData, currency: e.target.value})}
                      className="w-full px-4 py-3 border bg-transparent border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={loading}
                    >
                      <option value="USDT">USDT</option>
                      <option value="USD">USD</option>
                      <option value="BTC">BTC</option>
                      <option value="ETH">ETH</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trace ID
                  </label>
                  <input
                    type="text"
                    value={withdrawalData.traceId}
                    onChange={(e) => setWithdrawalData({...withdrawalData, traceId: e.target.value})}
                    className="w-full px-4 py-3 border bg-transparent border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="65255638 (optional)"
                    disabled={loading}
                  />
                </div>

                <button
                  onClick={handleWithdrawalSubmit}
                  disabled={loading}
                  className="w-full bg-orange-600  text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Sending Withdrawal Confirmation...
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5" />
                      Send Withdrawal Confirmation
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Preview Links */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-4">Preview email templates:</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a
              href={`${API_BASE_URL}/preview_welcome`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium underline"
            >
              Welcome Email
            </a>
            <a
              href={`${API_BASE_URL}/preview_deposit`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-800 text-sm font-medium underline"
            >
              Deposit Confirmation
            </a>
            <a
              href={`${API_BASE_URL}/preview_withdrawal`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 hover:text-orange-800 text-sm font-medium underline"
            >
              Withdrawal Confirmation
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailSenderForm;