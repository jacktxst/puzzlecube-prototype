import * as THREE from 'three';
import Game from './game.js'
import Editor from './editor.js'
import BlockTypes from './blocktypes.js'
import Enemy from './enemy.js'
import Player from './player.js'

const WIDTH  = 10
const HEIGHT = 32

// optimization idea for later
// last occupied block, trim save data for levels and lessen iteration


export default {

	data : new Uint8Array(WIDTH * WIDTH * HEIGHT),
	meshGroup : new THREE.Object3D(),

	tick() {
		for (let tickablePosition of this.tickList ) {

			switch (this.getBlockAt(tickablePosition)) {

				case BlockTypes.BLUE_ACTIVE.numericId:
					this.setBlockAt(tickablePosition, BlockTypes.BLUE_INACTIVE.numericId)
					break;
				case BlockTypes.BLUE_INACTIVE.numericId:
					this.setBlockAt(tickablePosition, BlockTypes.BLUE_ACTIVE.numericId)
					break;
				case BlockTypes.RED_ACTIVE.numericId:
					this.setBlockAt(tickablePosition, BlockTypes.RED_INACTIVE.numericId)
					break;
				case BlockTypes.RED_INACTIVE.numericId:
					this.setBlockAt(tickablePosition, BlockTypes.RED_ACTIVE.numericId)
					break;
				case BlockTypes.ENEMY.numericId:
					Game.entities.push(new Enemy(tickablePosition))
					break;
				case BlockTypes.BUTTON_INACTIVE.numericId:
					{
						let p = tickablePosition.clone()
						p.y += 1
						if (Player.position.equals(p) || this.getBlockAt(p) === BlockTypes.PUSH.numericId) {
							this.setBlockAt(tickablePosition, BlockTypes.BUTTON_ACTIVE.numericId)
							for (let pos of this.findPositionsOfBlockOfType(BlockTypes.GATE_ACTIVE.numericId,32)) {
								this.setBlockAt(pos, BlockTypes.GATE_INACTIVE.numericId)
							}
						}	
					}
					break;
				case BlockTypes.BUTTON_ACTIVE.numericId:
					{
						let p = tickablePosition.clone()
						p.y += 1
						if (! (Player.position.equals(p) || this.getBlockAt(p) === BlockTypes.PUSH.numericId)) {
							this.setBlockAt(tickablePosition, BlockTypes.BUTTON_INACTIVE.numericId)
							for (let pos of this.findPositionsOfBlockOfType(BlockTypes.GATE_INACTIVE.numericId,32)) {
								this.setBlockAt(pos, BlockTypes.GATE_ACTIVE.numericId)
							}
						}
					}
					break;

			}
		}
	},

	loadLevel(hexStr) {
		this.data.fill(0)
		this.data.setFromHex(hexStr)
		this._buildMesh()
		this._gatherTickableBlocks()
	},

	_gatherTickableBlocks() {
		this.tickList = []
		let x = 0
		let y = 0 
		let z = 0

		for (let numericBlockId of this.data) {

			let blockTypeInfo = BlockTypes[Object.keys(BlockTypes)[numericBlockId]]

			if (blockTypeInfo.tickable) {

				this.tickList.push(new THREE.Vector3(x - WIDTH/2 , y-1 , z - WIDTH/2))
			}

			x++;
			if (x>=WIDTH) {
				z++
				x=0
			}
			if (z>=WIDTH) {
				z=0
				x=0
				y++
			}

		}
	},

	findPositionOfBlockOfType(targetId) {
		let x = 0
		let y = 0 
		let z = 0

		for (let numericBlockId of this.data) {

			if (numericBlockId == targetId) {

				return new THREE.Vector3(x - WIDTH/2 , y-1 , z - WIDTH/2)
			}

			x++;
			if (x>=WIDTH) {
				z++
				x=0
			}
			if (z>=WIDTH) {
				z=0
				x=0
				y++
			}

		}
	},

	findPositionsOfBlockOfType(targetId, howMany) {
		let x = 0
		let y = 0 
		let z = 0

		let n = 0
		let result = []

		if (howMany === 0) return;

		for (let numericBlockId of this.data) {

			if (numericBlockId == targetId) {

				result.push(new THREE.Vector3(x - WIDTH/2 , y-1 , z - WIDTH/2)) ; 
				n++;
				if (n === howMany) {
					return result;
				}
			}

			x++;
			if (x>=WIDTH) {
				z++
				x=0
			}
			if (z>=WIDTH) {
				z=0
				x=0
				y++
			}

		}

		return result;
	},


	_arrayIndexFromPosition(position) {
		const temp = position.clone()
		temp.add( new THREE.Vector3(WIDTH/2, 1, WIDTH/2) )
		if (	temp.x <  0     || temp.y <  0     || temp.z <  0     ||
			temp.x >= WIDTH || temp.y >= WIDTH || temp.z >= WIDTH) {
			return -1;
		}
		return temp.y * WIDTH * WIDTH + WIDTH * temp.z + temp.x

	},

	isSolidAt(position) {

		let arrayIndex = this._arrayIndexFromPosition(position)
		if (arrayIndex < 0 || arrayIndex >= this.data.length) {
			return false;
		}
		let numericBlockId = this.data[arrayIndex]
		return BlockTypes[Object.keys(BlockTypes)[numericBlockId]].solid;

	},

	_buildMesh() {

		Game.gameScene.remove(this.meshGroup)
		this.meshGroup = new THREE.Object3D()

		let x = 0
		let y = 0 
		let z = 0

		const blockGeometry = new THREE.BoxGeometry(1,1,1)

		for (let numericBlockId of this.data) {

			let blockTypeInfo = BlockTypes[Object.keys(BlockTypes)[numericBlockId]]

			if (blockTypeInfo.material) {

				let newBox = new THREE.Mesh(
					new THREE.BoxGeometry(1,1,1),
					blockTypeInfo.material
				)

				newBox.position.set( x - WIDTH/2 , y-1 , z - WIDTH/2)

				this.meshGroup.add( 
					newBox
				)
			}

			x++;
			if (x>=WIDTH) {
				z++
				x=0
			}
			if (z>=WIDTH) {
				z=0
				x=0
				y++
			}

		}


		Game.gameScene.add(this.meshGroup)

	},

	setBlockAt(position, numericBlockId) {
		let arrayIndex = this._arrayIndexFromPosition(position)
		if (arrayIndex < 0 || arrayIndex >= this.data.length) {
			return;
		}
		this.data[arrayIndex] = numericBlockId
		this._buildMesh()
		if (BlockTypes[Object.keys(BlockTypes)[numericBlockId]].tickable) {
			for (let pos of this.tickList) {
				if (pos.equals(position)) {
					return
				}
			}
			this.tickList.push(position.clone())
		}
	},

	getBlockAt(position) {
		let arrayIndex = this._arrayIndexFromPosition(position)
		if (arrayIndex < 0 || arrayIndex >= this.data.length) {
			return BlockTypes.EMPTY.numericId;
		}
		return this.data[arrayIndex];
	}
}