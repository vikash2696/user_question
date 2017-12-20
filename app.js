var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
//user service
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

users = [];
io.on('connection', function(socket) {

  //Get all records 
   Questions.find({},function(err,allquestion){
            if(err) {
                return false;
            }
            socket.emit('questionList',allquestion);
        }).sort({updated_at: -1});
  

   socket.on('question', function(data) {
      //Save question
       var saveQuestiondata = { 
            category: data.category,
            question: data.question,
            answer: data.answer,
            status: 'active',
            author: data.user
      };
      if(data.question_id) {
            Questions.findByIdAndUpdate(data.question_id,saveQuestiondata, function(err,savedquestion){
            if(err) {
                return  false;
            }
            io.socket.emit('newquestion',savedquestion);
            return true;
        });
      }else {
           Questions.create(saveQuestiondata ,function(err,savedquestion){
            if(err) {
               return  false;
            }
            io.socket.emit('newquestion',savedquestion);
            return true;
         });
      }

      });

   socket.on('editQuestion', function(data) {
        //update question
        let id = data.question_id;
        Questions.findById(id,function(err,question){
            if(err) {
                return false;
            }
            socket.emit('editQuestiondata',question);
        });
    });

    socket.on('deleteQuestion', function(data) {
        //update question
        let id = data.question_id;
        Questions.findByIdAndRemove(id,function(err,question){
            if(err) {
                return false;
            }
            io.socket.emit('deleted',question);
        });
      });
});

http.listen(3018, function() {
   console.log('listening on localhost:3018');
});
