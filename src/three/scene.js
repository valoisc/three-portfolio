import * as THREE from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

// ===============================
// Loader helpers
// ===============================
let ICON_FONT = null;
let firstRender = false;

function hideLoader() {
  const loadingScreen = document.getElementById('loading-screen');
  if (!loadingScreen) return;

  loadingScreen.classList.add('fade-out');
  setTimeout(() => {
    // remove s� se ainda existir
    loadingScreen?.remove?.();
  }, 600);
}

// ===============================
// Vari�veis globais (drag threshold)
// ===============================
let pointerDownPos = { x: 0, y: 0 };
let didDrag = false;
const DRAG_THRESHOLD_PX = 6;

// ===============================
// Scene, camera, light, constants
// ===============================
let width = window.innerWidth;
let height = window.innerHeight;
var mouse = new THREE.Vector2();
var test = new THREE.Vector2(0, 0);
var raycaster = new THREE.Raycaster();

const scene = new THREE.Scene();
var clock = new THREE.Clock();

var aspect = width / height;
var d = 20;
const camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 2000);

// ===============================
// Renderer
// ===============================
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setClearColor(0x000000, 0);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(width, height);
renderer.domElement.id = 'render';
document.body.appendChild(renderer.domElement);

// ===============================
// Anima��o digitando
// ===============================
const microcopy = document.getElementById("microcopy");

function setPageOpen(isOpen) {
  document.documentElement.classList.toggle("page-open", isOpen);
  if (microcopy) microcopy.style.opacity = isOpen ? "0" : "1";
}

// ===============================
// Light
// ===============================
const alight = new THREE.AmbientLight(0xffffff);
scene.add(alight);

var light = new THREE.PointLight(0xffffff, 1);
light.position.set(-30, 10, 35);
scene.add(light);

// ===============================
// Texts (load font ONCE, create all icons)
// ===============================
const loadingManager = new THREE.LoadingManager(() => {
  // quando TODOS assets gerenciados por ele terminarem
  hideLoader();
});

const fontLoader = new FontLoader(loadingManager);

// usa BASE_URL do Vite (evita quebrar se estiver em subpasta)
const FONT_URL = `${import.meta.env.BASE_URL}font/font_icon.json`;

function addIcon(char, x, y, z, rot = {}) {
  if (!ICON_FONT) return;

  const textGeo = new TextGeometry(char, {
    font: ICON_FONT,
    size: 4,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: false
  });

  textGeo.computeBoundingBox();

  const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const mesh = new THREE.Mesh(textGeo, textMaterial);

  mesh.position.z = z;
  mesh.position.x = x;
  mesh.position.y = y;

  if (rot.x) mesh.rotateX(rot.x);
  if (rot.y) mesh.rotateY(rot.y);
  if (rot.z) mesh.rotateZ(rot.z);

  mesh.castShadow = true;
  mesh.receiveShadow = true;

  scene.add(mesh);
}

function createIcons() {
  // Mesmas posições/rotações do seu código original
  addIcon('\uf1fc',  1.8,  5.0,  3.2, { x: -Math.PI / 2, z:  Math.PI / 2 });
  addIcon('\uf06e',   2.0, -5.5,  3.2, { x: -Math.PI / 2, z:  Math.PI / 2 });
  addIcon('\uf0c6',  -5.0, -2.8,  2.0, { y: -Math.PI / 2, z:  Math.PI / 2 });
  addIcon('\uf095',   5.5, -2.8,  2.0, { y: -Math.PI / 2, z:  Math.PI / 2 });
  addIcon('\uf007',  -2.5, -2.4,  5.0);
  addIcon('\uf57d',  -2.8, -2.2, -5.5);
}

// carrega a fonte UMA vez e cria tudo
fontLoader.load(
  FONT_URL,
  (font) => {
    ICON_FONT = font;
    createIcons();
  },
  undefined,
  (err) => {
    console.error('Erro ao carregar font_icon.json', err);
    // n�o deixa travar loader em produ��o
    hideLoader();
  }
);

