import * as THREE from 'three';
import {
    GLTFLoader
} from 'three/addons/loaders/GLTFLoader.js';
import {
    FirstPersonControls
} from 'three/addons/controls/FirstPersonControls.js';
import {
    PointerLockControls
} from 'three/addons/controls/PointerLockControls.js';
// import {
//     GUI
// } from 'three/addons/controls/dat.gui.js';

const scene = new THREE.Scene();

const textureBack = new THREE.TextureLoader().load("./assets/textures/sky.jpg");
scene.background = textureBack

// const gui = new GUI()
// const camFolder = gui.addFolder('Camera')
// camFolder.add(camera.position, 'z', 0, 10)
// camFolder.open()

const backgroundMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2, 0),
    new THREE.MeshBasicMaterial({
        map: textureBack
    }));

backgroundMesh.material.depthTest = false;
backgroundMesh.material.depthWrite = false;

let backgroundScene = new THREE.Scene();
let backgroundCamera = new THREE.Camera();
backgroundScene.add(backgroundCamera);
backgroundScene.add(backgroundMesh);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// scene.background = new THREE.Color("blue");

let player = {
    height: 1.80,
    turnSpeed: .1,
    speed: .1,
    jumpHeight: .125,
    gravity: .005,
    velocity: 0,
    width: 0.8,
    playerJumps: false
}

document.body.appendChild(renderer.domElement);

const brickTexture = new THREE.TextureLoader().load("./assets/textures/bricks3.png");
brickTexture.wrapS = THREE.RepeatWrapping;
brickTexture.wrapT = THREE.RepeatWrapping;
brickTexture.repeat.set(45, 45);

// const planksTexture = new THREE.TextureLoader().load("./assets/textures/planks.png");
// planksTexture.wrapS = THREE.RepeatWrapping;
// planksTexture.wrapT = THREE.RepeatWrapping;
// planksTexture.repeat.set(1, 1);

camera.position.set(0, player.height, -5);
camera.lookAt(new THREE.Vector3(0, player.height, 0));

// Object:Box1
// let BoxGeometry1 = new THREE.BoxGeometry(1, 1, 1);
// let BoxMaterial1 = new THREE.MeshBasicMaterial({
//     color: "blue",
//     wireframe: false
// });
// // BoxMaterial1.map = brickTexture
// let Box1 = new THREE.Mesh(BoxGeometry1, BoxMaterial1);

// Box1.position.y = 3;
// Box1.scale.x = Box1.scale.y = Box1.scale.z = .25;
// scene.add(Box1);

// Object:Box2
// let BoxGeometry2 = new THREE.BoxGeometry(1, 1, 1);
// let BoxMaterial2 = new THREE.MeshPhongMaterial({
//     color: "white",
//     wireframe: false
// });
// BoxMaterial2.map = planksTexture
// let Box2 = new THREE.Mesh(BoxGeometry2, BoxMaterial2);

// Box2.position.y = 0.5;
// Box2.position.x = 0;
// Box2.receiveShadow = true;
// Box2.castShadow = true;

// scene.add(Box2);

let PlaneGeometry1 = new THREE.PlaneGeometry(10, 10);
let PlaneMaterial1 = new THREE.MeshPhongMaterial({
    color: "white",
    wireframe: false
});
PlaneMaterial1.map = brickTexture
let Plane1 = new THREE.Mesh(PlaneGeometry1, PlaneMaterial1);

Plane1.rotation.x -= Math.PI / 2;
Plane1.scale.x = 3;
Plane1.scale.y = 3;
Plane1.receiveShadow = true;
Plane1.name = 'floor'
scene.add(Plane1);

// let light1 = new THREE.PointLight("white", .8);
// light1.position.set(5, 3, 0);
// light1.castShadow = true;
// light1.shadow.camera.near = 2.5;
// scene.add(light1);

let ambientLight = new THREE.AmbientLightProbe('white', 0.5);
scene.add(ambientLight);


//controls
let controls = {};
document.addEventListener('keydown', ({
    key
}) => {
    controls[key.toLowerCase()] = true
});
document.addEventListener('keyup', ({
    key
}) => {
    controls[key.toLowerCase()] = false
});

const mouseControls = new PointerLockControls(camera, document.body);
document.addEventListener('mousedown', (event) => {
    mouseControls.lock()
})

const cameraVec = new THREE.Vector3()

function control() {
    // console.log(player.speed)
    console.log(controls)
    if (controls['w']) {
        // camera.position.addScaledVector(cameraVec, player.speed)
        // if (player.jumps) {
        //     camera.translateZ(-player.speed)
        //     // camera.translateY(player.speed)
        //     return
        // }
        camera.translateY(player.speed)
        camera.translateZ(-player.speed)

    }
    if (controls['s']) {
        // camera.position.addScaledVector(cameraVec, -player.speed)
        camera.translateZ(player.speed)
        camera.translateY(-player.speed)
    }
    if (controls['a']) {
        camera.translateX(-player.speed)
    }
    if (controls['d']) {
        camera.translateX(player.speed)
    }
    if (controls[' ']) {
        if (player.jumps) return false;
        player.jumps = true;
        player.velocity = -player.jumpHeight;
    }
    // if (controls['shift']) {
    //     player.speed /= 2
    // }
}

const pointer = new THREE.Vector2();

document.addEventListener('pointermove', (event) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
})

function destroyBlock() {
    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(pointer, camera)
    const intersects = raycaster.intersectObjects(scene.children)

    if(intersects[0].object.name == 'floor') return
    if(intersects[0].object.getWorldPosition.x <= 0) return

    scene.remove(intersects[0].object)

}

