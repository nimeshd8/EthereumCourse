pragma solidity ^0.4.17;

contract Lottery{
    
    address public manager;
    address[] public players;
    
    //constructor will assign address of deployed contract to manager, as manager is the instance of contract.
    function Lottery() public {
        manager = msg.sender;
    }
    
    //add address of participents who are going to play lottery 
    function addEnteries() public payable{
        require(msg.value > 0.01 ether);
        players.push(msg.sender);
    }
    
    /* 
        creating function to generate random number so we can get one winner amoung participents.
        block.difficulty is data of block.
        now is the currennt time.
        players are the list of players participated to play Lotter game.
    */
    function generateRandomNumber() private view returns (uint){
        return uint(keccak256(block.difficulty, now, players));
    }
    
    function pickWinner() public payable restrictedOnly{
        uint index = generateRandomNumber() % numberOfEntries();
        players[index].transfer(this.balance);
        players = new address[](0);     //This is to reset array. 
    }
    
    //This modifier used to give permission to manager only.
    modifier restrictedOnly(){
        require(msg.sender == manager);     //Restrict access to manager only.
        _;          //Rest of code comes here to execute.
    }    
    
    function getPlayers() public view returns (address[]){
        return players;
    }
    
    function numberOfEntries() public view returns (uint) {
        return players.length;
    }
    
}