const user = require('../models/user');

module.exports.profile = function(req, res) {
    if (req.cookies.user_id) {
      user.findById(req.cookies.user_id)
        .then(function(user) {
          if (user) {
            return res.render('user_profile', {
              title: "user profile",
              user: user
            });
          }
          return res.redirect('/users/sign-in');
        })
        .catch(function(err) {
          console.log('Error in finding user in profile', err);
          return res.redirect('/users/sign-in');
        });
    } else {
      return res.redirect('/users/sign-in');
    }
  }
  

module.exports.signUp = function(req,res){
    return res.render('user_sign_up' ,{
        title: "bruhgram | sign up"
    })
}

module.exports.signIn = function(req,res){
    return res.render('user_sign_in' ,{
        title: "bruhgram | sign in"
    })
}

//get sign up , sign in data

module.exports.create = function(req, res) {
    if (req.body.password != req.body.confirm_password) {
      return res.redirect('back');
    }
  
    user.findOne({ email: req.body.email })
      .then(existingUser => {
        if (existingUser) {
          return res.redirect('back');
        }
        return user.create(req.body)
          .then(newUser => {
            return res.redirect('/users/sign-in');
          });
      })
      .catch(err => {
        console.log('Error in finding or creating user: ', err);
        return res.redirect('back');
      });
  }
  

  module.exports.createSession = function(req, res) {
    user.findOne({ email: req.body.email })
      .then(foundUser => {
        if (!foundUser) {
          return res.redirect('back');
        }
        if (foundUser.password !== req.body.password) {
          return res.redirect('back');
        }
        res.cookie('user_id', foundUser.id);
        return res.redirect('/users/profile');
      })
      .catch(err => {
        console.log('Error in finding user during sign-in:', err);
        return res.redirect('back');
      });
  }
  