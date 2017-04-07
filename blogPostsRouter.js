// const express = require('express');
// const router = express.Router();

// //more dependencies and imports
// const bodyParser = require('body-parser');
// const {BlogPosts} = require('./model');
// const jsonParser = bodyParser.json();

// //add some blog posts to look at the data. 
// BlogPosts.create('The First Blog Post', 'This is my first blog post',
// 				'Bryan Guillen', '4/4/2017');
// BlogPosts.create('The Second Blog Post', 'This is my second blog post',
// 				'Bryan Guillen', '4/4/2017');

// router.get('/', (req, res) => {
// 	res.status(200).send(BlogPosts.get());
// });

// router.post('/', jsonParser, (req, res) => {
// 	const requiredFields = ['title', 'content', 'author'];
// 	for(let i=0; i<requiredFields.length; i++) {
// 		const field = requiredFields[i];
// 		if(!(field in req.body)) {
// 			return res.status(400).send(`\`${field}\` is missing!`);
// 		}
// 	}
// 	const post = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
//   	res.status(201).json(post);
// });

// router.delete('/:id', (req, res) => {
// 	BlogPosts.delete(req.params.id);
// 	res.status(204).end();
// });

// router.put('/:id', jsonParser, (req, res) => {
//   const requiredFields = [
//   	'id', 'title', 'content', 'author', 'publishDate'];
//   for (let i=0; i<requiredFields.length; i++) {
//     const field = requiredFields[i];
//     if (!(field in req.body)) {
//       return res.status(400).send(`${field} is missing`);
//     }
//   }
//   if (req.params.id !== req.body.id) {
//     return res.status(400).send(`Ids need to match.`);
//   }
//   const updatedItem = BlogPosts.update({
//     id: req.params.id,
//     title: req.body.title,
//     content: req.body.content,
//     author: req.body.author,
//     publishDate: req.body.publishDate
//   });
//   res.status(204).json(updatedItem);
// });

// module.exports = router;