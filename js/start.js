/**
 * Listens for the app launching then creates the window
 *
 * @see http://developer.chrome.com/apps/app.window.html
 */
chrome.app.runtime.onLaunched.addListener(function() {
  chrome.system.display.getInfo(function(info) {
	chrome.app.window.create('index.html', {
	  width: info[0].workArea.width,
	  height: info[0].workArea.height,
	  frame: 'none',
	  resizable: false
	});
  });
});

