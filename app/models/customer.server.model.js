'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Customer Schema
 */
var CustomerSchema = new Schema({
	firstName: {
		type: String,
		default: '',
		required: 'Please fill First name',
		trim: true
	},
    surName: {
        type: String,
        default: '',
        required: 'Please fill Last name',
        trim: true
    },
    email: {
        type: String,
        default: '',
        required: 'Please fill your Email',
        trim: true
    },
    phone: {
        type: Number,
        default: '',
        required: 'Please fill your Phone Number',
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

mongoose.model('Customer', CustomerSchema);
