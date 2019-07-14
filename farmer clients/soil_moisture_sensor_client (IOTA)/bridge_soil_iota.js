var awsIot = require('aws-iot-device-sdk');
var socketIOClient = require('socket.io-client');
const endpoint = "http://127.0.0.1:8080";
const socket = socketIOClient(endpoint);
var figlet = require('figlet');
const MAMChannel = require('./MAMChannel.js');


// Amazon NODEMCU device configuration
var device = awsIot.device({
  // begin keys, private key, user certificate, root certificate
  keyPath: 'cert/NodeMCUSoil.private.key',
  certPath: 'cert/NodeMCUSoil.cert.pem',
  caPath: 'cert/root-CA.crt',
  // end keys
  host: 'a24tnq52e443wf-ats.iot.us-east-2.amazonaws.com',
  port: 8883,
  // Client id allowed to post data into Amazon AWS
  clientId: 'client_id_that_is_allowed',
  // Amazon account regione
  region: 'us-east-2'
});

figlet('Soil Moisture Sensor + IOTA', function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data)
});

var myMAMChannel = new MAMChannel(
  'private',
  'https://nodes.devnet.iota.org:443',
  'th3s33dk3y',
  ''
);

myMAMChannel.openChannel();
var root = myMAMChannel.getRoot();

console.log(root);

// If the device is connected subscribe to topic_1
device.on('connect', function() {
  console.log('connected');
  device.subscribe('topic_1');
});


// Receive the data from AWS via pubsub from NODEMCU
device.on('message', function(topic, payload) {
  var message = payload.toString('utf8');
  var intermediateMsg = '{"location": "Vineyard", "device": "NodeMCU", "moisture":' + message + '}'
  var jsonMessage = JSON.parse(intermediateMsg);
  console.log(intermediateMsg);
  myMAMChannel.publish(jsonMessage);

  myMAMChannel.fetchFrom(root).then(fetchedData => {
    console.log(fetchedData);
  })
});

console.log('Sensor subscriber started.');
