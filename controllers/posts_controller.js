const Post = require('../models/post');
const comment = require('../models/comment');

module.exports.create = async function(req, res) {
  try{
    let post = await Post.create({
        content: req.body.content,
        user: req.user._id
    });
    
    if (req.xhr){
        // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
        post = await post.populate('user', 'name');

        return res.status(200).json({
            data: {
                post: post
            },
            message: "Post created!"
        });
    }

    req.flash('success', 'Post published!');
    return res.redirect('back');

}catch(err){
    req.flash('error', err);
    // added this to view the error on console as well
    console.log(err);
    return res.redirect('back');
}
};

  
  module.exports.destroy = function(req, res) {
    Post.findById(req.params.id)
      .then(post => {
        if (post.user == req.user.id) {
          return post.deleteOne();
        } else {
          req.flash('success' , 'error');
          throw new Error('Unauthorized');
        }
      })
      .then(() => {
        return comment.deleteMany({post: req.params.id});
      })
      .then(() => {

        if(req.xhr){
          return res.status(200).json({
            data: {
              post_id: req.params.id
            },
            message: "post deleted successfully"
          })
        }

        req.flash('success' , 'post and comments deleted');
        res.redirect('back');
      })
      .catch(err => {
        req.flash('error' , 'post cant be  deleted');
        res.status(500).send(err.message);
      });
  }
  