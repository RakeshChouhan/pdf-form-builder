var express = require("express");

var app = express();

app.get("/", function(req, res){
	res.send("Get methods");

});

app.use(express.static(".")); // put the static data folder name here which contain your UI code.

var server = app.listen(8081, function(){
	var host = server.address().address;
	var port = server.address().port;
	console.log(host +" : "+port);

});
