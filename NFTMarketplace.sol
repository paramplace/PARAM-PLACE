// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NFTMarketplace is ReentrancyGuard {
    IERC20 public paramToken;
    IERC721 public exclusiveNFT;
    
    struct Listing {
        address seller;
        uint256 price;
    }
    
    mapping(uint256 => Listing) public listings;
    
    event NFTListed(uint256 tokenId, address seller, uint256 price);
    event NFTSold(uint256 tokenId, address buyer, uint256 price);
    
    constructor(address _paramToken, address _exclusiveNFT) {
        paramToken = IERC20(_paramToken);
        exclusiveNFT = IERC721(_exclusiveNFT);
    }
    
    function listNFT(uint256 tokenId, uint256 price) external {
        require(exclusiveNFT.ownerOf(tokenId) == msg.sender, "Not owner");
        require(price > 0, "Invalid price");
        
        listings[tokenId] = Listing(msg.sender, price);
        exclusiveNFT.transferFrom(msg.sender, address(this), tokenId);
        
        emit NFTListed(tokenId, msg.sender, price);
    }
    
    function buyNFT(uint256 tokenId) external nonReentrant {
        Listing memory listing = listings[tokenId];
        require(listing.price > 0, "Not for sale");
        
        paramToken.transferFrom(msg.sender, listing.seller, listing.price);
        exclusiveNFT.transferFrom(address(this), msg.sender, tokenId);
        
        delete listings[tokenId];
        emit NFTSold(tokenId, msg.sender, listing.price);
    }
}