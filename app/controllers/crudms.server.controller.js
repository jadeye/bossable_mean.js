'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Crudm = mongoose.model('Crudm'),
	_ = require('lodash');

/**
 * Create a Crudm
 */
exports.create = function(req, res) {
	var crudm = new Crudm(req.body);
	crudm.user = req.user;

	crudm.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(crudm);
		}
	});
};

/**
 * Show the current Crudm
 */
exports.read = function(req, res) {
	res.jsonp(req.crudm);
};

/**
 * Update a Crudm
 */
exports.update = function(req, res) {
	var crudm = req.crudm ;

	crudm = _.extend(crudm , req.body);

	crudm.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(crudm);
		}
	});
};

/**
 * Delete an Crudm
 */
exports.delete = function(req, res) {
	var crudm = req.crudm ;

	crudm.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(crudm);
		}
	});
};

/**
 * List of Crudms
 */
exports.list = function(req, res) { 
	Crudm.find().sort('-created').populate('user', 'displayName').exec(function(err, crudms) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(crudms);
		}
	});
};

/**
 * Crudm middleware
 */
exports.crudmByID = function(req, res, next, id) { 
	Crudm.findById(id).populate('user', 'displayName').exec(function(err, crudm) {
		if (err) return next(err);
		if (! crudm) return next(new Error('Failed to load Crudm ' + id));
		req.crudm = crudm ;
		next();
	});
};

/**
 * Crudm authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.crudm.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
