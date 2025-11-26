import mqtt from "https://cdnjs.cloudflare.com/ajax/libs/mqtt/5.14.1/mqtt.esm.js"

const client = mqtt.connect("mqtt://pi00.local:9001")

// Lorsque la connexion à Mosquitto s'effectue
client.on("connect", () => {
    client.subscribe("js-connection")
    client.subscribe("js-connection-attempt")
    client.subscribe("js-restart-complete")
    client.subscribe("temperature_js")
    client.subscribe("start-countdown")
    client.subscribe("stop-countdown")
})

const form = document.getElementById("login-form");
const logo = document.getElementById("logo");
const redemarrage = document.getElementById("redemarrage");
const feedbackElement = document.getElementById("feedback");
const mainPage = document.getElementById("mainPage");
const temperatureDisplay = document.getElementById("temperature");   
const countdownDisplay = document.getElementById("countdown");
const defaiteImage = document.getElementById("defaite");
let victoire = false;
let buttonPressed = false;

// Timer variables
let countdownTimer = null;
let timeRemaining = 0;

form.addEventListener("submit", (event) => {
    event.preventDefault();
    submitConnexion();
});

client.on("message", (topic_buffer, message_buffer) => {
    const message = message_buffer.toString(); // Converti le buffer en string
    const topic = topic_buffer.toString();

    console.log(`Message reçu sur le topic ${topic} : ${message}`);
    if(topic === "start-countdown"){
        startCountdown(20);
    }
    else if(topic === "stop-countdown"){
        stopCountdown();
        victoire = true;
    }
    else if(topic === "temperature_js"){
        if(victoire){
            temperatureDisplay.textContent = `Température actuelle : ${parseFloat(message)} °C`;
        }
        else{
            temperatureDisplay.textContent = `Température actuelle : ${parseFloat(message) + 15} °C`;
        }
    }
    else if(topic === "js-restart-complete" ){
        redemarrage.style.display = "none";
        mainPage.style.display = "block";
    }     
    else if(topic === "js-connection" && message === "connexion"){
        form.style.display = "none";
        redemarrage.style.display = "block";
    }
    else if (topic === "js-connection" && message === "buttonPressed" && !buttonPressed){
        buttonPressed = true;
        logo.style.display = "none";
        form.style.display = "block";
    }
    else if(message === "tentative de connexion"){
        feedbackElement.textContent = "Touchez le senseur pour valider la connexion.";
    }
    else{
        feedbackElement.textContent = "Erreur de connexion.";
    }
});

function submitConnexion(){
    let username = document.forms["login-form"]["username"].value;
    let password = document.forms["login-form"]["password"].value;
    const login = {
        username: username,
        password: password
    };  
    victoire = false;
    client.publish("js-login", JSON.stringify(login));
    client.publish("js-username", username);
}

function startCountdown(seconds){
    if(countdownTimer){
        clearInterval(countdownTimer);
    }
    
    timeRemaining = seconds;
    updateCountdownDisplay();
    
    countdownTimer = setInterval(() => {
        timeRemaining--;
        updateCountdownDisplay();
        
        if(timeRemaining <= 0){
            clearInterval(countdownTimer);
            countdownTimer = null;
            defaiteImage.style.display = "block";
            mainPage.style.display = "none";
            client.publish("countdown-finished", "true");
        }
    }, 1000);
}

function stopCountdown(){
    if(countdownTimer){
        clearInterval(countdownTimer);
        countdownTimer = null;
        countdownDisplay.textContent = `Compte à rebours arrêté à ${formatTime(timeRemaining)}`;
    }
}

function updateCountdownDisplay(){
    countdownDisplay.textContent = `Temps restant : ${formatTime(timeRemaining)}`;
}

function formatTime(seconds){
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}