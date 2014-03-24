/**
 * Listens for the app launching then creates the window
 *
 * @see http://developer.chrome.com/apps/app.window.html
 */
chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index.html', {
    width: 1366,
    height: 720,
    frame: 'none'
  });
  chrome.permissions.request({
  });
  
  chrome.serial.getDevices(onGetDevices);

});

var savedConnectionID = 0,
    stringReceived = '';

// Connect to the first port in the list. Works for now.
var onGetDevices = function(ports) {
  chrome.serial.connect(ports[0].path, {bitrate: 115200}, onConnect);
}

// The serial port has been opened. Save its id and start listening.
var onConnect = function(connectionInfo) {
  savedConnectionID = connectionInfo.connectionId;
  chrome.serial.onReceive.addListener(onReceiveCallback);
}

//Listen on our serial port and handle the input.
var onReceiveCallback = function(info) {
      
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

chrome.runtime.onSuspend.addListener(function() {
  chrome.serial.flush(savedConnectionID, function() {});
  chrome.serial.disconnect(savedConnectionID, function() {});
  chrome.serial.flush(savedConnectionID, function() {});
});