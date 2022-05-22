//SPDX-License-Identifier:MIT

pragma solidity ^0.8.0;


import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../node_modules/@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/utils/Strings.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract Token is ERC721URIStorage{

    using Counters for Counters.Counter;
    using Strings for uint256;
    Counters.Counter private _tokenIds;
    address contractAddress;

    constructor(address marketplaceAddress) ERC721("TEST2", "TK2"){
        contractAddress = marketplaceAddress;

    }
    
    function createTokens() public returns (uint) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, t());
        setApprovalForAll(contractAddress, true);
        return newItemId;
    }


    function t() private view returns(string memory){

      string memory URL = "ipfs://Qmd9yX22Snozi4sDKYV5nxJb4hQsujoekqBaGfQb8ipUvG/";
      uint256 newItemId = _tokenIds.current();
      string memory baseExtension = ".json";
      return string(abi.encodePacked(URL, newItemId.toString(), baseExtension));
    }

    function NFT_Adress()external view returns(address){
        return address(this);
    }
}

contract NFTMarket is ReentrancyGuard,Ownable{

    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;

    address public ownertoken;
    uint256 fees = 5;

    constructor(){
        ownertoken = payable(msg.sender);
    }

    struct MarketItem{
        address nftContract;
        address payable seller;
        address payable ownertoken;
        uint256 tokenId;
        uint256 price;
        bool sold;
    }

    mapping(uint256 => MarketItem) private idToMarketItem;

    event MarketItemCreated(
        address indexed nftContract,
        address indexed seller,
        address ownertoken, 
        uint256 indexed _tokenId,
        uint256 price,
        bool sold
    );

    function getMarketItem(uint256 marketItemId) public view returns(
        address _nftContract,address _seller,address _owner,
        uint256 _tokenId,uint256 _price,bool _sold){
        return (idToMarketItem[marketItemId].nftContract,
        idToMarketItem[marketItemId].seller,
        idToMarketItem[marketItemId].ownertoken,
        idToMarketItem[marketItemId].tokenId,
        idToMarketItem[marketItemId].price,
        idToMarketItem[marketItemId].sold);
    }

    function TokenSell(address nftContract,uint256 tokenId,uint256 price)
    public payable nonReentrant{

        _itemIds.increment();

        idToMarketItem[tokenId] = MarketItem(
            nftContract,
            payable(msg.sender),
            payable(address(0)),
            tokenId,
            price,
            true //false ?
        );

        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
        
        emit MarketItemCreated(
            nftContract,
            payable(msg.sender),
            payable(address(0)),
            tokenId,
            price,
            true
        );
    }

    function BuyToken(
        address nftContract,
        uint256 tokenId
    ) public payable nonReentrant{
        uint price = idToMarketItem[tokenId].price;


        require(msg.value >= price, "Please submit the price current");
        uint fee = (price * fees) / 100; 
        idToMarketItem[tokenId].seller.transfer(msg.value - fee);
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
        //idToMarketItem[tokenId].ownertoken = payable(msg.sender);

        _itemsSold.increment();
        reset(tokenId);

        
    }

    function reset(uint256 tokenId)internal {
        idToMarketItem[tokenId].nftContract = 0x0000000000000000000000000000000000000000;
        idToMarketItem[tokenId].seller = payable(0x0000000000000000000000000000000000000000);
        idToMarketItem[tokenId].ownertoken = payable(0x0000000000000000000000000000000000000000);
        idToMarketItem[tokenId].tokenId = 0;
        idToMarketItem[tokenId].price = 0;
        idToMarketItem[tokenId].sold = false;

    }

    function SendBack(address nftContract,uint256 tokenId)external payable nonReentrant{
        require(msg.sender == idToMarketItem[tokenId].seller, "Not Owner Token");
        uint256 val = (idToMarketItem[tokenId].price * fees) / 100;
        require(msg.value >= val,"Need Pay 5% fees");
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
        reset(tokenId);

    }


    function getBalance()external view returns(uint){
        return address(this).balance;
    }

    function withdraw()external payable onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }
}
