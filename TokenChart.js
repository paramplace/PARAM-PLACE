import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../../context/Web3Context';
import { ethers } from 'ethers';

const TokenExchange = () => {
  const { signer, account } = useWeb3();
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [fromToken, setFromToken] = useState('ETH');
  const [toToken, setToToken] = useState('PARAM');
  const [exchangeRate, setExchangeRate] = useState(0.00025); // 1 ETH = 4000 PARAM

  useEffect(() => {
    if (fromAmount && fromToken && toToken) {
      const amount = parseFloat(fromAmount);
      if (!isNaN(amount)) {
        if (fromToken === 'ETH' && toToken === 'PARAM') {
          setToAmount((amount / exchangeRate).toFixed(2));
        } else if (fromToken === 'PARAM' && toToken === 'ETH') {
          setToAmount((amount * exchangeRate).toFixed(6));
        }
      }
    }
  }, [fromAmount, fromToken, toToken, exchangeRate]);

  const swapTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
  };

  const formatLargeNumber = (num) => {
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(2) + 'M';
    }
    if (num >= 1_000) {
      return (num / 1_000).toFixed(2) + 'K';
    }
    return num.toString();
  };

  const handleExchange = async () => {
    if (!signer || !fromAmount) return;
    
    try {
      // In a real app, this would interact with a DEX contract
      const amountInWei = ethers.utils.parseEther(
        fromToken === 'ETH' ? fromAmount : toAmount
      );
      
      // For demonstration only - actual implementation would vary
      alert(`Swapped ${fromAmount} ${fromToken} for ${toAmount} ${toToken}`);
    } catch (error) {
      console.error('Exchange error:', error);
      alert('Exchange failed');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Token Exchange</h2>
      
      <div className="mb-4 border p-4 rounded">
        <div className="flex justify-between mb-2">
          <span>From</span>
          <span>Balance: {
            fromToken === 'PARAM' ? 
              formatLargeNumber(1_000_000) : // Sample balance
              '0.5 ETH'
          }</span>
        </div>
        <div className="flex">
          <input
            type="number"
            value={fromAmount}
            onChange={(e) => setFromAmount(e.target.value)}
            className="flex-grow p-2 border rounded-l"
            placeholder="0.0"
          />
          <select 
            value={fromToken}
            onChange={(e) => setFromToken(e.target.value)}
            className="border p-2 rounded-r"
          >
            <option value="ETH">ETH</option>
            <option value="MATIC">MATIC</option>
            <option value="BNB">BNB</option>
            <option value="SOL">SOL</option>
            <option value="PARAM">PARAM</option>
          </select>
        </div>
      </div>
      
      <div className="flex justify-center my-2">
        <button 
          onClick={swapTokens}
          className="bg-gray-200 p-2 rounded-full"
        >
          ↓↑
        </button>
      </div>
      
      <div className="mb-4 border p-4 rounded">
        <div className="flex justify-between mb-2">
          <span>To</span>
          <span>Balance: {
            toToken === 'PARAM' ? 
              formatLargeNumber(5_000_000) : // Sample balance
              '0.01 ETH'
          }</span>
        </div>
        <div className="flex">
          <input
            type="text"
            value={toAmount}
            readOnly
            className="flex-grow p-2 border rounded-l bg-gray-100"
          />
          <select 
            value={toToken}
            onChange={(e) => setToToken(e.target.value)}
            className="border p-2 rounded-r"
          >
            <option value="PARAM">PARAM</option>
            <option value="ETH">ETH</option>
            <option value="MATIC">MATIC</option>
            <option value="BNB">BNB</option>
            <option value="SOL">SOL</option>
          </select>
        </div>
      </div>
      
      <div className="text-center mb-4">
        <p>1 ETH = {formatLargeNumber(1/exchangeRate)} PARAM</p>
        <p className="text-sm text-gray-600">Including fees</p>
      </div>
      
      <button 
        onClick={handleExchange}
        className="w-full bg-green-500 text-white px-4 py-2 rounded"
      >
        Exchange Tokens
      </button>
    </div>
  );
};

export default TokenExchange;