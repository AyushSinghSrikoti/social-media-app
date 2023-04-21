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


module.exports.destroy = function(req, res) {
    comment.findById(req.params.id).exec()
    .then(function(comment) {
        if(comment.user == req.user.id) {
            let postId = comment.post;
            return comment.deleteOne()
            .then(function() {
                return post.findByIdAndUpdate(postId, {$pull: {comments: req.params.id}}, {new: true}).exec();
            })
            .then(function(post) {
                return res.redirect('back');
            })
            .catch(function(err) {
                console.log(err);
                return res.redirect('back');
            });
        } else {
            return res.redirect('back');
        }
    })
    .catch(function(err) {
        console.log(err);
        return res.redirect('back');
    });
}


