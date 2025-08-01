import React, { useState } from 'react';
import { useWeb3 } from '../../context/Web3Context';
import { addresses, abis } from '../../contracts';

const AdminPanel = () => {
  const { signer } = useWeb3();
  const [recipient, setRecipient] = useState('');
  const [isMinting, setIsMinting] = useState(false);

  const mintNFT = async () => {
    if (!recipient || !signer) return;
    
    setIsMinting(true);
    try {
      const nftContract = new ethers.Contract(
        addresses.nft,
        abis.nft,
        signer
      );
      
      const tx = await nftContract.mint(recipient);
      await tx.wait();
      alert('NFT minted successfully!');
    } catch (error) {
      console.error('Minting error:', error);
      alert('Failed to mint NFT');
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Admin NFT Minting</h2>
      
      <div className="mb-4">
        <label className="block mb-2">Recipient Address</label>
        <input
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="0x..."
        />
      </div>
      
      <button
        onClick={mintNFT}
        disabled={isMinting}
        className="w-full bg-purple-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {isMinting ? 'Minting...' : 'Mint New NFT'}
      </button>
      
      <p className="mt-4 text-sm text-gray-600">
        Only contract owner can mint new NFTs
      </p>
    </div>
  );
};

export default AdminPanel;