angular.module('hello', [ 'ngRoute' ]).config(function($routeProvider, $httpProvider) {

	$routeProvider.when('/', {
		templateUrl : 'home.html',
		controller : 'home',
		controllerAs: 'controller'
	}).when('/login', {
		templateUrl : 'login.html',
		controller : 'navigation',
		controllerAs: 'controller'
	}).otherwise('/');

	$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

}).controller('navigation',

		function($rootScope, $http, $location, $route) {
			
			var self = this;

			self.tab = function(route) {
				return $route.current && route === $route.current.controller;
			};

			var authenticate = function(callback) {
				$http.get('user').success(function(data) {
					if (data.name) {
						$rootScope.authenticated = true;
					} else {
						$rootScope.authenticated = false;
					}
					callback && callback();
				}).error(function() {
					$rootScope.authenticated = false;
					callback && callback();
				});
			}

			authenticate();

			self.credentials = {};

			self.login = function() {
				$http.post('login', $.param(self.credentials), {
					headers : {
						"content-type" : "application/x-www-form-urlencoded"
					}
				}).success(function(data) {
					authenticate(function() {
						if ($rootScope.authenticated) {
							$location.path("/");
							self.error = false;
						} else {
							$location.path("/login");
							self.error = true;
						}
					});
				}).error(function(data) {
					$location.path("/login");
					self.error = true;
					$rootScope.authenticated = false;
				})
			};


			self.logout = function() {
				$http.post('logout', {}).finally(function() {
					$rootScope.authenticated = false;
					$location.path("/");
				});
			}

		}).controller('home', function($http) {
	var self = this;
	$http.get('/resource/').then(function(response) {
		self.greeting = response.data;
	})
});
