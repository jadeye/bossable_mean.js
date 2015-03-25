'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

        $scope.alerts = [
            {
                icon: 'glyphicon-user',
                color: 'btn-success',
                total: '20,408',
                desciption: 'Total customers'
            },
            {
                icon: 'glyphicon-calendar',
                color: 'btn-primary',
                total: '8,382',
                desciption: 'Total customers'
            },
            {
                icon: 'glyphicon-edit',
                color: 'btn-success',
                total: '527',
                desciption: 'Total customers'
            },
            {
                icon: 'glyphicon-record',
                color: 'btn-info',
                total: '85,000',
                desciption: 'Total customers'
            },
            {
                icon: 'glyphicon-eye-open',
                color: 'btn-warning',
                total: '348',
                desciption: 'Total customers'
            },
            {
                icon: 'glyphicon-flag',
                color: 'btn-danger',
                total: '20,408',
                desciption: 'Total customers'
            }
        ];
	}
]);
