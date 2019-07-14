const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('../auth');
const asyncHandler = require('express-async-handler');
const cors = require('cors');
const bodyParser = require('body-parser');
// BigchainDB driver
const BigchainDB = require('bigchaindb-driver');
// API URL
const API_PATH = 'http://localhost:9984/api/v1/';
// Connect Express to BigChainDB
const connection = new BigchainDB.Connection(API_PATH);
// Import user model
const Users = mongoose.model('Users');
const io = require('../../index.js').io;

const request = require('request');

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body);
    }
}

io.on("connection", socket => {
    console.log("New client connected");
    socket.on("outgoing data", data => {
      console.log(data)
      var dataString = 'temperature,location=vineyard temp='+data;
      console.log(dataString);
      var options = {
          url: 'http://localhost:8086/write?db=temperature_sensor&u=admin&p=admin',
          method: 'POST',
          body: dataString
      };
      request(options, callback);
      io.sockets.emit("outgoing data", data)
    });

    socket.on("outgoing data soil", data => {
      console.log("Soil: " + data)
      var dataString = 'moisture,location=vineyard moist='+data;
      console.log(dataString);
      var options = {
          url: 'http://localhost:8086/write?db=moisture_sensor&u=admin&p=admin',
          method: 'POST',
          body: dataString
      };
      request(options, callback);
      io.sockets.emit("outgoing data soil", data)
    });
    //A special namespace "disconnect" for when a client disconnects
    socket.on("disconnect", () => console.log("Client disconnected"));
});

router.get("/json", auth.required, (req, res) => {
    var location = {
   "type": "FeatureCollection",
   "features": [
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [8.63239, 39.7476]
    },
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [8.63240, 39.7475]
    },
  },
  {
    "type": "Feature",
    "geometry": {
       "type": "Point",
       "coordinates":  [8.63238, 39.7474]
    },
  },
]
}
    res.send(location);
});

router.get("/pump", (req, res) => {
  var headers = {
    'Content-Type': 'application/json'
  };

  var get_options = {
      url: 'http://w25.local/things/led/properties/on',
      method: 'GET',
  };

  request(get_options, callback);

  function callback(error, response, body) {
      if (!error && response.statusCode == 200) {
          var state = JSON.parse(body).on;

          var dataString = '{"on":'+ !state +'}';

          var options = {
              url: 'http://w25.local/things/led/properties/on',
              method: 'PUT',
              headers: headers,
              body: dataString
          };

          function mod_callback(error, response, body) {
              if (!error && response.statusCode == 200) {
                  console.log(body)
              }
          }
          request(options, mod_callback);
      }
  }
});


module.exports = router;
