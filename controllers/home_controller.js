const Post = require('../models/post');
const user = require('../models/user');

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

      user.find({}).exec()
        .then(function(users) {
          return res.render('home', {
            title: "bruhgram | Home",
            posts:  posts,
            all_users: users
          });
        })
        .catch(function(err) {
          console.log(err);
          return;
        });
    })
    .catch(function(err){
      console.log(err);
      return;
    });
}

