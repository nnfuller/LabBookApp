'use strict';

/* App Module */

var labbookApp = angular.module('labbookApp', [
  'ngRoute',
  'ngAnimate',
  /*'labbookAnimations',*/
  'labbookControllers'
]);

labbookApp.config(['$routeProvider',
function($routeProvider) {
  $routeProvider.
      when('/welcome', {
        templateUrl: '/partials/welcome.html',
        controller: 'WelcomeCtrl'
      }).
      when('/signin', {
        templateUrl: '/partials/signin.html',
        controller: 'SignInCtrl'
      }).
      when('/setup', {
        templateUrl: '/partials/setup.html',
        controller: 'SetUpCtrl'
      }).
      when('/data', {
        templateUrl: '/partials/data.html',
        controller: 'DataCtrl'
      }).
      otherwise({
        redirectTo: '/welcome'
      });
  }]);