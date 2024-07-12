import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

import Stats from 'three/addons/libs/stats.module.js';

import InfiniteGridHelper from '@plackyfantacky/three.infinitegridhelper';

import CameraControls from 'camera-controls';
CameraControls.install( {THREE: THREE});


let container, canvas, labels, camera, scene, mixer;
let labelRenderer, renderer;
let cameraDolly, cameraTarget;
let clock = new THREE.Clock();

let shiftKeyState = false;


container = document.getElementById('threejs-thingy');
if(container) {
    canvas = document.getElementById('thingy-canvas');
    labels = container.querySelector('.thingy-labels');
    init().catch(error => console.error(error));
}

async function init() {
	
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({antialias: true, canvas});
    labelRenderer = new CSS2DRenderer();

    let gltfData = await loadModel(wp_vars.plugin_url + '3d_assets/scene-main.glb');

    if(gltfData) {
        
        scene.add(gltfData.scene);
        
        cameraDolly = gltfData.scene.getObjectByName('cameraDolly');
        cameraTarget = gltfData.scene.getObjectByName('cameraTarget');
        pixelType = gltfData.scene.getObjectByName('pixeltype');

        cameraTarget.layers.set(2);
        cameraDolly.layers.set(2);
        pixelType.layers.set(2);

        // const stats = new Stats();
		// container.querySelector('.thingy-stats').appendChild(stats.dom);

        camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 1000);
        //camera.zoom = 0.75;
    
        const cameraControls = new CameraControls(camera, labelRenderer.domElement);
        cameraControls.setLookAt(
            cameraDolly.position.x,
            cameraDolly.position.y,
            cameraDolly.position.z,
            cameraTarget.position.x,
            cameraTarget.position.y,
            cameraTarget.position.z,
            true
        );
        cameraControls.dollyTo(7, true);
        cameraControls.setFocalOffset(-2, 0, 0); //this works when the scene is static

        // let newEmpty3 = new THREE.Object3D();
        // newEmpty3.position.set(cameraDolly.position.z, cameraDolly.position.y, cameraDolly.position.x * -1);
        // scene.add(newEmpty3);

        //adding this made me go 'WOW' when I saw the lighting
        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        scene.environment = pmremGenerator.fromScene(new RoomEnvironment(renderer), 0.04).texture;

        //renderer settings
	    renderer.setPixelRatio(window.devicePixelRatio);
	    container.appendChild(renderer.domElement);

        //addTransformControls(cameraTarget, "cameraTargetTransformer");
        makePositionLabel(cameraTarget);
        
        const axesHelper = new THREE.AxesHelper(5);
        scene.add(axesHelper);
        axesHelper.layers.set(1);

        //addTransformControls(cameraDolly, "cameraDollyTransformer");
        makePositionLabel(cameraDolly);
        

        // emptyEmpty3 = new TransformControls(camera, renderer.domElement);
        // emptyEmpty3.addEventListener('change',  render);
        // emptyEmpty3.addEventListener('dragging-changed', function (event) { cameraControls.enabled = ! event.value; });
        // scene.add(emptyEmpty3);
        // emptyEmpty3.attach(newEmpty3);
        //let camera

        //initialise the background
        scene.background = new THREE.Color('#ffca8a');
        let grid = new InfiniteGridHelper(0.1, 1, new THREE.Color('white'), 100, 'xzy');
        scene.add(grid);
    
        //add some lighting
        let directionalLight = new THREE.DirectionalLight('white', 3, 100);
        directionalLight.castShadow = true;
        scene.add(directionalLight);
        directionalLight.layers.set(2);

        let ambientLight = new THREE.AmbientLight(0x404040, 12);
        scene.add(ambientLight);
        ambientLight.layers.set(2);

        mixer = new THREE.AnimationMixer(gltfData.scene)
	
        //this plays the animation for the cameraTarget
        //mixer.clipAction(gltfData.animations[0]).play()
        //mixer.clipAction(gltfData.animations[1]).play()
        
        renderer.setAnimationLoop(animate);

        globalThis.cameraControls = cameraControls;

        render();

        globalThis.scene = scene;
    }
}

function loadModel(url) {
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
	dracoLoader.setDecoderPath(wp_vars.plugin_url + 'decoder/');
	loader.setDRACOLoader(dracoLoader);
    return loader.loadAsync(url);
}

function render() {
    if(resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement
        camera.aspect = canvas.clientWidth / canvas.clientHeight
        camera.updateProjectionMatrix()
    }
    renderer.render(scene, camera)
    labelRenderer.render(scene, camera)
}

function animate() {
    const delta = clock.getDelta();
    const updated = cameraControls.update(delta);
    mixer.update(delta);

    //requestAnimationFrame(animate)

    render();
}

function animateCamera() {
    const delta = clock.getDelta();
    mixer.update(delta);
    render();
}

function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement
    const pixelRatio = window.devicePixelRatio
    const width = Math.floor(canvas.clientWidth * pixelRatio)
    const height = Math.floor(canvas.clientHeight * pixelRatio)
    const needResize = canvas.width !== width || canvas.height !== height
    if (needResize) {
        renderer.setSize(width, height, false)
        labelRenderer.setSize(width, height)
        labelRenderer.domElement.style.position = 'absolute';
        labelRenderer.domElement.style.top = '0px';
        container.appendChild(labelRenderer.domElement);
    }
    return needResize
}

function makePositionLabel(obj) {
    const tempDiv = document.getElementById('thingy-label-template').cloneNode(true);
    let newDiv = tempDiv.content.firstElementChild;
    
    newDiv.querySelector('.x').textContent = obj.position.x;
    newDiv.querySelector('.y').textContent = obj.position.y;
    newDiv.querySelector('.z').textContent = obj.position.z;
    //labels.appendChild(newDiv);

    const newLabel = new CSS2DObject(newDiv);
    //newLabel.position.set(obj.position.z, obj.position.y, obj.position.x * -1);
    newLabel.position.set(0, 0.2, 0);
    newLabel.center.set(0, 1);
    newLabel.layers.set(1);
    obj.add(newLabel);
}

function addTransformControls(obj, name = "transformControls") {
    let transformControls = new TransformControls(camera, renderer.domElement);
    transformControls.addEventListener('change', render);
    transformControls.attach(obj);
    transformControls.name = name;
    transformControls.layers.set(1);
    scene.add(transformControls);
}

window.addEventListener('resize', render);

document.addEventListener( 'keydown', ( event ) => {
    if(event.key === 'Shift') {
        shiftKeyState = true;
        updateConfig();
        console.log(globalThis.scene.children)
    }
});

document.addEventListener( 'keyup', ( event ) => {
    if(event.key === 'Shift') {
        shiftKeyState = false;
        updateConfig();
    }
});

const updateConfig = () => {
    if(shiftKeyState) {
        cameraControls.mouseButtons.left = CameraControls.ACTION.DOLLY;
    } else {
        cameraControls.mouseButtons.left = CameraControls.ACTION.ROTATE;
    }
}

const thingyControls = document.getElementById('thingy-overlays');
if(thingyControls) {
    thingyControls.addEventListener('click', (event) => {
        camera.layers.toggle(1);
    });
}