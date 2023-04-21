const post = require('../models/post');

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
  