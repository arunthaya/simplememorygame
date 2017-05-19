/* - Developed by: Arun Thayanithy
	 S.N. - 100887220
	 Course - COMP 2406
	 Assignment 2
	 Date : March 7th, 2017
*/

//Global variables created to store necesary information that is needed for the page to work, so the variables aren't cleared with the functions
var user;
var counter = 0;
var clickedCards = [];
var correctAnswers = [];
var tempAnswers = [];
var guesses = 0;
var correctGuessed = 0;
var totalGameCounter = 1;


//The function is run when the page is loaded and prompts the user for a valid user name and reprompts if it does meet the while condition
$(document).ready(function(){
	totalGameCounter = 1;
	user = '';
	while(user ==''){
			//user = window.prompt("What is your name?");	
			if(counter != 0){
				user = window.prompt("Enter a valid name please:")
			}else{
				user = window.prompt("What is your name?");	
			}
			counter++;
	}
	
	//An ajax request is set with a post protocol where the client sends the user's entered name and runs a function after the server successfully responds with the necessary information
	$.ajax({
		method:"POST",
		url:"/memory/intro",
		data: {user: user, level: totalGameCounter},
		success: displayGame,
		dataType:'json'
	});
	
});

//On success from the ajax post request the displayGame function is ran which creates the gameboard and initiates a tile with a listener that activates a chooseTile function
function displayGame(data){
	
	//this ajax sole's purpose is to get the difficulty of the game and to display the board accordingly
	$.ajax({
		method: "GET",
		url: "/memory/level",
		data: {'user': user, 'level': totalGameCounter},
		success: function(data){
			//console.log("Level of difficulty is ", data.difficulty);
			var temper1000 = data.difficulty;
			var row = -1;
			var column = -1;
			var tester = 'x';
	
			$("#gameboard").empty();
			for (var i=0; i < data.difficulty*data.difficulty; i++){
				//whenever i mod 4 is equal to 0 it means a new row can be started, the function appends a tr tag to the gameboard div
				if(i%data.difficulty==0) {
					$("#gameboard").append("<tr>");
					row++;
					column = -1;
				}
				column++;
				//each tile has the necessary information linked to it for future reference and server reference, and a chooseTile listener is added 
				$("#gameboard").append("<td><div class='tile' id='block"+i+"' data-index='"+i+"' data-row='"+row+"' data-column='"+column+"'></div></td>");
				$("#block"+i).on('click',chooseTile);
				//test
				//$("#block"+i).addClass('tile').css({transform: 'rotateY(360deg)'});
				if((i+1)%data.difficulty==0) {
				$("#gameboard").append("</tr>");
				}
			}
			//console.log("exited for loop");
			},
		dataType: 'json'
	});
}

//this function is called after the very first runThrough and is the same as the first function when the page is reloaded, however the user is not prompted to enter their game again
function multipleRunThrough(){
	correctGuessed = 0;
	correctAnswers = 0;
	guesses = 0;
	$.ajax({
		method:"POST",
		url:"/memory/intro",
		data: {user: user, level: totalGameCounter},
		success: displayGame,
		dataType:'json'
	});
}

//chooseTile function that is run everytime a tile is clicked
function chooseTile(){

	//an array with the clicked cards is stored 
	var tester1000 = $(this).attr('data-index');

	clickedCards.push(parseInt(tester1000));

	//If the clickedCards.length is less than two the following will be executed
	if(clickedCards.length <= 2) {
		//An ajax get request is sent to the server and the server will respond with necessary information
		$.ajax({
			
			method:"GET",
			url:"/memory/card",
			data: {'username': user, 'rowchoice': $(this).attr('data-row'), 'columnchoice':$(this).attr('data-column'), 'index': $(this).attr('data-index')},
			success: function(data){
				//upon success the following will be executed
				tempAnswers.push(data.answer);
				//a temporary array with the tempAnswers is stored which is the tile selected number 
				$("#block"+data.indexer).html(data.answer);
				$("#block"+data.indexer).addClass('tileToggledClass').css({transform: 'rotateY(360deg)'});
				guesses++;
				//the listener is turned off as we don't want to click it again
				$("#block"+data.indexer).off('click',chooseTile);
				
				//if the clicked cards is equal to it will compare the two elements of the array to see if the cards are equal
				if(clickedCards.length == 2){
					if(tempAnswers[0] == tempAnswers[1]){
						
						//if they are equal the global arrays are reset 
						for(var i=2; i>0; i--){
							clickedCards.pop();
							tempAnswers.pop();
						}
						correctGuessed++;		
						
						/*if the number of correct answers is 8, the game is done and the following is ran, which prompts the user to 
						confirm whether they want to play the game again or not with the number of guesses they took*/
						if(correctGuessed == (data.difficultyT*data.difficultyT)/2){
							//total answers that are correct is equivalent to the difficulty multiplied by itself divided by 2
							setTimeout(function(){

								if(confirm("You took " + guesses+ " guesses. Would you like to play again?")){
									totalGameCounter++;
									multipleRunThrough();
								} else {
									alert("Thanks for playing");
								}

							},400);
						}			
					} else { 
						/* Asynchronous function that will turn on the choose tile after 500 milliseconds has passed along with the class 
							'tileToggledClass' being toggled 
						*/
						setTimeout( function(){
							$("#block"+clickedCards[0]).removeClass('tileToggledClass');
							$("#block"+clickedCards[1]).removeClass('tileToggledClass');
							$("#block"+clickedCards[0]).html("");
							$("#block"+clickedCards[1]).html("");
							$("#block"+clickedCards[0]).on('click',chooseTile).css({transform: 'rotateY(0deg)'});
							$("#block"+clickedCards[1]).on('click',chooseTile).css({transform: 'rotateY(0deg)'});;
	
							for(var i=2; i>0; i--){
								clickedCards.pop();
								tempAnswers.pop();
							}
						}, 500);
					}
				}
			},
			dataType:'json'
		});
	} else {
		if(tempAnswers[0] == tempAnswers[1]){
			for(var i=2; i>0; i--){
				clickedCards.pop();
				tempAnswers.pop();
			}
		}
		else {
			$("#block"+clickedCards[0]).removeClass('tileToggledClass');
			$("#block"+clickedCards[1]).removeClass('tileToggledClass');
			$("#block"+clickedCards[0]).on('click',chooseTile);
			$("#block"+clickedCards[1]).on('click',chooseTile);
			for(var i=2; i>0; i--){
				clickedCards.pop();
				tempAnswers.pop();
			}
		}
		//resets the tempAnswers and the clickedCards array 
		for(var i=2; i>0; i--){
			clickedCards.pop();
			tempAnswers.pop();
		}
	}

}
