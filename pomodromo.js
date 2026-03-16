let workTime = 25 * 60;
let breakTime = 5 * 60;

let time = workTime;
let timer = null;
let running = false;
let isWorkSession = true;
let sessionsCompleted = 0;

const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

const sessionType = document.getElementById("sessionType");
const timeLeft = document.getElementById("timeLeft");

function updateDisplay(){

let minutes = Math.floor(time / 60);
let seconds = time % 60;

minutes = minutes < 10 ? "0"+minutes : minutes;
seconds = seconds < 10 ? "0"+seconds : seconds;

timerDisplay.innerText = minutes + ":" + seconds;

let remainingMinutes = Math.ceil(time / 60);
timeLeft.innerText = remainingMinutes + " minutes remaining";

}

function startTimer(){

if(running) return;

running = true;

timer = setInterval(()=>{

time--;
updateDisplay();

if(time <= 0){

clearInterval(timer);
running = false;

if(isWorkSession){

sessionsCompleted++;
alert("Work session finished! Take a break.");

isWorkSession = false;
time = breakTime;
sessionType.innerText = "Break Session";

}else{

alert("Break finished! Back to work.");

isWorkSession = true;
time = workTime;
sessionType.innerText = "Work Session";

}

updateDisplay();

}

},1000);

}

function pauseTimer(){

clearInterval(timer);
running = false;

}

function resetTimer(){

clearInterval(timer);
running = false;

time = workTime;
isWorkSession = true;
sessionType.innerText = "Work Session";

updateDisplay();

}

startBtn.addEventListener("click",startTimer);
pauseBtn.addEventListener("click",pauseTimer);
resetBtn.addEventListener("click",resetTimer);

updateDisplay();