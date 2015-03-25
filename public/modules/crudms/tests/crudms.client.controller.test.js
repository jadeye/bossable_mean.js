'use strict';

(function() {
	// Crudms Controller Spec
	describe('Crudms Controller Tests', function() {
		// Initialize global variables
		var CrudmsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Crudms controller.
			CrudmsController = $controller('CrudmsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Crudm object fetched from XHR', inject(function(Crudms) {
			// Create sample Crudm using the Crudms service
			var sampleCrudm = new Crudms({
				name: 'New Crudm'
			});

			// Create a sample Crudms array that includes the new Crudm
			var sampleCrudms = [sampleCrudm];

			// Set GET response
			$httpBackend.expectGET('crudms').respond(sampleCrudms);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.crudms).toEqualData(sampleCrudms);
		}));

		it('$scope.findOne() should create an array with one Crudm object fetched from XHR using a crudmId URL parameter', inject(function(Crudms) {
			// Define a sample Crudm object
			var sampleCrudm = new Crudms({
				name: 'New Crudm'
			});

			// Set the URL parameter
			$stateParams.crudmId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/crudms\/([0-9a-fA-F]{24})$/).respond(sampleCrudm);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.crudm).toEqualData(sampleCrudm);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Crudms) {
			// Create a sample Crudm object
			var sampleCrudmPostData = new Crudms({
				name: 'New Crudm'
			});

			// Create a sample Crudm response
			var sampleCrudmResponse = new Crudms({
				_id: '525cf20451979dea2c000001',
				name: 'New Crudm'
			});

			// Fixture mock form input values
			scope.name = 'New Crudm';

			// Set POST response
			$httpBackend.expectPOST('crudms', sampleCrudmPostData).respond(sampleCrudmResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Crudm was created
			expect($location.path()).toBe('/crudms/' + sampleCrudmResponse._id);
		}));

		it('$scope.update() should update a valid Crudm', inject(function(Crudms) {
			// Define a sample Crudm put data
			var sampleCrudmPutData = new Crudms({
				_id: '525cf20451979dea2c000001',
				name: 'New Crudm'
			});

			// Mock Crudm in scope
			scope.crudm = sampleCrudmPutData;

			// Set PUT response
			$httpBackend.expectPUT(/crudms\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/crudms/' + sampleCrudmPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid crudmId and remove the Crudm from the scope', inject(function(Crudms) {
			// Create new Crudm object
			var sampleCrudm = new Crudms({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Crudms array and include the Crudm
			scope.crudms = [sampleCrudm];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/crudms\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCrudm);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.crudms.length).toBe(0);
		}));
	});
}());