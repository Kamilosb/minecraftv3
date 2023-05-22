import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

// document.body.appendChild


const scene = new THREE.Scene();

const textureBack = new THREE.TextureLoader().load("./assets/textures/sky.jpg");
scene.background = textureBack

// var texture = THREE.ImageUtils.loadTexture( '1.jpg' );
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
    height: .5,
    turnSpeed: .1,
    speed: .1,
    jumpHeight: .4,
    gravity: .01,
    velocity: 0,
    
    playerJumps: false
}

document.body.appendChild(renderer.domElement);

// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({
//     color: 0x00ff00
// });
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

const brickTexture = new THREE.TextureLoader().load("./assets/textures/bricks3.png");
brickTexture.wrapS = THREE.RepeatWrapping;
brickTexture.wrapT = THREE.RepeatWrapping;
brickTexture.repeat.set( 45, 45 );


const planksTexture = new THREE.TextureLoader().load("./assets/textures/planks.png");
planksTexture.wrapS = THREE.RepeatWrapping;
planksTexture.wrapT = THREE.RepeatWrapping;
planksTexture.repeat.set( 1, 1 );

// const fpHanlder = new FirstPersonControls(camera, renderer.domElement)
camera.position.set(0, player.height, -5);
camera.lookAt(new THREE.Vector3(0, player.height, 0));

// Object:Box1
let BoxGeometry1 = new THREE.BoxGeometry(1, 1, 1);
let BoxMaterial1 = new THREE.MeshBasicMaterial({ color: "blue", wireframe: false });
// BoxMaterial1.map = brickTexture
let Box1 = new THREE.Mesh(BoxGeometry1, BoxMaterial1);

Box1.position.y = 3;
Box1.scale.x = Box1.scale.y = Box1.scale.z = .25;
scene.add(Box1);

// Object:Box2
let BoxGeometry2 = new THREE.BoxGeometry(1, 1, 1);
let BoxMaterial2 = new THREE.MeshPhongMaterial({ color: "white", wireframe: false });
BoxMaterial2.map = planksTexture
let Box2 = new THREE.Mesh(BoxGeometry2, BoxMaterial2);

Box2.position.y = 0.5;
Box2.position.x = 0;
Box2.receiveShadow = true;
Box2.castShadow = true;

scene.add(Box2);

function setBlock(cords, type) {
    const texture_ = new THREE.TextureLoader().load(`./assets/textures/${type}.png`);
    texture_.wrapS = THREE.RepeatWrapping;
    texture_.wrapT = THREE.RepeatWrapping;
    texture_.repeat.set( 1, 1 );

    let blockGeometry = new THREE.BoxGeometry(1, 1, 1);
    let blockMat = new THREE.MeshPhongMaterial({ color: "white", wireframe: false });
    blockMat.map = texture_
    let newBox = new THREE.Mesh(blockGeometry, blockMat);
    
    newBox.position.y = cords.y + 0.5
    newBox.position.x = cords.x 
    newBox.position.z = cords.z
    newBox.receiveShadow = true;
    newBox.castShadow = true;

    scene.add(newBox);
}

let PlaneGeometry1 = new THREE.PlaneGeometry(10, 10);
let PlaneMaterial1 = new THREE.MeshPhongMaterial({ color: "white", wireframe: false });
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

let light2 = new THREE.AmbientLightProbe( 'white', 0.5 );
scene.add(light2);

// let light2 = new THREE.PointLight("white", 0.9);
// light2.position.set(0, 25, 0);
// light2.castShadow = true;
// light2.shadow.camera.near = 2.5;
// scene.add(light2);

//controls
let controls = {};
document.addEventListener('keydown', ({ key }) => { controls[key] = true });
document.addEventListener('keyup', ({ key }) => { controls[key] = false });

// document.addEventListener('mousemove', (event) => {
//     console.log(event)
// })

const mouseControls = new PointerLockControls( camera, document.body );
document.addEventListener('mousedown', (event) => {
    mouseControls.lock()
})

const cameraVec = new THREE.Vector3()
function control() {

    camera.getWorldDirection(cameraVec)

    // Controls:Engine 
    if(controls['w']){ // w
    camera.position.addScaledVector(cameraVec, player.speed)   
    //   camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
    //   camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
    }
    if(controls['s']){ // s
    camera.position.addScaledVector(cameraVec, -player.speed)  
    //   camera.position.x += Math.sin(camera.rotation.y) * player.speed;
    //   camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
    }
    if(controls['a']){ // a
        camera.translateX(-player.speed)
    //   camera.position.x += Math.sin(camera.rotation.y + Math.PI / 2) * player.speed;
    //   camera.position.z += -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed;
    }
    if(controls['d']){ // d
        camera.translateX(player.speed)
    //   camera.position.x += Math.sin(camera.rotation.y - Math.PI / 2) * player.speed;
    //   camera.position.z += -Math.cos(camera.rotation.y - Math.PI / 2) * player.speed;
    }
    // if(controls[37]){ // la
    //   camera.rotation.y -= player.turnSpeed;
    // }
    // if(controls[39]){ // ra
    //   camera.rotation.y += player.turnSpeed;
    // }
    if(controls[' ']) { // space
      if(player.jumps) return false;
      player.jumps = true;
      player.velocity = -player.jumpHeight;
    }
}

const pointer = new THREE.Vector2();
document.addEventListener('pointermove', (event) => {
	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
})





function destroyBlock() {
    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera( pointer, camera );

    const intersects = raycaster.intersectObjects( scene.children );
    scene.remove(intersects[0].object)
    // for ( let i = 0; i < intersects.length; i ++ ) {
    //     // if(intersects[i].object.type)
    //     // console.log(intersects[i].object.)
    //     scene.remove(intersects[i].object)
	// }
}

document.addEventListener('keypress', (event) => {
    if(event.key == 1) {
        currentBlockType = 0
    }
    if(event.key == 2) {
        currentBlockType = 1
    }
    if(event.key == 3) {
        currentBlockType = 2
    }
})

let currentBlockType = 0
function placeBlock() {
    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera( pointer, camera );
    let currentBlock = '' 
    switch(currentBlockType) {
        case 0:
            currentBlock = 'bricks'
            break
        case 1:
            currentBlock = 'planks'
            break
        case 2:
            currentBlock = 'stone'
            break
    }

    const intersects = raycaster.intersectObjects( scene.children );
    for ( let i = 0; i < intersects.length; i ++ ) {
        // console.log(intersects[i].point)
        setBlock(intersects[i].point, currentBlock)
		// intersects[ i ].object.material.color.set( 0xff0000 );
	} 
}

document.addEventListener('mousedown', (event) => {
    console.log(event)
    if(event.buttons == '1') {
        placeBlock()
    } else if(event.buttons == '2') {
        destroyBlock()
    }
})

function ixMovementUpdate() {
    player.velocity += player.gravity;
    camera.position.y -= player.velocity;

    if(camera.position.y < player.height) {
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

// TODO potem
// const loader = new GLTFLoader();

// loader.load('./assets/scene.gltf', function (gltf) {
//     scene.add(gltf.scene);
// }, undefined, function (error) {
//     console.error(error);
// });

function animate() {
    requestAnimationFrame(animate);
    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;
    control();
    ixMovementUpdate();
    renderer.render(backgroundScene , backgroundCamera );
    renderer.render(scene, camera);
}
animate();