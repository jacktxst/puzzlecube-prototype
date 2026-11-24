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
import DPad from './dpad.js'


let Textures = {}

export default {

	createGameScene() {
		const scene = new THREE.Scene();
		
		scene.add(Player.mesh)

		const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
		let originObject = new THREE.Object3D()

		directionalLight.target = originObject
		directionalLight.position.set(-5, 7, 10)
		scene.add( directionalLight );
		scene.background = new THREE.Color().setHex( 0x000000 );
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
		this.camera.position.y = 7.5;
		this.camera.position.z = 11
		this.camera.position.x = 4 * 0.75
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

		let Textures = [];

		let textureNames = [
			"box_glow",
			"box",
			"lift",
			"locked",
			"locked_glow",
			"unlocked_glow",
			"unlocked",
			"switch_off",
			"switch_off_glow",
			"switch_on",
			"switch_on_glow",
			"tiles_glow",
			"tiles"
		];

		for (let textureName of textureNames) {

			let texture = await this.textureLoader.loadAsync("./assets/textures/" + textureName + ".png");
			texture.magFilter = THREE.NearestFilter;
			texture.minFilter = THREE.NearestFilter;
			Textures[textureName] = texture;

		}

		/* resolve materials */

		for (let blockType in BlockTypes) {
			if (BlockTypes[blockType].material !== undefined) continue;
			BlockTypes[blockType].material = new THREE.MeshLambertMaterial()
			BlockTypes[blockType].material.map = Textures[BlockTypes[blockType].textureName]
			BlockTypes[blockType].material.emissive = new THREE.Color(1,1,1)
			BlockTypes[blockType].material.emissiveMap = Textures[BlockTypes[blockType].textureName + "_glow"]

			if (BlockTypes[blockType].matParams) {
				for (let thing in BlockTypes[blockType].matParams) {
					BlockTypes[blockType].material[thing] = BlockTypes[blockType].matParams[thing];
				}
			}

		}

		loadingMessage.innerHTML = "loading audio..."

		/*
		GameAudio.init()
		*/

		await Audio.init()


		loadingMessage.innerHTML = "setting up scene..."

		this.gameScene = this.createGameScene();

		this.menuScene = this.createMenuScene();

		this.scene = this.menuScene;

		this.entities = []

		// Editor.init()



		loadingMessage.innerHTML = "initializing ui..."

		DPad.init()

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
		// DPad.enable()
		
		// Editor.enable()
		Input.enablePlayerMovement()

	},

	exitGame() {
		Audio.play("mus_level5.mp3")
		Input.disablePlayerMovement()
		// DPad.disable()
		// Editor.disable()
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





