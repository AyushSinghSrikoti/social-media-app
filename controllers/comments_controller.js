const comment = require('../models/comment');
const post = require('../models/post');
const commentsMailer = require('../mailers/comments_mailer');


// module.exports.create = function(req,res){
//     post.findById(req.body.post)
//         .then(function(post){
//             if(post){
//                 comment.create({
//                     content: req.body.content,
//                     post: req.body.post,
//                     user: req.user._id
//                 })
//                 .then(function(comment){
//                     post.comments.push(comment);
//                     post.save();
//                     commentsMailer.newComment(comment);
//                     res.redirect('/');
//                 })
//                 .catch(function(err){
//                     // handle error
//                 });
//             }
//         })
//         .catch(function(err){
//             // handle error
//         });
// }


module.exports.create = async function(req, res){

    try{
        let previousPost = await post.findById(req.body.post);

        if (previousPost){
            let newComment = await comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });

            previousPost.comments.push(newComment);
            previousPost.save();
            
            newComment = await newComment.populate('user', 'name email');
            commentsMailer.newComment(newComment);
            if (req.xhr){
                
    
                return res.status(200).json({
                    data: {
                        comment: newComment
                    },
                    message: "Post created!"
                });
            }


            req.flash('success', 'Comment published!');

            res.redirect('/');
        }
    }catch(err){
        req.flash('error', err);
        return;
    }
    
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


