'use strict';

/* Controllers */

var labbookControllers = angular.module('labbookControllers', []);

var port = null,
    alpha = .2,
    beta = .2;

labbookControllers.controller('MainCtrl', ['$scope', '$rootScope',
  function($scope, $rootScope) {
    
    $scope.streamData = [[]];

    $rootScope.msg = {
      title: "Unable to find the LabBook DataHub",
      para:  "This computer is not connected to a LabBook DataHub! Please check that all cables are securely connected, and make sure the DataHub is plugged into this machine."
    };
    $rootScope.greyout = true;

    var tempData1 = [],
        tempData2 = [],
        tempData3 = [],
        totalData = [],
        b = 0;
    
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
      port.postMessage({reset: true});
      window.close();
      chrome.runtime.getBackgroundPage(function(page) {
        page.cleanup();
      });
    }

    port = chrome.runtime.connect({name: "backend"});
    port.onMessage.addListener(function(msg) {
      if (msg.raw) {
      	port.postMessage({raw: msg.raw});
      } else if (msg.send) {
      	port.postMessage({send: msg.send});
      } else if (msg.clean) {
      	$scope.$apply(function () {
          $scope.lastValue = msg.clean[1].toFixed(1);
        });

        tempData1.push([msg.clean[0],msg.clean[1]]);
        if (msg.clean[2]) {
          tempData2.push([msg.clean[0],msg.clean[2]]);
        }
        if (msg.clean[3]) {
          tempData3.push([msg.clean[0],msg.clean[3]]);
        }
        if (tempData1.length > 100) {
          tempData1.shift();
        }
        if (tempData2.length > 100) {
          tempData2.shift();
        }
        if (tempData3.length > 100) {
          tempData3.shift();
        }
        totalData = [tempData1];
        //if (msg.clean[2]) {
        //  totalData.push(tempData2);
        //}
        //if (msg.clean[3]) {
        //  totalData.push(tempData3);
        //}
        /*if (totalData[0].length >= 5) {
        	totalData[0][totalData[0].length-3][1] = (totalData[0][totalData[0].length-6][1]+totalData[0][totalData[0].length-5][1]+totalData[0][totalData[0].length-4][1]+totalData[0][totalData[0].length-3][1]+totalData[0][totalData[0].length-2][1]+totalData[0][totalData[0].length-1][1]+totalData[0][totalData[0].length][1])/7;
        }*/
        if (totalData[0].length > 2) {
          totalData[0][totalData[0].length-1][1] = alpha * totalData[0][totalData[0].length-1][1] + (1-alpha)*(b+totalData[0][totalData[0].length-2][1]);
          b = beta * (totalData[0][totalData[0].length-1][1]-totalData[0][totalData[0].length-2][1]) + (1-beta) * b;
        } else if (totalData[0].length == 2) {
          b = totalData[0][1][1] - totalData[0][0][1];
        }
        $scope.streamData = totalData;
      }
      if (msg.alert) {
        if (msg.alert=="conn") {
          $rootScope.greyout = false;
        } else if (msg.alert=="noconn") {
          $rootScope.msg = {
            title: "Unable to find the LabBook DataHub",
            para:  "This computer is not connected to a LabBook DataHub! Please check that all cables are securely connected, and make sure the DataHub is plugged into this machine."
          };
          $rootScope.greyout = true;
          $scope.streamData = [[]];
          tempData1 = [];
          tempData2 = [];
          tempData3 = [];
          totalData = [];
          port.postMessage({reset: true});
        } else if (msg.alert=="nosens") {
          $rootScope.msg = {
            title: "Unable to find sensors",
            para:  "No sensors appear to be connected to the LabBook DataHub! Please check that sensors are plugged into the correct ports, then check with your teacher."
          };
          $rootScope.greyout = true;
        } else if (msg.alert=="sens") {
          $rootScope.greyout = false;
        }
        $rootScope.$apply();
      }
    })
  }]);

labbookControllers.controller('WelcomeCtrl', ['$scope', '$rootScope',
  function($scope, $rootScope) {
    $rootScope.$watch('greyout', function (v) {
      $scope.homegrey = v;
    });
    $rootScope.$watch('msg', function (v) {
      $scope.msg = v;
    });
  }]);

labbookControllers.controller('SignInCtrl', ['$scope',
  function($scope) {
    
  }]);

labbookControllers.controller('SetUpCtrl', ['$scope',
  function($scope) {
    
  }]);

