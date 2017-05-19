# simplememorygame
Classic card memory game using Node and jQuery.

OS used: Mac OS 10.12, Xubuntu 16.04, Windows 8.1
Browsers tested on all OS: Firefox, Chrome, Safari (Mac only)
Notepad++ , Notepadqq, Sublime Text were the editors used


How to use:
1. Start a command prompt window from the same directory as where the server.js file is stored.
2. If mime-types module hasn't been installed, install it using the "npm install mime-types" command.
3. Run the server.js using node server.js command.
4. Go to http://localhost:2406/ in a browser of your choice.
5. You will be prompted to enter a username.
6. Leaving the prompt will force the prompt to reprompt for a proper username.
7. Game will populate.
8. Objective of the game is to match all cards, 
		- cards dissappear after two options have been selected
		- two matching cards will stay permanently flipped
9. Once you've completed the game the game will ask if you'd like to play, with the number of guesses it took
	to finish the game displayed.
10. If you click play again, the level of difficulty will increase with more cards.
