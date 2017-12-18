var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
//user service
var Users = require('./service/questionService');
var routes = require('./routes/index');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.set('views', __dirname + '/views');
app.set('view engine', 'html');

app.use(express.static(__dirname + '/public'));

//Mongo DB credentials
var mongoose = require('mongoose');
//mean_app is database name
var MONGO_DB_URI = 'mongodb://127.0.0.1/user_question';
mongoose.connect(MONGO_DB_URI, {
    useMongoClient: true
});

//Mongo connection success message
mongoose.connection.on('connected', function() {
    console.log('app is connected to mongodb ', MONGO_DB_URI);
});

mongoose.connection.on('error', err => {
    console.log('error while connecting to mongoose ', err);
});

var Questions = require('./service/questionService');

app.get('/', function(req, res) {
   res.sendfile('index.html');
});

app.use('/user',routes);


users = [];
io.on('connection', function(socket) {

   socket.emit('validuser','true');

   socket.on('question', function(data) {
      //Send message to everyone
        io.sockets.emit('newquestion', data);
           Questions.create({
            category: data.category,
            question: data.question,
            answer: data.answer,
            status: 'active',
            author: data.user
         },function(err,saveduser){
            if(err) {
               return  false;
            }
            return true;
         });

      });
});

http.listen(3018, function() {
   console.log('listening on localhost:3018');
});
