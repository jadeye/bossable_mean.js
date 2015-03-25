'use strict';

// Customers controller
var customersApp = angular.module('customers');

    customersApp.controller('CustomersController', ['$scope', '$stateParams', '$location', 'Authentication',
    'Customers', '$modal', '$log',
	function($scope, $stateParams, $location, Authentication, Customers, $modal, $log) {

        this.authentication = Authentication;

        // Find a list of Customers
        this.customers = Customers.query();

        /* open modal window for create
         * http://angular-ui.github.io/bootstrap/#/modal
         */
        this.modalCreate = function (size) {

        var modalInstance = $modal.open({
            templateUrl: 'modules/customers/views/create-customer.client.view.html',
            controller: function ($scope, $modalInstance) {

                $scope.ok = function () {
                        $modalInstance.close();
                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            },
            size: size
        });

            modalInstance.result.then(function (selectedItem) {
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

            /* open modal window for update
             * http://angular-ui.github.io/bootstrap/#/modal
             */
        this.modalUpdate = function (size, selectedCustomer) {

            var modalInstance = $modal.open({
                templateUrl: 'modules/customers/views/edit-customer.client.view.html',
                controller: function ($scope, $modalInstance, customer) {
                    $scope.customer = customer;

                    $scope.ok = function () {
                        /*if($scope.validUpdateForm) {
                            $log.info("Update OK...!");*/
                            $modalInstance.close($scope.customer);
                        //}
                    };

                    $scope.cancel = function () {
                        $log.info('ModalInstance CANCEL Clicked at: ' + new Date());
                        $modalInstance.dismiss('cancel');
                    };
                },
                size: size,
                resolve: {
                    customer: function () {
                        return selectedCustomer;
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });

        };

        // Remove existing Customer
        this.remove = function(customer) {
            $log.info('REMOVE CUSTOMER WAS CLICKED: ' + new Date());
            if ( customer ) {
                customer.$remove();

                for (var i in this.customers) {
                    if (this.customers [i] === customer) {
                        this.customers.splice(i, 1);
                    }
                }
            } else {
                this.customer.$remove(function() {
                    $location.path('customers');
                });
            }
        };

    }
]);


customersApp.controller('CustomersCreateController', ['$scope', 'Customers', 'Notify',
    function($scope, Customers, Notify) {

        /*$scope.ab = aa;
        $log.info("AA = " + aa);*/
        // Create new Customer
        this.create = function() {
            // Create new Customer object
            var customer = new Customers ({
                firstName: this.firstName,
                surName: this.surName,
                email: this.email,
                phone: this.phone
            });

            // Redirect after save
            customer.$save(function(response) {
                //$location.path('customers/' + response._id);
                Notify.sendMsg('NewCustomer', {'id': response._id});
                //Notify.sendMsg('NewCustomer', {'id': response._id});
                // Clear form fields
                $scope.firstName = '';
                $scope.surName = '';
                $scope.email = '';
                $scope.phone = '';
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

    }
]);

customersApp.controller('CustomersUpdateController', ['$scope', 'Customers', '$log',
    function($scope, Customers, $log) {

        // Update existing Customer
        this.update = function(updatedCustomer) {

            var customer = updatedCustomer;

            customer.$update(function() {
                //$location.path('customers/' + customer._id);
                $log.info('Updating Customer: ' + new Date());
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
    }
]);

customersApp.directive('customerList', ['Customers', 'Notify', function(Customers, Notify) {
   return {
       restrict: 'E',
       transclude: true,
       templateUrl: 'modules/customers/views/customer-list-template.html',
       link: function(scope, element, attrs) {
            // a new customer is added UPDATE customer list
           Notify.getMsg('NewCustomer', function (event, data) {
               scope.CustomersController.customers = Customers.query();
           });
       }
       /*
        The restrict option is typically set to:

        'A' - only matches attribute name
        'E' - only matches element name
        'C' - only matches class name
        These restrictions can all be combined as needed:

        'AEC' - matches either attribute or element or class name
        */
   };
}]);


/*

		// Find existing Customer
		$scope.findOne = function() {
			$scope.customer = Customers.get({ 
				customerId: $stateParams.customerId
			});
		};
*/
