var Questions = require('../service/questionService');

module.exports = {

    create(req,res){
       console.log("saveing questions");    
        Questions.create({
            category: req.body.category,
            question: req.body.question,
            answer: req.body.answer,
            status: req.body.status,
            author: req.body.author,
            created_at: req.body.created_at,
            updated_at : req.body.updated_at
        },function(err,savedquestion){
            if(err) {
                return  res.status(500).send({err:"Something error"});
            }
            return  res.status(200).json(savedquestion);
        });
    }

};
