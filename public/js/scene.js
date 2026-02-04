import * as THREE from 'three';
import { OrbitControls } from '/three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from '/three/examples/jsm/loaders/GLTFLoader.js';
import { FontLoader } from '/three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from '/three/examples/jsm/geometries/TextGeometry.js';

// ctrl + shift + l
// Scene, camera, light, constants
let width = window.innerWidth;
let height = window.innerHeight;
var mouse = new THREE.Vector2();
var test = new THREE.Vector2(0, 0);
var raycaster = new THREE.Raycaster();

const scene = new THREE.Scene();

//scene.background = new THREE.Color(.7, .8, .8);
//scene.background = new THREE.Color(1., 1., 1.);
var clock = new THREE.Clock();

var aspect = width / height;
var d = 20;
const camera = new THREE.OrthographicCamera( - d * aspect, d * aspect, d, - d, 1, 2000 );

//Renderer
//const renderer = new THREE.WebGLRenderer({antialias: true});
const renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setClearColor( 0x000000, 0 ); // the default
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize(width, height);
renderer.domElement.id = 'render';
document.body.appendChild(renderer.domElement);


// Light
const alight = new THREE.AmbientLight( 0xffffff );
scene.add(alight);

var light = new THREE.PointLight( 0xffffff, 1 );
light.position.set( -30, 10, 35);
scene.add( light );

// Texts
var pM, cM, sM;
const loadingManager = new THREE.LoadingManager( () => {
	
    const loadingScreen = document.getElementById( 'loading-screen' );
    loadingScreen.classList.add( 'fade-out' );
    
} );
const loader = new FontLoader(loadingManager);
loader.load( 'font/font_icon.json', function ( font ) {

        const textGeo = new TextGeometry( '', {
        font: font,
        size: 4,
        height: 0.5,
        curveSegments: 12,
        bevelEnabled: false
    });
    textGeo.computeBoundingBox();
    const textMaterial = new THREE.MeshPhongMaterial( { color: 0xcfcfcf} ); ;
    const mesh = new THREE.Mesh( textGeo, textMaterial );
    mesh.position.z = 3.2;
    mesh.position.x = 1.8;
    mesh.position.y = 5;
    mesh.rotateX(-Math.PI/2.);
    mesh.rotateZ(Math.PI/2.);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add( mesh );

});
loader.load( 'font/font_icon.json', function ( font ) {

        const textGeo = new TextGeometry( '', {
        font: font,
        size: 4,
        height: 0.5,
        curveSegments: 12,
        bevelEnabled: false
    });
    textGeo.computeBoundingBox();
    const textMaterial = new THREE.MeshPhongMaterial( { color: 0xcfcfcf} ); ;
    const mesh = new THREE.Mesh( textGeo, textMaterial );
    mesh.position.z = 3.2;
    mesh.position.x = 2.;
    mesh.position.y = -5.5;
    mesh.rotateX(-Math.PI/2.);
    mesh.rotateZ(Math.PI/2.);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add( mesh );

});
loader.load( 'font/font_icon.json', function ( font ) {

        const textGeo = new TextGeometry( '', {
        font: font,
        size: 4,
        height: 0.5,
        curveSegments: 12,
        bevelEnabled: false
    });
    textGeo.computeBoundingBox();
    const textMaterial = new THREE.MeshPhongMaterial( { color: 0xcfcfcf} ); ;
    const mesh = new THREE.Mesh( textGeo, textMaterial );
    mesh.position.z = 2;
    mesh.position.x = -5;
    mesh.position.y = -2.8;
    //mesh.rotateX(-Math.PI/2.);
    mesh.rotateY(-Math.PI/2.);
    mesh.rotateZ(Math.PI/2.);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add( mesh );

});
loader.load( 'font/font_icon.json', function ( font ) {

        const textGeo = new TextGeometry( '', {
        font: font,
        size: 4,
        height: 0.5,
        curveSegments: 12,
        bevelEnabled: false
    });
    textGeo.computeBoundingBox();
    const textMaterial = new THREE.MeshPhongMaterial( { color: 0xcfcfcf} ); ;
    const mesh = new THREE.Mesh( textGeo, textMaterial );
    mesh.position.z = 2;
    mesh.position.x = 5.5;
    mesh.position.y = -2.8;
    mesh.rotateY(-Math.PI/2.);
    mesh.rotateZ(Math.PI/2.);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add( mesh );

} );
loader.load( 'font/font_icon.json', function ( font ) {

        const textGeo = new TextGeometry( '', {
        font: font,
        size: 4,
        height: 0.5,
        curveSegments: 12,
        bevelEnabled: false
    });
    textGeo.computeBoundingBox();
    const textMaterial = new THREE.MeshPhongMaterial( { color: 0xcfcfcf} );
    const mesh = new THREE.Mesh( textGeo, textMaterial );
    mesh.position.z = 5;
    mesh.position.x = -2.5;
    mesh.position.y = -2.4;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add( mesh );

} );
loader.load( 'font/font_icon.json', function ( font ) {

        const textGeo = new TextGeometry( '', {
        font: font,
        size: 4,
        height: 0.5,
        curveSegments: 12,
        bevelEnabled: false
    });
    textGeo.computeBoundingBox();
    const textMaterial = new THREE.MeshPhongMaterial( { color: 0xcfcfcf} );
    const mesh = new THREE.Mesh( textGeo, textMaterial );
    mesh.position.z = -5.5;
    mesh.position.x = -2.8;
    mesh.position.y = -2.2;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add( mesh );

} );

