import * as THREE from 'three';

const size = 64;
const canvas = document.createElement('canvas');
canvas.width = size;
canvas.height = size;

// link do favicon
const favicon = document.getElementById('dynamic-favicon');
if (!favicon) {
  console.warn('[favicon] #dynamic-favicon não encontrado. Favicon animado desativado.');
} else {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true
    });
  } catch (err) {
    console.warn('[favicon] WebGL indisponível. Favicon animado desativado.', err);
    renderer = null;
  }

  if (renderer) {
    renderer.setSize(size, size);
    renderer.setPixelRatio(1);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 3;

    // cubo
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial({
      color: 0x16889A,
      roughness: 0.4,
      metalness: 0.3
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // luz
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const light = new THREE.DirectionalLight(0xffffff, 0.6);
    light.position.set(2, 2, 5);
    scene.add(light);

    function animate() {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.015;

      try {
        renderer.render(scene, camera);
        favicon.href = canvas.toDataURL('image/png');
      } catch (err) {
        console.warn('[favicon] erro ao renderizar favicon. Parando animação.', err);
        return;
      }

      requestAnimationFrame(animate);
    }

    animate();
  }
}
