// SPDX-License-Identifier: MIT

pragma solidity ^0.6;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract ERC1155Collection is ERC1155 {

    mapping (uint256 => string) private _uris;
    uint256 private lastId;
    // Contract name
    string public name;
    // Contract symbol
    string public symbol;

    constructor (string memory _uri,string memory _name,string memory _symbol) public ERC1155(_uri) {
        name = _name;
        symbol = _symbol;
    }

    function setURI(string memory newuri) public {
        _setURI(newuri);
    }

    function setIdURI(uint256 tokenid,string memory uri) public {
        _uris[tokenid] = uri;
    }

    function uri(uint256 _id) public view override returns (string memory) {
        require(_exists(_id), "ERC721Tradable#uri: NONEXISTENT_TOKEN");
        return _uris[_id];
    }

    function mint(address to, uint256 value,string memory _uri, bytes memory data) public {
        _mint(to, lastId, value, data);
        _uris[lastId] = _uri;
        lastId++;
    }

    function mintBatch(address to, uint256[] memory values, string[] memory uris,bytes memory data) public {
        uint256[] memory ids = new uint256[](values.length);
        for(uint i = 0; i<values.length; i++){
            ids[i] = lastId;
            lastId++;
        }
        _mintBatch(to, ids, values, data);
        for(uint i = 0; i<ids.length; i++){
            _uris[ids[i]] = uris[i];
        }
    }

    function burn(address owner, uint256 id, uint256 value) public {
        _burn(owner, id, value);
        _uris[id] = "";
    }

    function burnBatch(address owner, uint256[] memory ids, uint256[] memory values) public {
        _burnBatch(owner, ids, values);
        for(uint i = 0; i<ids.length; i++){
            _uris[ids[i]] = "";
        }
    }

    function _exists(uint256 _id) internal view returns (bool) {
        return keccak256(abi.encodePacked(_uris[_id])) != keccak256(abi.encodePacked(""));
    }

    /**
      * @dev calculates the next token ID based on value of _currentTokenID
      * @return uint256 for the next token ID
      */
    function _getNextTokenID() private view returns (uint256) {
        return lastId;
    }


}