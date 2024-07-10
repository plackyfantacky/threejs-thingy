import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'

import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';

import InfiniteGridHelper from '@plackyfantacky/three.infinitegridhelper';

let container, camera, scene, renderer, orbiter, mixer
let cameraDolly, cameraTarget
let clock = new THREE.Clock()


container = document.getElementById('threejs-thingy')
if(container) {
    init().catch(error => console.error(error))
}

function loadModel(url) {
    const loader = new GLTFLoader()
    const dracoLoader = new DRACOLoader()
	dracoLoader.setDecoderPath(wp_vars.plugin_url + 'decoder/')
	loader.setDRACOLoader(dracoLoader)
    return loader.loadAsync(url)
}

async function init() {
	
    scene = new THREE.Scene()
    renderer = new THREE.WebGLRenderer({antialias: true})

    let gltfData = await loadModel(wp_vars.plugin_url + '3d_assets/scene-main.glb')

    if(gltfData) {
        scene.add(gltfData.scene)
        
        cameraDolly = gltfData.scene.getObjectByName('cameraDolly')
        cameraTarget = gltfData.scene.getObjectByName('cameraTarget')
        pixelType = gltfData.scene.getObjectByName('pixeltype')

        camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 1000)
        camera.zoom = 0.75

        //adding this made me go 'WOW' when I saw the lighting
        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        scene.environment = pmremGenerator.fromScene(new RoomEnvironment(renderer), 0.04).texture;

        //renderer settings
        renderer.setAnimationLoop(render)
	    renderer.setPixelRatio(window.devicePixelRatio)
	    container.appendChild(renderer.domElement)

        //add some orbit controls to the camera
        orbiter = new OrbitControls(camera, renderer.domElement)
        orbiter.enableDamping = true
    
        //update the camera with the initial position of the cameraDolly
        camera.position.copy(cameraDolly.position)
        //camera.lookAt(cameraTarget.position)
        orbiter.target = cameraTarget.position
        orbiter.update()

        // emptyTarget = new TransformControls(camera, renderer.domElement);
        // emptyTarget.addEventListener('change', render);
        // emptyTarget.addEventListener('dragging-changed', function (event) {
        //     orbiter.enabled = ! event.value;
        // });
        // scene.add(emptyTarget);
        // emptyTarget.attach(cameraTarget);
        // orbiter.update()


        // emptyDolly = new TransformControls(camera, renderer.domElement);
        // emptyDolly.addEventListener('change',  render);
        // emptyDolly.addEventListener('dragging-changed', function (event) {
        //     orbiter.enabled = ! event.value;
        // });
        // scene.add(emptyDolly);
        // emptyDolly.attach(cameraDolly);
        // orbiter.update()

        //initialise the background
        scene.background = new THREE.Color('#ffca8a')
        let grid = new InfiniteGridHelper(0.1, 1, new THREE.Color('white'), 100, 'xzy');
        scene.add(grid);
    
        //add some lighting
        let directionalLight = new THREE.DirectionalLight('white', 3, 100)
        directionalLight.castShadow = true
        scene.add(new THREE.AmbientLight(0x404040, 12))
        scene.add(directionalLight)

        mixer = new THREE.AnimationMixer(gltfData.scene)
	
        //this plays the animation for the cameraTarget
        mixer.clipAction(gltfData.animations[0]).play()

        //this plays the animation for the cameraDolly following the path
        mixer.clipAction(gltfData.animations[1]).play()

        //console.log('gltfData', gltfData)
    }
}

function render() {
    if(resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement
        camera.aspect = canvas.clientWidth / canvas.clientHeight
        camera.updateProjectionMatrix()
    }
    if (mixer) mixer.update(clock.getDelta())
    camera.position.copy(cameraDolly.position)
	orbiter.update()
	renderer.render(scene, camera)
}

function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement
    const pixelRatio = window.devicePixelRatio
    const width = Math.floor(canvas.clientWidth * pixelRatio)
    const height = Math.floor(canvas.clientHeight * pixelRatio)
    const needResize = canvas.width !== width || canvas.height !== height
    if (needResize) {
        renderer.setSize(width, height, false)
    }
    return needResize
}