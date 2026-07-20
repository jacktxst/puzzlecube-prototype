/*

	the only script that gets executed by index.html

*/

import Game from './game.js'

window.game = Game

let startGameButton = document.createElement("button")
let img = document.createElement("img")

img.style.maxWidth = "100px"
img.style.maxHeight = "100px"

img.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSe7dwT5QddCCL8rLxEK1y2YPSYfgWE6nYfwjP-gFNigw&s=10"
startGameButton.id = "startGameButton"
startGameButton.appendChild(img);
startGameButton.classList.add("centered");

startGameButton.addEventListener("click", (e)=>{
	Game.gameInit()
	document.body.removeChild(startGameButton)

	let div = document.createElement("div")

	div.style.color = "white"
	div.style.backgroundColor = "black"
	div.style.position = "absolute"
	div.style.top = "0"
	div.style.left = "0"
	div.innerHTML = "puzzlecube prototype build jun 2026"

	document.body.appendChild(div)


})

document.body.appendChild(startGameButton)



