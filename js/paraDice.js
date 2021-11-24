/*----- paraDice GAME ------*/
/*---BY Nathalie Verdavoir--*/
/*--------FOR STUDI---------*/
/*--------20211116----------*/

let gameStat = {};
//sounds
const rollingDiceSound = new Audio('./sounds/rolling-dice.mp3');
rollingDiceSound.load();
const pickedDiceSound = new Audio('./sounds/picked-dice.mp3');
pickedDiceSound.load();
const looserDiceSound = new Audio('./sounds/looser.mp3');
looserDiceSound.load();
const holdSound = new Audio('./sounds/hold.mp3');
holdSound.load();
const winnerSound = new Audio('./sounds/winner.mp3');
winnerSound.load();

//add the event on every elements near the button (svg path included)
document.addEventListener('click', function (event) {
	if (!event.target.closest('.btn')) return;
    let functionToCall = event.target.closest('.btn').getAttribute('data-action')+'()';
        eval(functionToCall);
}, false);

const changePseudo1 = () => {
    gameStat["p1"]["pseudo"]= document.getElementById("pseudop1Input").value;
    setContent( "pseudo-p1", getGameStat('p1','pseudo'));
}

const changePseudo2 = () => {
    gameStat["p2"]["pseudo"]= document.getElementById("pseudop2Input").value;
    setContent( "pseudo-p2", getGameStat('p2','pseudo'));
}

const setContent = (target, text) => document.getElementById(target).textContent = text;

const getGameStat = (playerId, cat='current') => gameStat[playerId][cat];


const newGame = () => { 
    animatedDice();
    const pseudo1 = gameStat["p1"] ? getGameStat('p1','pseudo') : 'PLAYER 1';
    const pseudo2 = gameStat["p2"] ? getGameStat('p2','pseudo') : 'PLAYER 2';

    gameStat = {
        p1 :{
            global : 0,
            current : 0,
            pseudo: pseudo1,
        },
        p2 :{
            global : 0,
            current : 0,
            pseudo: pseudo2,
        }
    };
    setContent( "pseudo-p1", getGameStat('p1','pseudo'));
    setContent( "pseudo-p2", getGameStat('p2','pseudo'));
    setContent( "global-p1", getGameStat('p1','global'));
    setContent( "global-p2", getGameStat('p2','global'));
    setContent( "current-p1", getGameStat('p1'));
    setContent( "current-p2", getGameStat('p2'));
    toggleElement('roll');
    setAnnouncementMessage('WELCOME IN PARADICE !')
    document.getElementById('hold').classList.add('invisible');
    displayResult(0);
}

const roll = () => {
    let result = Math.floor(Math.random()*6)+1;
    animatedDice(result);
    document.getElementById('roll').classList.add('disabled');
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
    } else if(result!=0) { 
        pickedDiceSound.currentTime = 0; pickedDiceSound.play();
        addTo(result, 'current', getActivePlayerId());
        document.getElementById('hold').classList.remove('invisible');
    }
};

const looserDice = () => {
    looserDiceSound.currentTime = 0; looserDiceSound.play();
    gameStat[getActivePlayerId()]['current']=0;
    setContent( 'current-'+getActivePlayerId(), getGameStat(getActivePlayerId()) );
    changeActivePlayer();
}

const addTo = (howMany, toCounter, toPlayer) => {
    if( toCounter==='global') {
        gameStat[toPlayer]["current"]=0; 
        setContent( 'current-'+toPlayer, 0);
        document.getElementById('current-'+toPlayer).parentNode.classList.add('animatedScore'+toPlayer);
        setTimeout(() => {
            document.getElementById('current-'+toPlayer).parentNode.classList.remove('animatedScore'+toPlayer);
            }, 4300);     
    }
    else {
        document.getElementById('dice-'+howMany).parentNode.classList.add(toPlayer+'AddingDice');
        setTimeout(() => {
            document.getElementById('dice-'+howMany).parentNode.classList.remove(toPlayer+'AddingDice');
            }, 300);   
    }
    gameStat[toPlayer][toCounter]+=howMany;
    setContent( toCounter+'-'+toPlayer, getGameStat( toPlayer , toCounter ) );
}

const getActivePlayerId = () => document.getElementById('name-p1').classList.contains('active') ? 'p1' : 'p2';

const arrElementToActive = ["name-p1","name-p2","bg-p1","bg-p2"];

const changeActivePlayer = () => {
    arrElementToActive.forEach(el => {
        document.getElementById(el).classList.toggle("active"); 
        document.getElementById('hold').classList.add('invisible');
    })
}

const hold = () => {
    if ( getGameStat(getActivePlayerId()) > 0 ) {
        holdSound.currentTime = 0; holdSound.play();
    addTo(getGameStat(getActivePlayerId()), 'global', getActivePlayerId());
    }
    if ( getGameStat(getActivePlayerId(),'global') >= 100 ) { 
        displayWinner(getActivePlayerId());
        } else {
        changeActivePlayer();
    }
}

const toggleElement = (id) => document.getElementById(id).classList.toggle('invisible');

const animatedDice = (result) => {
    for(let loop=1;loop<5;loop++){
        for(let dice=0;dice<7;dice++){
            setTimeout(() => {
                displayAnimated(dice);
                }, 50*dice+loop*350); 
        }
    }
    if(result){
        rollingDiceSound.currentTime = 0; rollingDiceSound.play();
        setTimeout(() => {
        displayResult(result);
        document.getElementById('roll').classList.remove('disabled');
        rollingDiceSound.pause();
        }, 1800);}
}

const displayAnimated = (dice) => {
    //hide (with d-none) all of the svg of dices 
    [...dicesArray]
        .forEach( d => {
            d.classList.add('d-none');
        }) 
    //and show the picked one 
    let newDiceId = 'dice-'+dice;
    document.getElementById(newDiceId).classList.remove('d-none');
}

const displayWinner = (player) => {
    let msg = getGameStat(player,'pseudo')+' is the winner! Congrats!!!';
    let el='';
    for(f=1;f<7;f++){
        el+= '<div class="firework" id="firework'+f+'">';
        for(e=0;e<12;e++){
            el+= '<div class="explosion"></div>';
        }
        el+='</div>';
    }
    setAnnouncementMessage(msg,el);
}

const setAnnouncementMessage = ( msg , el) => {
    if(el) {
        document.getElementById('winner').innerHTML= msg+el;
        winnerSound.currentTime = 0; winnerSound.play();
    } else {
        setContent( 'winner', msg);
    }
    toggleElement('winner');
}

newGame();
