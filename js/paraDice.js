/*----- paraDice GAME ------*/
/*---BY Nathalie Verdavoir--*/
/*--------FOR STUDI---------*/
/*--------20211124----------*/

let gameStat = {};

//sounds
const titles = ["rollingDiceSound" , "pickedDiceSound" , "looserDiceSound" , "holdSound" , "winnerSound"];
let sounds = [];
for(let title in titles) {
    sounds.push(new Audio('./sounds/'+titles[title]+'.mp3'));
    sounds[title].load();
}

const muteSounds = () => {
    for(let title of sounds) {
        title.volume = title.volume ? 0 : 1;
        [...document.querySelectorAll(".bi-volume-mute")]
            .map( d => d.classList.toggle('d-none'));
    }
}

const resetPlaySound = s => {
    sounds[s].currentTime = 0; 
    sounds[s].play();
}

//add the event on every elements near the button (svg path included)
document.addEventListener('click', event => {
    const el = event.target.closest('.btn');
	if (!el) return;
    if(el.getAttribute('data-action')){
        const player = event.path[0].getAttribute("data-player") ? event.path[0].getAttribute("data-player") : '';
        const action = el.getAttribute('data-action');
        const functionToCall = `${action}('${player}')`;
        eval(functionToCall);  
    }   
}, false);

//getters and setters
const setContent = (target, text) => document.getElementById(target).textContent = text;

const getClassList = el => document.getElementById(el).classList;

const getGameStat = (playerId, cat='current') => gameStat[playerId][cat];

const toggleElement = id => getClassList(id).toggle('invisible');

const getActivePlayerId = () =>getClassList('name-p1').contains('active') ? 'p1' : 'p2';

const arrElementToActive = ["name-p1","name-p2","bg-p1","bg-p2"];

const changeActivePlayer = () => {
    arrElementToActive.map(el => getClassList(el).toggle("active"));
    getClassList('hold').add('invisible');
}

const dicesArray = document.getElementsByClassName("dice");

const changePseudo = player => {
        const inputValue = document.getElementById("pseudo"+player+"Input").value;
        if( inputValue != '' ) {
            gameStat[player]["pseudo"] = inputValue;
            setContent( "pseudo-"+player, inputValue);
        }
}

//games functions
const newGame = () => { 
    gameStat = {
        p1 :{
            global : 0,
            current : 0,
            pseudo: gameStat["p1"] ? getGameStat('p1','pseudo') : 'PLAYER 1',
        },
        p2 :{
            global : 0,
            current : 0,
            pseudo: gameStat["p2"] ? getGameStat('p2','pseudo') : 'PLAYER 2',
        }
    };
    //Populate html
    for (let [player,stat] of Object.entries(gameStat)) {
        for (let [target,value] of Object.entries(stat)) {
            setContent( target+"-"+player, value);
        }
    }
    //show roll button
    toggleElement('roll');
    //hide announcement and hold button
    getClassList('winner').add('d-none');
    getClassList('hold').add('invisible');
}

const roll = () => {
    let result = Math.floor(Math.random()*6)+1;
    animatedDice(result);
    getClassList('roll').add('disabled');
    getClassList('hold').add('disabled');
};

const displayResult = result => {
    //hide (with d-none) all of the svg of dices 
    [...dicesArray].map( d => d.classList.add('d-none'));
    //and show the picked one 
    let newDiceId = 'dice-'+result;
    getClassList(newDiceId).remove('d-none');
    //then add result to current score
    if(result==1){
        looserDice();
    } else { 
        resetPlaySound(1);
        addTo(result, 'current', getActivePlayerId());
        getClassList('hold').remove('invisible');
    }
};

const looserDice = () => {
    resetPlaySound(2);
    gameStat[getActivePlayerId()]['current']=0;
    setContent( 'current-'+getActivePlayerId(), 0 );
    changeActivePlayer();
}

const addTo = (howMany, toCounter, toPlayer) => {
    if( toCounter==='global') {
        gameStat[toPlayer]["current"]=0; 
        setContent( 'current-'+toPlayer, 0);
        toggleAnimation('current-'+toPlayer, toPlayer+'AnimatedScore');
    }
    else { 
        toggleAnimation('dice-'+howMany, toPlayer+'AddingDice'); 
    }
    gameStat[toPlayer][toCounter]+=howMany;
    setContent( toCounter+'-'+toPlayer, getGameStat( toPlayer , toCounter ) );
    getClassList('hold').remove('disabled');
}

const hold = () => {
    if ( getGameStat(getActivePlayerId()) > 0 ) {
        resetPlaySound(3);
        addTo(getGameStat(getActivePlayerId()), 'global', getActivePlayerId());
    }
    if ( getGameStat(getActivePlayerId(),'global') >= 100 ) { 
        displayWinner(getActivePlayerId());
        } else {
        changeActivePlayer();
    }
}

//animations
const toggleAnimation = (el, animation) => {
    const classParentEl = document.getElementById(el)
                            .parentNode
                            .classList;
    classParentEl.add(animation);
    setTimeout(() => {classParentEl.remove(animation)}, 300);
}

const animatedDice = result => {
    for(let loop=0;loop<3;loop++){
        for(let dice=0;dice<7;dice++){
            setTimeout(() => {
                displayAnimated(dice);
                }, 50*dice+loop*350); 
        }
    }
    resetPlaySound(0);
    setTimeout(() => {
        displayResult(result);
        getClassList('roll').remove('disabled');
        sounds[0].pause();
    }, 1050 );
}

const displayAnimated = (dice) => {
    //hide (with d-none) all of the svg of dices 
    [...dicesArray].map( d => d.classList.add('d-none'));
    //and show the picked one 
    let newDiceId = 'dice-'+dice;
    getClassList(newDiceId).remove('d-none');
}

const displayWinner = (player) => {
    setContent('winnerName', getGameStat(player,'pseudo'));
    getClassList('winner').toggle('d-none');
}

const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  new bootstrap.Tooltip(tooltipTriggerEl);
});

//first loading
newGame();
setTimeout(() => {
    getClassList('welcome').add('d-none');
}, 30000);
