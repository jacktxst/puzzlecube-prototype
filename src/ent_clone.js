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

const _cloneGeometry = new THREE.BoxGeometry(1, 1, 1)

export default class CloneEntity {

	constructor(position) {



		this.origin = position.clone()
		this.target = position.clone()
		this.moveDirectionId = Player.moveDirectionId
		this.target.add(PLAYER_MOVE_DIRS[Player.moveDirectionId]);
		this.ANIM_LENGTH = 0.125
		this.animationProgress = 0

		if(World.getBlockAt(this.target) != BlockTypes.EMPTY.numericId){
			Game.scene.remove(this.mesh)
			this.needToFree = true
			return;
		}

		World.setBlockAt(position, BlockTypes.EMPTY.numericId)


		this.mesh = new THREE.Mesh(
			_cloneGeometry,
			BlockTypes.CLONE.material
		)
		this.mesh.position.copy(this.origin)
		Game.scene.add(this.mesh)



	}

	process(deltaTime) {

		if (this.needToFree) return

		this.animationProgress += deltaTime

		let rot = new THREE.Vector3()
		rot.copy(PLAYER_SPIN_DIRS[this.moveDirectionId])
		rot.multiplyScalar(this.animationProgress/this.ANIM_LENGTH)

		let anim_pos = new THREE.Vector3()
		anim_pos.copy(PLAYER_MOVE_DIRS[this.moveDirectionId])
		anim_pos.multiplyScalar( 1 * Math.sin( PI * this.animationProgress/this.ANIM_LENGTH * 0.5 ) )
		anim_pos.y = 0.5 * Math.sin(  PI * this.animationProgress/this.ANIM_LENGTH )

		this.mesh.rotation.setFromVector3(rot, 'XYZ')
		this.mesh.position.addVectors(this.origin, anim_pos)

		if (this.animationProgress > this.ANIM_LENGTH) {
			World.setBlockAt(this.target, BlockTypes.CLONE.numericId)
			Game.scene.remove(this.mesh)
			this.needToFree = true
	
		}

	}

	cleanup() {
		Game.scene.remove(this.mesh)
	}

}