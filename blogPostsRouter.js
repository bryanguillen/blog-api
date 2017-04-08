const express = require('express');
const router = express.Router();

//more dependencies and imports
const bodyParser = require('body-parser');
const {BlogPost} = require('./model');
const {DATABASE_URL, PORT} = require('./config');
const jsonParser = bodyParser.json();

//add some blog posts to look at the data. 
router.get('/', (req, res) => {
	BlogPost
		.find()
		.limit(10)
		.exec()
		.then(posts => {
			res.json({
				posts: posts.map(
					(post) => post.apiRepr())
			});
		})
		.catch(err => {
			console.error(err);
			res.status(500).json({errorMessage: 'Internal Server Error'});
		})
});

router.get('/:id', (req, res) => {
	BlogPost
		.findById(req.params.id)
		.exec()
		.then(post => res.json(post.apiRepr()))
		.catch(err => {
		 	console.error(err);
		 	res.status(500).json({errorMessage: 'Internal Server Error'});
		})
});

router.post('/', jsonParser, (req, res) => {
	const requiredFields = ['title', 'content', 'author', 'publishDate'];
	for(let i=0, length=requiredFields.length; i<length; i++) {
		let field=requiredFields[i]; 
		if(!(field in req.body)) {
			console.error('There is a body missing!')
			return res.status(400).send(`${field} is missing from the request body`)
		}
	}

	BlogPost
		.create({
			title: req.body.title,
			content: req.body.content, 
			author: req.body.author,
			publishDate: req.body.publishDate || Date.now()
		})
		.then(post => res.status(201).json(post.apiRepr()))
		.catch(err => {
			console.error(err);
			return res.status(500).json({errorMessage: 'Internal Server Error'});
		});
});	

router.put('/:id', jsonParser, (req, res) => {
	BlogPost
		.findByIdAndUpdate(req.params.id, {$set: {
			title: req.body.title,
			content: req.body.content, 
			author: req.body.author,
			publishDate: req.body.publishDate	
		}})
		.exec()
		.then(res.status(204).end());
});

router.delete('/:id', (req, res) => {
	BlogPost
		.findByIdAndRemove(req.params.id, function(err) {
			if(err) {
				console.error(err);
				return res.status(500).json({errorMessage: 'Internal Server Error'});				
			}
		})
		.exec()
		.then(res.status(204).end());
});

module.exports = router;