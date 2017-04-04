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

//use route
app.use('/blog-posts', blogPostsRouter);

app.listen(8080, () => {
  console.log(`Your app is listening on port 8080`);
});