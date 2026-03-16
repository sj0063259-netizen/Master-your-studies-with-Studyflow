let totalTime = 25 * 60;
let time = totalTime;
let timer = null;
let running = false;

const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const sessionType = document.getElementById("sessionType");
const timeLeft = document.getElementById("timeLeft");

function updateTimer(){

let minutes = Math.floor(time / 60);
let seconds = time % 60;

minutes = minutes < 10 ? "0" + minutes : minutes;
seconds = seconds < 10 ? "0" + seconds : seconds;

timerDisplay.innerText = minutes + ":" + seconds;

let remainingMinutes = Math.ceil(time / 60);
timeLeft.innerText = remainingMinutes + " minutes remaining";

}

function startTimer(){

if(running) return;

running = true;

timer = setInterval(()=>{

if(time > 0){

time--;
updateTimer();

}else{

clearInterval(timer);
running = false;

sessionType.innerText = "Break Time!";
alert("Session completed! Take a break.");

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

time = totalTime;
sessionType.innerText = "Work Session";

updateTimer();

}

startBtn.addEventListener("click",startTimer);
pauseBtn.addEventListener("click",pauseTimer);
resetBtn.addEventListener("click",resetTimer);

updateTimer();