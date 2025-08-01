import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../../../context/Web3Context';
import { addresses, abis } from '../../../contracts';

const Staking = () => {
  const { signer, account } = useWeb3();
  const [stakedAmount, setStakedAmount] = useState('0');
  const [rewardAmount, setRewardAmount] = useState('0');
  const [stakeInput, setStakeInput] = useState('');

  useEffect(() => {
    const loadStakingData = async () => {
      if (!signer || !account) return;
      
      const stakingContract = new ethers.Contract(
        addresses.staking,
        abis.staking,
        signer
      );
      
      const stake = await stakingContract.stakes(account);
      const reward = await stakingContract.calculateReward(account);
      
      setStakedAmount(ethers.utils.formatUnits(stake.amount, 18));
      setRewardAmount(ethers.utils.formatUnits(reward, 18));
    };
    
    loadStakingData();
  }, [signer, account]);

  const handleStake = async () => {
    if (!stakeInput || parseFloat(stakeInput) <= 0) return;
    
    const stakingContract = new ethers.Contract(
      addresses.staking,
      abis.staking,
      signer
    );
    
    const amount = ethers.utils.parseUnits(stakeInput, 18);
    const tx = await stakingContract.stake(amount);
    await tx.wait();
    // Refresh data
  };

  const handleWithdrawReward = async () => {
    const stakingContract = new ethers.Contract(
      addresses.staking,
      abis.staking,
      signer
    );
    
    const tx = await stakingContract.withdrawReward();
    await tx.wait();
    // Refresh data
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">PARAM Token Staking</h2>
      
      <div className="mb-4">
        <p>Staked: {stakedAmount} PARAM</p>
        <p>Rewards: {rewardAmount} PARAM</p>
      </div>
      
      <div className="flex mb-4">
        <input
          type="number"
          value={stakeInput}
          onChange={(e) => setStakeInput(e.target.value)}
          placeholder="Amount to stake"
          className="flex-grow p-2 border rounded-l"
        />
        <button 
          onClick={handleStake}
          className="bg-green-500 text-white px-4 py-2 rounded-r"
        >
          Stake
        </button>
      </div>
      
      <button 
        onClick={handleWithdrawReward}
        className="w-full bg-blue-500 text-white px-4 py-2 rounded mb-2"
      >
        Withdraw Rewards
      </button>
      
      <button className="w-full bg-gray-500 text-white px-4 py-2 rounded">
        Unstake
      </button>
      
      <p className="mt-4 text-sm text-gray-600">
        APR: 1.5% • Rewards calculated in real-time
      </p>
    </div>
  );
};

export default Staking;