document.addEventListener('keypress', (event) => {
    if (event.key == 1) {
        selectedHotbarSlot = 0
    }
    if (event.key == 2) {
        selectedHotbarSlot = 1
    }
    if (event.key == 3) {
        selectedHotbarSlot = 2
    }
    if(event.key == 4) {
        selectedHotbarSlot = 3
    }
    if(event.key == 5) {
        selectedHotbarSlot = 4
    }
    if(event.key == 6) {
        selectedHotbarSlot = 5
    }
    if(event.key == 7) {
        selectedHotbarSlot = 6
    }
    if(event.key == 8) {
        selectedHotbarSlot = 7
    }
    if(event.key == 9) {
        selectedHotbarSlot = 8
    }
    if(event.key == 'g') {
        CheckForCollision()
    }
})

const blockList = {}
const placedBlocks = []

class Block {
    constructor(blockName) {
        const texture = new THREE.TextureLoader().load(`./assets/textures/blocks/${blockName}.png`);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);

        this.name = blockName
        this.blockGeometry = new THREE.BoxGeometry(1, 1, 1);
        this.blockMat = new THREE.MeshPhongMaterial({
            color: "white",
            wireframe: false,
            transparent: true
        });
        this.blockMat.map = texture
        blockList[blockName] = this
    }

    place(cords) {
        let newBox = new THREE.Mesh(this.blockGeometry, this.blockMat);
        newBox.position.x = Math.round(cords.x)
        newBox.position.y = Math.round(cords.y) + 0.5
        newBox.position.z = Math.round(cords.z)
        newBox.receiveShadow = true;
        newBox.castShadow = true;
        newBox.name = this.name
        placedBlocks.push(newBox)
        scene.add(newBox);
    }
}

function initBlocks() {
    new Block('bricks')
    new Block('stone')
    new Block('planks')
    new Block('stoneBricks')
    new Block('glass')
    new Block('dirt')
}
initBlocks()

let selectedHotbarSlot = 0

function placeBlock() {
    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(pointer, camera);
    let currentBlock = ''
    switch (selectedHotbarSlot) {
        case 0:
            currentBlock = 'bricks'
            break
        case 1:
            currentBlock = 'planks'
            break
        case 2:
            currentBlock = 'stone'
            break
        case 3:
            currentBlock = 'stoneBricks'
            break
        case 4:
            currentBlock = 'glass'
            break
        case 5:
            currentBlock = 'dirt'
            break
    }

    const intersects = raycaster.intersectObjects(scene.children);
    if(!intersects[0]) return
    if(intersects[0].distance > 4.5) return
    blockList[currentBlock].place(intersects[0].point)
}

// function CheckForCollision() {
//     // const camVec = new THREE.Vector3()
//     // const raycaster = new THREE.Raycaster()

//     // camera.getWorldDirection(camVec)
//     // raycaster.set(camera.position, camVec)
//     // const intersects = raycaster.intersectObjects(scene.children)
//     // console.log(camVec)
// }

// Setup our world
// var world = new CANNON.World();
// world.gravity.set(0, 0, -9.82); // m/s²

// // Create a sphere
// var radius = 1; // m
// var sphereBody = new CANNON.Body({
//    mass: 5, // kg
//    position: new CANNON.Vec3(0, 0, 10), // m
//    shape: new CANNON.Sphere(radius)
// });
// world.addBody(sphereBody);

// // Create a plane
// var groundBody = new CANNON.Body({
//     mass: 0 // mass == 0 makes the body static
// });
// var groundShape = new CANNON.Plane();
// groundBody.addShape(groundShape);
// world.addBody(groundBody);

// var fixedTimeStep = 1.0 / 60.0; // seconds
// var maxSubSteps = 3;

// // Start the simulation loop
// var lastTime;
// (function simloop(time){
//   requestAnimationFrame(simloop);
//   if(lastTime !== undefined){
//      var dt = (time - lastTime) / 1000;
//      world.step(fixedTimeStep, dt, maxSubSteps);
//   }
//   console.log("Sphere z position: " + sphereBody.position.z);
//   lastTime = time;
// })();


document.addEventListener('mousedown', (event) => {
    if (event.buttons == '2') {
        placeBlock()
    } else if (event.buttons == '1') {
        destroyBlock()
    }
})

function ixMovementUpdate() {
    player.velocity += player.gravity;
    camera.position.y -= player.velocity;
    
    if (camera.position.y < player.height) {
        camera.position.y = player.height;
        player.jumps = false;
    }
}

window.addEventListener('resize', () => {
    let w = window.innerWidth,
        h = window.innerHeight;

    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
});

// TODO potem ładowanie modeli
// const loader = new GLTFLoader();
// let tree = {}

// loader.load('./assets/models/maple_tree.glb', function (gltf) {
//     // console.log()
//     // gltf.scene.position = 3
//     // tree = gltf.scene
//     scene.add(gltf.scene);
//     tree = gltf.scene
//     // tree.position.y = 11
//     tree.scale.x = 0.01
//     tree.scale.y = 0.01
//     tree.scale.z = 0.01
//     tree.receiveShadow = true
//     // tree.transparent = true
//     console.log(tree)
// }, undefined, function (error) {
//     console.error(error);
// });
// tree.position.y = 11
// setInterval(() => {
//     // console.log(camera.position)
// }, 500)

function animate() {
    requestAnimationFrame(animate);
    control();
    ixMovementUpdate();
    renderer.render(backgroundScene, backgroundCamera);
    renderer.render(scene, camera);
}

setInterval(animate(), 16.67)