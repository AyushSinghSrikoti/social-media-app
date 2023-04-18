const user = require('../models/user');

module.exports.profile = function(req, res){
    return res.render('user_profile', {
        title: 'User Profile'
    })
}

module.exports.signUp = function(req,res){
    if(req.isAuthenticated()){
      return res.redirect('/users/profile');
    }

    return res.render('user_sign_up' ,{
        title: "bruhgram | sign up"
    })
}

module.exports.signIn = function(req,res){
    if(req.isAuthenticated()){
      return res.redirect('/users/profile');
    }
  
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
  

module.exports.createSession = function(req,res){
    return res.redirect('/');
}

module.exports.destroySession = function(req, res){
  req.logout(function(err) {
    if (err) {
      console.log('Error in destroying the session', err);
      return;
    }
    return res.redirect('/');
  });
}