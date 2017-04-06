//imports and requirements
const chai = require('chai');
const chaiHttp = require('chai-http');
const {app, runServer, closeServer} = require('../server');
const should = chai.should();

//allowing for http integration testing
chai.use(chaiHttp);

describe('Blog Post API Endpoints', function() {
	//before makes sure the server is running and after makes sure to close it to stop any funny behavior
	before(function() {
    	return runServer();
 	});

	after(function() {
    	return closeServer();
  	});

  	it('should GET all blog post resources', function() {
  		return chai.request(app)
  			.get('/blog-posts')
  			.then(function(res) {
  				res.should.have.status(200);
  				res.should.be.json;
  				res.body.should.be.a('array');
  				res.body.length.should.be.at.least(1);
  				const expectedKeys = ['id', 'title', 'content', 'author', 'publishDate'];
  				res.body.forEach(function(item) {
  					item.should.be.a('object');
  					item.should.include.keys(expectedKeys);
  				});
  			});
  	});

  	it('should POST new blog post resource', function() {
  		const newPost = {
  			title: "Hello Universe", 
  			content: "I am the hello world enemy", 
  			author: "Bryan G", 
  			publishDate: "4/5/2017"
  		};
  		return chai.request(app)
  			.post('/blog-posts')
  			.send(newPost)
  			.then(function(res) {
  				res.should.have.status(201);
  				res.should.be.json;
  				res.body.should.be.a('object');
  				res.body.should.include.keys('title', 'content', 'author', 'publishDate');
  				res.body.id.should.not.be.null;

  			});
  	});	

  	it('should PUT / update existing blog post', function() {
  		const updateData = {
      		title: 'foo',
      		content: 'hello world',
      		author: 'Bryan Guillen',
      		publishDate: '4/5/2017'
    	};

    	return chai.request(app)
      		.get('/blog-posts')
      		.then(function(res) {
        		updateData.id = res.body[0].id;
        		return chai.request(app)
          			.put(`/blog-posts/${updateData.id}`)
          			.send(updateData);
      		});
  	});

  	it('should DELETE existing blog-posts', function() {
  		return chai.request(app)
      		.get('/blog-posts')
      		.then(function(res) {
        		return chai.request(app)
          			.delete(`/blog-posts/${res.body[0].id}`);
      		})
      		.then(function(res) {
		        res.should.have.status(204);
      		});
  	});
});