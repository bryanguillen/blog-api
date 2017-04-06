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
});