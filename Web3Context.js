import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import WalletConnectProvider from '@walletconnect/web3-provider';

const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState('');
  const [chainId, setChainId] = useState(137); // Polygon Mainnet
  
  const connectWallet = async () => {
    const walletConnectProvider = new WalletConnectProvider({
      infuraId: process.env.REACT_APP_INFURA_ID,
      chainId: 137,
      rpc: {
        137: 'https://polygon-rpc.com'
      }
    });
    
    await walletConnectProvider.enable();
    const ethersProvider = new ethers.providers.Web3Provider(walletConnectProvider);
    const signer = ethersProvider.getSigner();
    const address = await signer.getAddress();
    
    setProvider(ethersProvider);
    setSigner(signer);
    setAccount(address);
    
    return signer;
  };
  
  return (
    <Web3Context.Provider value={{
      provider,
      signer,
      account,
      chainId,
      connectWallet
    }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => useContext(Web3Context);