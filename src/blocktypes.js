import * as THREE from 'three';

export default {

	EMPTY : {
		numericId : 0,
		solid: false,
		material: null,
	},
	SOLID : {
		numericId : 1,
		solid: true,
		textureName: "tiles"
	},
	DEATH : {
		numericId : 2,
		solid: true,
	},
	BLUE_ACTIVE : {
		numericId : 3,
		solid: true,
		tickable: true
	},
	BLUE_INACTIVE : {
		numericId : 4,
		solid: false,
		tickable: true
	},
	RED_ACTIVE : {
		numericId : 5,
		solid: true,
		tickable: true
	},
	RED_INACTIVE : {
		numericId : 6,
		solid: false,
		tickable: true

	},
	GOAL : {
		numericId : 7,
		solid: false,
		material: new THREE.MeshBasicMaterial({color:0x00ff00,transparent:true,opacity:0.5})

	},
	LIFT : {
		numericId : 8,
		solid: false,
		material: new THREE.MeshBasicMaterial({color:0xffff00,transparent:true,opacity:0.5})
	},
	PUSH : {
		numericId : 9,
		textureName: "box",
		solid: true,
		pushable: true,

	},
	BLUE_PORTAL : {
		numericId : 10,
		solid: false,
	},
	ORANGE_PORTAL : {
		numericId : 11,
		solid: false,
	},
	FALLING : {
		numericId : 12,
		solid: true,
	},
	ENEMY : {
		material : new THREE.MeshLambertMaterial({emissive: new THREE.Color(1,0,0)}),
		numericId : 13,
		solid: true,
		tickable : true
	},

	BUTTON_INACTIVE : {
		numericId : 14,
		solid: true,
		textureName: "switch_off",
		tickable : true
	},
	BUTTON_ACTIVE : {
		numericId : 15,
		solid: true,
		textureName: "switch_on",
		tickable : true
	},
	
	GATE_ACTIVE : {
		numericId : 16,
		solid: true,
		textureName: "locked",

	},
	GATE_INACTIVE : {
		numericId : 17,
		solid: false,
		textureName: "unlocked",
		matParams : { opacity: 0.2, transparent: true },
	},
	CLONE : {
		numericId : 18,
		solid: true,
		tickable:true,
	},
	ICE : {
		numericId : 19,
		solid: true,
	},
}