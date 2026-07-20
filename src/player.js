import * as THREE from 'three';
import World from './world.js'
import BlockTypes from './blocktypes.js'
import Game from './game.js'
import GameAudio from './gameaudio.js'
import Levels from './levels.js'

const PI = 3.141592

// the four directions that the player can move in by pressing w, a, s and d

const PLAYER_MOVE_DIRS = [
	new THREE.Vector3(0 , 0,-1),
	new THREE.Vector3(-1, 0, 0),
	new THREE.Vector3(0 , 0, 1),
	new THREE.Vector3(1 , 0, 0)
]

// the full rotation made during the player's move animation

const PLAYER_SPIN_DIRS = [
	new THREE.Vector3(-PI/2, 0,     0),
	new THREE.Vector3(    0, 0,  PI/2),
	new THREE.Vector3( PI/2, 0,     0),
	new THREE.Vector3(    0, 0, -PI/2)
]

export default {

	mesh : new THREE.Mesh( new THREE.BoxGeometry( 1, 1, 1 ), new THREE.MeshLambertMaterial( { color: 0x00ff00 } ) ),
	ANIM_LENGTH : 0.25,
	position : new THREE.Vector3(),
	moveDirectionId : 0,
	gravity : 36,
	maxFallVelocity: 3,
	spawnPoint : new THREE.Vector3(0, 2, 0),

	collide() {
		let temp = this.position.clone()

		temp.y -= 1

		if (World.getBlockAt(temp) === BlockTypes.FALLING.numericId) {
			World.setBlockAt(temp, BlockTypes.EMPTY.numericId)
		}

		temp.y += 1
		
		temp.add(PLAYER_MOVE_DIRS[this.moveDirectionId])

		temp.y += 1
		if ( World.isSolidAt(temp) ) {
			GameAudio.play("fail")
			return true
		}
		temp.y -= 1

		if ( BlockTypes[Object.keys(BlockTypes)[World.getBlockAt(temp)]].pushable ) {

			// check 1 block beyond for solidity
			temp.add(PLAYER_MOVE_DIRS[this.moveDirectionId])
			if ( World.isSolidAt(temp) ) {
				GameAudio.play("fail")
				return true
			} else {
				World.setBlockAt(temp, BlockTypes.PUSH.numericId)
				temp.sub(PLAYER_MOVE_DIRS[this.moveDirectionId])
				World.setBlockAt(temp, BlockTypes.EMPTY.numericId)
				GameAudio.play("move")
				return false;
			}

		}

		else if ( World.isSolidAt(temp) ) {
			GameAudio.play("fail")
			return true
		}
		
		else {
			GameAudio.play("move")
			return false
		}

		
	},

	moveForward() {
		if (this.isDoingMoveAnimation || this.isFalling) return;
		this.moveDirectionId = 0

		if ( ! this.collide() ) this.isDoingMoveAnimation = true
	},

	moveLeft() {
		if (this.isDoingMoveAnimation || this.isFalling) return;
		this.moveDirectionId = 1
		if ( ! this.collide() ) this.isDoingMoveAnimation = true
	},

	moveBack() {
		if (this.isDoingMoveAnimation || this.isFalling) return;
		this.moveDirectionId = 2
		if ( ! this.collide() ) this.isDoingMoveAnimation = true
	},

	moveRight() {
		if (this.isDoingMoveAnimation || this.isFalling) return;
		this.moveDirectionId = 3
		if ( ! this.collide() ) this.isDoingMoveAnimation = true
	},

	fallDownIfNotSupported() {
		let temp = this.position.clone()
		temp.y -= 1
		if ( ! World.isSolidAt(temp) ) this.isFalling = true;
	},

	// more like a reset than an init. init is just the definition of this object
	init() {

		this.position = new THREE.Vector3( Levels[Game.currentLevel].spawnpoint.x, Levels[Game.currentLevel].spawnpoint.y, Levels[Game.currentLevel].spawnpoint.z )
		this.mesh.position.copy(this.position)
		this.mesh.rotation.set(0,0,0,'XYZ')
		this.isFalling = false 
		this.isDoingMoveAnimation = false
		this.animationProgress = 0
		this.fallVelocity = 0
		
	},

	update(deltaTime) {

		if (this.isDoingMoveAnimation) {

			this.animationProgress += deltaTime

			let rot = new THREE.Vector3()
			rot.copy(PLAYER_SPIN_DIRS[this.moveDirectionId])
			rot.multiplyScalar(this.animationProgress/this.ANIM_LENGTH)

			let anim_pos = new THREE.Vector3()
			anim_pos.copy(PLAYER_MOVE_DIRS[this.moveDirectionId])
			anim_pos.multiplyScalar( 1 * Math.sin( PI * this.animationProgress/this.ANIM_LENGTH * 0.5 ) )
			anim_pos.y = 0.5 * Math.sin(  PI * this.animationProgress/this.ANIM_LENGTH )

			this.mesh.rotation.setFromVector3(rot, 'XYZ')
			this.mesh.position.addVectors(this.position, anim_pos)

			if (this.animationProgress > this.ANIM_LENGTH) {
				this.animationProgress = 0
				this.isDoingMoveAnimation = false 
				this.mesh.rotation.set(0,0,0, 'XYZ')
				this.position.add(PLAYER_MOVE_DIRS[this.moveDirectionId])
				this.mesh.position.copy(this.position)
				World.tick()
				// potential bug from the order of these next two statements
				this.fallDownIfNotSupported()
				if (World.getBlockAt(this.position) ===  BlockTypes.LIFT.numericId) {
					this.position.y += 1
					this.mesh.position.copy(this.position)
				}
				if (World.getBlockAt(this.position) ===  BlockTypes.GOAL.numericId) {
					if (Game.currentLevel+1 === Levels.length) {
						Game.win()
					} else {
						Game.loadLevel(Game.currentLevel+1)
					}
				}
				if (World.getBlockAt(this.position) ===  BlockTypes.BLUE_PORTAL.numericId) {
					this.position = World.findPositionOfBlockOfType(BlockTypes.ORANGE_PORTAL.numericId)
					this.mesh.position.copy(this.position)
				}
				else if (World.getBlockAt(this.position) ===  BlockTypes.ORANGE_PORTAL.numericId) {
					this.position = World.findPositionOfBlockOfType(BlockTypes.BLUE_PORTAL.numericId)
					this.mesh.position.copy(this.position)
				}
			}
		} else if (this.isFalling) {

			if (this.mesh.position.y < -2) {
				this.init()
				Game.loadLevel(Game.currentLevel)
			}

			this.fallVelocity += deltaTime * this.gravity
			if (this.fallVelocity > this.maxFallVelocity) this.fallVelocity = this.maxFallVelocity

			this.mesh.position.y -= deltaTime * this.fallVelocity

			let temp = this.mesh.position.clone()
			temp.y += 0.5
			temp.y = Math.round(temp.y)
			temp.y -= 1
			if (World.isSolidAt(temp)) {
				this.isFalling = false;
				this.fallVelocity = 0
				temp.y += 1
				this.mesh.position.copy(temp)
				this.position.copy(temp)
			}
		}

	}

}