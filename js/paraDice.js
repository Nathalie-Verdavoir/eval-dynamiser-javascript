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

const setContent = (target, text) => document.getElementById(target).textContent = text;

const getGameStat = (playerId, cat='current') => gameStat[playerId][cat];

const newGame = () => {
    gameStat = {
        p1 :{
            global : 0,
            current : 0,
            pseudo: 'PLAYER 1'
        },
        p2 :{
            global : 0,
            current : 0,
            pseudo: 'PLAYER 2'
        }
    };
    
    setContent( "pseudo-p1", getGameStat('p1','pseudo'));
    setContent( "pseudo-p2", getGameStat('p2','pseudo'));
    setContent( "global-p1", getGameStat('p1','global'));
    setContent( "global-p2", getGameStat('p2','global'));
    setContent( "current-p1", getGameStat('p1'));
    setContent( "current-p2", getGameStat('p2'));
    toggleButtons();
    displayResult(0);
}

const roll = () => {
    let result = Math.floor(Math.random()*6)+1;
    displayResult(result);
};

const dicesArray = document.getElementsByClassName("dice");

const displayResult = (result) => {
    //hide (with d-none) all of the svg of dices 
    [...dicesArray]
        .forEach( d => {
            d.classList.add('d-none');
        }) 
    //and show the picked one 
    let newDiceId = 'dice-'+result;
    document.getElementById(newDiceId).classList.remove('d-none');
    //then add result to current score
    if(result==1){
        looserDice();
    } else {
        addTo(result, 'current', getActivePlayerId());
    }
};

const looserDice = () => {
    gameStat[getActivePlayerId()]['current']=0;
    setContent( 'current-'+getActivePlayerId(), getGameStat(getActivePlayerId()) );
    changeActivePlayer();
}

const addTo = (howMany, toCounter, toPlayer) => {
    if( toCounter==='global') {
        gameStat[toPlayer]["current"]=0; 
        setContent( 'current-'+toPlayer, 0);
    }
    gameStat[toPlayer][toCounter]+=howMany;
    setContent( toCounter+'-'+toPlayer, getGameStat( toPlayer , toCounter ) );
}

const getActivePlayerId = () => document.getElementById('name-p1').classList.contains('active') ? 'p1' : 'p2';

const arrElementToActive = ["name-p1","name-p2","bg-p1","bg-p2"];

const changeActivePlayer = () => {
    arrElementToActive.forEach(el => {
        document.getElementById(el).classList.toggle("active");
    })
}

const hold = () => {
    if ( getGameStat(getActivePlayerId()) > 0 ) {
    addTo(getGameStat(getActivePlayerId()), 'global', getActivePlayerId());
    }
    if ( getGameStat(getActivePlayerId(),'global') >= 100 ) { 
        toggleButtons();
        setContent( 'winner', document.getElementById("name-"+getActivePlayerId()).textContent+' WINS')
        } else {
        changeActivePlayer();
    }
}

const toggleButtons = () => {
    myButtonsHtml.forEach(myBtn => {
        if(myBtn.getAttribute('data-action')!="newGame"){
            myBtn.classList.toggle('invisible');
        }
    })
    document.getElementById('winner').classList.toggle('invisible');
}

newGame();