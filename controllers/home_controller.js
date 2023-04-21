const Post = require('../models/post');

module.exports.home = function(req, res){

  // populate the user of each post
  Post.find({}).populate('user')
    .populate({
      path: 'comments',
      populate: {
        path: 'user'
      }
    })
    .exec()
    .then(function(posts){
      return res.render('home', {
          title: "bruhgram | Home",
          posts:  posts
      });
    })
    .catch(function(err){
      console.log(err);
      return;
    });
}
