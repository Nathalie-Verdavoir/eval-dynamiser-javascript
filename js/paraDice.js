/*----- paraDice GAME ------*/
/*---BY Nathalie Verdavoir--*/
/*--------FOR STUDI---------*/
/*--------20211116----------*/

gameStat = {
    p1 :{
        global : 0,
        current : 0,
    },
    p2 :{
        global : 0,
        current : 0,
    }
};
const myButtonsHtml = document.querySelectorAll("button");

myButtonsHtml.forEach(myBtn => {
    myBtn.addEventListener('click', (e) => {
        let functionToCall = e.target.getAttribute('data-action')+'()';
        eval(functionToCall);
    })
});

const globalP1Html = document.getElementById("global-p1");
const globalP2Html = document.getElementById("global-p2");
const currentP1Html = document.getElementById("current-p1");
const currentP2Html = document.getElementById("current-p2");


const newGame = () => {
    globalP1Html.textContent = gameStat["p1"]["global"];
    globalP2Html.textContent = gameStat["p2"]["global"];
    currentP1Html.textContent = gameStat["p1"]["current"];
    currentP2Html.textContent = gameStat["p2"]["current"];
}
newGame();

const dicesArray = document.getElementsByClassName("dice");

const roll = () => {
    //get a random number from 1 to 6
    let result = Math.floor(Math.random()*6)+1;
    newDiceId = 'dice-'+result;
    //console.log(newDiceId);
    displayResult(newDiceId);
 };

const displayResult = (newDiceId) => {
     //hide (with d-none) all of the svg of dices and show the picked one 
    Array
        .from(dicesArray)
        .forEach( d => {
            d.classList.add('d-none');
        })
    document.getElementById(newDiceId).classList.remove('d-none');
};
