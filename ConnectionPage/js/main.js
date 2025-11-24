import mqtt from "https://cdnjs.cloudflare.com/ajax/libs/mqtt/5.14.1/mqtt.esm.js"

const client = mqtt.connect("mqtt://pi00.local:9001")

// Lorsque la connexion à Mosquitto s'effectue
client.on("connect", () => {
    client.subscribe("js-connection")
    client.subscribe("js-connection-attempt")
    client.subscribe("js-restart-complete")
    client.subscribe("temperature_js")
    client.subscribe("start-countdown")
})

const form = document.getElementById("login-form");
const logo = document.getElementById("logo");
const redemarrage = document.getElementById("redemarrage");
const feedbackElement = document.getElementById("feedback");
const mainPage = document.getElementById("mainPage");
const temperatureDisplay = document.getElementById("temperature");   
const countdownDisplay = document.getElementById("countdown");
const defaiteImage = document.getElementById("defaite");

form.addEventListener("submit", (event) => {
    event.preventDefault();
    submitConnexion();
});

client.on("message", (topic_buffer, message_buffer) => {
    const message = message_buffer.toString(); // Converti le buffer en string
    const topic = topic_buffer.toString();

    console.log(`Message reçu sur le topic ${topic} : ${message}`);
    if(topic === "start-countdown"){
        if (window.countdownInterval) {
            clearInterval(window.countdownInterval);
            window.countdownInterval = null;
        }
        let remaining = 20;
        countdownDisplay.style.display = "block";
        countdownDisplay.textContent = `Temps restant : ${remaining}s`;
        window.countdownInterval = setInterval(() => {
            remaining--;
            if (remaining > 0) {
                countdownDisplay.textContent = `Temps restant : ${remaining}s`;
            } else {
                clearInterval(window.countdownInterval);
                window.countdownInterval = null;
                countdownDisplay.textContent = "Temps écoulé";
                // afficher l'image de défaite et masquer la page principale si souhaité
                defaiteImage.style.display = "block";
                mainPage.style.display = "none";
            }
        }, 1000);
    }
    else if(topic === "temperature_js"){
        temperatureDisplay.textContent = `Température actuelle : ${message} °C`;
    }
    else if(topic === "js-restart-complete" ){
        redemarrage.style.display = "none";
        mainPage.style.display = "block";
    }     
    else if(topic === "js-connection" && message === "connexion"){
        form.style.display = "none";
        redemarrage.style.display = "block";
    }
    else if (topic === "js-connection" && message === "buttonPressed"){
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
    client.publish("js-login", JSON.stringify(login));
    client.publish("js-username", username);
}