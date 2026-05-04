import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

const canvas = document.getElementById('hero-canvas');
if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const resize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();
  window.addEventListener('resize', resize);

  // Wireframe icosahedron with vertex displacement
  const geo = new THREE.IcosahedronGeometry(1.7, 6);
  const basePositions = geo.attributes.position.array.slice();

  const wireMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true,
    transparent: true,
    opacity: 0.45
  });
  const innerMat = new THREE.MeshBasicMaterial({
    color: 0xff2547,
    wireframe: true,
    transparent: true,
    opacity: 0.22
  });

  const mesh = new THREE.Mesh(geo, wireMat);
  scene.add(mesh);

  const innerGeo = new THREE.IcosahedronGeometry(1.1, 4);
  const innerMesh = new THREE.Mesh(innerGeo, innerMat);
  scene.add(innerMesh);

  // Floating particles
  const particleCount = 200;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const r = 3 + Math.random() * 2;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.022,
    transparent: true,
    opacity: 0.55
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // Mouse parallax
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  window.addEventListener('mousemove', (e) => {
    mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.ty = -((e.clientY / window.innerHeight) * 2 - 1);
  });

  const positionAttr = geo.attributes.position;
  let t = 0;

  const animate = () => {
    t += 0.005;

    // Vertex displacement
    for (let i = 0; i < positionAttr.count; i++) {
      const ix = i * 3;
      const ox = basePositions[ix];
      const oy = basePositions[ix + 1];
      const oz = basePositions[ix + 2];
      const len = Math.sqrt(ox * ox + oy * oy + oz * oz);
      const noise = 0.08 * Math.sin(ox * 2 + t) * Math.cos(oy * 2 + t * 0.7) * Math.sin(oz * 2 + t * 1.3);
      const factor = (len + noise) / len;
      positionAttr.array[ix] = ox * factor;
      positionAttr.array[ix + 1] = oy * factor;
      positionAttr.array[ix + 2] = oz * factor;
    }
    positionAttr.needsUpdate = true;

    mesh.rotation.x += 0.0015;
    mesh.rotation.y += 0.002;
    innerMesh.rotation.x -= 0.001;
    innerMesh.rotation.y -= 0.0015;
    particles.rotation.y += 0.0007;

    mouse.x += (mouse.tx - mouse.x) * 0.06;
    mouse.y += (mouse.ty - mouse.y) * 0.06;
    camera.position.x = mouse.x * 0.4;
    camera.position.y = mouse.y * 0.4;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };

  animate();
}
