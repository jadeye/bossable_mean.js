'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var crudms = require('../../app/controllers/crudms.server.controller');

	// Crudms Routes
	app.route('/crudms')
		.get(crudms.list)
		.post(users.requiresLogin, crudms.create);

	app.route('/crudms/:crudmId')
		.get(crudms.read)
		.put(users.requiresLogin, crudms.hasAuthorization, crudms.update)
		.delete(users.requiresLogin, crudms.hasAuthorization, crudms.delete);

	// Finish by binding the Crudm middleware
	app.param('crudmId', crudms.crudmByID);
};
