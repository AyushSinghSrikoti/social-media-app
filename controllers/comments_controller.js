const comment = require('../models/comment');
const post = require('../models/post');

module.exports.create = function(req,res){
    post.findById(req.body.post)
        .then(function(post){
            if(post){
                comment.create({
                    content: req.body.content,
                    post: req.body.post,
                    user: req.user._id
                })
                .then(function(comment){
                    post.comments.push(comment);
                    post.save();
                    res.redirect('/');
                })
                .catch(function(err){
                    // handle error
                });
            }
        })
        .catch(function(err){
            // handle error
        });
}