// Cube
var material = new THREE.ShaderMaterial({ 
    uniforms: {
      u_time: { type: "f", value: 1.0 },
      u_resolution: {value: new THREE.Vector2(width, height) },
    },
    vertexShader: `
    attribute float size;
    varying vec3 vPosition;
    varying vec3 vNormal;
    void main() {
        vPosition = position.xyz;
        vec4 vPosition = modelViewMatrix * vec4( position, 1.0 );
        gl_Position =  projectionMatrix * vPosition;
        vPosition = gl_Position;
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
        //gl_FragColor = vec4(abs(vNormal)+spectrum(.95), 1.); 
    }` 
});
var geometry = new THREE.BoxGeometry(10,10,10);
var cube = new THREE.Mesh(geometry, material);
scene.add( cube );

// Events
var intersects, info, title, close, sobre, contato, portfolio, footer;
info = document.getElementById("hinfo");
title = document.getElementById("ptitle");
close = document.getElementsByName("close-content");
sobre = document.getElementById("sobre");
contato = document.getElementById("contato");
portfolio = document.getElementById("portfolio");
footer = document.getElementById("footer");
console.log(close)
var pageMode = false;

function onWindowResize() {
    if (!pageMode) {
        width = window.innerWidth
        height = window.innerHeight
        var aspect = width / height;
        camera.left = -d * aspect ;
        camera.right = d * aspect;
        camera.top = d ;
        camera.bottom = - d;

        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
    }
}
function onHover(event){
    event.preventDefault();
    if (pageMode) {
        mouse.x = -(( (window.innerWidth - event.clientX) / width )*2-1);
        mouse.y = -(-((window.innerHeight - event.clientY) / height) * 2 + 1);
    }   
    else {
        mouse.x = ( event.clientX / width ) * 2 - 1;
        mouse.y = - ( event.clientY / height ) * 2 + 1;
    } 
}
function closePage(){
    //document.getElementById("close").style.display = "none";
    width = window.innerWidth;
    height = window.innerHeight;
    var aspect = width / height;
    camera.left = -d * aspect ;
    camera.right = d * aspect;
    camera.top = d ;
    camera.bottom = - d;

    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    //close.textContent = ""
    ptitle.textContent = "valois"
    pageMode = false;
    footer.style.opacity = 1.;
    sobre.style.display = 'none';
    contato.style.display = 'none';
    portfolio.style.display = 'none';
}
close.forEach((item) => {
    item.onpointerdown = closePage
});
function onClick(event){
    var size;
    if (window.innerWidth <= 1280){
        size = 0
    }
    else {
        size = 0
    }
    raycaster.setFromCamera(mouse, camera);
    intersects = raycaster.intersectObject(cube);

    if (intersects.length > 0) {
        let o = intersects[0].faceIndex;
        if (o == 2 || o == 3) {
            if(!pageMode) {
                footer.style.opacity = 1.;
            }
            window.open("/misc/curriculum.pdf", '_blank').focus();
            return;
        }
        if (o == 10 || o == 11) {
            if(!pageMode) {
                footer.style.opacity = 1.;
            }
            return;
        }
        if (o == 6 || o == 7) {
            if(!pageMode) {
                footer.style.opacity = 1.;
            }
        }
        //document.getElementById("close").style.display = "block";
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
            camera.left = -d * aspect ;
            camera.right = d * aspect;
            camera.top = d;
            camera.bottom = - d;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
            //close.textContent = "voltar"
            ptitle.textContent = ""
            portfolio.style.display = "block";
        }
        if (o == 9 || o == 8) {
            pageMode = true;
            width = size;
            height = size;
            var aspect = width / height;
            camera.left = -d * aspect ;
            camera.right = d * aspect;
            camera.top = d;
            camera.bottom = - d;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
            //close.textContent = "voltar"
            ptitle.textContent = ""
            sobre.style.display = "block";
        }
        if (o == 1 || o == 0) {
            pageMode = true;
            width = size;
            height = size;
            var aspect = width / height;
            camera.left = -d * aspect ;
            camera.right = d * aspect;
            camera.top = d;
            camera.bottom = - d;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
            //close.textContent = "voltar"
            ptitle.textContent = ""
            contato.style.display = "block";
        }
    }
}

