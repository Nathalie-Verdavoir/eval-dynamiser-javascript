/*----- paraDice GAME ------*/
/*---BY Nathalie Verdavoir--*/
/*--------FOR STUDI---------*/
/*--------20211124----------*/

let gameStat = {};

//sounds
let sounds = ["rollingDiceSound" , "pickedDiceSound" , "looserDiceSound" , "holdSound" , "winnerSound"];
for(let title in sounds) {
    sounds[title] = new Audio('./sounds/'+sounds[title]+'.mp3');
    sounds[title].load();
}

const muteSounds = () => {
    for(let title of sounds) {
        title.volume = title.volume ? 0 : 1;
        document.querySelector(".mute").classList.toggle('notMuted');
    }
}

const resetPlaySound = s => {
    sounds[s].currentTime = 0; 
    sounds[s].play();
}

//add the event on every elements near the button (svg path included)
document.addEventListener('click', function (event) {
	if (!event.target.closest('.btn')) return;
    let functionToCall = event.target.closest('.btn').getAttribute('data-action')+'()';
        eval(functionToCall);
}, false);

//getters and setters
const setContent = (target, text) => document.getElementById(target).textContent = text;

const getClassList = el => document.getElementById(el).classList;

const getGameStat = (playerId, cat='current') => gameStat[playerId][cat];

const toggleElement = id => getClassList(id).toggle('invisible');

const getActivePlayerId = () =>getClassList('name-p1').contains('active') ? 'p1' : 'p2';

const arrElementToActive = ["name-p1","name-p2","bg-p1","bg-p2"];

const changeActivePlayer = () => {
    arrElementToActive.forEach(el => {
        getClassList(el).toggle("active"); 
    });
    getClassList('hold').add('invisible');
}

const dicesArray = document.getElementsByClassName("dice");

const changePseudo = () => {
    for (let i=1;i<3;i++) {
        const playerId = 'p'+i;
        const inputValue = document.getElementById("pseudo"+playerId+"Input").value;
        if( inputValue != gameStat[playerId]["pseudo"] 
         && inputValue !='' ) {
            gameStat[playerId]["pseudo"] = inputValue;
            setContent( "pseudo-"+playerId, getGameStat(playerId,'pseudo'));
        }
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
    for (let player of Object.keys(gameStat)) {
        for (let target of Object.keys(gameStat[player])) {
            setContent( target+"-"+player, getGameStat(player,target));
        }
    }
    toggleElement('roll');
    setAnnouncementMessage('WELCOME IN PARADICE !')
    getClassList('hold').add('invisible');
}

const roll = () => {
    let result = Math.floor(Math.random()*6)+1;
    animatedDice(result);
    getClassList('roll').add('disabled');
};

const displayResult = (result) => {
    //hide (with d-none) all of the svg of dices 
    [...dicesArray]
        .forEach( d => {
            d.classList.add('d-none');
        }) 
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
    setContent( 'current-'+getActivePlayerId(), getGameStat(getActivePlayerId()) );
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
}

const toggleAnimation = (el, animation) => {
    const classParentEl = document.getElementById(el)
                            .parentNode
                            .classList;
    classParentEl.add(animation);
    setTimeout(() => {classParentEl.remove(animation)}, 300);
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
const animatedDice = result => {
    for(let loop=1;loop<4;loop++){
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
    },
    1500);
}

const displayAnimated = (dice) => {
    //hide (with d-none) all of the svg of dices 
    [...dicesArray]
        .forEach( d => {
            d.classList.add('d-none');
        }) 
    //and show the picked one 
    let newDiceId = 'dice-'+dice;
    getClassList(newDiceId).remove('d-none');
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
        resetPlaySound(4);
    } else {
        setContent( 'winner', msg);
    }
    toggleElement('winner');
}

newGame();
