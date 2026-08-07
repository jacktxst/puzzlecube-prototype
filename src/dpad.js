import Player from './player.js'

export default {
	init() {
		let dPadDiv = document.createElement("div")
		this.dPadDiv = dPadDiv
		dPadDiv.id = "dpad"
		dPadDiv.style.gridTemplateColumns = "repeat(3, 1fr)"
		dPadDiv.style.gridTemplateRows = "repeat(3, 1fr)"
		let buttonLeft = document.createElement("div")
		buttonLeft.classList.add("dPadButton")
		buttonLeft.style.gridArea = "2 / 1"
		buttonLeft.addEventListener("click",(e)=>{
			Player.moveLeft()
		})
		dPadDiv.appendChild(buttonLeft)
		let buttonRight = document.createElement("div")
		buttonRight.classList.add("dPadButton")
		buttonRight.style.gridArea = "2 / 3"
		buttonRight.addEventListener("click",(e)=>{
			Player.moveRight()
		})
		dPadDiv.appendChild(buttonRight)
		let buttonUp = document.createElement("div")
		buttonUp.classList.add("dPadButton")
		buttonUp.style.gridArea = "1 / 2"
		buttonUp.addEventListener("click",(e)=>{
			Player.moveForward()
		})
		dPadDiv.appendChild(buttonUp)
		let buttonDown = document.createElement("div")
		buttonDown.classList.add("dPadButton")
		buttonDown.style.gridArea = "3 / 2"
		buttonDown.addEventListener("click",(e)=>{
			Player.moveBack()
		})
		dPadDiv.appendChild(buttonDown)
		
	},
	enable() {
		document.body.appendChild(this.dPadDiv)
	},
	disable() {
		document.body.removeChild(this.dPadDiv)
	}
}