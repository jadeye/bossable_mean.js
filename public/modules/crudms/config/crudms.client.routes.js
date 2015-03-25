'use strict';

//Setting up route
angular.module('crudms').config(['$stateProvider',
	function($stateProvider) {
		// Crudms state routing
		$stateProvider.
		state('listCrudms', {
			url: '/crudms',
			templateUrl: 'modules/crudms/views/list-crudms.client.view.html'
		}).
		state('createCrudm', {
			url: '/crudms/create',
			templateUrl: 'modules/crudms/views/create-crudm.client.view.html'
		}).
		state('viewCrudm', {
			url: '/crudms/:crudmId',
			templateUrl: 'modules/crudms/views/view-crudm.client.view.html'
		}).
		state('editCrudm', {
			url: '/crudms/:crudmId/edit',
			templateUrl: 'modules/crudms/views/edit-crudm.client.view.html'
		});
	}
]);