// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NexusProtocol_v1 {
    using Counters for Counters.Counter;
    Counters.Counter private _assetsSold;
    Counters.Counter private _assetCount;
    mapping(uint256 => Asset) private tokenIdToAssetMap;

    struct Asset {
        address assetContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool listed;
    }

    function createListing(
        address _assetContract,
        uint256 _tokenId,
        uint256 _price
    ) public payable {
        _assetCount.increment();
    }

    function purchaseAsset(address _assetContract, uint256 _tokenId)
        public
        payable
    {
        _assetsSold.increment();
    }

    function getListedAssets() public view returns (Asset[] memory) {
        uint256 assetCount = _assetCount.current();
        uint256 unsoldAssetsCount = assetCount - _assetsSold.current();

        Asset[] memory assets = new Asset[](unsoldAssetsCount);
        uint256 assetsIndex = 0;
        for (uint256 i = 0; i < assetCount; i++) {
            if (tokenIdToAssetMap[i + 1].listed) {
                assets[assetsIndex] = tokenIdToAssetMap[i + 1];
                assetsIndex++;
            }
        }
        return assets;
    }

    function getMyAssets() public view returns (Asset[] memory) {
        uint256 assetCount = _assetCount.current();
        uint256 myAssetCount = 0;
        for (uint256 i = 0; i < assetCount; i++) {
            if (tokenIdToAssetMap[i + 1].owner == msg.sender) {
                myAssetCount++;
            }
        }

        Asset[] memory assets = new Asset[](myAssetCount);
        uint256 assetsIndex = 0;
        for (uint256 i = 0; i < assetCount; i++) {
            if (tokenIdToAssetMap[i + 1].owner == msg.sender) {
                assets[assetsIndex] = tokenIdToAssetMap[i + 1];
                assetsIndex++;
            }
        }
        return assets;
    }
}
