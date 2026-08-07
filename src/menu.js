import Game from './game.js'
import Levels from './levels.js'

export default {

	init() {

		let winMenu = this.createMenu()
		winMenu.createLabel("YOU WON")
		winMenu.createButton("RETURN TO MAIN MENU", ()=>{
			document.body.removeChild(winMenu.div)
			document.body.appendChild(mainMenu.div)
		})
		this.winMenu = winMenu


		let mainMenu = this.createMenu()
		mainMenu.createButton("PLAY", ()=>{
			document.body.removeChild(mainMenu.div)
			Game.startGame(0)
		})
		mainMenu.createButton("LEVELS", ()=>{
			document.body.removeChild(mainMenu.div)
			document.body.appendChild(levelsMenu.div)
		})
		mainMenu.createButton("OPTIONS")
		mainMenu.createButton("CREDITS", ()=>{
			document.body.removeChild(mainMenu.div)
			document.body.appendChild(creditsMenu.div)
		})
		this.mainMenu = mainMenu


		let levelsMenu = this.createMenu()
		for (let level in Levels) {
			levelsMenu.createButton(`LEVEL ${level}`,()=>{
				document.body.removeChild(levelsMenu.div)
				Game.startGame(Number(level))
			})
		}
		levelsMenu.createButton("RETURN",()=>{
			document.body.removeChild(levelsMenu.div)
			document.body.appendChild(mainMenu.div)
		})




		let creditsMenu = this.createMenu()
		creditsMenu.createButton("RETURN", ()=>{
			document.body.removeChild(creditsMenu.div)
			document.body.appendChild(mainMenu.div)
		})

	},

	createMenu() {

		let menu = {

			createButton(text, func) {

				let button = document.createElement("button")
				button.innerHTML = text
				button.classList.add("menubutton")
				button.classList.add("menuitem")

				button.addEventListener("click", func)

				this.div.appendChild(button)

			},

			createLabel(text) {

				let div = document.createElement("div")
				div.innerHTML = text
				div.classList.add("label")
				div.classList.add("menuitem")


				this.div.appendChild(div)

			}

		}

		let div = document.createElement("div")

		div.classList.add("centered")
		div.classList.add("menu")

		menu.div = div 

		return menu

	}



}