'use strict';

//Crudms service used to communicate Crudms REST endpoints
angular.module('crudms').factory('Crudms', ['$resource',
	function($resource) {
		return $resource('crudms/:crudmId', { crudmId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);