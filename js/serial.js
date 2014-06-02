chrome.app.runtime.onLaunched.addListener(function() {
  chrome.runtime.getPlatformInfo(setPlatformInfo);
  startup();
});

var connected = false,
    savedConnectionID = 0,
    stringReceived = '',
    os = '',
    port = null;

var str2ab = function(str) {
  var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
  var bufView = new Uint16Array(buf);

  for (var i=0, strLen=str.length; i<strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }

  return buf;
}

var setPlatformInfo = function(info) {
  os = info.os;
  console.log(os);
}

var startup = function() {
  connected = false;
  console.log("Beginning search...");
  chrome.serial.getDevices(onGetDevices);
}

// Connect to the first port in the list. Works for now.
var onGetDevices = function(ports) {
  console.log(ports);
  var portFound = false;
  if (os == "win") {
  	if (ports[0]) {
  	  console.log("Trying "+ports[0].path+"...");
  	  chrome.serial.connect(ports[0].path, {bitrate: 115200, receiveTimeout: 2000}, onConnect);
    } else {
      startup();
    }
  } else if (os == "mac") {  
    for (var i=0; i<ports.length;i++) {
      if (ports[i].path.match(/tty\.usbmodem1/)) {
        console.log("Trying "+ports[i].path+"...");
        chrome.serial.connect(ports[i].path, {bitrate: 115200, receiveTimeout: 2000}, onConnect);
        portFound = true;
        break;
      }
    }
    if (!portFound) {
      startup();
    }
  }
}

// The serial port has been opened. Save its id and start listening.
var onConnect = function(connectionInfo) {
  savedConnectionID = connectionInfo.connectionId;
  chrome.serial.onReceive.addListener(onReceiveCallback);
  chrome.serial.onReceiveError.addListener(onReceiveErrorCallback);
  //chrome.alarms.create("badconn", {when: Date.now() + 3000});
}

var onSend = function(info) {
  return true;
}

chrome.alarms.onAlarm.addListener(function(alarm) {
  if (alarm.name == "badconn") {
    if (!connected) {
	    cleanup();
      startup();
    }
    chrome.alarms.clear("badconn");
  }
});

var onReceiveErrorCallback = function(info) {
  console.log("Device lost. Reconnecting...");
  port.postMessage({alert: "noconn"});
  cleanup();
  startup();
}

var onDisconnect = function() {
  console.log("Disconnect successful!");
  savedConnectionID = 0;
}

//Listen on our serial port and handle the input.
var onReceiveCallback = function(info) {
  if (info.data) {
  	connected=true;
    //Convert an array buffer to a string.
    var str = String.fromCharCode.apply(null, new Uint8Array(info.data));

    //Break our string into pieces along newlines and output an array of string partials.
    if (str.charAt(str.length-1) === '\n') {
      stringReceived += str.substring(0, str.length-1);
      port.postMessage({raw: stringReceived});
      stringReceived = '';
    } else {
      stringReceived += str;
    }
  }
}

chrome.runtime.onConnect.addListener(function(p) {
  console.assert(p.name == "backend");
  port = p;
  port.onMessage.addListener(function(msg) {
  	if (msg.send) {
      chrome.serial.send(savedConnectionID, str2ab(msg.send), onSend);
  	}
  });
});

var cleanup = function() {
  chrome.serial.send(savedConnectionID, str2ab("D"), onSend);
  chrome.serial.flush(savedConnectionID,function(){});
  chrome.serial.disconnect(savedConnectionID, onDisconnect);
  chrome.serial.onReceive.removeListener(onReceiveCallback);
  chrome.serial.onReceiveError.removeListener(onReceiveErrorCallback);
}