const post = require('../models/post');
const comment = require('../models/comment');

module.exports.create = async function(req, res) {
  try {
    if (!req.body.content) {
      return res.status(400).send('Content is required');
    }

    const createdPost = await post.create({
      content: req.body.content,
      user: req.user._id
    });

    req.flash('success' , 'post created');
    return res.redirect('back');
  } catch(error) {
    req.flash('error' , error);
    return res.status(500).send('Internal server error');
  }
};

  
  module.exports.destroy = function(req, res) {
    post.findById(req.params.id)
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
        req.flash('success' , 'post and comments deleted');
        res.redirect('back');
      })
      .catch(err => {
        req.flash('error' , 'post cant be  deleted');
        res.status(500).send(err.message);
      });
  }
  
  