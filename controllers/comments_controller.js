// const comment = require('../models/comment');
// const post = require('../models/post');
// const commentsMailer = require('../mailers/comments_mailer');
// const commentEmailWorker = require('../workers/comment_email_worker');
// const queue = require('../config/kue');
// const Likes = require("../models/like");


// module.exports.create = async function(req, res){

//     try{
//         let previousPost = await post.findById(req.body.post);

//         if (previousPost){
//             let newComment = await comment.create({
//                 content: req.body.content,
//                 post: req.body.post,
//                 user: req.user._id
//             });

//             previousPost.comments.push(newComment);
//             previousPost.save();
            
//             newComment = await newComment.populate('user', 'name email');
//             // commentsMailer.newComment(newComment);

//             let job = queue.create('emails' , newComment).save(function(err){
//                 if(err){
//                     console.log('error in creating a queue');
//                 }

//                 console.log('job enqueued' , job.id);
//             });


//             if (req.xhr){
                
    
//                 return res.status(200).json({
//                     data: {
//                         comment: newComment
//                     },
//                     message: "Post created!"
//                 });
//             }


//             req.flash('success', 'Comment published!');

//             res.redirect('/');
//         }
//     }catch(err){
//         req.flash('error', err);
//         return;
//     }
    
// }


// module.exports.destroy = async function(req, res) {
//     try {
//       const commentToDelete = await comment.findById(req.params.id).exec();
  
//       if (commentToDelete.user == req.user.id) {
//         const postId = commentToDelete.post;
  
//         await commentToDelete.deleteOne();
//         await post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id } }, { new: true }).exec();

//         await Likes.deleteMany({ likeable: comment._id, onModel: "Comment" });
  
//         return res.redirect('back');
//       } else {
//         return res.redirect('back');
//       }
//     } catch (err) {
//       console.log(err);
//       return res.redirect('back');
//     }
//   };


const Comment = require('../models/comment');
const Post = require('../models/post');
const commentsMailer = require('../mailers/comments_mailer');
const queue = require('../config/kue');
const commentEmailWorker = require('../workers/comment_email_worker');
const Like = require('../models/like');

module.exports.create = async function(req, res){

    try{
        let post = await Post.findById(req.body.post);

        if (post){
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });

            post.comments.push(comment);
            post.save();
            
            comment = await comment.populate('user', 'name email');
            // commentsMailer.newComment(comment);

            let job = queue.create('emails', comment).save(function(err){
                if (err){
                    console.log('Error in sending to the queue', err);
                    return;
                }
                console.log('job enqueued', job.id);

            })

            if (req.xhr){
                
    
                return res.status(200).json({
                    data: {
                        comment: comment
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


module.exports.destroy = async function(req, res){

    try{
        let comment = await Comment.findById(req.params.id);

        if (comment.user == req.user.id){

            let postId = comment.post;

            comment.remove();

            let post = Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id}});

            // CHANGE :: destroy the associated likes for this comment
            await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});


            // send the comment id which was deleted back to the views
            if (req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }


            req.flash('success', 'Comment deleted!');

            return res.redirect('back');
        }else{
            req.flash('error', 'Unauthorized');
            return res.redirect('back');
        }
    }catch(err){
        req.flash('error', err);
        return;
    }
    
}