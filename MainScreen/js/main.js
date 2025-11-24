import mqtt from "https://cdnjs.cloudflare.com/ajax/libs/mqtt/5.14.1/mqtt.esm.js"

const client = mqtt.connect("mqtt://pi00.local:9001")

// Lorsque la connexion à Mosquitto s'effectue
client.on("connect", () => {
    client.subscribe("js-connection")
})

// Lorsqu'on reçoit un message, peu importe le topic
client.on("message", (topic_buffer, message_buffer) => {
    const message = message_buffer.toString() // Converti le buffer en string
    const topic = topic_buffer.toString()
    const logo = document.getElementById("logo");
    const redemarrage = document.getElementById("redemarrage");
    if(topic === "js-connection" ){


    }
    if(topic === "js-restart-complete" ){
        redemarrage.style.display = "none";
    }
})
