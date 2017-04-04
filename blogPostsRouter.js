const express = require('express');
const router = express.Router();

//more dependencies and imports
const bodyParser = require('body-parser');
const {BlogPosts} = require('./model');
const jsonParser = bodyParser.json();

//add some blog posts to look at the data. 
BlogPosts.create('The First Blog Post', 'This is my first blog post',
				'Bryan Guillen', '4/4/2017');

router.get('/', (req, res) => {
	res.status(200).send(BlogPosts.get());
});

module.exports = router;