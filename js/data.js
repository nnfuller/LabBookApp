chrome.app.runtime.onLaunched.addListener(function() {
});

var Aon = false,
	Bon = false,
	Con = false,
	numOn = 0,
	queried = false,
	Aeq = "1/(0.241844-0.00840788*sqrt(835.741-237.872*x))",
	Beq = "x",
	Ceq = "x";

chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name == "backend");
  port.onMessage.addListener(function(msg) {
    if (msg.raw) {
      if (~msg.raw.indexOf('I')) {
      	//code to process sensor detection
      	var vals = msg.raw.split('I')[1].substring(1).split('B'),
      		temp = vals.pop().split('C');
      	vals = vals.concat(temp);
      	if ((vals[0]>20) != Aon) {
      	  port.postMessage({send: "A"});
      	}
      	if ((vals[1]>20) != Bon) {
      	  port.postMessage({send: "B"});
      	}
      	if ((vals[2]>20) != Con) {
      	  port.postMessage({send: "C"});
      	}
        if ((vals[0]<20)&&(vals[1]<20)&&(vals[2]<20)) {
          port.postMessage({alert:"nosens"});
        } else {
          port.postMessage({alert:"sens"});
        }
      } else if (~msg.raw.indexOf('LABBOOK DATAHUB')) {
      	if (queried==false) {
          port.postMessage({send: "I", alert: "conn"});
      	  queried = true;
        }
      } else {
      	//code to process "regular" operation
      	//only operates on data as strings
      	var output = msg.raw.split('T').reverse();
      	if (~msg.raw.indexOf('A')) {
      	  Aon = true;
      	  var at = output.pop();
      	  output = output.concat(at.split('A')[1]);
      	}
      	if (~msg.raw.indexOf('B')) {
      	  Bon = true;
      	  var bt = output.pop();
      	  output = output.concat(bt.split('B'));
      	}
      	if (~msg.raw.indexOf('C')) {
      	  Con = true;
      	  var ct = output.pop();
      	  output = output.concat(ct.split('C'));
      	}
      	if (!(Aon||Bon||Con)) {
        }
        cleanData(output);
      }
    } else if (msg.setEq) {
      if (msg.setEq.a) {
      	Aeq = msg.setEq.a;
      }
      if (msg.setEq.b) {
      	Beq = msg.setEq.b;
      }
      if (msg.setEq.c) {
      	Ceq = msg.setEq.c;
      }
    } else if (msg.reset) {
      Aon = false;
      Bon = false;
      Con = false;
      numOn = 0;
      queried = false;
    }
  });
});

var cleanData = function(data) {
  numOn = data.length - 1;
  if (numOn) {
  	//handle data
  	if (!Aon) {
  	  data.splice(1,1);
  	  numOn--;
  	}
  	for (var i=0; i<=numOn; i++) {
  	  data[i] = parseInt(data[i]);
  	}
  	data[0] = Math.round(data[0]/25)*25;
  	transformVals(data);
  } else {
  	//raise noconn flag
  }
}

var transformVals = function(data) {
  var Adone = false,
  	  Bdone = false,
  	  Cdone = false;
  if (!Aon) {
  	Adone = true;
  }
  if (!Bon) {
  	Bdone = true;
  }
  if (!Con) {
  	Cdone = true;
  }
  data[0] = data[0]/1000;
  for (var i=1; i<=numOn; i++) {
  	if (!Adone) {
  	  data[i] = Parser.parse(Aeq).evaluate({x: Math.round(data[i]*500/1024)/100});
  	  Adone = true;
  	} else if (!Bdone) {
  	  data[i] = Parser.parse(Beq).evaluate({x: Math.round(data[i]*500/1024)/100});
  	  Bdone = true;
  	} else if (!Cdone) {
  	  data[i] = Parser.parse(Ceq).evaluate({x: Math.round(data[i]*500/1024)/100});
  	  Cdone = true;
  	}
  }
  if (numOn) {
    port.postMessage({clean: data}); 
  }
  if (data[0]%4==0) {
  	port.postMessage({send: "I"});
  }
}