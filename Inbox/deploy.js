const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface , bytecode } = require('./compile');

const provider = new HDWalletProvider (
    'choice suit olympic half aware conduct silk fix cactus clap lucky enforce',
    'https://rinkeby.infura.io/v3/aefa14408fc24334b38664e96579ac99'
);

const web3 = new Web3(provider);

/**
 * Need to do two async operations 
 * 1st to get all accounts and 
 * 2nd to deploy code on rinkeby network
 * 
 */
const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account', accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode, arguments: ['Hi there!'] })
        .send({ gas: '1000000', from: accounts[0] });
    
       console.log('Contract deployed to', result.options.address);
};
deploy();

/** Truffle version 0.0.3 */
/*
    const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: ['Hi there!'] })
    .send({ gas: '1000000', from: accounts[0] });
 */

 /** Truffle version 0.0.4 , 0.0.5 & 0.0.6 */
/*
    const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data: '0x' + bytecode, arguments: ['Hi there!']}) // add 0x bytecode
    .send({from: accounts[0]}); // remove 'gas'
 */