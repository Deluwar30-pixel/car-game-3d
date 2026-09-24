// ============ BASIC SETUP ============
const container = document.getElementById('game-container');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a15);
scene.fog = new THREE.Fog(0x0a0a15, 30, 100);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 300);
camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = false;
container.appendChild(renderer.domElement);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
dirLight.position.set(10, 30, 10);
dirLight.castShadow = true;
scene.add(dirLight);

// ============ ROAD ============
const roadWidth = 10;
const roadLength = 400;

const roadGeo = new THREE.PlaneGeometry(roadWidth, roadLength);
const roadMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
const road = new THREE.Mesh(roadGeo, roadMat);
road.rotation.x = -Math.PI / 2;
road.position.z = -roadLength / 2 + 20;
road.receiveShadow = true;
scene.add(road);

// রাস্তার দুই পাশের সাদা লাইন
function createLine(xPos) {
  const lineGeo = new THREE.PlaneGeometry(0.3, roadLength);
  const lineMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const line = new THREE.Mesh(lineGeo, lineMat);
  line.rotation.x = -Math.PI / 2;
  line.position.set(xPos, 0.01, -roadLength / 2 + 20);
  scene.add(line);
}
createLine(-roadWidth / 2 + 0.5);
createLine(roadWidth / 2 - 0.5);

// মাঝের ড্যাশ লাইন
const dashGroup = new THREE.Group();
for (let i = 0; i < 80; i++) {
  const dashGeo = new THREE.PlaneGeometry(0.3, 2);
  const dashMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const dash = new THREE.Mesh(dashGeo, dashMat);
  dash.rotation.x = -Math.PI / 2;
  dash.position.set(0, 0.01, -i * 5);
  dashGroup.add(dash);
}
scene.add(dashGroup);

// ============ GROUND ============
const groundGeo = new THREE.PlaneGeometry(200, 400);
const groundMat = new THREE.MeshStandardMaterial({ color: 0x0a0a15 });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.1;
ground.position.z = -roadLength / 2 + 20;
ground.receiveShadow = true;
scene.add(ground);

// ============ SIDE GRAPHICS ============

// -------- গাছ --------
function createTree(x, z) {
  const tree = new THREE.Group();

  const trunkGeo = new THREE.CylinderGeometry(0.15, 0.2, 1.5, 8);
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
  const trunk = new THREE.Mesh(trunkGeo, trunkMat);
  trunk.position.y = 0.75;
  trunk.castShadow = true;
  tree.add(trunk);

  const leafMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x0a3d1e });

  const leaf1Geo = new THREE.ConeGeometry(1, 1.5, 8);
  const leaf1 = new THREE.Mesh(leaf1Geo, leafMat);
  leaf1.position.y = 1.8;
  leaf1.castShadow = true;
  tree.add(leaf1);

  const leaf2Geo = new THREE.ConeGeometry(0.7, 1.2, 8);
  const leaf2 = new THREE.Mesh(leaf2Geo, leafMat);
  leaf2.position.y = 2.6;
  leaf2.castShadow = true;
  tree.add(leaf2);

  tree.position.set(x, 0, z);
  return tree;
}

for (let i = 0; i < 15; i++) {
  scene.add(createTree(-8 - Math.random() * 4, -i * 25 - Math.random() * 5));
  scene.add(createTree(8 + Math.random() * 4, -i * 25 - Math.random() * 5));
}

// -------- স্ট্রিট লাইট --------
function createStreetLight(x, z) {
  const light = new THREE.Group();

  const poleGeo = new THREE.CylinderGeometry(0.1, 0.1, 5, 8);
  const poleMat = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.8 });
  const pole = new THREE.Mesh(poleGeo, poleMat);
  pole.position.y = 2.5;
  pole.castShadow = true;
  light.add(pole);

  const bulbGeo = new THREE.SphereGeometry(0.3, 12, 12);
  const bulbMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    emissive: 0xfbbf24,
    emissiveIntensity: 3
  });
  const bulb = new THREE.Mesh(bulbGeo, bulbMat);
  bulb.position.y = 5;
  light.add(bulb);

  
  light.position.set(x, 0, z);
  return light;
}

