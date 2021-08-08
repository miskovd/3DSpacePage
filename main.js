import './style.css'
import * as THREE from 'three';
import { OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {interpolateYlGn} from "https://cdn.skypack.dev/d3-scale-chromatic@3";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGL1Renderer({
    canvas: document.querySelector("#bg"),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(38.55);


//camera.position.z = document.body.getBoundingClientRect().top * -30.81;


renderer.render(scene, camera);

const geometry = new THREE.TorusGeometry(10, 1, 16, 100);
//const material = new THREE.MeshBasicMaterial({color:0xFF6347, wireframe:true});//Sceleton - don't need light
const material = new THREE.MeshStandardMaterial({color:0x0E86D4});//Need light
const torus = new THREE.Mesh(geometry, material);
scene.add(torus);

//Lights
const pointLight = new THREE.PointLight(0xffffff);
const ambientLight = new THREE.AmbientLight(0xffffff);
pointLight.position.set(5, 5, 5);
scene.add(pointLight, ambientLight);

//Helpers
// const lightHelper = new THREE.PointLightHelper(pointLight);//Light poiter
// const gridHelper = new THREE.GridHelper(200,50);//Grid 
// scene.add(lightHelper, gridHelper);

//Mouse control
const controls = new OrbitControls(camera, renderer.domElement);

//Stars
/*function addStar(){
    const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    const material = new THREE.MeshStandardMaterial({color: 0xFF6347});
    const star = new THREE.Mesh(geometry, material);

    const [x, y, z] = Array(3).fill().map( () => THREE.MathUtils.randFloatSpread(100) );//Rand from 0 to 100
    star.position.set(x, y, z);
    scene.add(star);
}
Array(200).fill().forEach(addStar);*/

//Stars2
function stars2() {
    var particles = 100000;
    var geometry = new THREE.BufferGeometry();
    var positions = [];
    var colors = [];
    var sizes = [];
    var n = 900,
      n2 = n / 2;
    for (var i = 0; i < particles; i++) {
      var x = Math.random() * n - n2;
      var y = Math.random() * n - n2;
      var z = Math.random() * n - n2;
      positions.push(x, y, z);
      var s = Math.pow(Math.random(), 12.0);
      sizes.push(s * 16 + 1);
      const c = new THREE.Color(d3.interpolatePlasma(Math.random()));//Stars colors
      colors.push(c.r, c.g, c.b);
    }
    geometry.addAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    geometry.addAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geometry.addAttribute("size", new THREE.Float32BufferAttribute(sizes, 1));
    var material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uColor: { type: "v3", value: new THREE.Color(0xffffff) },
        uAlpha: { value: 1.0 }
      },
      vertexShader: document.getElementById("vertexShader").textContent,
      fragmentShader: document.getElementById("fragmentShader").textContent
    });
    const stars = new THREE.Points(geometry, material);
    scene.add(stars);
  }
  stars2();


//Space BG
const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;

//Avatar
// const avatarTexture = new THREE.TextureLoader().load('jeff.png');
// const avatar =new THREE.Mesh(
//     new THREE.BoxGeometry(3, 3, 3),
//     new THREE.MeshBasicMaterial( {map: avatarTexture} )
// );
// scene.add(avatar);

//Moon
const moonTexture = new THREE.TextureLoader().load('moon.jpg');
const normalTexture = new THREE.TextureLoader().load('normal.jpg');
const moon = new THREE.Mesh(
    new THREE.SphereGeometry(0.7,32, 32),
    new THREE.MeshStandardMaterial({
        map: moonTexture,
        normalMap: normalTexture,
        displacementScale:10.
    })
);
scene.add(moon);
moon.position.z = 25;
moon.position.setX(-5);


//Earth
const earthTexture = new THREE.TextureLoader().load('earth.jpg');
const earthBump1k = new THREE.TextureLoader().load('earthbump1k.jpg');
const earth = new THREE.Mesh(
  new THREE.SphereGeometry(5, 130, 130),
  new THREE.MeshStandardMaterial({
    color:'gray',
    map:earthTexture,
    normalMap: earthBump1k,
    displacementScale:0.1
  })
);
scene.add(earth);
earth.position.x = 0;
earth.position.y = 0;
earth.position.z = 5;


//moveCamera();

function moveCamera(){
    const t = document.body.getBoundingClientRect().top;
    moon.rotation.x += 0.05;
    moon.rotation.y += 0.075;
    moon.rotation.z += 0.05;

    // avatar.rotation.y += 0.01;
    // avatar.rotation.z += 0.01;

    camera.position.z = t * -0.01;
    camera.position.x = t * -0.0002;
    camera.position.y = t * -0.0002;

    //console.log("CAMERA:"+camera.position.z);
}
document.body.onscroll = moveCamera;


function animate(){
    requestAnimationFrame(animate);

    //camera.position.z += 0.8;
    //console.log("CAMERA:"+camera.position.z);

    torus.rotation.x += 0.01;
    torus.rotation.y += 0.01;

    controls.update();
    renderer.render(scene, camera);
}
animate();


