import * as THREE from 'three';

import CameraControls from 'camera-controls';
CameraControls.install( {THREE: THREE});

export const makeScene = (element, overrides = null) => {
    const scene = new THREE.Scene();

    const fov = overrides?.fov || 20;
    const aspect = overrides?.aspect || window.innerWidth / window.innerHeight;
    const near = overrides?.near || 0.1;
    const far = overrides?.far || 1000;

    const domElement = overrides?.domElement || element.querySelector('canvas'); 

    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    const controls = new CameraControls(camera, domElement);

    
    const lightPos = overrides?.lightPos || [-1, 2, 4];
    const colour = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(colour, intensity);
    light.position.set(...lightPos);
    camera.add(light);
    
    return {scene, camera, controls};

}
