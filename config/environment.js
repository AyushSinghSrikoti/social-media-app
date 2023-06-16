const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');



const logDirectory = path.join(__dirname , '../production_logs');
fs.existsSync(logDirectory)|| fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log' , {
  interval: '1d',
  path: logDirectory
});


const development = {
    name: 'development',
    asset_path:'./assets',
    session_cookie_key: 'blahsomething',
    db: 'bruhgram_development',
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'srikotigadwali@gmail.com',
          pass: 'angprmspjsamzzhj'
        }
      },
    
    google_clientID: "130798080418-dkn2v1qeb68euh24ng9tjqc6l0t4ma30.apps.googleusercontent.com",
    google_clientSecret: "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",
    google_callbackURL: "http://localhost:8080/users/auth/google/callback",
    jwt_secret: 'bruhgram',
    morgan: {
      mode: 'dev',
      options: {stream: accessLogStream}
    }
}

const production = {
    name: 'production',
    asset_path: process.env.BRUHGRAM_ASSET_PATH,
    session_cookie_key: process.env.BRUHGRAM_SESSION_COOKIE_KEY,
    db: process.env.BRUHGRAM_DB,
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.BRUHGRAM_GMAIL_USERNAME,
          pass: process.env.BRUHGRAM_GMAIL_PASSWORD
        }
      },
    
    google_clientID: process.env.GOOGLE_CLIENT_ID,
    google_clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    google_callbackURL: process.env.GOOGLE_CALLBACK_URL,
    jwt_secret: process.env.BRUHGRAM_JWT_SECRET,
    morgan: {
      mode: 'combine',
      options: {stream: accessLogStream}
    }
}


module.exports = eval(process.env.BRUHGRAM_ENVIRONMENT)==undefined ? development : eval(process.env.BRUHGRAM_ENVIRONMENT);