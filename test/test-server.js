//imports and requirements
const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const {app, runServer, closeServer} = require('../server');
const {BlogPost} = require('../model')
const should = chai.should();
const mongoose = require('mongoose');
const {TEST_DATABASE_URL} = require('../config');

//allowing for http integration testing
chai.use(chaiHttp);

function randomPost() {
	let post = {
		title: "Random Post",
		content: "Lorem Ipsum",
		author: {
      		firstName: faker.name.firstName(),
      		lastName: faker.name.lastName()
    	},
		publishDate: Date.now()
	};
	return post;
}

function seedDatabase() {
	let seedData = [];
	for(let i=0; i<10; i++) {
		seedData.push(randomPost());
	};
	return BlogPost.insertMany(seedData);
}

function tearDownDatabase() {
	return mongoose.connection.dropDatabase();
}

describe('Blog Post API Endpoints', function() {
//before makes sure the server is running and after makes sure to close it to stop any funny behavior
 	before(function() {
     	return runServer(TEST_DATABASE_URL);
  	});

 	beforeEach(function() {
 		return seedDatabase();
 	});

 	afterEach(function() {
 		return tearDownDatabase();
 	})

 	after(function() {
     	return closeServer();
   	});

 	describe('GET ALL RESOURCES', function() {
 		//testing strategy
 		//should get all of the resources from endpoint
 		let res;
 		it('should show all posts', function() {
 			return chai.request(app)
 				.get('/posts')
 				.then(function(_res) {
 					res = _res;
 					res.should.have.status(200);
 					res.should.be.json;
 					res.body.should.be.a('object');
 					return BlogPost.count();
 				})
 				then(function(count) {
 					//make sure there is consistency between db and the response object length
 					res.body.posts.should.have.length.of(count);
 				});
 		});
 	})

 	describe('POST NEW RESOURCE', function(){
 		//CREATE A NEW RESOURCE
 		//Verify this by checking that it returns the correct status code
 		//it returns the json rep of the new post
 		//check that it is persisted into the database
 		let res; 
 		let newPost = randomPost();
 		it('should create and show the new post', function() {
 			return chai.request(app)
 				.post('/posts')
 				.send(newPost)
 				then(function(_res) {
 					res = _res;
 					res.should.have.status(201);
 					res.should.be.json;
 					res.should.include.keys(
 						'title', 'content', 'author', 'firstName', 'lastName', 'publishDate'
 					)
 					res.should.not.be.null;
 					return BlogPost.findById(res.body.id)
 				})
 				.then(function(post) {
 					post.title.should.equal(newPost.title);
 					post.content.should.equal(newPost.content);
 					post.author.firstName.should.equal(newPost.author.firstName);
 					post.author.lastName.should.equal(newPost.author.lastName);
 					post.author.publishDate.should.equal(newPost.publishDate);
 				});
 		});
 	})

 	describe('UPDATE CURRENT RESOURCE', function() {
 		//UPDATE EXISTING REOURCE
 		//Strategy
 		//make sure we get the correct status code,
 		//it has been updated in database
 		let updateData = {
 			title: "New Title",
 			content: "New Content",
 			author: {
 				firstName: "",
 				lastName: ""
 			},
 			publishDate: ""
 		}
 		it('should update existing post', function() {
 			return BlogPost
 				.findOne()
 				.exec()
 				.then(function(post) {
 					updateData.id = post.id;
 					updateData.author.firstName = post.author.firstName;
 					updateData.author.lastName = post.author.lastName;
 					updateData.publishDate = post.publishDate;
 					return chai.request(app)
 						.put(`/posts/${post.id}`)
 						.send(updateData)
 				})
 				.then(function(res) {
 					res.should.have.status(204);
 					return BlogPost.findById(updateData.id).exec()
 				})
 				.then(function(updatedPost) {
 					updatedPost.title.should.equal(updateData.title);
 					updatedPost.content.should.equal(updateData.content);
 				})
 		});
 	});

 	describe('DELETE ENDPOINT', function() {
 		let post;
 		it('should remove post permenantly', function() {
 			BlogPost
  				.findOne()
  				.exec()
  				.then(function(_post) {
    			post = _post;
    			return chai.request(app).delete(`/restaurants/${restaurant.id}`);
  				})
  				.then(function(res) {
    				res.should.have.status(204);
    				return BlogPost.findById(posts.id).exec();
  				})
  				.then(function(_post) {
    				should.not.exist(_post);
  				});
 		})
 	})

});