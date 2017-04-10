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
});