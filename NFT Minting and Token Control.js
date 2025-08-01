// In your frontend AdminPanel.js
import { useWeb3 } from '../../context/Web3Context';
import { addresses, abis } from '../../contracts';

const AdminPanel = () => {
  const { signer, account } = useWeb3();
  
  // Verify admin status
  const checkAdminStatus = async () => {
    const nftContract = new ethers.Contract(addresses.nft, abis.nft, signer);
    const isAdmin = await nftContract.owner() === account;
    return isAdmin;
  };
  
  // Rest of your admin functions...
}