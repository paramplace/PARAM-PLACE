// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract TokenStaking is ReentrancyGuard {
    IERC20 public paramToken;
    uint256 public constant APR = 15; // 1.5% represented as 15 (1000 = 100%)
    uint256 public constant YEAR = 365 days;
    
    struct Stake {
        uint256 amount;
        uint256 startTime;
    }
    
    mapping(address => Stake) public stakes;
    
    event Staked(address user, uint256 amount);
    event Unstaked(address user, uint256 amount);
    event RewardWithdrawn(address user, uint256 reward);
    
    constructor(address _paramToken) {
        paramToken = IERC20(_paramToken);
    }
    
    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be > 0");
        require(paramToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        if(stakes[msg.sender].amount > 0) {
            _withdrawReward();
        }
        
        stakes[msg.sender] = Stake(
            stakes[msg.sender].amount + amount,
            block.timestamp
        );
        
        emit Staked(msg.sender, amount);
    }
    
    function unstake(uint256 amount) external nonReentrant {
        require(stakes[msg.sender].amount >= amount, "Insufficient stake");
        _withdrawReward();
        
        stakes[msg.sender].amount -= amount;
        require(paramToken.transfer(msg.sender, amount), "Transfer failed");
        
        emit Unstaked(msg.sender, amount);
    }
    
    function withdrawReward() external nonReentrant {
        _withdrawReward();
    }
    
    function _withdrawReward() private {
        uint256 reward = calculateReward(msg.sender);
        if(reward > 0) {
            require(paramToken.transfer(msg.sender, reward), "Reward transfer failed");
            stakes[msg.sender].startTime = block.timestamp;
            emit RewardWithdrawn(msg.sender, reward);
        }
    }
    
    function calculateReward(address user) public view returns (uint256) {
        Stake memory s = stakes[user];
        if(s.amount == 0) return 0;
        
        uint256 stakedTime = block.timestamp - s.startTime;
        return (s.amount * APR * stakedTime) / (1000 * YEAR);
    }
}