const user = require('../models/user');
const fs = require('fs');
const path = require('path');


module.exports.profile = function(req, res) {
  user.findOne({_id: req.params.id}).exec()
    .then(function(user) {
      return res.render('user_profile', {
        title: 'User Profile',
        profile_user: user
      });
    })
    .catch(function(err) {
      console.log("Error:", err);
      return res.redirect('/');
    });
};


module.exports.update = async function(req, res) {
  try {
    if(req.user.id === req.params.id) {
      let updatedUser = await user.findByIdAndUpdate(req.params.id, req.body);
      updatedUser.uploadedAvatar(req,res,function(err){
        if(err){
          console.log('******multer error' , err);
        }

        updatedUser.name = req.body.name;
        updatedUser.email = req.body.email;

        if(req.file){

            if(updatedUser.avatar){
              fs.unlinkSync(path.join(__dirname+'..'+ updatedUser.avatar));
            }
          updatedUser.avatar = user.avatarPath+'/'+req.file.filename;
        }

        updatedUser.save();
        res.redirect('back');
      });
    } else {
      return res.status(401).send('Unauthorized');
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal Server Error');
  }
};






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
    req.flash('success' , 'Logged in successfully');
    return res.redirect('/');
}

module.exports.destroySession = function(req, res){
  req.logout(function(err) {
    if (err) {
      console.log('Error in destroying the session', err);
      return;
    }
    req.flash('success' , 'You have logged out');
    return res.redirect('/');
  });
}