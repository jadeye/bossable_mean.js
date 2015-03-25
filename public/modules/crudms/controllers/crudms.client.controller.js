'use strict';

// Crudms controller
angular.module('crudms').controller('CrudmsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Crudms',
	function($scope, $stateParams, $location, Authentication, Crudms) {
		$scope.authentication = Authentication;

		// Create new Crudm
		$scope.create = function() {
			// Create new Crudm object
			var crudm = new Crudms ({
				name: this.name
			});

			// Redirect after save
			crudm.$save(function(response) {
				$location.path('crudms/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Crudm
		$scope.remove = function(crudm) {
			if ( crudm ) { 
				crudm.$remove();

				for (var i in $scope.crudms) {
					if ($scope.crudms [i] === crudm) {
						$scope.crudms.splice(i, 1);
					}
				}
			} else {
				$scope.crudm.$remove(function() {
					$location.path('crudms');
				});
			}
		};

		// Update existing Crudm
		$scope.update = function() {
			var crudm = $scope.crudm;

			crudm.$update(function() {
				$location.path('crudms/' + crudm._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Crudms
		$scope.find = function() {
			$scope.crudms = Crudms.query();
		};

		// Find existing Crudm
		$scope.findOne = function() {
			$scope.crudm = Crudms.get({ 
				crudmId: $stateParams.crudmId
			});
		};
	}
]);