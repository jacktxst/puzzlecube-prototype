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

const _enemyGeometry = new THREE.BoxGeometry(1, 1, 1)

export default class Enemy {

	constructor(position) {

		
		let bestPosition = position.clone()
		let checkPosition = position.clone()
		let bestDistance = 9999
		let bestDirection = null

		const offsetVectors = [
			new THREE.Vector3(-1,-1, 0),
			new THREE.Vector3( 1,-1, 0),
			new THREE.Vector3( 0,-1,-1),
			new THREE.Vector3( 0,-1, 1),
		]

		for (let offsetVector of offsetVectors) {
			checkPosition.addVectors(position,offsetVector)
			if (World.isSolidAt(checkPosition)) {
				checkPosition.y += 1
				if (World.getBlockAt(checkPosition) === BlockTypes.EMPTY.numericId) {
					checkPosition.y += 1
					if (World.isSolidAt(checkPosition)) continue
					checkPosition.y -= 1
					let d = Player.position.distanceTo(checkPosition)
					if (d < 0.9) {
						Player.init()
						Game.loadLevel(Game.currentLevel)
						this.needToFree = true
						return
					}
					if (d < bestDistance) {
						bestDistance = d 
						bestPosition = checkPosition.clone()
						bestDirection = offsetVector.clone()
						bestDirection.y += 1
					}
				}
			}	
		}

		World.setBlockAt(position, BlockTypes.EMPTY.numericId)


		this.origin = position.clone()
		this.target = bestPosition.clone()
		this.ANIM_LENGTH = 0.125
		this.animationProgress = 0

		this.mesh = new THREE.Mesh(
			_enemyGeometry,
			BlockTypes.ENEMY.material
		)
		this.mesh.position.copy(this.origin)
		Game.scene.add(this.mesh)

		for (let i in PLAYER_MOVE_DIRS) {

			if (PLAYER_MOVE_DIRS[i].equals(bestDirection)) {
				this.moveDirectionId = i
			}

		}

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
			World.setBlockAt(this.target, BlockTypes.ENEMY.numericId)
			Game.scene.remove(this.mesh)
			this.needToFree = true
			if (this.target.distanceTo(Player.position) <= 1.01) {
				Game.loadLevel(Game.currentLevel)
			}
		}

	}

	cleanup() {
		Game.scene.remove(this.mesh)
	}

}