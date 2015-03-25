'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Crudm Schema
 */
var CrudmSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Crudm name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Crudm', CrudmSchema);