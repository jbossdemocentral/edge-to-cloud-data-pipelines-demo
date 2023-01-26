// Set constraints for the video stream
var constraints = { video: { facingMode: "user" }, audio: false };
var track = null;

// Define constants
const cameraView = document.querySelector("#camera--view"),
    cameraOutput = document.querySelector("#camera--output"),
    cameraSensor = document.querySelector("#camera--sensor"),
    cameraTrigger = document.querySelector("#camera--trigger"),

    btnHttp = document.querySelector("#protocol--http"),
    btnMqtt = document.querySelector("#protocol--mqtt"),

    filePicker = document.querySelector("#fileInput");

// Access the device camera and stream to cameraView
function cameraStart() {
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function(stream) {
            track = stream.getTracks()[0];
            cameraView.srcObject = stream;
        })
        .catch(function(error) {
            console.error("Oops. Something is broken.", error);
        });
}

// Take a picture when cameraTrigger is tapped
cameraTrigger.onclick = function() {
    cameraSensor.width = cameraView.videoWidth;
    cameraSensor.height = cameraView.videoHeight;

    // fwidth = 400
    // factor = fwidth/cameraSensor.width
    // fheight = cameraSensor.height * factor

    cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
    // cameraSensor.getContext("2d").drawImage(cameraView, 0, 0, fwidth, fheight);
    cameraOutput.src = cameraSensor.toDataURL("image/jpeg");
    cameraOutput.classList.add("taken");

    btnHttp.hidden = false
    btnMqtt.hidden = false

    // sendHttp(cameraOutput.src)
    // track.stop();
};

function resizeImage(base64Str) {

    var img = new Image();
    img.src = base64Str;
    var canvas = document.createElement('canvas');
    var MAX_WIDTH = 400;
    var MAX_HEIGHT = 350;
    var width = img.width;
    var height = img.height;

    if (width > height) {
      if (width > MAX_WIDTH) {
        height *= MAX_WIDTH / width;
        width = MAX_WIDTH;
      }
    } else {
      if (height > MAX_HEIGHT) {
        width *= MAX_HEIGHT / height;
        height = MAX_HEIGHT;
      }
    }
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);
    return canvas.toDataURL("image/jpeg");
  }


// Send via HTTP when the button is tapped
btnHttp.onclick = function() {
    sendHttp(cameraOutput.src)
};

// Send via MQTT when the button is tapped
btnMqtt.onclick = function() {
    sendMqtt(cameraOutput.src)
};

// called when the MQTT client connects
function onConnect() {
    // Once a connection has been made, make a subscription and send a message.
    console.log("MQTT: connected to broker");
}

fileInput.onchange= function(event) {

	// var image = document.getElementById('outputHttp');
	// image.src = URL.createObjectURL(event.target.files[0]);
	
    file = event.target.files[0];

    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {


        cameraOutput.src = reader.result;
 
        cameraSensor.getContext("2d").drawImage(cameraOutput, 0, 0);


        cameraOutput.classList.add("taken");
    
        btnHttp.hidden = false
        btnMqtt.hidden = false

    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };

	// sendHttp(event.target.files[0]);

    // viaMqtt(event)
}


function sendHttp(srcImage) {
  
    const Http = new XMLHttpRequest();
    const url=window.origin+"/detection"

    Http.open("POST", url);
    Http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    reduced = resizeImage(srcImage)
    Http.send(JSON.stringify({ "image": reduced.replace("data:image/jpeg;base64,", "")}));

    Http.onreadystatechange = (e) => {
      console.log(Http.responseText)
    }	
}

function sendMqtt(srcImage) {
    reduced = resizeImage(srcImage)
    // jsonMsg = JSON.stringify({ "image": srcImage.replace("data:image/jpeg;base64,", "")})
    jsonMsg = JSON.stringify({ "image": reduced.replace("data:image/jpeg;base64,", "")})
    message = new Paho.MQTT.Message(jsonMsg);
    message.destinationName = "detection";
    client.send(message);
}


// Start the video stream when the window loads
window.addEventListener("load", cameraStart, false);





const brokerHost = window.location.hostname.replace("camel-edge", "broker-amq-mqtt")
var brokerPort = window.location.port 
const brokerUrl=window.location.href+"/test"

var brokerOptions = null

if (brokerPort == "8080"){
	//this is for local testing
	brokerPort = "1883"
	brokerOptions = {onSuccess:onConnect}
}
else{
	brokerPort = "443"
	brokerOptions = {useSSL:true,onSuccess:onConnect}
}

// Create a client instance
client = new Paho.MQTT.Client(brokerHost, Number(brokerPort), "CamelBrowserClient");

// set callback handlers
// client.onConnectionLost = onConnectionLost;
// client.onMessageArrived = onMessageArrived;

// connect the client
client.connect(brokerOptions);
