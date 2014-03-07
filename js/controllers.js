'use strict';

/* Controllers */

var labbookControllers = angular.module('labbookControllers', []);

labbookControllers.controller('MainCtrl', ['$scope', '$rootScope',
  function($scope, $rootScope) {
    
    var styles = {

      //slide from right
      front: '.view-animate.ng-enter {left:100%;}  .view-animate.ng-leave.ng-leave-active {left:-100%;}',

      //slide from left
      back: '.view-animate.ng-enter {left:-100%;}  .view-animate.ng-leave.ng-leave-active {left:100%;}'

    }


    $scope.setDir = function(direction) {

      //choose front/back sliding direction
      $rootScope.style = styles[direction];

    }

    $scope.close = function() {
      window.close();
    }

  }]);

labbookControllers.controller('WelcomeCtrl', ['$scope',
  function($scope) {
    
  }]);

labbookControllers.controller('SignInCtrl', ['$scope',
  function($scope) {
    
  }]);

labbookControllers.controller('SetUpCtrl', ['$scope',
  function($scope) {
    
  }]);

labbookControllers.controller('DataCtrl', ['$scope', 'Serial',
  function($scope, Serial) {
    $scope.data = [Serial.dataList];
    $scope.points = [];
    $scope.$watch('data', function(v) {
      $scope.points.push(v[0][v[0].length-1]);
    }, true);
    $scope.lastValue = 0;

    $scope.menushow =false;
    $scope.showMenu = function() {
      $scope.menushow = true;
    }
    $scope.hideMenu = function() {
      $scope.menushow = false;
    }
    $scope.setData = function() {
      Serial.start(150);
    }
  }]);
