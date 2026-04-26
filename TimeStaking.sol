```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

/// @title Time-based ETH Staking Contract
/// @author Mohit
/// @notice Allows users to stake ETH for a fixed duration and earn rewards based on APY
/// @dev Uses simple interest model, not compounded. Includes basic reentrancy protection.
contract timeStaking {

    /// @notice Annual Percentage Yield (max 30%)
    uint8 APY;

    /// @dev Reentrancy lock flag
    bool locked;

    /// @notice Total liquidity in contract (not actively updated in current implementation)
    uint totalLiquidity;

    /// @notice Owner of the contract
    address public owner;

    /// @dev Address of the contract itself
    address contractAddress;

    /// @notice Struct storing user staking details
    /// @param balance Amount of ETH staked
    /// @param startTime Timestamp when staking started
    /// @param stakedTime Timestamp when staking unlocks
    /// @param staked Whether user currently has an active stake
    struct user {
        uint balance;
        uint startTime;
        uint stakedTime;
        bool staked;
    }

    /// @notice Mapping of user address to staking data
    mapping(address => user) userStatus;

    /// @notice Emitted when a user stakes ETH
    /// @param user Address of staker
    /// @param amount Amount staked
    /// @param timeInDays Lock duration in days
    event UserStaked(address user, uint amount, uint timeInDays);

    /// @notice Emitted when user withdraws stake and rewards
    /// @param user Address of user
    /// @param amount Original staked amount
    /// @param reward Reward earned
    /// @param totalAmount Total payout (amount + reward)
    event AmountWithdraw(address user, uint amount, uint reward, uint totalAmount);

    /// @notice Thrown when zero ETH is sent
    error InvalidAmount();

    /// @notice Thrown when user tries to stake again while already staking
    /// @param stakedAmount Existing staked balance
    error alreadyStaked(uint stakedAmount);

    /// @notice Initializes contract with APY
    /// @param _APY Annual Percentage Yield (must be <= 30)
    constructor(uint8 _APY) {
        owner = msg.sender;
        contractAddress = address(this);
        APY = _APY;
    }

    /// @notice Restricts access to owner or contract itself
    modifier onlyOwner() {
        require(msg.sender == owner || msg.sender == contractAddress, "Not Authorised");
        _;
    }

    /// @notice Prevents reentrancy attacks
    modifier reenterrancyGuard {
        require(!locked, "No permission");
        locked = true;
        _;
        locked = false;
    }

    /// @notice Allows owner to update APY
    /// @param _APY New APY (must be between 1 and 30)
    function changeAPY(uint8 _APY) public onlyOwner {
        require(_APY > 0 && _APY <= 30, "APY Limit Excedded");
        APY = _APY;
    }

    /// @notice Stake ETH for a fixed duration
    /// @param time Lock duration in days
    function stake(uint time) public payable {
        if (msg.value == 0 ether) {
            revert InvalidAmount();
        }

        if (userStatus[msg.sender].staked) {
            revert alreadyStaked(userStatus[msg.sender].balance);
        }

        uint timeStake = (block.timestamp + (time * 1 days));

        userStatus[msg.sender] = user(
            msg.value,
            block.timestamp,
            timeStake,
            true
        );

        emit UserStaked(msg.sender, msg.value, time);
    }

    /// @notice Calculates reward for a user
    /// @dev Uses simple interest formula based on elapsed time
    /// @param _user Address of the user
    /// @return reward Amount of reward earned
    function calculateReward(address _user) internal view returns (uint reward) {
        uint totalTime = block.timestamp - userStatus[_user].startTime;
        uint timeInDays = totalTime / 1 days;
        uint userBalance = userStatus[_user].balance;

        reward = (userBalance * APY * timeInDays) / (100 * 365);
    }

    /// @notice Unstake funds and claim rewards after lock period
    function unstake() public reenterrancyGuard {
        require(
            block.timestamp >= userStatus[msg.sender].stakedTime,
            "Funds Still Locked"
        );
        require(
            userStatus[msg.sender].balance != 0,
            "No Active Stake"
        );

        uint reward = calculateReward(msg.sender);
        uint balance = userStatus[msg.sender].balance;
        uint totalReward = balance + reward;

        (bool success, ) = payable(msg.sender).call{value: totalReward}("");
        require(success, "Transaction Failed");

        // Reset user state
        userStatus[msg.sender].balance = 0;
        userStatus[msg.sender].startTime = 0;
        userStatus[msg.sender].stakedTime = 0;
        userStatus[msg.sender].staked = false;

        emit AmountWithdraw(msg.sender, balance, reward, totalReward);
    }

    /// @notice View user staking details and reward
    /// @param _user Address of user
    /// @return balance Staked amount
    /// @return startTime Stake start timestamp
    /// @return stakedTime Unlock timestamp
    /// @return reward Current calculated reward
    function seeUserReward(address _user)
        public
        view
        returns (
            uint balance,
            uint startTime,
            uint stakedTime,
            uint reward
        )
    {
        user storage u = userStatus[_user];
        reward = calculateReward(_user);

        return (u.balance, u.startTime, u.stakedTime, reward);
    }

    /// @notice Allows owner to withdraw entire contract balance
    /// @dev This can drain user funds — use with caution
    function ownerWithdraw() public onlyOwner {
        (bool success,) = payable(owner).call{value: address(this).balance}("");
        require(success, "Transaction Failed");
    }
}
```
