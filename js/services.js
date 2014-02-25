'use strict';

/* Services */

var labbookServices = angular.module('labbookServices', []);

labbookServices.factory('Serial', ['$rootScope', function($rootScope){
  
  var dataLength = 0,
      dataList = [],
      savedConnectionID = -1,
      stringReceived = '',
      temp = [];
  
  //Initialize communication with a given datalength.
  var start = function(len) {
    dataLength = len+1;
    chrome.serial.connect( "/dev/ttyACM0", {bitrate: 115200}, onConnect);
    chrome.serial.onReceive.addListener(onReceiveCallback);
  }
  
  //Given a list of devices, save the path to the first.
  //TODO: Solution to determine which device is ours.
  var onGetDevices = function(ports) {
    //for (var i=0; i<ports.length; i++) {
    //  console.log(ports[i].path);
    //  pathID=ports[0].path;
    //}
  }
  
  // The serial port has been opened. Save its id to use later.
  var onConnect = function(connectionInfo) {
    savedConnectionID = connectionInfo.connectionId;
  }
  
  //We're ready to bid our friend adieu. Wrap it up.
  var onDisconnect = function(result) {
    if (result) {
      console.log("Disconnected from the serial port")
    } else {
      console.log("Disconnect failed");
    }
  }
  
  //Listen on our serial port and handle the input.
  var onReceiveCallback = function(info) {
    
    if (info.data) {
      
      //Convert an array buffer to a string.
      var str = String.fromCharCode.apply(null, new Uint8Array(info.data));
      
      //Break our string into pieces along newlines and output an array of string partials.
      if (str.charAt(str.length-1) === '\n') {
        stringReceived += str.substring(0, str.length-1);
        var split = stringReceived.split("T");
        temp = [parseInt(split[1]), parseInt(split[0].substring(1))];
        stringReceived = '';
        $rootScope.$apply(function() {
            dataList.push(temp);
        });
        if (dataList.length == dataLength) {
          chrome.serial.disconnect(info.connectionId, onDisconnect);
        }   
      } else {
        stringReceived += str;
      }
    }
  }
  
  return {
    
    dataList: dataList,
    
    start: start,
    
    onGetDevices: onGetDevices,
    
    onConnect: onConnect,
    
    onReceiveCallback: onReceiveCallback,
    
    onDisconnect: onDisconnect
  }
}]);