var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
//user service
var Users = require('./service/questionService');
var routes = require('./routes/index');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

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






app.get('/', function(req, res) {
   res.sendfile('index.html');
});

app.use('/user',routes);


users = [];
io.on('connection', function(socket) {

   socket.emit('validuser','true');

   socket.on('msg', function(data) {
      //Send message to everyone
      add_question(data,function(res){

         io.sockets.emit('newmsg', data);
      });
   })
});

var Questions = require('./service/questionService');
// console.log(Questions); 
var add_question = function (status,callback) {

   // app.post('/question',function(req,res){

   Questions.create({
            category: req.body.category,
            question: req.body.question,
            answer: req.body.answer,
            status: req.body.status,
            author: req.body.author,
            created_at: req.body.created_at,
            updated_at : req.body.updated_at
   },function(err,saveduser){
      if(err) {
         callback(false);
         return;
         return   res.status(500).send({err:"Name is required Filed"});
      }
       callback(true);
       return;
      return   res.status(200).json(saveduser);
   });
// });
}

http.listen(3018, function() {
   console.log('listening on localhost:3018');
});
