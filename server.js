const express = require('express');

//other dependencies and then imports
const morgan = require('morgan');
const bodyParser = require('body-parser');
const {BlogPosts} = require('./model')
const blogPostsRouter = require('./blogPostsRouter');
const jsonParser = bodyParser.json();

//starting app 
const app = express();

//log http layer 
app.use(morgan('common'));

function runServer() {
  const port = process.env.PORT || 8080;
  return new Promise((resolve, reject) => {
    server = app.listen(port, () => {
      console.log(`Your app is listening on port ${port}`);
      resolve(server);
    }).on('error', err => {
      reject(err)
    });
  });
}

function closeServer() {
  return new Promise((resolve, reject) => {
    console.log('Closing server');
    server.close(err => {
      if (err) {
        reject(err);
        // so we don't also call `resolve()`
        return;
      }
      resolve();
    });
  });
}

//use route
app.use('/blog-posts', blogPostsRouter);

if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};