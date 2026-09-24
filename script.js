// ============ BASIC SETUP ============
const container = document.getElementById('game-container');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a15);
scene.fog = new THREE.Fog(0x0a0a15, 20, 80);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
container.appendChild(renderer.domElement);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(10, 20, 10);
dirLight.castShadow = true;
scene.add(dirLight);

const neonLight = new THREE.PointLight(0x4ade80, 1, 50);
neonLight.position.set(0, -2, 0);
scene.add(neonLight);

// ============ ROAD ============
const roadWidth = 10;
const roadLength = 200;

const roadGeo = new THREE.PlaneGeometry(roadWidth, roadLength);
const roadMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
const road = new THREE.Mesh(roadGeo, roadMat);
road.rotation.x = -Math.PI / 2;
road.position.z = -roadLength / 2 + 10;
road.receiveShadow = true;
scene.add(road);

function createLine(xPos) {
  const lineGeo = new THREE.PlaneGeometry(0.3, roadLength);
  const lineMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const line = new THREE.Mesh(lineGeo, lineMat);
  line.rotation.x = -Math.PI / 2;
  line.position.set(xPos, 0.01, -roadLength / 2 + 10);
  scene.add(line);
}
createLine(-roadWidth / 2 + 0.5);
createLine(roadWidth / 2 - 0.5);

const dashGroup = new THREE.Group();
for (let i = 0; i < 50; i++) {
  const dashGeo = new THREE.PlaneGeometry(0.3, 2);
  const dashMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const dash = new THREE.Mesh(dashGeo, dashMat);
  dash.rotation.x = -Math.PI / 2;
  dash.position.set(0, 0.01, -i * 5);
  dashGroup.add(dash);
}
scene.add(dashGroup);

const groundGeo = new THREE.PlaneGeometry(100, 200);
const groundMat = new THREE.MeshStandardMaterial({ color: 0x0a0a15 });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.1;
ground.position.z = -roadLength / 2 + 10;
ground.receiveShadow = true;
scene.add(ground);

// ============ CAR FACTORY ============
function createCar(color, emissiveColor) {
  const car = new THREE.Group();

  const bodyGeo = new THREE.BoxGeometry(1.8, 0.7, 3.5);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: color,
    metalness: 0.6,
    roughness: 0.3,
    emissive: emissiveColor
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = 0.6;
  body.castShadow = true;
  car.add(body);

  const cabinGeo = new THREE.BoxGeometry(1.5, 0.6, 1.6);
  const cabinMat = new THREE.MeshStandardMaterial({
    color: 0x111111,
    metalness: 0.9,
    roughness: 0.1
  });
  const cabin = new THREE.Mesh(cabinGeo, cabinMat);
  cabin.position.set(0, 1.2, -0.2);
  cabin.castShadow = true;
  car.add(cabin);

  function createWheel(x, z) {
    const wheelGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 20);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8, roughness: 0.4 });
    const wheel = new THREE.Mesh(wheelGeo, wheelMat);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(x, 0.4, z);
    wheel.castShadow = true;
    return wheel;
  }
  car.add(createWheel(-1, 1.2));
  car.add(createWheel(1, 1.2));
  car.add(createWheel(-1, -1.2));
  car.add(createWheel(1, -1.2));

  const headlightGeo = new THREE.SphereGeometry(0.15, 10, 10);
  const headlightMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 2 });
  const hL = new THREE.Mesh(headlightGeo, headlightMat);
  hL.position.set(-0.6, 0.6, 1.8);
  car.add(hL);
  const hR = new THREE.Mesh(headlightGeo, headlightMat);
  hR.position.set(0.6, 0.6, 1.8);
  car.add(hR);

  const taillightGeo = new THREE.SphereGeometry(0.15, 10, 10);
  const taillightMat = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 2 });
  const tL = new THREE.Mesh(taillightGeo, taillightMat);
  tL.position.set(-0.6, 0.6, -1.8);
  car.add(tL);
  const tR = new THREE.Mesh(taillightGeo, taillightMat);
  tR.position.set(0.6, 0.6, -1.8);
  car.add(tR);

  return car;
}

// ============ PLAYER CAR ============
const playerCar = createCar(0xef4444, 0x441111);
playerCar.position.set(0, 0, 0);
scene.add(playerCar);

const carGlow = new THREE.PointLight(0x4ade80, 2, 8);
carGlow.position.set(0, 0.2, 0);
playerCar.add(carGlow);

// ============ ENEMY CARS ============
const enemies = [];
const enemyColors = [
  [0x3b82f6, 0x112244],
  [0x22c55e, 0x114422],
  [0xeab308, 0x443311],
  [0xa855f7, 0x331144],
  [0xf97316, 0x442211]
];

