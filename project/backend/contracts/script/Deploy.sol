// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/CampaignFactory.sol";
import "../src/DummyToken.sol"; 

// Nota: 
// Con forge script di default tutto viene simulato 
// in una EVM locale (dry-run), per eseguire il
// deploy reale bisogna usare le funzioni startBroadcast e stopBroadcast
// e il tag --broadcast

contract Deploy is Script {

    function run() external returns (TestToken token) {
        
        // Chiave privata per firmare la transazione
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console.log("Deploying with:", deployer);

        vm.startBroadcast(deployerPrivateKey);

        token = new TestToken("Charlie Coin", "WAC");

        vm.stopBroadcast();

        console.log("Contract deployed at:", address(token));
    }
}