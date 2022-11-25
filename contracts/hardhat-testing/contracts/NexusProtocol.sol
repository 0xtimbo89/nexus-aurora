// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NexusProtocol is Ownable {
    uint256 public _listingCount;
    uint256 public _listingCompleted;

    mapping(bytes32 => Listing) public listingCatalog;

    enum ListingStatus {
        ACTIVE,
        COMPLETED,
        CANCELLED
    }

    struct Listing {
        address collectionAddress;
        uint256 tokenId;
        uint256 price;
        address seller;
        address buyer;
        ListingStatus status;
    }

    // TODO: add duration to expire listing
    function createListing(
        address _collectionAddress,
        uint256 _tokenId,
        uint256 _price
    ) public {
        require(
            IERC721(_collectionAddress).ownerOf(_tokenId) == msg.sender,
            "Seller must be owner of token"
        );

        require(
            IERC721(_collectionAddress).isApprovedForAll(
                msg.sender,
                address(this)
            ),
            "Nexus must be set to operator for collection"
        );

        bytes32 listingId = keccak256(
            abi.encodePacked(_collectionAddress, _tokenId)
        );

        listingCatalog[listingId] = Listing(
            _collectionAddress,
            _tokenId,
            _price,
            msg.sender,
            address(0),
            ListingStatus.ACTIVE
        );

        _listingCount += 1;
    }

    function cancelListing(address _collectionAddress, uint256 _tokenId)
        public
        payable
    {
        bytes32 listingId = keccak256(
            abi.encodePacked(_collectionAddress, _tokenId)
        );

        Listing memory listingToUpdate = listingCatalog[listingId];

        require(
            listingToUpdate.seller == msg.sender,
            "Cannot cancel listing if not original seller"
        );

        require(
            listingToUpdate.status == ListingStatus.ACTIVE,
            "Listing must be active in order to cancel"
        );

        listingToUpdate.status = ListingStatus.CANCELLED;

        listingCatalog[listingId] = listingToUpdate;
    }

    function fulfillListing(address _collectionAddress, uint256 _tokenId)
        public
        payable
    {
        bytes32 listingId = keccak256(
            abi.encodePacked(_collectionAddress, _tokenId)
        );

        Listing memory listingToUpdate = listingCatalog[listingId];

        require(
            IERC721(_collectionAddress).isApprovedForAll(
                listingToUpdate.seller,
                address(this)
            ),
            "Collection is not approved for spending"
        );

        require(msg.value >= listingToUpdate.price, "Insufficient value");

        require(
            listingToUpdate.status == ListingStatus.ACTIVE,
            "Listing is not active"
        );

        // protocol takes 1% fee for each purchase facilitated
        payable(listingToUpdate.seller).transfer((msg.value * 99) / 100);

        IERC721(_collectionAddress).transferFrom(
            listingToUpdate.seller,
            msg.sender,
            _tokenId
        );

        listingToUpdate.buyer = payable(msg.sender);
        listingToUpdate.status = ListingStatus.COMPLETED;

        listingCatalog[listingId] = listingToUpdate;

        _listingCompleted += 1;
    }

    function getListingBuyer(address _collectionAddress, uint256 _tokenId)
        public
        view
        returns (address)
    {
        bytes32 listingId = keccak256(
            abi.encodePacked(_collectionAddress, _tokenId)
        );

        Listing memory listing = listingCatalog[listingId];

        return listing.buyer;
    }

    function getListingSeller(address _collectionAddress, uint256 _tokenId)
        public
        view
        returns (address)
    {
        bytes32 listingId = keccak256(
            abi.encodePacked(_collectionAddress, _tokenId)
        );

        Listing memory listing = listingCatalog[listingId];

        return listing.seller;
    }

    function getListingStatus(address _collectionAddress, uint256 _tokenId)
        public
        view
        returns (ListingStatus)
    {
        bytes32 listingId = keccak256(
            abi.encodePacked(_collectionAddress, _tokenId)
        );

        Listing memory listing = listingCatalog[listingId];

        return listing.status;
    }

    function getListingPrice(address _collectionAddress, uint256 _tokenId)
        public
        view
        returns (uint256)
    {
        bytes32 listingId = keccak256(
            abi.encodePacked(_collectionAddress, _tokenId)
        );

        Listing memory listing = listingCatalog[listingId];

        return listing.price;
    }

    function hasActiveListing(address _collectionAddress, uint256 _tokenId)
        public
        view
        returns (uint256)
    {
        bytes32 listingId = keccak256(
            abi.encodePacked(_collectionAddress, _tokenId)
        );

        Listing memory listing = listingCatalog[listingId];

        require(
            listing.status == ListingStatus.ACTIVE,
            "Token does not have an active listing"
        );

        return listing.price;
    }

    function withdraw(address payable _dest) external onlyOwner {
        uint256 _balance = address(this).balance;
        (bool sent, ) = _dest.call{value: _balance}("");
        require(sent, "Failed to sent Ether");
    }

    /**
     * @dev enable contract to receive ethers in royalty
     */
    receive() external payable {}
}