// ===============================
// Cube 
// ===============================
var material = new THREE.ShaderMaterial({
  uniforms: {
    u_time: { type: "f", value: 1.0 },
    u_resolution: { value: new THREE.Vector2(width, height) },
  },
  vertexShader: `
    attribute float size;
    varying vec3 vPosition;
    varying vec3 vNormal;
    void main() {
        vPosition = position.xyz;
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        gl_Position = projectionMatrix * mvPosition;
        vNormal = normal;
    }`,
  fragmentShader: `
    uniform vec2 u_resolution;
    uniform float u_time;
    varying vec3 vPosition;
    varying vec3 vNormal;
    vec3 pal( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d ) {
        return a + b*cos(63.88318*(c*t+d) );
    }
    vec3 spectrum(float n) {
        return pal(n, vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.,1.0,1.0),vec3(.0,0.33,0.67) );
    }
    void main() {
        gl_FragColor = vec4(spectrum(abs(vNormal.x/.659+vNormal.y/.66+vNormal.z/.6606)), 1.);
    }`
});

var geometry = new THREE.BoxGeometry(10, 10, 10);
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);


// ===============================
// Events (mantido)
// ===============================
var intersects, info, title, close, sobre, contato, portfolio, footer;
info = document.getElementById("hinfo");
title = document.getElementById("ptitle");
sobre = document.getElementById("sobre");
contato = document.getElementById("contato");
portfolio = document.getElementById("portfolio");
footer = document.getElementById("footer");
var pageMode = false;

function onWindowResize() {
  if (!pageMode) {
    width = window.innerWidth
    height = window.innerHeight
    var aspect = width / height;
    camera.left = -d * aspect;
    camera.right = d * aspect;
    camera.top = d;
    camera.bottom = -d;

    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
}

function onHover(event) {
  event.preventDefault();
  if (pageMode) {
    mouse.x = -((((window.innerWidth - event.clientX) / width) * 2 - 1));
    mouse.y = -(-((window.innerHeight - event.clientY) / height) * 2 + 1);
  }
  else {
    mouse.x = (event.clientX / width) * 2 - 1;
    mouse.y = - (event.clientY / height) * 2 + 1;
  }
}

function closePage() {
  width = window.innerWidth;
  height = window.innerHeight;
  var aspect = width / height;
  camera.left = -d * aspect;
  camera.right = d * aspect;
  camera.top = d;
  camera.bottom = -d;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);

  title.textContent = "valois"
  pageMode = false;
  setPageOpen(false);
  controls.autoRotate = true;
  controls.enabled = true;
  footer.style.opacity = 1.;
  sobre.style.display = 'none';
  contato.style.display = 'none';
  portfolio.style.display = 'none';
}

// ===============================
// Dark mode (HTML + Three)
// ===============================
const DARK_CLASS = 'theme-dark';

function applyDarkMode(isDark) {
  document.documentElement.classList.toggle(DARK_CLASS, isDark);
  localStorage.setItem('theme', isDark ? 'dark' : 'light');

  alight.intensity = isDark ? 0.6 : 1.0;
  light.intensity = isDark ? 0.9 : 1.0;

  light.position.set(
    isDark ? -15 : -30,
    isDark ? 25 : 10,
    isDark ? 30 : 35
  );
}

function toggleDarkMode() {
  const isDark = document.documentElement.classList.contains(DARK_CLASS);
  applyDarkMode(!isDark);
}

(function initTheme() {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') applyDarkMode(true);
})();

// ===============================
// Bot�es de voltar (HTML UI)
// ===============================
document.querySelectorAll('.js-back').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    closePage();
  });
});

