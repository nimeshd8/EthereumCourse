const assert = require('assert');
const ganache = require('ganache-cli');

//Note Web3 'W' is capital it's shows Constructor.
const Web3 = require('web3');

const provider = ganache.provider();
const web3 = new Web3(provider);      //created instance of web3 for test network

const { interface, bytecode } = require('../compile');

//Test is created to Check contract is deployed or not

let accounts;
let inbox;

beforeEach(async () => {
    //get a list of each accounts
    accounts = await web3.eth.getAccounts();

    //use one of those accounts to deploy the contracts
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode , arguments : ['Hi there!'] })
        .send({ from: accounts[0] , gas : 1000000 });
});

describe( 'Inbox', () => {

    it('contract Deployed', () => {
        assert.ok(inbox.options.address);
    });

    it('Has a default message', async () => {
        const message = await inbox.methods.message().call();
        assert.equal(message , 'Hi there!');
    });

});

/*
    promise code vs async code

    beforeEach(() => {
    //get a list of each accounts
    web3.eth.getAccounts()
    .then(fetchAccounts => {
        console.log(fetchAccounts);
    });

    //use one of those accounts to deploy the contracts

});

/*
class Car{

    park(){
        return 'Stopped';
    }

    drive(){
        return 'vroom';
    }
}

let car;

beforeEach( () => {
    car = new Car();
});

describe('Car', () => {

    it('can park', () => {
        assert.equal(car.park(), 'Stopped');
    });

    it('can drive', () => {
        assert.equal(car.drive(), 'vroom');
    });
});

*/