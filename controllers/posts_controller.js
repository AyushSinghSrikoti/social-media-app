const post = require('../models/post');
const comment = require('../models/comment');

module.exports.create = function(req, res) {
    if (!req.body.content) {
      return res.status(400).send('Content is required');
    }
  
    post.create({
      content: req.body.content,
      user: req.user._id
    })
      .then((createdPost) => {
        console.log('Post created:', createdPost);
        return res.redirect('back');
      })
      .catch((error) => {
        console.error('Error creating post:', error);
        return res.status(500).send('Internal server error');
      });
  };
  
  module.exports.destroy = function(req, res) {
    post.findById(req.params.id)
      .then(post => {
        if (post.user == req.user.id) {
          return post.deleteOne();
        } else {
          throw new Error('Unauthorized');
        }
      })
      .then(() => {
        return comment.deleteMany({post: req.params.id});
      })
      .then(() => {
        res.redirect('back');
      })
      .catch(err => {
        res.status(500).send(err.message);
      });
  }
  
  