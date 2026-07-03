// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
//import "../src/MyContract.sol";


// Nota: 
// Con forge script di default tutto viene simulato 
// in una EVM locale (dry-run), per eseguire il
// deploy reale bisogna usare le funzioni startBroadcast e stopBroadcast
// e il tag --broadcast
contract Deploy is Script {
    function run() external {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(privateKey);

        //MyContract myContract = new MyContract(/* args costruttore */);

        vm.stopBroadcast();
    }
}