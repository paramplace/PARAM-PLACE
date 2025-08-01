// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ExclusiveNFT is ERC721, Ownable {
    uint256 private _tokenIdCounter;
    
    constructor() ERC721("ExclusiveNFT", "ENFT") {}
    
    function mint(address to) external onlyOwner {
        _tokenIdCounter++;
        _safeMint(to, _tokenIdCounter);
    }
    
    function burn(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        _burn(tokenId);
    }
}