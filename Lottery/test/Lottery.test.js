const assert = require('assert');
const ganacheCli = require('ganache-cli');

const provider = ganacheCli.provider();
const Web3 = require('web3');

const { interface, bytecode } = require('../compile.js'); 

const web3 = new Web3(provider);

let accounts;
let lottery;

beforeEach( async () => {

    accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account', accounts[0]);

    lottery = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode , arguments : [] })
        .send({ gas: 1000000, from: accounts[0] })

    //console.log('Contract deployed to : ', lottery.options.address); 
});

describe('Lottery', () => {

    it('Is contract is deployed ', () => {
        assert.ok(lottery.options.address);
    });

    it('allows one account to enter', async () => {
        await lottery.methods.addEnteries().send({
            from : accounts[0],
            value : web3.utils.toWei('0.02', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from : accounts[0]
        });

        assert.equal(accounts[0], players[0]);
        assert.equal(1, players.length);
    });

    it('allows multiple accounts to enter', async () => {
        await lottery.methods.addEnteries().send({
           from : accounts[0],
           value : web3.utils.toWei('0.02', 'ether')
        });
        
        await lottery.methods.addEnteries().send({
            from : accounts[1],
            value : web3.utils.toWei('0.02', 'ether')
         });
        
        await lottery.methods.addEnteries().send({
            from : accounts[2],
            value : web3.utils.toWei('0.02', 'ether')
         });

        const players = await lottery.methods.getPlayers().call({
            from : accounts[0]
        });

        assert.equal(accounts[0], players[0]);
        assert.equal(accounts[1], players[1]);
        assert.equal(accounts[2], players[2]);

        assert.equal(3, players.length);
    });

    it('requires a minimum amunt of ether ', async ()=> {
        try{
            await lottery.methods.addEnteries().send({
                from: accounts[0],
                value:  0
             });
             assert(false);
        } catch(err){
            assert(err);
        }
    });

    it('only manager can call pickWinner', async () => {
        try{
            await lottery.methods.pickWinner().send({
                from: accounts[1]
            });
            assert(false);
        } catch(err){
            assert(err);
        }
    });

    it('sends money to the winner and reset players array', async () => {
        await lottery.methods.addEnteries().send({
            from : accounts[0],
            value : web3.utils.toWei('2','ether')
        });

        const initialBalance = await web3.eth.getBalance(accounts[0]);

        await lottery.methods.pickWinner().send({
            from : accounts[0]
        });

        const finalBalance = await web3.eth.getBalance(accounts[0]);

        const difference = finalBalance - initialBalance;

        console.log('gas we have burn for transaction ', difference);
        assert(difference > web3.utils.toWei('1.8', 'ether'));

        
    });

});