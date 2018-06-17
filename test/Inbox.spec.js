const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const { interface, bytecode } = require('../compile');

let web3 = new Web3(ganache.provider());
let fetchedAccounts;
let inbox;
const MESSAGE = 'Hello world';
const MAX_GAS = 500000;

describe('Inbox', () => {
    beforeEach(async () => {
        // Get a list of all accounts
        fetchedAccounts = await web3.eth.getAccounts();
        // use an account to deploy the contract
        inbox = await new web3.eth.Contract(JSON.parse(interface))
            .deploy({ data: `0x${bytecode}`, arguments: [MESSAGE] })
            .send({ from: fetchedAccounts[0], gas: MAX_GAS });
    });
    it('should fetch accounts', () => {
        assert.ok(fetchedAccounts);
    })
    it('deploys a contract', () => {
        assert.ok(inbox.options.address);
    });
    describe('message', () => {
        it('should have a default message', async () => {
            const message = await inbox.methods.message().call();
            assert.equal(message, MESSAGE);
        });
    });
    describe('getMessage', () => {
        it('should change the default message', async () => {
            const NEW_MESSAGE = 'HELLO WORLD!!!';
            await inbox.methods.setMessage(NEW_MESSAGE).send({ from: fetchedAccounts[1] });
            const message = await inbox.methods.message().call();
            assert.equal(message, NEW_MESSAGE);
        });
    });
});
