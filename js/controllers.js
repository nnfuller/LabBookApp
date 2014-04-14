'use strict';

/* Controllers */

var labbookControllers = angular.module('labbookControllers', []);

labbookControllers.controller('MainCtrl', ['$scope', '$rootScope',
  function($scope, $rootScope) {
    
    chrome.app.window.current().maximize();

    var value = 0,
        time = 0,
        tempData = [],
        split = [];
    
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
      chrome.runtime.getBackgroundPage(function(page) {
        //page.cleanup();
      });
    }

    chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
      split = msg.split('T');
      value = Math.round(parseInt(split[0].slice(1))*500/1024)/100;
      time = parseInt(split[1]);
      
      $scope.$apply(function () {
        $scope.lastValue = value.toFixed(2);
      });
      
      if (tempData.length > 0 && time < tempData[0][0]) {
        tempData = [];
      }
      
      if (value != 0 || tempData.length > 0) {
        tempData.push([time,value]);
      }
        
      if (tempData.length > 100) {
        tempData.shift();
      }
      
      //$scope.streamData = tempData;
      
    });

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

labbookControllers.controller('DataCtrl', ['$scope',
  function($scope) {
    var split = "",
        start = 0;
    $scope.copyReady = false;
    $scope.points = [];
    $scope.data = [];
    $scope.menushow = false;
    $scope.sensorType="volt";
    $scope.tCalib="32.0";
    $scope.vUnit = "V";
    $scope.tUnit = "C";
    $scope.dUnit = "m";
    $scope.fUnit = "N";
    $scope.pUnit = "Pa";
    $scope.gUnit = "sec";

    $scope.showMenu = function() {
      $scope.menushow = true;
    }
    $scope.hideMenu = function() {
      $scope.menushow = false;
    }
    $scope.startPlot = function() {
      $scope.data = [];
      $scope.collect = true;
      $scope.copyReady = false;
    }
    $scope.stopPlot = function() {
      $scope.collect = false;
      $scope.points = $scope.data;
      $scope.copyReady = true;
    }
    $scope.saveData = function() {
      chrome.runtime.getBackgroundPage(function(page) {
        page.startAuth($scope.data);
      });
    }

    chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
      if (msg=="disconnect" && $scope.collect) {
        $scope.stopPlot();
      } else {
        if ($scope.collect) {
          split = msg.split('T');
          if (!$scope.data[0]) {
            start = parseInt(split[1]);
          }
          $scope.data.push([parseInt(split[1])-start,(Math.round(parseInt(split[0].slice(1))*500/1024)/100).toFixed(2)]);
        }
      }
    });
    
    $scope.$watch('sensorType', function() {
      $scope.vShow = false;
      $scope.tShow = false;
      $scope.dShow = false;
      $scope.fShow = false;
      $scope.pShow = false;
      $scope.gShow = false;
      if($scope.sensorType =="volt"){
      $scope.vShow = true;
      }
      if($scope.sensorType =="temp"){
      $scope.tShow = true;
      }
      if($scope.sensorType =="dist"){
      $scope.dShow = true;
      }
      if($scope.sensorType =="force"){
      $scope.fShow = true;
      }
      if($scope.sensorType =="press"){
      $scope.pShow = true;
      }
      if($scope.sensorType =="gate"){
      $scope.gShow = true;
      }
    }, true);
  }]);