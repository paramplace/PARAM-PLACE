import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../../context/Web3Context';
import { addresses, abis } from '../../contracts';

const NFTMarket = () => {
  const { signer, account } = useWeb3();
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMarketData = async () => {
      if (!signer) return;
      
      const marketContract = new ethers.Contract(
        addresses.market,
        abis.market,
        signer
      );
      
      const tokenIds = await marketContract.getAllListedTokens();
      const nftData = await Promise.all(tokenIds.map(async id => {
        const listing = await marketContract.listings(id);
        return {
          id: id.toString(),
          price: ethers.utils.formatUnits(listing.price, 18),
          seller: listing.seller
        };
      }));
      
      setNfts(nftData);
      setLoading(false);
    };
    
    loadMarketData();
  }, [signer]);

  const buyNFT = async (tokenId, price) => {
    const marketContract = new ethers.Contract(
      addresses.market,
      abis.market,
      signer
    );
    
    const tx = await marketContract.buyNFT(
      tokenId, 
      { value: ethers.utils.parseUnits(price, 18) }
    );
    await tx.wait();
    // Refresh data
  };

  if (loading) return <div>Loading NFTs...</div>;

  return (
    <div className="grid grid-cols-4 gap-4">
      {nfts.map(nft => (
        <div key={nft.id} className="border p-4 rounded-lg">
          <div className="bg-gray-200 h-48"></div>
          <h3 className="text-lg font-bold mt-2">NFT #{nft.id}</h3>
          <p className="text-gray-600">Price: {nft.price} PARAM</p>
          <button 
            onClick={() => buyNFT(nft.id, nft.price)}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Buy NFT
          </button>
        </div>
      ))}
    </div>
  );
};

export default NFTMarket;