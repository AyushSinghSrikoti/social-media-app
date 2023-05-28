const nodemailer = require('../config/nodemailer');

exports.newComment = async (comment) => {
  try {
    let htmlString = await nodemailer.renderTemplate({ comment: comment }, '/comments/new_comment.ejs');

    nodemailer.transporter.sendMail({
      from: 'ayushsinghsrikoti@gmail.com',
      to: comment.user.email,
      subject: "new comment",
      html: htmlString
    }, (err, info) => {
      if (err) {
        console.log('Error in sending mail:', err);
        return;
      }

      console.log('Message sent:', info);
      return;
    });
  } catch (err) {
    console.log('Error in rendering template:', err);
  }
};
