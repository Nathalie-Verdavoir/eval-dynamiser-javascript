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
//#TODO get following lines lighter (until line 37)
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
    displayResult(result);
};

const displayResult = (result) => {
    //hide (with d-none) all of the svg of dices and show the picked one 
    
    newDiceId = 'dice-'+result;
    
    //#TODO check for a better way to change class
    Array
        .from(dicesArray)
        .forEach( d => {
            d.classList.add('d-none');
        })
    document.getElementById(newDiceId).classList.remove('d-none');
    addTo(result, 'current', getActivePlayerId());
};

const addTo = (howMany, toCounter, toPlayer) => {console.log(toPlayer);
    gameStat[toPlayer][toCounter]+=howMany;
    document.getElementById('current-'+toPlayer).textContent=gameStat[toPlayer][toCounter];
}

const getActivePlayerId = () => {
    //get the active player
    //#TODO ternary operator?
    if(document.getElementById('name-p1').classList.contains('active'))
    {return 'p1'}else{return 'p2'}
}

const changeActivePlayer = () => {
    //#TODO get it better and smaller
    getActivePlayerId()=='p1' ? 
    (
        document.getElementById('name-p1').classList.remove('active'),
        document.getElementById('name-p2').classList.add('active'),
        document.getElementById('bg-p1').classList.remove('active'),
        document.getElementById('bg-p2').classList.add('active')
    )
    : 
    (
       document.getElementById('name-p2').classList.remove('active'),
       document.getElementById('name-p1').classList.add('active'),
       document.getElementById('bg-p2').classList.remove('active'),
       document.getElementById('bg-p1').classList.add('active')
   );
}

