import mqtt from "https://cdnjs.cloudflare.com/ajax/libs/mqtt/5.14.1/mqtt.esm.js"

const client = mqtt.connect("mqtt://pi00.local:9001")

// Lorsque la connexion à Mosquitto s'effectue
client.on("connect", () => {
    client.subscribe("js-password")

    client.publish("js-password", "Hello MQTT de JS")
})

// Lorsqu'on reçoit un message, peu importe le topic
client.on("message", (topic, message_buffer) => {
    const message = message_buffer.toString() // Converti le buffer en string

    console.log(`${topic}: ${message}`)
})
const form = document.getElementById("login-form");
form.addEventListener("submit", (event)=>{
    event.preventDefault()
        console.log("asdasds")

    submitConnexion();
})
function submitConnexion(){
    let username = document.forms["login-form"]["username"].value;
    let password = document.forms["login-form"]["password"].value;
    const login = {
    username: username,
    password: password
    };  
  client.publish("js-login", JSON.stringify(login))
    client.publish("js-username", username)
}