window.addEventListener('resize', onWindowResize, false);
window.addEventListener('mousemove', onHover);
window.addEventListener('click', onClick);

// Camera, etc
camera.position.set(10, 10, 10)
camera.rotation.order = 'YXZ';
camera.rotation.y = Math.PI / 4;
camera.rotation.x = Math.atan( - 1 / Math.sqrt( 2 ) );
const controls = new OrbitControls( camera, renderer.domElement );
controls.autoRotateSpeed = .9
controls.autoRotate = true
controls.enableZoom = false 
controls.enablePan = false

render();
function render() {
    
    requestAnimationFrame(render);
    raycaster.setFromCamera(test, camera);
    intersects = raycaster.intersectObject(cube);
    if (intersects.length < 1) {
        info.style.opacity = 0;
        info.textContent = "";
    } else {
        let o = intersects[0].faceIndex;
        
        if (o == 9 || o == 8) {
            if (!pageMode) {
                info.style.opacity = 0.3;
                info.textContent = "SOBRE MIM";
            }
        } 
        if (o == 4 || o == 5) {
            if (!pageMode) {
                info.style.opacity = 0.3;
                info.textContent = "PORTFOLIO";
            }
        } 
        if (o == 1 || o == 0) {
            if (!pageMode) {
                info.style.opacity = 0.3;
                info.textContent = "CONTATO";
            }
        } 
        if (o == 2 || o == 3) {
            if (!pageMode) {
                info.style.opacity = 0.3;
                info.textContent = "CURRICULUM";
            }
        } 
        if (o == 6 || o == 7) {
            if (!pageMode) {
                info.style.opacity = 0.3;
                info.textContent = "NIGHT MODE";
            }
        } 
        if (o == 11 || o == 10) {
            if (!pageMode) {
                info.style.opacity = 0.3;
                info.textContent = "ENGLISH";
            }
        } 
    };
    controls.update();
    renderer.render(scene, camera);
    //material.uniforms.u_time.value = clock.getElapsedTime();
};
