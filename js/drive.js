var token = null,
    data = "",
    header;

var startAuth = function(d, h) {
  data = d;
  header = h;
  chrome.identity.getAuthToken({'interactive': true}, handleToken);
}

var handleToken = function(t) {
  if (chrome.runtime.lastError) {
    console.log(chrome.runtime.lastError);
  } else {
    token = t;
    createSheet();
  }
}

var createSheet = function() {
  var xhr = new XMLHttpRequest(),
      boundary = '-------314159265358979323846',
      delimiter = "\r\n--" + boundary + "\r\n",
      close_delim = "\r\n--" + boundary + "--";
  
  var metadata =
      {
        'title': 'LabBook Data',
        'mimeType': 'text/csv'
      };
  
  var content = header + ",,,,,,,,,,,,,,,,,,,,,,,,,,\n";
  
  for (var i=0;i<data.length;i++) {
    for (var j=0;j<data[i].length;j++) {
      content += data[i][j] + ",";
    }
    content += "\n";
  }
  
  var multipartRequestBody =
              delimiter +
              'Content-Type: application/json\r\n\r\n' +
              JSON.stringify(metadata) +
              delimiter +
              'Content-Type: text/csv\r\n\r\n' +
              content +
              close_delim;
  
  xhr.open("POST", "https://www.googleapis.com/upload/drive/v2/files?uploadType=multipart&convert=true", true);
  xhr.setRequestHeader('Authorization', 'Bearer ' + token);
  xhr.setRequestHeader('Content-Type', 'multipart/mixed; boundary="' + boundary + '"');
  xhr.send(multipartRequestBody);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      port.postMessage({alert: {upload: true, name: JSON.parse(xhr.response).ownerNames[0]}});
    }
  }
}