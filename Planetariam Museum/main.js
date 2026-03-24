// main.js
// Virtual Planetarium Museum - Basic Scene & Controls

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.155.0/build/three.module.js';
import { PointerLockControls } from 'https://cdn.jsdelivr.net/npm/three@0.155.0/examples/jsm/controls/PointerLockControls.js';

// Ensure DOM is ready before running Three.js code
window.addEventListener('DOMContentLoaded', () => {
  // Scene setup
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x222244);

  // Camera setup
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.set(0, 2, 10);

  // Renderer setup
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Dome (planetarium)
  const domeGeometry = new THREE.SphereGeometry(10, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
  const domeMaterial = new THREE.MeshPhongMaterial({ color: 0x8888aa, side: THREE.DoubleSide });
  const dome = new THREE.Mesh(domeGeometry, domeMaterial);
  dome.position.set(0, 10, 0);
  scene.add(dome);

  // Floor
  const floorGeometry = new THREE.CircleGeometry(10, 32);
  const floorMaterial = new THREE.MeshPhongMaterial({ color: 0x444444 });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0;
  scene.add(floor);

  // Entrance wall
  const wallGeometry = new THREE.BoxGeometry(2, 4, 0.2);
  const wallMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc });
  const wall = new THREE.Mesh(wallGeometry, wallMaterial);
  wall.position.set(0, 2, 10);
  scene.add(wall);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(0, 15, 0);
  scene.add(pointLight);

  // PointerLockControls for movement
  const controls = new PointerLockControls(camera, document.body);
  document.body.addEventListener('click', () => {
    controls.lock();
  });

  // Movement variables
  const move = { forward: false, backward: false, left: false, right: false };
  const velocity = new THREE.Vector3();
  const speed = 0.1;

  // Keyboard controls
  window.addEventListener('keydown', (e) => {
    if (e.code === 'KeyW') move.forward = true;
    if (e.code === 'KeyS') move.backward = true;
    if (e.code === 'KeyA') move.left = true;
    if (e.code === 'KeyD') move.right = true;
  });
  window.addEventListener('keyup', (e) => {
    if (e.code === 'KeyW') move.forward = false;
    if (e.code === 'KeyS') move.backward = false;
    if (e.code === 'KeyA') move.left = false;
    if (e.code === 'KeyD') move.right = false;
  });

  // Placeholder info point
  const infoGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  const infoMaterial = new THREE.MeshPhongMaterial({ color: 0xffd700 });
  const infoPoint = new THREE.Mesh(infoGeometry, infoMaterial);
  infoPoint.position.set(2, 0.25, 5);
  scene.add(infoPoint);

  // Simple interaction (hover)
  const raycaster = new THREE.Raycaster();
  let infoShown = false;

  function showInfo() {
    if (!infoShown) {
      document.getElementById('info').innerHTML = 'You found an info point!';
      infoShown = true;
      setTimeout(() => {
        document.getElementById('info').innerHTML = 'Use WASD to move, mouse to look around';
        infoShown = false;
      }, 2000);
    }
  }

  // Check for info point proximity
  function checkInfoPoint() {
    raycaster.setFromCamera({ x: 0, y: 0 }, camera);
    const intersects = raycaster.intersectObject(infoPoint);
    if (intersects.length > 0 && intersects[0].distance < 2) {
      showInfo();
    }
  }

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);

    // Movement logic
    velocity.set(0, 0, 0);
    if (move.forward) velocity.z -= speed;
    if (move.backward) velocity.z += speed;
    if (move.left) velocity.x -= speed;
    if (move.right) velocity.x += speed;
    controls.moveRight(velocity.x);
    controls.moveForward(velocity.z);

    renderer.render(scene, camera);
    checkInfoPoint();
  }
  animate();

  // Responsive resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
});

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222244);

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 10);

// Renderer setup
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Dome (planetarium)
const domeGeometry = new THREE.SphereGeometry(10, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
const domeMaterial = new THREE.MeshPhongMaterial({ color: 0x8888aa, side: THREE.DoubleSide });
const dome = new THREE.Mesh(domeGeometry, domeMaterial);
dome.position.set(0, 10, 0);
scene.add(dome);

// Floor
const floorGeometry = new THREE.CircleGeometry(10, 32);
const floorMaterial = new THREE.MeshPhongMaterial({ color: 0x444444 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = 0;
scene.add(floor);

// Entrance wall
const wallGeometry = new THREE.BoxGeometry(2, 4, 0.2);
const wallMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc });
const wall = new THREE.Mesh(wallGeometry, wallMaterial);
wall.position.set(0, 2, 10);
scene.add(wall);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(0, 15, 0);
scene.add(pointLight);

// PointerLockControls for movement
const controls = new PointerLockControls(camera, document.body);
document.body.addEventListener('click', () => {
  controls.lock();
});

// Movement variables
const move = { forward: false, backward: false, left: false, right: false };
const velocity = new THREE.Vector3();
const speed = 0.1;

// Keyboard controls
window.addEventListener('keydown', (e) => {
  if (e.code === 'KeyW') move.forward = true;
  if (e.code === 'KeyS') move.backward = true;
  if (e.code === 'KeyA') move.left = true;
  if (e.code === 'KeyD') move.right = true;
});
window.addEventListener('keyup', (e) => {
  if (e.code === 'KeyW') move.forward = false;
  if (e.code === 'KeyS') move.backward = false;
  if (e.code === 'KeyA') move.left = false;
  if (e.code === 'KeyD') move.right = false;
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Movement logic
  velocity.set(0, 0, 0);
  if (move.forward) velocity.z -= speed;
  if (move.backward) velocity.z += speed;
  if (move.left) velocity.x -= speed;
  if (move.right) velocity.x += speed;
  controls.moveRight(velocity.x);
  controls.moveForward(velocity.z);

  renderer.render(scene, camera);
}
animate();

// Responsive resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Placeholder info point
const infoGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const infoMaterial = new THREE.MeshPhongMaterial({ color: 0xffd700 });
const infoPoint = new THREE.Mesh(infoGeometry, infoMaterial);
infoPoint.position.set(2, 0.25, 5);
scene.add(infoPoint);

// Simple interaction (hover)
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let infoShown = false;

function showInfo() {
  if (!infoShown) {
    document.getElementById('info').innerHTML = 'You found an info point!';
    infoShown = true;
    setTimeout(() => {
      document.getElementById('info').innerHTML = 'Use WASD to move, mouse to look around';
      infoShown = false;
    }, 2000);
  }
}

// Check for info point proximity
function checkInfoPoint() {
  raycaster.setFromCamera({ x: 0, y: 0 }, camera);
  const intersects = raycaster.intersectObject(infoPoint);
  if (intersects.length > 0 && intersects[0].distance < 2) {
    showInfo();
  }
}

// Add to animation loop
const oldAnimate = animate;
function animateWithInfo() {
  oldAnimate();
  checkInfoPoint();
}
animate = animateWithInfo;

// Start animation
animate();