labbookControllers.controller('DataCtrl', ['$scope', '$rootScope',
  function($scope, $rootScope) {
    var b = 0,
        fullSet = [],
        start = 0;
    $scope.copyReady = false;
    $scope.copyshow = false;
    $scope.points = [];
    $scope.data = [[],[],[]];
    $scope.datagrey = true;
    $scope.sensorType="volt";
    $scope.tCalib="32.0";
    $scope.vUnit = "V";
    $scope.tUnit = "C";
    $scope.dUnit = "m";
    $scope.fUnit = "N";
    $scope.pUnit = "Pa";
    $scope.gUnit = "sec";
    $scope.labels= ["Time","Value A"];
    $scope.localdonemsg = "";
    $scope.uploaddonemsg = "";

    $rootScope.$watch('greyout', function (v) {
      $scope.datagrey = v;
    });
    $rootScope.$watch('msg', function (v) {
      $scope.msg = v;
    });

    $scope.showMenu = function() {
      $scope.menushow = true;
    }
    $scope.hideMenu = function() {
      $scope.menushow = false;
    }
    $scope.hideCopy = function() {
      $scope.copyshow = false;
    }
    $scope.startPlot = function() {
      $scope.data = [];
      $scope.points = [];
      $scope.collect = true;
      $scope.copyReady = false;
    }
    $scope.stopPlot = function() {
      $scope.collect = false;
      setPoints();
      $scope.copyReady = true;
    }
    $scope.copyData = function() {
      $scope.copyshow = true;
    }
    $scope.uploadData = function() {
      chrome.runtime.getBackgroundPage(function(page) {
        page.startAuth($scope.points, $scope.labels.join(','));
      });
    }
    $scope.saveData = function() {
      var content = $scope.labels.join(',') + "\n";
      for (var i=0;i<$scope.points.length;i++) {
        for (var j=0;j<$scope.points[i].length;j++) {
          content += $scope.points[i][j] + ",";
        }
        content += "\n";
      }

      var contentBlob = new Blob([content], {type: "text/csv;charset=utf-8;"});

      chrome.fileSystem.chooseEntry({type: "saveFile", accepts: [{mimeTypes: ["text/csv"], extensions: ["csv"]}]}, function(entry) {
        entry.createWriter(function(writer) {
          writer.onwriteend = function(e) {
            $scope.localdonemsg = "File saved to " + entry.fullPath + " successfully!";
          };
          writer.write(contentBlob);
        });
      });
    }

    var setPoints = function() {
      if ($scope.data) {
        var cachedData = false;
        for (var i=0; i<=$scope.data[0][0][0]-.05; i+=.05) {
          cachedData=true;
          chrome.storage.local.get(i.toFixed(2), function(item) {
            if (item) {
              var strs = JSON.stringify(item).split(":");
              $scope.points.push([strs[0].slice(2,strs[0].length-1),strs[1].slice(1,strs[1].length-2)]);
            }
          });
        }
      }
      chrome.storage.local.clear(function(){
        dumpData();
      });
      $scope.labels= ["Time","Value A", "Value B", "Value C"].slice(0,$scope.data.length+1);
      $scope.localdonemsg = "";
      $scope.uploaddonemsg = "";
    }

    var dumpData = function() {
      for (var i=0; i<$scope.data[0].length; i++) {
        $scope.points.push([$scope.data[0][i][0].toFixed(2), $scope.data[0][i][1].toFixed(2)]);
        if ($scope.data[1]){
          $scope.points[i].push($scope.data[1][i][1].toFixed(2));
        }
        if ($scope.data[2]){
          $scope.points[i].push($scope.data[2][i][1].toFixed(2));
        }
      }
    }

    port.onMessage.addListener(function(msg) {
      if (msg.clean) {
      	if ($scope.collect) {
      	  var temp = $scope.data;
      	  if (!$scope.data[0]) {
            start = msg.clean[0];
            temp.push([[0,msg.clean[1]]])
            /*if (msg.clean.length>2) {
              temp.push([[0,msg.clean[2]]])
            }
            if (msg.clean.length>3) {
              temp.push([[0,msg.clean[3]]])
            }*/
          } else {
      	    var time = msg.clean[0] - start;
      	    temp[0].push([time,msg.clean[1]])
      	    /*if (msg.clean.length>2) {
              temp[1].push([time,msg.clean[2]]);
            }
            if (msg.clean.length>3) {
              temp[2].push([time,msg.clean[3]]);
            }*/
          }/*
          fullSet = temp;
          if (temp[0].length>301) {
          	var n = temp[0].length-300,
          		step = (temp[0].length-1)/(n-1);
          	for (var i=0; i<temp.length; i++) {
          	  for (var j=0; j<n; j+=step) {
          	  	temp[i].splice(j,1);
          	  }
          	}
          }*/
          if (temp[0].length > 2) {
            temp[0][temp[0].length-1][1] = alpha * temp[0][temp[0].length-1][1] + (1-alpha)*(b+temp[0][temp[0].length-2][1]);
            b = beta * (temp[0][temp[0].length-1][1]-temp[0][temp[0].length-2][1]) + (1-beta) * b;
          } else if (temp[0].length == 2) {
            b = temp[0][1][1] - temp[0][0][1];
          }
          $scope.data = temp;
          if ($scope.data[0].length>200) {
            var raw = $scope.data[0].shift();
            if (raw) {
              chrome.storage.local.set(JSON.parse('{"'+raw[0].toFixed(2)+'":"'+raw[1].toFixed(2)+'"}'));
            }
          }
      	}
      } else if (msg.alert) {
        if (msg.alert=="noconn") {
          $scope.stopPlot();
        } else if (msg.alert.upload) {
          $scope.uploaddonemsg = "Uploaded to " + msg.alert.name + "'s Google Drive!";
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