/* ==========================================================================
   PROCEDURAL THREE.JS 3D ARCHITECTURAL TILE & DIN 18534 CUTAWAY ENGINE (v5)
   Real 3D Beveled 2x2 Tile Geometry | 1.5mm Recessed Grout | Crisp Honed Stone PBR
   ========================================================================== */
'use strict';

(function initScrolly3D() {
  const canvas = document.getElementById('scrollyCanvas');
  const stageSection = document.getElementById('scrollyStage');
  if (!canvas || !stageSection || typeof THREE === 'undefined') return;

  const isMobile = window.innerWidth <= 768;
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();

  function createStudioEnvironment() {
    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();
    const envCanvas = document.createElement('canvas');
    envCanvas.width = 512;
    envCanvas.height = 256;
    const ctx = envCanvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0.0, '#FFFFFF');
    grad.addColorStop(0.28, '#F6EFE4');
    grad.addColorStop(0.47, '#1F1D1A');
    grad.addColorStop(0.62, '#C8B89F');
    grad.addColorStop(1.0, '#181614');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 256);

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(36, 16, 150, 56);
    ctx.fillStyle = '#FFE4BC';
    ctx.fillRect(275, 24, 165, 52);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(190, 128, 95, 26);

    const envTex = new THREE.CanvasTexture(envCanvas);
    envTex.mapping = THREE.EquirectangularReflectionMapping;
    envTex.colorSpace = THREE.SRGBColorSpace;
    const rt = pmrem.fromEquirectangular(envTex);
    envTex.dispose();
    pmrem.dispose();
    return rt.texture;
  }

  scene.environment = createStudioEnvironment();

  const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 80);
  camera.position.set(6.15, 4.18, 7.05);
  camera.lookAt(0, 0.52, 0);

  const hemiLight = new THREE.HemisphereLight(0xFFF7EC, 0x3F3933, 0.85);
  scene.add(hemiLight);

  const keyLight = new THREE.DirectionalLight(0xFFF3E0, 2.35);
  keyLight.position.set(7.5, 10.8, 6.4);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  keyLight.shadow.camera.near = 1;
  keyLight.shadow.camera.far = 30;
  keyLight.shadow.camera.left = -5.0;
  keyLight.shadow.camera.right = 5.0;
  keyLight.shadow.camera.top = 5.0;
  keyLight.shadow.camera.bottom = -5.0;
  keyLight.shadow.bias = -0.0004;
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0xE0EBE7, 1.05);
  rimLight.position.set(-7.5, 5.2, -4.8);
  scene.add(rimLight);

  const nicheLight = new THREE.PointLight(0xFFC278, 1.85, 5.0, 1.6);
  nicheLight.position.set(-0.45, 1.15, -0.78);
  scene.add(nicheLight);

  // Seamless Radial Contact Shadow (fades to pure 0.0 well inside plane perimeter -> zero rectangular edge!)
  function createFloorAOTexture() {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 256;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(128, 128, 14, 128, 128, 108);
    g.addColorStop(0.0, 'rgba(22, 20, 17, 0.42)');
    g.addColorStop(0.42, 'rgba(22, 20, 17, 0.19)');
    g.addColorStop(0.76, 'rgba(22, 20, 17, 0.05)');
    g.addColorStop(1.0, 'rgba(22, 20, 17, 0.0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  const aoPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(7.2, 6.4),
    new THREE.MeshBasicMaterial({ map: createFloorAOTexture(), transparent: true, depthWrite: false })
  );
  aoPlane.rotation.x = -Math.PI / 2;
  aoPlane.position.set(0.08, -0.56, 0.08);
  scene.add(aoPlane);

  // ── Procedural High-Frequency Honed Stone PBR Maps ────────────────────────
  function makeCanvas(w, h) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    return c;
  }

  function hash2(x, y) {
    const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
    return n - Math.floor(n);
  }

  function smoothNoise(x, y) {
    const ix = Math.floor(x), iy = Math.floor(y);
    const fx = x - ix, fy = y - iy;
    const ux = fx * fx * (3 - 2 * fx);
    const uy = fy * fy * (3 - 2 * fy);
    const a = hash2(ix, iy);
    const b = hash2(ix + 1, iy);
    const c = hash2(ix, iy + 1);
    const d = hash2(ix + 1, iy + 1);
    return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
  }

  function fbm(x, y) {
    return (
      smoothNoise(x, y) * 0.52 +
      smoothNoise(x * 2.13 + 7.3, y * 2.13 + 1.9) * 0.30 +
      smoothNoise(x * 4.71 + 3.1, y * 4.71 + 9.4) * 0.18
    );
  }

  function hexToRgb(hex) {
    const v = parseInt(hex.slice(1), 16);
    return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
  }

  function createStoneMaps(preset) {
    const size = 512;
    const c = makeCanvas(size, size);
    const n = makeCanvas(size, size);
    const r = makeCanvas(size, size);
    const ctx = c.getContext('2d');
    const nctx = n.getContext('2d');
    const rctx = r.getContext('2d');

    const imgData = ctx.createImageData(size, size);
    const normData = nctx.createImageData(size, size);
    const roughData = rctx.createImageData(size, size);
    const heightBuf = new Float32Array(size * size);

    const cBase = hexToRgb(preset.base);
    const cVeinA = hexToRgb(preset.veinA);
    const cVeinB = hexToRgb(preset.veinB);

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const pIdx = y * size + x;
        const idx = pIdx * 4;

        // Crisp high-frequency honed travertine/limestone sedimentary grain & natural marbling
        const nx = x * 0.028;
        const ny = y * 0.028;
        const cloud = fbm(nx, ny);
        const strata = fbm(nx * 0.7 + cloud * 1.4, ny * 2.6 + 2.3);
        const micro = fbm(nx * 2.9 + 4.1, ny * 2.9 - 2.7);
        const pore = hash2(x * 0.91, y * 0.91) > 0.962 ? -0.18 : 0.0;
        const grain = (hash2(x * 0.6, y * 0.6) - 0.5) * 0.055;

        const veinFactor = Math.max(0, Math.min(1, (strata - 0.36) * 1.65));
        const lightCloud = Math.max(0, Math.min(1, (cloud - 0.45) * 1.45));

        let rr = cBase[0] * (1 - veinFactor * 0.44) + cVeinA[0] * (veinFactor * 0.44);
        let gg = cBase[1] * (1 - veinFactor * 0.44) + cVeinA[1] * (veinFactor * 0.44);
        let bb = cBase[2] * (1 - veinFactor * 0.44) + cVeinA[2] * (veinFactor * 0.44);

        rr = rr * (1 - lightCloud * 0.34) + cVeinB[0] * (lightCloud * 0.34) + (pore + grain) * 44;
        gg = gg * (1 - lightCloud * 0.34) + cVeinB[1] * (lightCloud * 0.34) + (pore + grain) * 40;
        bb = bb * (1 - lightCloud * 0.34) + cVeinB[2] * (lightCloud * 0.34) + (pore + grain) * 35;

        imgData.data[idx] = Math.max(0, Math.min(255, rr));
        imgData.data[idx + 1] = Math.max(0, Math.min(255, gg));
        imgData.data[idx + 2] = Math.max(0, Math.min(255, bb));
        imgData.data[idx + 3] = 255;

        heightBuf[pIdx] = 0.62 + (cloud - 0.5) * 0.14 + pore * 0.85;

        const baseRough = Math.round(preset.roughness * 255);
        const roughVal = Math.max(35, Math.min(245, Math.round(baseRough + (micro - 0.5) * 44 + (pore < 0 ? 45 : 0))));
        roughData.data[idx] = roughData.data[idx + 1] = roughData.data[idx + 2] = roughVal;
        roughData.data[idx + 3] = 255;
      }
    }

    const strength = 2.6;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const xm = (x - 1 + size) % size;
        const xp = (x + 1) % size;
        const ym = (y - 1 + size) % size;
        const yp = (y + 1) % size;
        const dx = (heightBuf[y * size + xp] - heightBuf[y * size + xm]) * strength;
        const dy = (heightBuf[yp * size + x] - heightBuf[ym * size + x]) * strength;
        const dz = 1.0;
        const len = Math.hypot(dx, dy, dz);
        const idx = (y * size + x) * 4;
        normData.data[idx] = Math.round(((-dx / len) * 0.5 + 0.5) * 255);
        normData.data[idx + 1] = Math.round(((-dy / len) * 0.5 + 0.5) * 255);
        normData.data[idx + 2] = Math.round(((dz / len) * 0.5 + 0.5) * 255);
        normData.data[idx + 3] = 255;
      }
    }

    ctx.putImageData(imgData, 0, 0);
    nctx.putImageData(normData, 0, 0);
    rctx.putImageData(roughData, 0, 0);

    const map = new THREE.CanvasTexture(c);
    map.colorSpace = THREE.SRGBColorSpace;
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 4;

    const normal = new THREE.CanvasTexture(n);
    normal.wrapS = normal.wrapT = THREE.RepeatWrapping;

    const rough = new THREE.CanvasTexture(r);
    rough.wrapS = rough.wrapT = THREE.RepeatWrapping;

    return { map, normal, rough };
  }

  function createScreedTexture() {
    const c = makeCanvas(256, 256);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#8B867D';
    ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 1200; i++) {
      const x = hash2(i, 1.3) * 256;
      const y = hash2(i, 7.9) * 256;
      ctx.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,0.12)' : 'rgba(20,20,18,0.14)';
      ctx.fillRect(x, y, 2.2, 2.2);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }

  function createAdhesiveTexture() {
    const c = makeCanvas(256, 256);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#979188';
    ctx.fillRect(0, 0, 256, 256);
    for (let y = 0; y < 256; y += 10) {
      ctx.fillStyle = '#6E685F';
      ctx.fillRect(0, y, 256, 4);
      ctx.fillStyle = '#BCB6AC';
      ctx.fillRect(0, y + 4, 256, 3);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 3);
    return tex;
  }

  function createMembraneTexture() {
    const c = makeCanvas(256, 256);
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#255B65';
    ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = '#5399A3';
    ctx.lineWidth = 14;
    ctx.strokeRect(7, 7, 242, 242);
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    for (let y = 0; y < 256; y += 8) ctx.fillRect(0, y, 256, 2);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  function createMirrorReflectionTexture() {
    const c = makeCanvas(256, 256);
    const ctx = c.getContext('2d');
    const g = ctx.createLinearGradient(0, 0, 256, 256);
    g.addColorStop(0.0, '#FFFDF8');
    g.addColorStop(0.28, '#E6DACA');
    g.addColorStop(0.54, '#C5B8A6');
    g.addColorStop(0.8, '#8E8375');
    g.addColorStop(1.0, '#5E574E');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);

    // Architectural soft window/ceiling depth hint inside reflection
    ctx.fillStyle = 'rgba(255, 250, 240, 0.32)';
    ctx.fillRect(18, 22, 92, 66);
    ctx.fillStyle = 'rgba(55, 50, 44, 0.22)';
    ctx.fillRect(0, 178, 256, 78);

    ctx.save();
    ctx.translate(128, 128);
    ctx.rotate(-0.48);
    const glare = ctx.createLinearGradient(-48, -140, 48, -140);
    glare.addColorStop(0, 'rgba(255,255,255,0)');
    glare.addColorStop(0.5, 'rgba(255,253,247,0.82)');
    glare.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = glare;
    ctx.fillRect(-38, -180, 76, 360);
    ctx.restore();

    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  const PRESETS = {
    travertin: {
      name: 'Travertin Sandstein',
      base: '#E2D6C3',
      veinA: '#C6B397',
      veinB: '#F2EBE0',
      grout: 0xA89C8B,
      roughness: 0.38
    },
    basalt: {
      name: 'Nero Basalt Dunkel',
      base: '#2E322F',
      veinA: '#1B1D1C',
      veinB: '#4B524D',
      grout: 0x161817,
      roughness: 0.44
    },
    calacatta: {
      name: 'Calacatta Weiß',
      base: '#F3EFE8',
      veinA: '#A99F91',
      veinB: '#FAF8F4',
      grout: 0xCBC3B7,
      roughness: 0.18
    },
    cotto: {
      name: 'Cotto Terrakotta',
      base: '#B87755',
      veinA: '#8E5236',
      veinB: '#D49E7F',
      grout: 0x7A5B49,
      roughness: 0.52
    }
  };

  const pavilion = new THREE.Group();
  pavilion.position.set(0, -0.04, 0);
  scene.add(pavilion);

  // Layer 1: Tragwerk & GKBI Trockenbau + Mineralischer Gefälle-Estrich
  const layerBase = new THREE.Group();
  const screedTex = createScreedTexture();
  const drywallMat = new THREE.MeshStandardMaterial({
    color: 0x567863,
    bumpMap: screedTex,
    bumpScale: 0.012,
    roughness: 0.84
  });
  const screedMat = new THREE.MeshStandardMaterial({ map: screedTex, bumpMap: screedTex, bumpScale: 0.018, roughness: 0.92 });

  const floorScreed = new THREE.Mesh(new THREE.BoxGeometry(3.3, 0.14, 2.8), screedMat);
  floorScreed.position.set(0, -0.45, 0);
  floorScreed.castShadow = true;
  floorScreed.receiveShadow = true;

  const backDrywall = new THREE.Mesh(new THREE.BoxGeometry(3.18, 2.38, 0.12), drywallMat);
  backDrywall.position.set(0.06, 0.90, -1.34);
  backDrywall.castShadow = true;
  backDrywall.receiveShadow = true;

  const sideDrywall = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.38, 2.8), drywallMat);
  sideDrywall.position.set(-1.59, 0.90, 0);
  sideDrywall.castShadow = true;
  sideDrywall.receiveShadow = true;

  layerBase.add(floorScreed, backDrywall, sideDrywall);

  // Layer 2: DIN 18534 Verbundabdichtung + Eckdichtband
  const layerMembrane = new THREE.Group();
  const membraneTex = createMembraneTexture();
  const membraneMat = new THREE.MeshStandardMaterial({
    map: membraneTex,
    bumpMap: membraneTex,
    bumpScale: 0.01,
    roughness: 0.48,
    metalness: 0.08
  });
  const sealingTapeMat = new THREE.MeshStandardMaterial({ color: 0x62A8B2, roughness: 0.58 });

  const floorMembrane = new THREE.Mesh(new THREE.BoxGeometry(3.22, 0.035, 2.72), membraneMat);
  floorMembrane.position.set(0.03, -0.34, 0.03);
  floorMembrane.castShadow = true;

  const backMembrane = new THREE.Mesh(new THREE.BoxGeometry(3.16, 2.26, 0.035), membraneMat);
  backMembrane.position.set(0.06, 0.94, -1.24);
  backMembrane.castShadow = true;

  const sideMembrane = new THREE.Mesh(new THREE.BoxGeometry(0.035, 2.26, 2.72), membraneMat);
  sideMembrane.position.set(-1.49, 0.94, 0.03);
  sideMembrane.castShadow = true;

  const cornerBand = new THREE.Mesh(new THREE.BoxGeometry(0.09, 2.26, 0.09), sealingTapeMat);
  cornerBand.position.set(-1.44, 0.94, -1.19);

  layerMembrane.add(floorMembrane, backMembrane, sideMembrane, cornerBand);

  // Layer 3: Dünnbett-Kammbett + echte 3D Zahntraufel-Rippen + Nivellierclips
  const layerAdhesive = new THREE.Group();
  const adhesiveTex = createAdhesiveTexture();
  const adhesiveMat = new THREE.MeshStandardMaterial({
    map: adhesiveTex,
    bumpMap: adhesiveTex,
    bumpScale: 0.032,
    roughness: 0.86
  });

  const floorAdhesive = new THREE.Mesh(new THREE.BoxGeometry(3.18, 0.04, 2.68), adhesiveMat);
  floorAdhesive.position.set(0.05, -0.28, 0.05);

  const backAdhesive = new THREE.Mesh(new THREE.BoxGeometry(3.18, 2.20, 0.04), adhesiveMat);
  backAdhesive.position.set(0.05, 0.96, -1.18);

  const sideAdhesive = new THREE.Mesh(new THREE.BoxGeometry(0.04, 2.20, 2.68), adhesiveMat);
  sideAdhesive.position.set(-1.43, 0.96, 0.05);

  const adhesiveRidgesGroup = new THREE.Group();
  const ridgeMat = new THREE.MeshStandardMaterial({ color: 0x9C958B, roughness: 0.9 });
  for (let ry = -0.1; ry <= 1.95; ry += 0.12) {
    const ridge = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.045, 0.065), ridgeMat);
    ridge.position.set(1.63, ry, -1.17);
    adhesiveRidgesGroup.add(ridge);
  }

  const adhesiveClipsGroup = new THREE.Group();
  const clipMat = new THREE.MeshStandardMaterial({ color: 0xC49E6C, roughness: 0.3, metalness: 0.4 });
  for (let i = -1; i <= 1; i++) {
    const clip = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.045, 0.095), clipMat);
    clip.position.set(i * 0.9 + 0.12, -0.23, 0.45);
    adhesiveClipsGroup.add(clip);
  }

  layerAdhesive.add(floorAdhesive, backAdhesive, sideAdhesive, adhesiveRidgesGroup, adhesiveClipsGroup);

  // Layer 4: Real 3D 2x2 XXL Porcelain Slabs with True Physical 1.5mm Recessed Grout Gaps!
  const layerTile = new THREE.Group();
  const initialMaps = createStoneMaps(PRESETS.travertin);
  const tileMat = new THREE.MeshPhysicalMaterial({
    map: initialMaps.map,
    normalMap: initialMaps.normal,
    normalScale: new THREE.Vector2(0.75, 0.75),
    roughnessMap: initialMaps.rough,
    roughness: 0.85,
    metalness: 0.04,
    clearcoat: 0.28,
    clearcoatRoughness: 0.24,
    envMapIntensity: 1.05
  });

  const groutMat = new THREE.MeshStandardMaterial({
    color: PRESETS.travertin.grout,
    roughness: 0.92
  });

  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xDDB978,
    metalness: 0.95,
    roughness: 0.14,
    envMapIntensity: 2.8
  });

  const basaltAccentMat = new THREE.MeshStandardMaterial({
    color: 0x222523,
    roughness: 0.48,
    metalness: 0.1
  });

  const walnutMat = new THREE.MeshStandardMaterial({
    color: 0x4A3A2C,
    roughness: 0.6,
    metalness: 0.05
  });

  // Recessed Grout Backing Panels + Individual 3D Porcelain Slabs (1.5mm true recessed joints!)
  const gap = 0.014;
  const floorTileGroup = new THREE.Group();
  const backTileGroup = new THREE.Group();
  const sideTileGroup = new THREE.Group();

  // Floor 2x2 XXL Slabs
  const floorGroutBack = new THREE.Mesh(new THREE.BoxGeometry(3.15, 0.032, 2.65), groutMat);
  floorGroutBack.position.set(0.07, -0.222, 0.07);
  floorTileGroup.add(floorGroutBack);
  const fw = (3.16 - gap) / 2, fd = (2.66 - gap) / 2;
  for (let ix = 0; ix < 2; ix++) {
    for (let iz = 0; iz < 2; iz++) {
      const slab = new THREE.Mesh(new THREE.BoxGeometry(fw, 0.038, fd), tileMat);
      slab.position.set(0.07 + (ix - 0.5) * (fw + gap), -0.20, 0.07 + (iz - 0.5) * (fd + gap));
      slab.castShadow = true;
      slab.receiveShadow = true;
      floorTileGroup.add(slab);
    }
  }

  // Back Wall 2x2 XXL Slabs (seated strictly above floor tile bottom y=-0.10 so zero overhang!)
  const backGrout = new THREE.Mesh(new THREE.BoxGeometry(3.10, 2.16, 0.03), groutMat);
  backGrout.position.set(0.095, 0.98, -1.122);
  backTileGroup.add(backGrout);
  const bw = (3.11 - gap) / 2, bh = (2.17 - gap) / 2;
  for (let ix = 0; ix < 2; ix++) {
    for (let iy = 0; iy < 2; iy++) {
      const slab = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, 0.038), tileMat);
      slab.position.set(0.095 + (ix - 0.5) * (bw + gap), 0.98 + (iy - 0.5) * (bh + gap), -1.105);
      slab.castShadow = true;
      slab.receiveShadow = true;
      backTileGroup.add(slab);
    }
  }

  // Side Wall 2x2 XXL Slabs
  const sideGrout = new THREE.Mesh(new THREE.BoxGeometry(0.03, 2.16, 2.65), groutMat);
  sideGrout.position.set(-1.372, 0.98, 0.07);
  sideTileGroup.add(sideGrout);
  const sd = (2.66 - gap) / 2;
  for (let iz = 0; iz < 2; iz++) {
    for (let iy = 0; iy < 2; iy++) {
      const slab = new THREE.Mesh(new THREE.BoxGeometry(0.038, bh, sd), tileMat);
      slab.position.set(-1.355, 0.98 + (iy - 0.5) * (bh + gap), 0.07 + (iz - 0.5) * (sd + gap));
      slab.castShadow = true;
      slab.receiveShadow = true;
      sideTileGroup.add(slab);
    }
  }

  // Flush-Embedded Recessed LED Wall Niche with Brushed Brass Frame
  const nicheRim = new THREE.Mesh(new THREE.BoxGeometry(1.08, 0.36, 0.018), brassMat);
  nicheRim.position.set(-0.55, 1.05, -1.084);
  const nicheFrame = new THREE.Mesh(new THREE.BoxGeometry(1.03, 0.31, 0.026), basaltAccentMat);
  nicheFrame.position.set(-0.55, 1.05, -1.078);
  backTileGroup.add(nicheRim);
  const nicheLed = new THREE.Mesh(
    new THREE.BoxGeometry(1.0, 0.018, 0.055),
    new THREE.MeshBasicMaterial({ color: 0xFFD99E })
  );
  nicheLed.position.set(-0.55, 1.2, -1.068);
  const bottleA = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.14, 20), brassMat);
  bottleA.position.set(-0.82, 0.965, -1.042);
  const bottleNeckA = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.035, 12), basaltAccentMat);
  bottleNeckA.position.set(-0.82, 1.05, -1.042);
  const bottleB = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.115, 20), new THREE.MeshPhysicalMaterial({ color: 0xEFEAE0, roughness: 0.2, clearcoat: 0.8 }));
  bottleB.position.set(-0.72, 0.952, -1.042);

  // Slotted Brushed Brass Linear Floor Drain
  const drainGroup = new THREE.Group();
  drainGroup.position.set(-0.68, -0.176, -0.78);
  const drainRecess = new THREE.Mesh(new THREE.BoxGeometry(1.06, 0.015, 0.095), basaltAccentMat);
  const drainInsert = new THREE.Mesh(new THREE.BoxGeometry(0.98, 0.018, 0.062), brassMat);
  drainInsert.position.y = 0.004;
  drainGroup.add(drainRecess, drainInsert);
  for (let s = -2; s <= 2; s++) {
    const slot = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.02, 0.012), basaltAccentMat);
    slot.position.set(s * 0.19, 0.006, 0);
    drainGroup.add(slot);
  }

  // Concealed Brass Rain Shower + Flange + Thermostatic Mixer
  const wallFlange = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.02, 24), brassMat);
  wallFlange.rotation.z = Math.PI / 2;
  wallFlange.position.set(-1.325, 1.88, -0.25);

  const showerArm = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.5, 16), brassMat);
  showerArm.rotation.z = Math.PI / 2;
  showerArm.position.set(-1.08, 1.88, -0.25);

  const showerHead = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.21, 0.026, 32), brassMat);
  showerHead.position.set(-0.84, 1.86, -0.25);
  showerHead.castShadow = true;

  const showerNozzleFace = new THREE.Mesh(new THREE.CylinderGeometry(0.175, 0.175, 0.008, 28), basaltAccentMat);
  showerNozzleFace.position.set(-0.84, 1.844, -0.25);

  const mixerPlate = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.28, 0.13), brassMat);
  mixerPlate.position.set(-1.32, 1.12, -0.25);
  const dialTop = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.044, 20), brassMat);
  dialTop.rotation.z = Math.PI / 2;
  dialTop.position.set(-1.292, 1.18, -0.25);
  const dialBot = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.044, 20), brassMat);
  dialBot.rotation.z = Math.PI / 2;
  dialBot.position.set(-1.292, 1.06, -0.25);

  // Sculpted Floating Vanity: Fluted Walnut Base + Travertine Countertop + Ceramic Vessel Basin
  const vanityGroup = new THREE.Group();
  vanityGroup.position.set(0.84, 0.65, -0.82);

  const vanityCabinet = new THREE.Mesh(new THREE.BoxGeometry(1.06, 0.27, 0.48), walnutMat);
  vanityCabinet.position.set(0, -0.03, -0.02);
  vanityCabinet.castShadow = true;

  for (let fx = -0.46; fx <= 0.46; fx += 0.09) {
    const flute = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.25, 0.015), new THREE.MeshStandardMaterial({ color: 0x35281E, roughness: 0.7 }));
    flute.position.set(fx, -0.03, 0.225);
    vanityGroup.add(flute);
  }

  const vanityCountertop = new THREE.Mesh(new THREE.BoxGeometry(1.14, 0.055, 0.54), tileMat);
  vanityCountertop.position.set(0, 0.13, 0);
  vanityCountertop.castShadow = true;

  const vesselMat = new THREE.MeshPhysicalMaterial({ color: 0xFAF7F0, roughness: 0.14, clearcoat: 0.9 });
  const vesselBasin = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.2, 0.11, 32), vesselMat);
  vesselBasin.scale.set(1.25, 1, 0.88);
  vesselBasin.position.set(0, 0.21, 0.03);
  vesselBasin.castShadow = true;

  const vesselRimInner = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.19, 0.012, 28), new THREE.MeshStandardMaterial({ color: 0xE8E2D5, roughness: 0.28 }));
  vesselRimInner.scale.set(1.22, 1, 0.85);
  vesselRimInner.position.set(0, 0.262, 0.03);

  const basinDrain = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.015, 16), brassMat);
  basinDrain.position.set(0, 0.266, 0.03);

  const wallSpoutPlate = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.06, 0.018), brassMat);
  wallSpoutPlate.position.set(0, 0.36, -0.255);
  const wallSpout = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.22, 16), brassMat);
  wallSpout.rotation.x = Math.PI / 2;
  wallSpout.position.set(0, 0.36, -0.15);
  const spoutTip = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.013, 0.04, 16), brassMat);
  spoutTip.position.set(0, 0.34, -0.045);

  vanityGroup.add(vanityCabinet, vanityCountertop, vesselBasin, vesselRimInner, basinDrain, wallSpoutPlate, wallSpout, spoutTip);

  const mirrorHalo = new THREE.Mesh(
    new THREE.RingGeometry(0.40, 0.445, 56),
    new THREE.MeshBasicMaterial({ color: 0xFFE3B3, side: THREE.DoubleSide })
  );
  mirrorHalo.position.set(0.84, 1.48, -1.072);

  const mirrorTex = createMirrorReflectionTexture();
  const mirrorGlass = new THREE.Mesh(
    new THREE.CircleGeometry(0.405, 56),
    new THREE.MeshPhysicalMaterial({
      map: mirrorTex,
      metalness: 0.45,
      roughness: 0.04,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      envMapIntensity: 2.1
    })
  );
  mirrorGlass.position.set(0.84, 1.48, -1.066);

  const mirrorRim = new THREE.Mesh(new THREE.TorusGeometry(0.408, 0.012, 14, 56), brassMat);
  mirrorRim.position.set(0.84, 1.48, -1.063);

  // Tempered Glass Screen with Crisp Green-Tint Edge & Brushed Brass Clamps
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xDCEAE4,
    transparent: true,
    opacity: 0.28,
    roughness: 0.05,
    metalness: 0.08,
    reflectivity: 0.95,
    envMapIntensity: 1.9
  });
  const glassWall = new THREE.Mesh(new THREE.BoxGeometry(0.03, 2.12, 1.28), glassMat);
  glassWall.position.set(0.04, 0.88, -0.44);

  const glassEdgeMat = new THREE.MeshBasicMaterial({ color: 0x6F9E8F, transparent: true, opacity: 0.8 });
  const glassEdgeFront = new THREE.Mesh(new THREE.BoxGeometry(0.032, 2.12, 0.012), glassEdgeMat);
  glassEdgeFront.position.set(0.04, 0.88, 0.2);
  const glassEdgeTop = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.012, 1.28), glassEdgeMat);
  glassEdgeTop.position.set(0.04, 1.94, -0.44);

  const glassChannel = new THREE.Mesh(new THREE.BoxGeometry(0.048, 2.13, 0.036), brassMat);
  glassChannel.position.set(0.04, 0.88, -1.08);
  const glassClampFloor = new THREE.Mesh(new THREE.BoxGeometry(0.058, 0.052, 0.085), brassMat);
  glassClampFloor.position.set(0.04, -0.16, 0.14);
  const glassStabilizerBar = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 1.38, 16), brassMat);
  glassStabilizerBar.rotation.z = Math.PI / 2;
  glassStabilizerBar.position.set(-0.65, 1.91, 0.12);

  const glassGroup = new THREE.Group();
  glassGroup.add(glassWall, glassEdgeFront, glassEdgeTop, glassChannel, glassClampFloor, glassStabilizerBar);

  floorTileGroup.add(drainGroup);
  backTileGroup.add(nicheFrame, nicheLed, bottleA, bottleNeckA, bottleB, vanityGroup, mirrorHalo, mirrorGlass, mirrorRim);
  sideTileGroup.add(wallFlange, showerArm, showerHead, showerNozzleFace, mixerPlate, dialTop, dialBot);
  layerTile.add(floorTileGroup, backTileGroup, sideTileGroup, glassGroup);

  pavilion.add(layerBase, layerMembrane, layerAdhesive, layerTile);

  // ── Explode & Camera State (True Surface-Normal Explosion — Zero Corner Clashes!)
  let explodeAmount = 0.0;
  let targetExplode = 0.0;
  let pointerX = 0;
  let pointerY = 0;
  let smoothPX = 0;
  let smoothPY = 0;
  let isVisible = true;
  let needsRender = true;

  function applyExplode(t) {
    const e = Math.max(0, Math.min(1, t));
    // Floor Stack along Y (Estrich -> DIN 18534 -> Kammbett & Clips -> XXL Stone)
    floorScreed.position.y = -0.45 - 0.34 * e;
    floorMembrane.position.y = -0.34 - 0.12 * e;
    floorAdhesive.position.y = -0.28 + 0.09 * e;
    adhesiveClipsGroup.position.y = 0.09 * e;
    floorTileGroup.position.y = 0.34 * e;

    // Back Wall Stack along Z (GKBI -> DIN 18534 -> Kammbett -> XXL Stone & Vanity)
    backDrywall.position.z = -1.34 - 0.32 * e;
    backMembrane.position.z = -1.24 - 0.12 * e;
    backAdhesive.position.z = -1.18 + 0.08 * e;
    adhesiveRidgesGroup.position.z = 0.08 * e;
    backTileGroup.position.z = 0.32 * e;

    // Side Wall Stack along X (GKBI -> DIN 18534 -> Kammbett -> XXL Stone & Shower)
    sideDrywall.position.x = -1.59 - 0.32 * e;
    sideMembrane.position.x = -1.49 - 0.12 * e;
    sideAdhesive.position.x = -1.43 + 0.08 * e;
    sideTileGroup.position.x = 0.32 * e;

    // Corner Sealing Band + Frameless Glass stay flush with back wall along +Z
    cornerBand.position.set(-1.44 - 0.12 * e, 0.94, -1.19 - 0.12 * e);
    glassGroup.position.set(0.14 * e, 0.24 * e, 0.32 * e);

    pavilion.rotation.y = -0.5 + e * 0.32 + smoothPX * (isMobile ? 0 : 0.14);
    pavilion.rotation.x = 0.03 + smoothPY * (isMobile ? 0 : 0.06);
  }

  function resize() {
    const container = document.getElementById('canvasContainer');
    if (!container) return;
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    const aspect = w / h;
    camera.aspect = aspect;
    // Dynamically match vertical framing on portrait containers so model fills cleanly without empty vertical void
    camera.fov = aspect < 0.9 ? 23.8 : 26;
    if (aspect < 0.9) {
      camera.position.set(6.75, 4.62, 7.72);
    } else {
      camera.position.set(6.28, 4.24, 7.18);
    }
    camera.lookAt(0, 0.5, 0);
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    needsRender = true;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  if (!isMobile) {
    window.addEventListener('pointermove', (e) => {
      pointerX = (e.clientX / window.innerWidth - 0.5) * 2;
      pointerY = (e.clientY / window.innerHeight - 0.5) * 2;
      needsRender = true;
    }, { passive: true });
  }

  const layerPills = document.querySelectorAll('.layer-pill');
  const stepTitle = document.getElementById('scrollyStepTitle');
  const stepDesc = document.getElementById('scrollyStepDesc');
  const LAYER_COPY = [
    {
      title: '1. Tragwerk & Gefälle-Estrich',
      desc: 'Feuchtraum-GKBI-Platten und lasergenauer Gefälle-Estrich bilden die absolut ebene Basis ohne Hohllagen.'
    },
    {
      title: '2. DIN 18534 Verbundabdichtung',
      desc: 'Dichtbahn, Eckdichtbänder und Rohrmanschetten schützen die Bausubstanz dauerhaft vor Feuchtigkeit.'
    },
    {
      title: '3. Kammbett & Nivelliersystem',
      desc: 'Flexmörtel im Buttering-Floating-Verfahren garantiert 100 % Benetzung und exakt 1,5 mm schmale Fugen.'
    },
    {
      title: '4. XXL-Keramik & Messing-Finish',
      desc: 'Großformatiges Feinsteinzeug bis 120×260 cm mit auf Gehrung geschliffenen Kanten und bündiger Duschrinne.'
    }
  ];

  function updateLayerUI(progress) {
    let idx = 0;
    if (progress > 0.72) idx = 3;
    else if (progress > 0.45) idx = 2;
    else if (progress > 0.2) idx = 1;

    layerPills.forEach((pill, i) => pill.classList.toggle('active', i === idx));
    if (stepTitle && stepDesc) {
      stepTitle.textContent = LAYER_COPY[idx].title;
      stepDesc.textContent = LAYER_COPY[idx].desc;
    }
  }

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.create({
      trigger: '#scrollyStage',
      start: 'top bottom',
      end: 'bottom top',
      onToggle: (self) => { isVisible = self.isActive; }
    });

    ScrollTrigger.create({
      trigger: '#scrollyStage',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.4,
      onUpdate: (self) => {
        const p = self.progress;
        const wave = p < 0.6 ? (p / 0.6) : (1 - (p - 0.6) / 0.4);
        targetExplode = Math.max(0, Math.min(1, wave));
        needsRender = true;
        const slider = document.getElementById('explodeSlider');
        const valEl = document.getElementById('explodePct');
        if (slider) slider.value = Math.round(targetExplode * 100);
        if (valEl) valEl.textContent = `${Math.round(targetExplode * 100)} %`;
        updateLayerUI(p);
      }
    });

    gsap.ticker.add(() => {
      if (!isVisible) return;
      const dE = targetExplode - explodeAmount;
      const dX = pointerX - smoothPX;
      const dY = pointerY - smoothPY;
      if (!needsRender && Math.abs(dE) < 0.0008 && Math.abs(dX) < 0.001 && Math.abs(dY) < 0.001) return;
      explodeAmount += dE * 0.18;
      smoothPX += dX * 0.12;
      smoothPY += dY * 0.12;
      if (Math.abs(dE) < 0.0008) explodeAmount = targetExplode;
      applyExplode(explodeAmount);
      renderer.render(scene, camera);
      needsRender = Math.abs(targetExplode - explodeAmount) >= 0.0008;
    });
  } else {
    applyExplode(0.5);
    renderer.render(scene, camera);
  }

  window.__setTileMaterial = function (key) {
    const preset = PRESETS[key];
    if (!preset) return;
    const maps = createStoneMaps(preset);
    if (tileMat.map) tileMat.map.dispose();
    if (tileMat.normalMap) tileMat.normalMap.dispose();
    if (tileMat.roughnessMap) tileMat.roughnessMap.dispose();
    tileMat.map = maps.map;
    tileMat.normalMap = maps.normal;
    tileMat.roughnessMap = maps.rough;
    tileMat.needsUpdate = true;
    groutMat.color.setHex(preset.grout);
    needsRender = true;

    document.querySelectorAll('[data-mat]').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.mat === key);
    });
    renderer.render(scene, camera);
  };

  window.__cookSetExplode = function (t) {
    targetExplode = t;
    explodeAmount = t;
    applyExplode(t);
    isVisible = true;
    needsRender = false;
    renderer.render(scene, camera);
  };

  const explodeSlider = document.getElementById('explodeSlider');
  if (explodeSlider) {
    explodeSlider.addEventListener('input', (e) => {
      const val = Number(e.target.value) / 100;
      targetExplode = val;
      needsRender = true;
      const pctEl = document.getElementById('explodePct');
      if (pctEl) pctEl.textContent = `${e.target.value} %`;
      updateLayerUI(val * 0.6);
    }, { passive: true });
  }

  layerPills.forEach((pill, index) => {
    pill.addEventListener('click', () => {
      const targets = [0.05, 0.45, 0.85, 0.15];
      targetExplode = targets[index];
      needsRender = true;
      const pctEl = document.getElementById('explodePct');
      if (explodeSlider) explodeSlider.value = Math.round(targetExplode * 100);
      if (pctEl) pctEl.textContent = `${Math.round(targetExplode * 100)} %`;
      layerPills.forEach((p, i) => p.classList.toggle('active', i === index));
      if (stepTitle && stepDesc) {
        stepTitle.textContent = LAYER_COPY[index].title;
        stepDesc.textContent = LAYER_COPY[index].desc;
      }
    });
  });

  applyExplode(0.35);
  renderer.render(scene, camera);
})();
