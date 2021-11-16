/*----- paraDice GAME ------*/
/*---BY Nathalie Verdavoir--*/
/*--------FOR STUDI---------*/
/*--------20211116----------*/

let gameStat = {};
const myButtonsHtml = document.querySelectorAll("button");

myButtonsHtml.forEach(myBtn => {
    myBtn.addEventListener('click', (e) => {
        let functionToCall = e.target.getAttribute('data-action')+'()';
        eval(functionToCall);
    })
});

const setContent = (target, text) => {
    document.getElementById(target).textContent = text;
}

const getGameStat = (playerId, cat) => {
    cat = cat || "current";
    return gameStat[playerId][cat];
}

const newGame = () => {
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
    setContent( "global-p1", getGameStat('p1','global'));
    setContent( "global-p2", getGameStat('p2','global'));
    setContent( "current-p1", getGameStat('p1'));
    setContent( "current-p2", getGameStat('p2'));
}

const roll = () => {
    let result = Math.floor(Math.random()*6)+1;
    displayResult(result);
};

const dicesArray = document.getElementsByClassName("dice");

const displayResult = (result) => {
    //hide (with d-none) all of the svg of dices and show the picked one 
    [...dicesArray]
        .forEach( d => {
            d.classList.add('d-none');
        }) 
    let newDiceId = 'dice-'+result;
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

newGame();