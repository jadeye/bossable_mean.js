'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Crudm = mongoose.model('Crudm'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, crudm;

/**
 * Crudm routes tests
 */
describe('Crudm CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Crudm
		user.save(function() {
			crudm = {
				name: 'Crudm Name'
			};

			done();
		});
	});

	it('should be able to save Crudm instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Crudm
				agent.post('/crudms')
					.send(crudm)
					.expect(200)
					.end(function(crudmSaveErr, crudmSaveRes) {
						// Handle Crudm save error
						if (crudmSaveErr) done(crudmSaveErr);

						// Get a list of Crudms
						agent.get('/crudms')
							.end(function(crudmsGetErr, crudmsGetRes) {
								// Handle Crudm save error
								if (crudmsGetErr) done(crudmsGetErr);

								// Get Crudms list
								var crudms = crudmsGetRes.body;

								// Set assertions
								(crudms[0].user._id).should.equal(userId);
								(crudms[0].name).should.match('Crudm Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Crudm instance if not logged in', function(done) {
		agent.post('/crudms')
			.send(crudm)
			.expect(401)
			.end(function(crudmSaveErr, crudmSaveRes) {
				// Call the assertion callback
				done(crudmSaveErr);
			});
	});

	it('should not be able to save Crudm instance if no name is provided', function(done) {
		// Invalidate name field
		crudm.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Crudm
				agent.post('/crudms')
					.send(crudm)
					.expect(400)
					.end(function(crudmSaveErr, crudmSaveRes) {
						// Set message assertion
						(crudmSaveRes.body.message).should.match('Please fill Crudm name');
						
						// Handle Crudm save error
						done(crudmSaveErr);
					});
			});
	});

	it('should be able to update Crudm instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Crudm
				agent.post('/crudms')
					.send(crudm)
					.expect(200)
					.end(function(crudmSaveErr, crudmSaveRes) {
						// Handle Crudm save error
						if (crudmSaveErr) done(crudmSaveErr);

						// Update Crudm name
						crudm.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Crudm
						agent.put('/crudms/' + crudmSaveRes.body._id)
							.send(crudm)
							.expect(200)
							.end(function(crudmUpdateErr, crudmUpdateRes) {
								// Handle Crudm update error
								if (crudmUpdateErr) done(crudmUpdateErr);

								// Set assertions
								(crudmUpdateRes.body._id).should.equal(crudmSaveRes.body._id);
								(crudmUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Crudms if not signed in', function(done) {
		// Create new Crudm model instance
		var crudmObj = new Crudm(crudm);

		// Save the Crudm
		crudmObj.save(function() {
			// Request Crudms
			request(app).get('/crudms')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Crudm if not signed in', function(done) {
		// Create new Crudm model instance
		var crudmObj = new Crudm(crudm);

		// Save the Crudm
		crudmObj.save(function() {
			request(app).get('/crudms/' + crudmObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', crudm.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Crudm instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Crudm
				agent.post('/crudms')
					.send(crudm)
					.expect(200)
					.end(function(crudmSaveErr, crudmSaveRes) {
						// Handle Crudm save error
						if (crudmSaveErr) done(crudmSaveErr);

						// Delete existing Crudm
						agent.delete('/crudms/' + crudmSaveRes.body._id)
							.send(crudm)
							.expect(200)
							.end(function(crudmDeleteErr, crudmDeleteRes) {
								// Handle Crudm error error
								if (crudmDeleteErr) done(crudmDeleteErr);

								// Set assertions
								(crudmDeleteRes.body._id).should.equal(crudmSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Crudm instance if not signed in', function(done) {
		// Set Crudm user 
		crudm.user = user;

		// Create new Crudm model instance
		var crudmObj = new Crudm(crudm);

		// Save the Crudm
		crudmObj.save(function() {
			// Try deleting Crudm
			request(app).delete('/crudms/' + crudmObj._id)
			.expect(401)
			.end(function(crudmDeleteErr, crudmDeleteRes) {
				// Set message assertion
				(crudmDeleteRes.body.message).should.match('User is not logged in');

				// Handle Crudm error error
				done(crudmDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Crudm.remove().exec();
		done();
	});
});