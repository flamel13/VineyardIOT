const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
const errorHandler = require('errorhandler');
mongoose.promise = global.Promise;
//Configure isProduction variable
const isProduction = process.env.NODE_ENV === 'production';
const http = require('http')
const socketIO = require('socket.io')


//localhost port
const port = 4000
//Initiate our app
const app = express();
// our server instance
const server = http.createServer(app)
server.listen(8080, "127.0.0.1");
// This creates our socket using the instance of the server
var io = exports.io = socketIO(server);

app.use(cors());

//Configure our app
app.use(cors());
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'flamel13', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));

if(!isProduction) {
  app.use(errorHandler());
}

//Configure Mongoose
mongoose.connect('mongodb://localhost:20000/geofood', { useNewUrlParser: true });
mongoose.set('debug', false);

//Models and routes
require('./models/Users');
app.use(require('./routes'));

//Passport configuration
require('./config/passport');

app.listen(port, () => console.log('Server running on http://localhost:4000/'));
