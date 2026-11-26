export default {

    keybinds : {
        "m":{onDown(){
            this.looking = !this.looking;
        }},
        "ArrowLeft": {onHeld(dt){
            if (this.looking) this.camera.rotation.y -= dt * this.moveSpeed
            else this.camera.position.x -= dt * this.moveSpeed;
        }},
        "ArrowRight":{onHeld(dt){
            if (this.looking) this.camera.rotation.y += dt * this.moveSpeed
            else this.camera.position.x += dt * this.moveSpeed;
        }},
        "ArrowUp":   {onHeld(dt){
            if (this.looking) this.camera.rotation.x += dt * this.moveSpeed
            else this.camera.position.z -= dt * this.moveSpeed;
        }},
        "ArrowDown": {onHeld(dt){
            if (this.looking) this.camera.rotation.x -= dt * this.moveSpeed
            else this.camera.position.z += dt * this.moveSpeed;
        }},
    },

    heldKeys : [],

    init(camera) {
        this.camera = camera;
        this.looking = false;
        this.moveSpeed = 1
        this.lookSpeed = 0.1
        window.addEventListener("keydown", (event)=>{
            if (this.keybinds[event.key] && !this.heldKeys.includes(event.key)) {
                this.heldKeys.push(event.key)
                if (this.keybinds[event.key].onDown) (this.keybinds[event.key].onDown.bind(this))();
            }
        });
        window.addEventListener("keyup", (event)=>{
            if (this.keybinds[event.key] && this.heldKeys.includes(event.key)) {
                this.heldKeys = this.heldKeys.filter((e) => e !== event.key)
            }
        });
    },

    update(dt) {

        for (let key of this.heldKeys) {
            if (this.keybinds[key].onHeld)
                (this.keybinds[key].onHeld.bind(this))(dt);
        }

    }

}

