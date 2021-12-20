const contract = require("@truffle/contract");
const path = require('path');
const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const privateKeyProvider = new HDWalletProvider(
    process.env.PRIV_KEY,
    process.env.RPC_URL
);

const LimitOrderMonitorJSON = require(path.join(__dirname, '../contracts/LimitOrderMonitor.json'));
const LimitOrderMonitor = contract(LimitOrderMonitorJSON);


function Keeper() {
}

Keeper.prototype.init = async function () {

    this.web3 = new Web3(privateKeyProvider);
    LimitOrderMonitor.setProvider(privateKeyProvider);

    this.accounts = await this.web3.eth.getAccounts();
    this.instance = await LimitOrderMonitor.at(process.env.MONITOR_ADDRESS);

    this.loopMonitors();
}

Keeper.prototype.processMonitor = async function () {
    console.log('START loopMonitors');

    const targetGasPrice = await this.web3.eth.getGasPrice();

    const receipt = await this.instance.checkUpkeep.call('0x', {gasPrice: targetGasPrice});
    console.log('receipt:', receipt.upkeepNeeded);
    if (receipt.upkeepNeeded) {
        const performUpkeep = await this.instance.performUpkeep(receipt.performData, {gasPrice: targetGasPrice});
        console.log('performUpkeep:', performUpkeep);
    }

    // TODO check the account balance and replenish if necessary
}

Keeper.prototype.loopMonitors = async function () {
    this.processMonitor()
        .then(() => {
            console.log('END loopMonitors');
        })
        .catch((err) => {
            console.error("processMonitor error", err);
        }).finally(() => {
            setTimeout(() => {
                this.loopMonitors();
            }, 60000).unref();
    });
}

module.exports = new Keeper();