chrome.app.runtime.onLaunched.addListener(function() {
  //startup();
});

var tempConnectionID = 0,
    savedConnectionID = 0,
    stringReceived = '';

var startup = function() {
  console.log("Beginning search...");
  chrome.serial.getDevices(onGetDevices);
}

// Connect to the first port in the list. Works for now.
var onGetDevices = function(ports) {
  if (ports[0]) {
    console.log("Trying "+ports[0].path+"...");
    chrome.serial.connect(ports[0].path, {bitrate: 115200}, onConnect);
  } else {
    startup();
  }
}

// The serial port has been opened. Save its id and start listening.
var onConnect = function(connectionInfo) {
  savedConnectionID = connectionInfo.connectionId;
  chrome.serial.onReceive.addListener(onReceiveCallback);
  chrome.serial.onReceiveError.addListener(onReceiveErrorCallback);
}

var onReceiveErrorCallback = function(info) {
  console.log("Device lost. Reconnecting...");
  chrome.runtime.sendMessage("disconnect");
  cleanup();
  //startup();
}

var onDisconnect = function() {
  console.log("Disconnect successful!");
  savedConnectionID = 0;
}

//Listen on our serial port and handle the input.
var onReceiveCallback = function(info) {
  
  if (info.data) {
    //Convert an array buffer to a string.
    var str = String.fromCharCode.apply(null, new Uint8Array(info.data));

    //Break our string into pieces along newlines and output an array of string partials.
    if (str.charAt(str.length-1) === '\n') {
      stringReceived += str.substring(0, str.length-1);
      chrome.runtime.sendMessage(stringReceived);
      stringReceived = '';
    } else {
      stringReceived += str;
    }
  }
}

var cleanup = function() {
  chrome.serial.flush(savedConnectionID,function(){});
  chrome.serial.disconnect(savedConnectionID, onDisconnect);
  chrome.serial.onReceive.removeListener(onReceiveCallback);
  chrome.serial.onReceiveError.removeListener(onReceiveErrorCallback);
}