function spawnEnemy() {
  const colorData = enemyColors[Math.floor(Math.random() * enemyColors.length)];
  const enemy = createCar(colorData[0], colorData[1]);
  const lane = Math.floor(Math.random() * 3) - 1; // -1, 0, 1
  enemy.position.set(lane * 3, 0, -60);
  enemy.userData = { lane: lane };
  scene.add(enemy);
  enemies.push(enemy);
}

// ============ CONTROLS ============
const keys = { left: false, right: false };
let carVelocityX = 0;
const maxSpeedX = 0.35;
const acceleration = 0.02;
const friction = 0.9;
const maxX = roadWidth / 2 - 1.2;

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = true;
  if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = true;
});
document.addEventListener('keyup', e => {
  if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = false;
  if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = false;
});

const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');

function bindTouch(btn, dir) {
  btn.addEventListener('touchstart', e => { e.preventDefault(); keys[dir] = true; });
  btn.addEventListener('touchend', e => { e.preventDefault(); keys[dir] = false; });
  btn.addEventListener('mousedown', () => keys[dir] = true);
  btn.addEventListener('mouseup', () => keys[dir] = false);
  btn.addEventListener('mouseleave', () => keys[dir] = false);
}
bindTouch(leftBtn, 'left');
bindTouch(rightBtn, 'right');

// ============ GAME STATE ============
let isRunning = false;
let roadSpeed = 0.5;
let score = 0;
let highScore = parseInt(localStorage.getItem('carGameHighScore')) || 0;
let spawnTimer = 0;
const spawnInterval = 90;

const overlay = document.getElementById('overlay');
const startBtn = document.getElementById('startBtn');
const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('highScore');

highScoreEl.textContent = highScore;

startBtn.addEventListener('click', startGame);

function startGame() {
  // রিসেট
  enemies.forEach(e => scene.remove(e));
  enemies.length = 0;
  score = 0;
  roadSpeed = 0.5;
  spawnTimer = 0;
  playerCar.position.x = 0;
  carVelocityX = 0;
  scoreEl.textContent = '0';
  overlay.classList.add('hidden');
  isRunning = true;
}

function gameOver() {
  isRunning = false;
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('carGameHighScore', highScore);
    highScoreEl.textContent = highScore;
  }
  setTimeout(() => {
    overlay.querySelector('h1').textContent = '💥 Game Over';
    overlay.querySelector('p').textContent = `তোমার স্কোর: ${score}`;
    startBtn.textContent = '🔄 Restart';
    overlay.classList.remove('hidden');
  }, 500);
}

// ============ ANIMATION LOOP ============
function animate() {
  requestAnimationFrame(animate);

  if (isRunning) {
    // প্লেয়ার মুভমেন্ট
    if (keys.left) carVelocityX -= acceleration;
    if (keys.right) carVelocityX += acceleration;
    carVelocityX *= friction;
    carVelocityX = Math.max(-maxSpeedX, Math.min(maxSpeedX, carVelocityX));
    playerCar.position.x += carVelocityX;
    playerCar.position.x = Math.max(-maxX, Math.min(maxX, playerCar.position.x));
    playerCar.rotation.z = -carVelocityX * 0.5;

    // ড্যাশ লাইন স্ক্রল
    dashGroup.children.forEach(dash => {
      dash.position.z += roadSpeed;
      if (dash.position.z > 10) dash.position.z -= 250;
    });

    // বাধা স্পন
    spawnTimer++;
    if (spawnTimer >= spawnInterval) {
      spawnTimer = 0;
      spawnEnemy();
    }

    // বাধা মুভমেন্ট
    for (let i = enemies.length - 1; i >= 0; i--) {
      const e = enemies[i];
      e.position.z += roadSpeed;

      // সংঘর্ষ চেক
      const dx = Math.abs(e.position.x - playerCar.position.x);
      const dz = Math.abs(e.position.z - playerCar.position.z);
      if (dx < 1.6 && dz < 2.8) {
        gameOver();
        return;
      }

      // স্কোর বাড়াও (যখন বাধা পেরিয়ে যায়)
      if (e.position.z > 12 && !e.userData.passed) {
        e.userData.passed = true;
        score += 10;
        scoreEl.textContent = score;
        // স্পিড বাড়াও
        roadSpeed += 0.02;
      }

      // মুছে ফেলো যদি অনেক দূরে চলে যায়
      if (e.position.z > 20) {
        scene.remove(e);
        enemies.splice(i, 1);
      }
    }

    // ক্যামেরা ফলো
    camera.position.x += (playerCar.position.x * 0.5 - camera.position.x) * 0.08;
    camera.lookAt(playerCar.position.x * 0.3, 0, 0);
  }

  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

console.log('✅ Step 3 Ready - Enemies + Score + Game Over!');