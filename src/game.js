import * as THREE from 'three';
import Input from './input.js'
import Player from './player.js'
import Editor from './editor.js'
import World from './world.js'
import GameAudio from './gameaudio.js'
import Levels from './levels.js'
import Audio from './audio.js'
import BlockTypes from './blocktypes.js'
import Menu from './menu.js'

let Textures = {}

export default {

	createGameScene() {
		const scene = new THREE.Scene();
		
		scene.add(Player.mesh)

		const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
		let originObject = new THREE.Object3D()

		directionalLight.target = originObject
		directionalLight.position.set(-5, 7, 10)
		scene.add( directionalLight );
		scene.background = Textures.starTexture
		return scene
	},

	createMenuScene() {
		const scene = new THREE.Scene();
		scene.background = Textures.starTexture
		return scene
	},

	// load assets and initialize main menu
	async gameInit() {

		const loadingMessage = document.createElement('div')
		loadingMessage.innerHTML = "setting up..."
		loadingMessage.style.color = "white"
		loadingMessage.classList.add("centered")
		document.body.appendChild(loadingMessage)

		this.world = World // for console access
		this.editor = Editor
		this.player = Player
		
		this.clock = new THREE.Timer()

		this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
		this.camera.position.y = 10;
		this.camera.position.z = 10
		this.camera.position.x = 3
		this.camera.lookAt(new THREE.Vector3())

		this.raycaster = new THREE.Raycaster()

		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		this.renderer.setPixelRatio(window.devicePixelRatio); 

		document.body.appendChild( this.renderer.domElement );

		window.addEventListener("resize", (e)=>{
			this.renderer.setSize( window.innerWidth, window.innerHeight );
			this.renderer.setPixelRatio(window.devicePixelRatio); 
		})

		



		loadingMessage.innerHTML = "loading textures..."

		this.textureLoader = new THREE.TextureLoader();

		Textures.starTexture = await this.textureLoader.loadAsync("./assets/stars.jpg");


		

		


		loadingMessage.innerHTML = "loading audio..."

		GameAudio.init()
		await Audio.init()

		



		loadingMessage.innerHTML = "setting up scene..."

		this.gameScene = this.createGameScene();

		this.menuScene = this.createMenuScene();

		this.scene = this.menuScene;

		this.entities = []

		Editor.init()



		loadingMessage.innerHTML = "initializing ui..."

		Menu.init()

		document.body.appendChild(Menu.mainMenu.div)

		Audio.play("mus_level5.mp3")
		document.body.removeChild(loadingMessage)

		this.renderer.setAnimationLoop( this.animate.bind(this) );

	},

	// transition between main menu and in game
	startGame(level=0) {

		this.scene = this.gameScene
		this.loadLevel(level)
		
		Editor.enable()
		Input.enablePlayerMovement()

	},

	exitGame() {
		Audio.play("mus_level5.mp3")
		Input.disablePlayerMovement()
		Editor.disable()
		for (let ent of this.entities) ent.cleanup()
		this.entities = []
		this.scene = this.menuScene

	},




	win() {
		this.exitGame()
		document.body.appendChild(Menu.winMenu.div)
	},

	// in game loop
	animate( time ) {
		this.clock.update()
		let deltaTime = this.clock.getDelta()

		Player.update(deltaTime)

		let id = 0
		while (true) {
			if (id >= this.entities.length) break;

			let ent = this.entities[id]
			ent.process(deltaTime)
			if (ent.needToFree) {
				this.entities.splice(id,1)
				id--
			}
			id++
		}

	  	this.renderer.render( this.scene, this.camera );

	},

	

	loadLevel(levelId) {
		for (let ent of this.entities) ent.cleanup()
		this.entities = []
		this.currentLevel = levelId
		World.loadLevel(Levels[this.currentLevel].data)
		Player.init()
		if (Audio.currentTrack != Levels[this.currentLevel].trackName) {
			Audio.play(Levels[this.currentLevel].trackName)
		}
	}

}





