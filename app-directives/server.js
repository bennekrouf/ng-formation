var express = require('express')
	,app = module.exports.app = express()
	;

app.configure(function () {
	app.use(express.favicon());
	app.use(express.urlencoded());
	app.use(express.logger('dev'));  //tiny, short, default
	app.use(express.bodyParser({limit: '2000mb'}));

	app.use(app.router);
	app.use(express.static(__dirname + '/app'));
	app.use("/test", express.static(__dirname + '/test'));
	app.use(express.errorHandler({dumpExceptions: true, showStack: true, showMessage: true}));
});

var port = process.argv[2] || 5000;	
	
app.listen(port, '127.0.0.1', 511, function() {
  console.log("Listening on : "+port);
  
  var open = require('open');
  open('http://localhost:' + port + '/', 'chrome');
  //open('http://127.0.0.1:8080/debug?port=5858');
});