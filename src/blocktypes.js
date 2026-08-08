import * as THREE from 'three';

export default {

	EMPTY : {
		numericId : 0,
		solid: false,
		material: null
	},
	SOLID : {
		numericId : 1,
		solid: true,
		material: new THREE.MeshLambertMaterial({color:0xFFFFFF})
	},
	DEATH : {
		numericId : 2,
		solid: true,
		material: new THREE.MeshLambertMaterial({color:0xFFAAAA})
	},
	BLUE_ACTIVE : {
		numericId : 3,
		solid: true,
		material: new THREE.MeshLambertMaterial({color:0x0000FF}), 
		tickable: true
	},
	BLUE_INACTIVE : {
		numericId : 4,
		solid: false,
		material: new THREE.MeshLambertMaterial({color:0x0000FF,transparent: true,opacity: 0.5,depthWrite: false}),
		tickable: true
	},
	RED_ACTIVE : {
		numericId : 5,
		solid: true,
		material: new THREE.MeshLambertMaterial({color:0xFF0000}),
		tickable: true
	},
	RED_INACTIVE : {
		numericId : 6,
		solid: false,
		material: new THREE.MeshLambertMaterial({color:0xFF0000,transparent: true,opacity: 0.5,depthWrite: false}),
		tickable: true

	},
	GOAL : {
		numericId : 7,
		solid: false,
		material: new THREE.MeshLambertMaterial({color:0x00FF00,transparent: true,opacity: 0.5,depthWrite: false}),

	},
	LIFT : {
		numericId : 8,
		solid: false,
		material: new THREE.MeshLambertMaterial({color:0xFFFF00,transparent: true,opacity: 0.5,depthWrite: false}),

	},
	PUSH : {
		numericId : 9,
		solid: true,
		pushable: true,
		material: new THREE.MeshLambertMaterial({color:0xFF00FF}),

	},
	BLUE_PORTAL : {
		numericId : 10,
		solid: false,
		material: new THREE.MeshLambertMaterial({color:0x00CAD6,transparent: true,opacity: 0.5,depthWrite: false}),
	},
	ORANGE_PORTAL : {
		numericId : 11,
		solid: false,
		material: new THREE.MeshLambertMaterial({color:0xD65500,transparent: true,opacity: 0.5,depthWrite: false}),
	},
	FALLING : {
		numericId : 12,
		solid: true,
		material: new THREE.MeshLambertMaterial({color:0x969082}),
	},
	ENEMY : {
		numericId : 13,
		solid: true,
		material: new THREE.MeshLambertMaterial({color:0xFF0000}),
		tickable : true
	},

	BUTTON_INACTIVE : {
		numericId : 14,
		solid: true,
		material: new THREE.MeshLambertMaterial({color:0x999900}),
		tickable : true
	},
	BUTTON_ACTIVE : {
		numericId : 15,
		solid: true,
		material: new THREE.MeshLambertMaterial({color:0xFFFF00}),
		tickable : true
	},
	
	GATE_ACTIVE : {
		numericId : 16,
		solid: true,
		material: new THREE.MeshLambertMaterial({color:0x999999}),
	},
	GATE_INACTIVE : {
		numericId : 17,
		solid: false,
		material: new THREE.MeshLambertMaterial({color:0x999999,transparent: true,opacity: 0.5,depthWrite: false}),
	},
	CLONE : {
		numericId : 18,
		solid: true,
		tickable:true,
		material: new THREE.MeshLambertMaterial({color:0x9999FF}),
	},
	ICE : {
		numericId : 19,
		solid: true,
		material: new THREE.MeshLambertMaterial({color:0x9999FF,transparent: true,opacity: 0.7,depthWrite: false}),
	},
}