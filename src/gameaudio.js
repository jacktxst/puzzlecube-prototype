// TODO : add support for multiple buses and looping

export default {
	init() {
		this.audioElement = document.createElement("audio")
		this.audioElement.src = "./assets/allsounds.mp3"
		this.audioElement.style.display = "none"
		document.body.appendChild(this.audioElement)
		this.audioElement.addEventListener("timeupdate", (() => {
		  if (this.audioElement.currentTime >= this.stopTime) {
		     this.audioElement.pause();
		  }
		}).bind(this));
	},

	// must be called by a function ultimately originating from a user input, not the animation loop.
	play(soundName) {

		this.audioElement.currentTime = this._sounds[soundName].start;
    	this.stopTime = this._sounds[soundName].stop;
    	this.audioElement
    	this.audioElement.play();

	},

	_sounds : {

		move : {
			start : 0.0,
			stop  : 0.02,
		},
		fail : {
			start : 0.5,
			stop  : 0.7,
		},


	}


}