for (let i = 0; i < 20; i++) {
  scene.add(createStreetLight(-6, -i * 20));
  scene.add(createStreetLight(6, -i * 20));
}

// -------- দূরের বিল্ডিং --------
function createBuilding(x, z, height) {
  const buildGeo = new THREE.BoxGeometry(2, height, 2);
  const buildMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    emissive: 0x0a0a1a
  });
  const building = new THREE.Mesh(buildGeo, buildMat);
  building.position.set(x, height / 2, z);
  building.castShadow = true;

  const windowCount = Math.floor(Math.random() * 5) + 3;
  for (let j = 0; j < windowCount; j++) {
    const winGeo = new THREE.BoxGeometry(0.3, 0.4, 0.1);
    const winMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      emissive: 0xfbbf24,
      emissiveIntensity: 1.5
    });
    const win = new THREE.Mesh(winGeo, winMat);
    win.position.set(
      (Math.random() - 0.5) * 1.5,
      (Math.random() - 0.5) * (height - 1),
      1.01
    );
    building.add(win);
  }

  return building;
}


for (let i = 0; i < 10; i++) {
  const h = 3 + Math.random() * 8;
  scene.add(createBuilding(-20 - Math.random() * 15, -i * 30 - Math.random() * 10, h));
  scene.add(createBuilding(20 + Math.random() * 15, -i * 30 - Math.random() * 10, h));
}

// -------- তারাময় আকাশ --------
for (let i = 0; i < 50; i++) {
  const starGeo = new THREE.SphereGeometry(0.08, 4, 4);
  const starMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffff,
    emissiveIntensity: 1.5
  });
  const star = new THREE.Mesh(starGeo, starMat);
  star.position.set(
    (Math.random() - 0.5) * 300,
    30 + Math.random() * 40,
    -Math.random() * 300
  );
  scene.add(star);
}

// -------- চাঁদ --------
const moonGeo = new THREE.SphereGeometry(3, 20, 20);
const moonMat = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  emissive: 0xffffff,
  emissiveIntensity: 1
});
const moon = new THREE.Mesh(moonGeo, moonMat);
moon.position.set(30, 40, -100);
scene.add(moon);

const moonLight = new THREE.PointLight(0x88aaff, 1, 150);
moonLight.position.set(30, 40, -100);
scene.add(moonLight);

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
  const headlightMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 3 });
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
  const lane = Math.floor(Math.random() * 3) - 1;
  enemy.position.set(lane * 3, 0, -80);
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
    if (keys.left) carVelocityX -= acceleration;
    if (keys.right) carVelocityX += acceleration;
    carVelocityX *= friction;
    carVelocityX = Math.max(-maxSpeedX, Math.min(maxSpeedX, carVelocityX));
    playerCar.position.x += carVelocityX;
    playerCar.position.x = Math.max(-maxX, Math.min(maxX, playerCar.position.x));
    playerCar.rotation.z = -carVelocityX * 0.5;

    dashGroup.children.forEach(dash => {
      dash.position.z += roadSpeed;
      if (dash.position.z > 20) dash.position.z -= 400;
    });

    spawnTimer++;
    if (spawnTimer >= spawnInterval) {
      spawnTimer = 0;
      spawnEnemy();
    }

    for (let i = enemies.length - 1; i >= 0; i--) {
      const e = enemies[i];
      e.position.z += roadSpeed;

      const dx = Math.abs(e.position.x - playerCar.position.x);
      const dz = Math.abs(e.position.z - playerCar.position.z);
      if (dx < 1.6 && dz < 2.8) {
        gameOver();
        return;
      }

      if (e.position.z > 15 && !e.userData.passed) {
        e.userData.passed = true;
        score += 10;
        scoreEl.textContent = score;
        roadSpeed += 0.02;
      }

      if (e.position.z > 25) {
        scene.remove(e);
        enemies.splice(i, 1);
      }
    }

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

console.log('✅ Full Game Ready - Graphics + Enemies + Score!');
