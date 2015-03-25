'use strict';

// Configuring the Articles module
angular.module('crudms').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Crudms', 'crudms', 'dropdown', '/crudms(/create)?');
		Menus.addSubMenuItem('topbar', 'crudms', 'List Crudms', 'crudms');
		Menus.addSubMenuItem('topbar', 'crudms', 'New Crudm', 'crudms/create');
	}
]);