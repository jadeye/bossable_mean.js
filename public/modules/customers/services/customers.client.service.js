'use strict';

//Customers service used to communicate Customers REST endpoints
angular.module('customers')

    .factory('Customers', ['$resource',
        function($resource) {
            return $resource('customers/:customerId', { customerId: '@_id' }, {
                update: {
                    method: 'PUT'
                }
            });
        }
    ])


    .factory('Notify', ['$rootScope', '$log',
        function($rootScope, $log) {

            var notify = {};
            $log.info('NOTIFIED....');
            notify.sendMsg = function(msg, data) {
                data = data || {};
                $rootScope.$emit(msg, data);

                console.log('message has been sent!');
            };

            notify.getMsg = function(msg, func, scope) {
                var unbind = $rootScope.$on(msg, func);
                $log.info('GETTING MSG....');
                if (scope) {
                    scope.$on('destroy', unbind);
                }
            };
        }
    ]);
/*
angular.module('customers').factory('Customers', ['$resource',
	function($resource) {
		return $resource('customers/:customerId', { customerId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);*/
