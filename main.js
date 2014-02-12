/**
 * Listens for the app launching then creates the window
 *
 * @see http://developer.chrome.com/apps/app.window.html
 */
chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index.html', {
    width: 1366,
    height: 768,
  });
  chrome.permissions.request({
  });

});

  var onGetPorts = function(ports) {
  for (var i=0; i<ports.length; i++) {
    console.log(ports[i]);
  }
}
chrome.serial.getPorts(onGetPorts);
