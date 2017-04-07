const express = require('express');

//other dependencies and then imports
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const blogPostsRouter = require('./blogPostsRouter');
const jsonParser = bodyParser.json(); 
const {PORT, DATABASE_URL} = require('./config'); //constants for app

mongoose.Promise = global.Promise 

//starting app 
const app = express();

//log http layer 
app.use(morgan('common'));

// this function connects to our database, then starts the server
function runServer(databaseUrl=DATABASE_URL, port=PORT) {

  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

// this function closes the server, and returns a promise that we'll
//use in integreation test later
function closeServer() {
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err));
};


//use route
//TEMPORARY COMMENT OUT!
app.use('/posts', blogPostsRouter);

module.exports = {app, runServer, closeServer};