function onClick(event) {
  if (pageMode) return;
  const size = Math.min(window.innerWidth, window.innerHeight);
  raycaster.setFromCamera(mouse, camera);
  intersects = raycaster.intersectObject(cube);

  if (intersects.length > 0) {
    let o = intersects[0].faceIndex;
    if (o == 2 || o == 3) {
      if (!pageMode) {
        footer.style.opacity = 1.;
      }
      const win = window.open("/misc/curriculum.pdf", '_blank');
      win?.focus();
      return;
    }
    if (o == 10 || o == 11) {
      if (!pageMode) {
        footer.style.opacity = 1.;
      }
      return;
    }
    if (o == 6 || o == 7) {
      if (!pageMode) {
        toggleDarkMode();
      }
      return;
    }

    sobre.style.display = 'none';
    contato.style.display = 'none';
    portfolio.style.display = 'none';
    info.style.opacity = 0.;
    info.textContent = "";
    footer.style.opacity = 0.;

    if (o == 4 || o == 5) {
      pageMode = true;
      width = size;
      height = size;
      var aspect = width / height;
      camera.left = -d * aspect;
      camera.right = d * aspect;
      camera.top = d;
      camera.bottom = -d;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      controls.autoRotate = false;
      controls.enabled = false;
      title.textContent = ""
      setPageOpen(true);
      portfolio.style.display = "block";
    }
    if (o == 9 || o == 8) {
      pageMode = true;
      width = size;
      height = size;
      var aspect = width / height;
      camera.left = -d * aspect;
      camera.right = d * aspect;
      camera.top = d;
      camera.bottom = -d;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      controls.autoRotate = false;
      controls.enabled = false;
      title.textContent = ""
      setPageOpen(true);
      sobre.style.display = "block";
    }
    if (o == 1 || o == 0) {
      pageMode = true;
      width = size;
      height = size;
      var aspect = width / height;
      camera.left = -d * aspect;
      camera.right = d * aspect;
      camera.top = d;
      camera.bottom = -d;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      controls.autoRotate = false;
      controls.enabled = false;
      title.textContent = ""
      setPageOpen(true);
      contato.style.display = "block";
    }
  }
}

// Controle do Cubo Arrastar e etc
function onPointerDown(e) {
  didDrag = false;
  pointerDownPos.x = e.clientX;
  pointerDownPos.y = e.clientY;
}

function onPointerMove(e) {
  const dx = e.clientX - pointerDownPos.x;
  const dy = e.clientY - pointerDownPos.y;
  if ((dx * dx + dy * dy) > (DRAG_THRESHOLD_PX * DRAG_THRESHOLD_PX)) {
    didDrag = true;
  }
}

function onPointerUp(e) {
  if (didDrag) return;

  if (e.target.closest('#sobre, #portfolio, #contato, #overlay, [name="close-content"], #close-content')) {
    return;
  }

  onClick(e);
}

window.addEventListener('resize', onWindowResize, false);
window.addEventListener('pointerdown', onPointerDown);
window.addEventListener('pointermove', (e) => { onPointerMove(e); onHover(e); });
window.addEventListener('pointerup', onPointerUp);

// ===============================
// Camera, etc
// ===============================
camera.position.set(10, 10, 10)
camera.rotation.order = 'YXZ';
camera.rotation.y = Math.PI / 4;
camera.rotation.x = Math.atan(-1 / Math.sqrt(2));
const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotateSpeed = .9
controls.autoRotate = true
controls.enableZoom = false
controls.enablePan = false

render();

function render() {
  requestAnimationFrame(render);

  try {
    if (pageMode) {
      info.style.opacity = 0;
      info.textContent = "";
    }

    raycaster.setFromCamera(test, camera);
    intersects = raycaster.intersectObject(cube);

    if (intersects.length < 1) {
      info.style.opacity = 0;
      info.textContent = "";
    } else {
      let o = intersects[0].faceIndex;

      if (!pageMode) {
        if (o == 9 || o == 8) info.textContent = "SOBRE MIM";
        if (o == 4 || o == 5) info.textContent = "PORTFOLIO";
        if (o == 1 || o == 0) info.textContent = "CONTATO";
        if (o == 2 || o == 3) info.textContent = "CURRICULUM";
        if (o == 6 || o == 7) info.textContent = "NIGHT MODE";
        if (o == 11 || o == 10) info.textContent = "ENGLISH";

        info.style.opacity = 0.65;
      }
    }

    controls.update();
    renderer.render(scene, camera);

    // PRIMEIRO FRAME = loader sai
    if (!firstRender) {
      firstRender = true;
      hideLoader();
    }

  } catch (err) {
    console.error('[RENDER ERROR]', err);
    hideLoader();
    setTimeout(() => {
      hideLoader();
    }, 5000);
  }
}
