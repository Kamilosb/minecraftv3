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
    jumpHeight: .15,
    gravity: .005,
    velocity: 0,

    playerJumps: false
}

document.body.appendChild(renderer.domElement);

const brickTexture = new THREE.TextureLoader().load("./assets/textures/bricks3.png");
brickTexture.wrapS = THREE.RepeatWrapping;
brickTexture.wrapT = THREE.RepeatWrapping;
brickTexture.repeat.set(45, 45);

const planksTexture = new THREE.TextureLoader().load("./assets/textures/planks.png");
planksTexture.wrapS = THREE.RepeatWrapping;
planksTexture.wrapT = THREE.RepeatWrapping;
planksTexture.repeat.set(1, 1);

// const fpHanlder = new FirstPersonControls(camera, renderer.domElement)
camera.position.set(0, player.height, -5);
camera.lookAt(new THREE.Vector3(0, player.height, 0));

// Object:Box1
let BoxGeometry1 = new THREE.BoxGeometry(1, 1, 1);
let BoxMaterial1 = new THREE.MeshBasicMaterial({
    color: "blue",
    wireframe: false
});
// BoxMaterial1.map = brickTexture
let Box1 = new THREE.Mesh(BoxGeometry1, BoxMaterial1);

Box1.position.y = 3;
Box1.scale.x = Box1.scale.y = Box1.scale.z = .25;
scene.add(Box1);

// Object:Box2
let BoxGeometry2 = new THREE.BoxGeometry(1, 1, 1);
let BoxMaterial2 = new THREE.MeshPhongMaterial({
    color: "white",
    wireframe: false
});
BoxMaterial2.map = planksTexture
let Box2 = new THREE.Mesh(BoxGeometry2, BoxMaterial2);

Box2.position.y = 0.5;
Box2.position.x = 0;
Box2.receiveShadow = true;
Box2.castShadow = true;

scene.add(Box2);

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
    controls[key] = true
});
document.addEventListener('keyup', ({
    key
}) => {
    controls[key] = false
});

const mouseControls = new PointerLockControls(camera, document.body);
document.addEventListener('mousedown', (event) => {
    mouseControls.lock()
})

const cameraVec = new THREE.Vector3()

function control() {
    camera.getWorldDirection(cameraVec)
    
    // cameraVec.x = 0
    // console.log(cameraVec)
    
    if (controls['w']) {
        camera.position.addScaledVector(cameraVec, player.speed)
    }
    if (controls['s']) {
        camera.position.addScaledVector(cameraVec, -player.speed)
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
}

const pointer = new THREE.Vector2();
// pointer.x = window.innerWidth / 2 
// pointer.y = window.innerHeight / 2 

document.addEventListener('pointermove', (event) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
})

function destroyBlock() {
    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(pointer, camera)
    const intersects = raycaster.intersectObjects(scene.children)
    if(intersects[0].object.getWorldPosition.x <= 0) {
        return
    } else {
        scene.remove(intersects[0].object)
    }
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
    if(event.key == 95) {
        selectedHotbarSlot = 8
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
        // console.log(newBox.position)
        newBox.receiveShadow = true;
        newBox.castShadow = true;
        placedBlocks.push(newBox)
        console.log(newBox)
        scene.add(newBox);
    }
}

function initBlocks() {
    new Block('bricks')
    new Block('stone')
    new Block('planks')
    new Block('stoneBricks')
    new Block('glass')
}

initBlocks()

let selectedHotbarSlot = 0

// function setBlock(cords, type) {
//     const texture_ = new THREE.TextureLoader().load(`./assets/textures/${type}.png`);
//     texture_.wrapS = THREE.RepeatWrapping;
//     texture_.wrapT = THREE.RepeatWrapping;
//     texture_.repeat.set(1, 1);

//     let blockGeometry = new THREE.BoxGeometry(1, 1, 1);
//     let blockMat = new THREE.MeshPhongMaterial({
//         color: "white",
//         wireframe: false
//     });
//     blockMat.map = texture_
//     let newBox = new THREE.Mesh(blockGeometry, blockMat);

//     newBox.position.y = Number((cords.y).toFixed(0)) + 0.5;
//     newBox.position.x = Number((cords.x).toFixed(0));
//     newBox.position.z = Number((cords.z).toFixed(0));
//     newBox.receiveShadow = true;
//     newBox.castShadow = true;

//     scene.add(newBox);
// }



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
    }

    const intersects = raycaster.intersectObjects(scene.children);
    if(intersects[0].distance > 4.5) return
    blockList[currentBlock].place(intersects[0].point)

}

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

// loader.load('./assets/scene.gltf', function (gltf) {
//     scene.add(gltf.scene);
// }, undefined, function (error) {
//     console.error(error);
// });

function animate() {
    requestAnimationFrame(animate);
    control();
    ixMovementUpdate();
    renderer.render(backgroundScene, backgroundCamera);
    renderer.render(scene, camera);
}
// animate();

setInterval(animate(), 16.67)