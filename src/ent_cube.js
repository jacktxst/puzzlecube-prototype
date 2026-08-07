import Player from './player.js'
import World from './world.js'
import BlockTypes from './blocktypes.js'
import * as THREE from 'three';
import Game from './game.js'

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

const _cubeGeometry = new THREE.BoxGeometry(1, 1, 1)

export default class MovingCube {

	constructor(position, direction) {

		
		this.ANIM_LENGTH = 0.125
		this.animationProgress = 0
		this.origin = position;
		this.direction = direction;
		this.target = new THREE.Vector3()
		this.target.addVectors(this.origin,this.direction);

		this.mesh = new THREE.Mesh(
			_cubeGeometry,
			BlockTypes.PUSH.material
		)
		this.mesh.position.copy(position)
		Game.scene.add(this.mesh)

	}

	process(deltaTime) {

		if (this.needToFree) return

		this.animationProgress += deltaTime

		let anim_pos = new THREE.Vector3()
		anim_pos.copy(this.direction)
		anim_pos.multiplyScalar( this.animationProgress/this.ANIM_LENGTH );

		this.mesh.position.addVectors(this.origin, anim_pos)

		if (this.animationProgress > this.ANIM_LENGTH) {
			World.setBlockAt(this.target, BlockTypes.PUSH.numericId)
			Game.scene.remove(this.mesh)
			this.needToFree = true
		}

	}

	cleanup() {
		Game.scene.remove(this.mesh)
	}

}