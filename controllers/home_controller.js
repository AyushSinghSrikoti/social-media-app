const Post = require('../models/post');
const user = require('../models/user');

module.exports.home = async function(req, res) {
  try {
    const posts = await Post.find({})
      .sort('-createdAt')
      .populate('user')
      .populate({
        path: 'comments',
        populate: {
          path: 'user'
        }
      })
      .exec();

    const users = await user.find({}).exec();

    res.render('home', {
      title: "bruhgram | Home",
      posts:  posts,
      all_users: users
    });
  } catch(err) {
    console.log(err);
    return;
  }
}


