/* - Developed by: Arun Thayanithy
	 S.N. - 100887220
	 Course - COMP 2406
	 Assignment 2
	 Date : March 7th, 2017
*/





/*Importing necessary modules from npm, and local modules including makeBoard, this assignment server script was built on tutorial 6's server skeleton, 
	makeBoard.js was also  retrieved from COMP 2406's website, courtesy of Andrew Runka 
*/
var http = require('http');
var fs = require('fs');
var mime = require('mime-types');
var url = require('url');
var board = require('./board/makeBoard.js');
var totalGameCounter = 0;

const ROOT = "./public";

//simple server is initiated to listen to the port
var server = http.createServer(handleRequest);
server.listen(2406);
console.log('Server listening on port 2406');
var users = {};
var clients = {};
var client;
var temporaryTester = [];
var hardnessLevel = 0;


//handler for requests and responds made to the url once the server is listening on port 2406 successfully
function handleRequest(req, res) {
	
	
	
	var urlObj = url.parse(req.url, true);
	var filename = ROOT+urlObj.pathname;
	
	//this if statement is used whenever a user refreshes the page, and new user is created by sending a post request to the server
	
	if(urlObj.pathname === "/memory/intro"){
		var body = '';
		
		req.on('data', function (data) {
			body += data;
			//totalGameCounter++;
		});
		
	
		req.on('end', function() {
			var tempUser = body.substring(5, body.indexOf("&"));
			//console.log("tempUser is  ", tempUser);
			var levelOfDifficulty = parseInt(body.substring(body.indexOf("&")+7, body.length));
			hardnessLevel = levelOfDifficulty*2 + 2;
			//console.log("hardness level is",hardnessLevel);
			//console.log("Hardness level is ", hardnessLevel);
			//console.log("Level of difficulty is ", levelOfDifficulty);
			client = board.makeBoard(hardnessLevel);
			//console.log(client);
			users[tempUser] = client;
		});
		
		respond(200, JSON.stringify(users)); 
		/*a response is sent back to the client with the users stored in the array for the key, and the value being the randomly generated array
		*/
																		

	}
	//this if statement is used when a client request is received, it will return the necessary information for the gameboard logic
	else if(urlObj.pathname === "/memory/card") {
		
		//These variables parse the information sent from the client and store the values
		var temporary = users[urlObj.query.username];
		var selectedRow = urlObj.query.rowchoice;
		var selectedColumn = urlObj.query.columnchoice;
		
		//Response sends back the answer of the selected tile, and sends back the row tester and column tester, along with the index ranging from 0 to 15, for the client to process information
		var response = {answer: temporary[selectedRow][selectedColumn], rowTester: parseInt(selectedRow), columnTester: parseInt(selectedColumn), indexer: parseInt(urlObj.query.index), difficultyT: hardnessLevel};
		respond(200, JSON.stringify(response));

	}
	//this if statement is executed just to get the hardness level when running the display function
	else if(urlObj.pathname === "/memory/level"){
		var response = {difficulty: hardnessLevel};
		respond(200, JSON.stringify(response));
	}
	else {
		
		//this part of the server will serve the index html as soon as the page is requested asynchronously 
		fs.stat(filename, function(err, stats) {
			if(err){
				respondErr(err);
			}else{
				if(stats.isDirectory()) filename+= "/index.html";
				fs.readFile(filename,"utf8",function(err, data){
					if(err)respondErr(err);
					else respond(200,data);
				});
			}
		});
		
		//if an error is found the 404.html page is brought up
		function serve404(){
			fs.readFile(ROOT+"/404.html","utf8",function(err,data){
				if(err)respond(500,err.message);
				else respond(404,data);
			});
		}
		
		//if an error is found on the server, the server responds with the appropriate error message
		function respondErr(err){
			console.log("Handling error: ",err);
			if(err.code==="ENOENT"){
				serve404();
			}else{
				respond(500,err.message);
			}
		}
				

	}
	
	
	//function that is called with the status code of the server being passed through along with the data necessary for the client
	function respond(code, data){
		res.writeHead(code, {'content-type': mime.lookup(filename)|| 'text/html'});
		res.end(data);
	}

};//end handle request



