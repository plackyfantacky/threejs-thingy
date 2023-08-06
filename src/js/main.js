import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'

import InfiniteGridHelper from './lib/THREE.InfiniteGridHelper/InfiniteGridHelper.js'

let container, camera, scene, renderer, controls, clock, mixer
let loader, dracoLoader
let emptyLight

init()

function init() {
	container = document.getElementById('threejs-thingy')
	window.addEventListener('resize', onWindowResize, false)

	scene = new THREE.Scene()
	renderer = new THREE.WebGLRenderer()
	clock = new THREE.Clock()
	camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 1000)
	controls = new OrbitControls(camera, renderer.domElement)

	dracoLoader = new DRACOLoader()
	dracoLoader.setDecoderPath(wp_vars.plugin_url + 'decoder/')
	
	loader = new GLTFLoader()
	loader.setDRACOLoader(dracoLoader)
	loader.setPath(wp_vars.plugin_url + '3d_assets/')

	loader.load('3d-text.glb', function (gltf) {
		mixer = new THREE.AnimationMixer(gltf.scene)
		mixer.clipAction(gltf.animations[0])
		initialiseScene(gltf)
		scene.add(gltf.scene)
	})

	let rect = container.getBoundingClientRect()
	camera.aspect = rect.width / rect.height
	camera.updateProjectionMatrix()
	renderer.setSize(rect.width, rect.height)

	renderer.setAnimationLoop(render)
	renderer.setPixelRatio(window.devicePixelRatio)
	renderer.physicallyCorrectLights = true
	container.appendChild(renderer.domElement)

	controls.autoRotate = true
	controls.autoRotateSpeed = - 0.75
	controls.enableDamping = true
	controls.target.set(0, 0.27, 0)
	controls.update()
}

function render() {
	if (mixer) mixer.update(clock.getDelta())
	controls.update()
	renderer.render(scene, camera)
}

function initialiseScene(gltf) {

	//let plane = new THREE.GridHelper(25, 25)
	//plane.material.color = new THREE.Color('white')
	scene.background = new THREE.Color('#ffca8a')
	//scene.add(plane)

	let grid = new InfiniteGridHelper(0.1, 1, new THREE.Color('white'), 100, 'xzy');
	scene.add(grid);

	gltf.scene.getObjectByName('nerdmesh').material = new THREE.MeshStandardMaterial({ color: 0xf99d2a })
	gltf.scene.getObjectByName('formesh').material = new THREE.MeshStandardMaterial({ color: 0xffd133 })
	gltf.scene.getObjectByName('hiremesh').material = new THREE.MeshStandardMaterial({ color: 0xe44d26 })

	scene.add(new THREE.AmbientLight(0x404040, 3))

	emptyLight = gltf.scene.getObjectByName('emptyLight')
	let directionalLight = new THREE.DirectionalLight('white', 3, 100)
	directionalLight.position.copy(emptyLight.position)
	directionalLight.castShadow = true
	scene.add(directionalLight)

	if (typeof gltf.cameras !== 'undefined' && gltf.cameras.length > 0) {
		camera.position.copy(gltf.scene.children[5].position)
		controls.update()
	}
}

function onWindowResize() {
	const planeAspectRatio = 16 / 9;
	const fov = 50;

	if (camera.aspect > planeAspectRatio) {
		// window too large
		camera.zoom = 2;
		const cameraHeight = Math.tan(THREE.MathUtils.degToRad(fov / 2));
		const ratio = camera.aspect / planeAspectRatio;
		const newCameraHeight = cameraHeight / ratio;
		camera.fov = THREE.MathUtils.radToDeg(Math.atan(newCameraHeight)) * 2;
	} else {
		// window too narrow
		camera.fov = fov;
		camera.zoom = 3;
	}
	let rect = container.getBoundingClientRect()
	camera.aspect = rect.width / rect.height
	camera.updateProjectionMatrix()
	renderer.setSize(rect.width, rect.height)
}