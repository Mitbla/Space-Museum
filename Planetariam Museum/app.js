// Virtual Planetarium Museum - stable vanilla Three.js setup

window.addEventListener('DOMContentLoaded', async () => {
  const infoEl = document.getElementById('info');

  if (!window.THREE) {
    infoEl.textContent = 'Three.js failed to load. Check internet connection and reload.';
    return;
  }

  const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js');
  const gltfLoader = new GLTFLoader();

  const textureLoader = new THREE.TextureLoader();

  const mercuryPic = new Image();
  mercuryPic.src = '../mercury_premium_1773689140406.png';
  await new Promise(res => { mercuryPic.onload = res; mercuryPic.onerror = res; });

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x89b9ee);

  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 1.7, 12);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  document.body.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 0.48));
  const keyLight = new THREE.DirectionalLight(0xffffff, 0.9);
  keyLight.position.set(8, 14, 6);
  scene.add(keyLight);

  // Sky features: sun + clouds
  const sun = new THREE.Mesh(
    new THREE.SphereGeometry(2.8, 28, 28),
    new THREE.MeshBasicMaterial({ color: 0xffdf7a })
  );
  sun.position.set(18, 32, -30);
  scene.add(sun);

  const sunHalo = new THREE.Mesh(
    new THREE.SphereGeometry(3.8, 24, 24),
    new THREE.MeshBasicMaterial({ color: 0xfff1b0, transparent: true, opacity: 0.3 })
  );
  sunHalo.position.copy(sun.position);
  scene.add(sunHalo);

  const sunLight = new THREE.DirectionalLight(0xfff0cf, 0.5);
  sunLight.position.copy(sun.position);
  scene.add(sunLight);

  function createCloudTexture() {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 128;
    const ctx = c.getContext('2d');

    ctx.clearRect(0, 0, c.width, c.height);
    const puffs = [
      [58, 74, 34],
      [94, 58, 42],
      [132, 70, 38],
      [168, 64, 32],
      [110, 82, 36],
    ];

    for (const puff of puffs) {
      const grad = ctx.createRadialGradient(puff[0], puff[1], 3, puff[0], puff[1], puff[2]);
      grad.addColorStop(0, 'rgba(255,255,255,0.92)');
      grad.addColorStop(1, 'rgba(255,255,255,0.0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(puff[0], puff[1], puff[2], 0, Math.PI * 2);
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  const cloudTex = createCloudTexture();
  for (let i = 0; i < 18; i++) {
    const cloud = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: cloudTex, transparent: true, opacity: 0.7, depthWrite: false })
    );
    cloud.position.set(
      -34 + Math.random() * 68,
      20 + Math.random() * 14,
      -34 + Math.random() * 56
    );
    const s = 4 + Math.random() * 5;
    cloud.scale.set(s * 1.8, s, 1);
    scene.add(cloud);
  }

  // Floor system setup
  const FLOOR_COUNT = 8;
  const FLOOR_HEIGHT = 3.2;
  const EYE_HEIGHT = 1.7;

  function getFloorY(floorNumber) {
    return (floorNumber - 1) * FLOOR_HEIGHT;
  }

  function getCameraYForFloor(floorNumber) {
    return getFloorY(floorNumber) + EYE_HEIGHT;
  }

  // Collision + interior helpers (must be declared before any use)
  const PLAYER_RADIUS = 0.32;
  const staticColliders = [];
  const elevatorColliders = [];
  const interiorDoors = [];

  function addAabbCollider(centerX, centerY, centerZ, sizeX, sizeY, sizeZ) {
    staticColliders.push({
      minX: centerX - sizeX / 2,
      maxX: centerX + sizeX / 2,
      minY: centerY - sizeY / 2,
      maxY: centerY + sizeY / 2,
      minZ: centerZ - sizeZ / 2,
      maxZ: centerZ + sizeZ / 2,
    });
  }

  function addElevatorAabbCollider(centerX, centerY, centerZ, sizeX, sizeY, sizeZ) {
    elevatorColliders.push({
      minX: centerX - sizeX / 2,
      maxX: centerX + sizeX / 2,
      minY: centerY - sizeY / 2,
      maxY: centerY + sizeY / 2,
      minZ: centerZ - sizeZ / 2,
      maxZ: centerZ + sizeZ / 2,
    });
  }

  function pointInsideExpandedAabb(pos, aabb, expandXZ) {
    return (
      pos.x > aabb.minX - expandXZ &&
      pos.x < aabb.maxX + expandXZ &&
      pos.y > aabb.minY &&
      pos.y < aabb.maxY &&
      pos.z > aabb.minZ - expandXZ &&
      pos.z < aabb.maxZ + expandXZ
    );
  }

  // Procedural brick texture for outside walls
  function createBrickTexture() {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 256;
    const ctx = c.getContext('2d');

    ctx.fillStyle = '#8e4f37';
    ctx.fillRect(0, 0, c.width, c.height);

    const brickW = 42;
    const brickH = 20;
    for (let y = 0; y < c.height; y += brickH) {
      const offset = ((y / brickH) % 2) * (brickW / 2);
      for (let x = -brickW; x < c.width + brickW; x += brickW) {
        ctx.fillStyle = '#9f5c41';
        ctx.fillRect(x + offset, y, brickW - 2, brickH - 2);
      }
    }

    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    for (let i = 0; i < 350; i++) {
      const px = Math.random() * c.width;
      const py = Math.random() * c.height;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px + 1.5, py + 1.5);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(6, 6);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  // Procedural black/silver/gold marble floor texture
  function createMarbleTexture() {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 512;
    const ctx = c.getContext('2d');

    // Dark base
    ctx.fillStyle = '#0d0f14';
    ctx.fillRect(0, 0, c.width, c.height);

    // Subtle silver clouding
    for (let i = 0; i < 1400; i++) {
      const x = Math.random() * c.width;
      const y = Math.random() * c.height;
      const r = 8 + Math.random() * 26;
      const a = 0.01 + Math.random() * 0.03;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(205,210,220,${a.toFixed(3)})`);
      g.addColorStop(1, 'rgba(205,210,220,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Silver veins
    ctx.lineCap = 'round';
    for (let i = 0; i < 42; i++) {
      const sx = Math.random() * c.width;
      const sy = Math.random() * c.height;
      const ex = sx + (Math.random() - 0.5) * 220;
      const ey = sy + (Math.random() - 0.5) * 220;
      ctx.strokeStyle = `rgba(205,210,220,${(0.18 + Math.random() * 0.24).toFixed(2)})`;
      ctx.lineWidth = 0.6 + Math.random() * 2.1;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.bezierCurveTo(
        sx + (Math.random() - 0.5) * 120,
        sy + (Math.random() - 0.5) * 120,
        ex + (Math.random() - 0.5) * 120,
        ey + (Math.random() - 0.5) * 120,
        ex,
        ey
      );
      ctx.stroke();
    }

    // Gold accent veins
    for (let i = 0; i < 20; i++) {
      const sx = Math.random() * c.width;
      const sy = Math.random() * c.height;
      const ex = sx + (Math.random() - 0.5) * 180;
      const ey = sy + (Math.random() - 0.5) * 180;
      ctx.strokeStyle = `rgba(212,170,76,${(0.24 + Math.random() * 0.28).toFixed(2)})`;
      ctx.lineWidth = 0.8 + Math.random() * 1.9;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.quadraticCurveTo(
        sx + (Math.random() - 0.5) * 110,
        sy + (Math.random() - 0.5) * 110,
        ex,
        ey
      );
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(8, 8);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  const marbleTex = createMarbleTexture();

  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(45, 96),
    new THREE.MeshStandardMaterial({
      map: marbleTex,
      color: 0xffffff,
      roughness: 0.48,
      metalness: 0.18,
    })
  );
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  const buildingHeight = FLOOR_COUNT * FLOOR_HEIGHT + 2.2;
  const wallThickness = 0.32;
  const halfWallThickness = wallThickness / 2;

  // Museum wall bounds used to cut away any dome surface that falls inside the building volume.
  // Keep only the shell that is outside the walls.
  const museumBounds = {
    minX: -5.0 + halfWallThickness,
    maxX: 13.0 - halfWallThickness,
    minY: 0.0,
    maxY: buildingHeight,
    minZ: -13.0 + halfWallThickness,
    maxZ: 1.0 - halfWallThickness,
  };

  function pointInsideMuseumBounds(x, y, z) {
    return (
      x > museumBounds.minX &&
      x < museumBounds.maxX &&
      y > museumBounds.minY &&
      y < museumBounds.maxY &&
      z > museumBounds.minZ &&
      z < museumBounds.maxZ
    );
  }

  function createOutsideOnlyHemisphereGeometry(radius, widthSegments, heightSegments, center) {
    const geometry = new THREE.SphereGeometry(
      radius,
      widthSegments,
      heightSegments,
      0,
      Math.PI * 2,
      0,
      Math.PI / 2
    );

    const positions = geometry.attributes.position;
    const sourceIndex = geometry.index.array;
    const filteredIndex = [];

    for (let i = 0; i < sourceIndex.length; i += 3) {
      const ia = sourceIndex[i];
      const ib = sourceIndex[i + 1];
      const ic = sourceIndex[i + 2];

      const ax = positions.getX(ia) + center.x;
      const ay = positions.getY(ia) + center.y;
      const az = positions.getZ(ia) + center.z;
      const bx = positions.getX(ib) + center.x;
      const by = positions.getY(ib) + center.y;
      const bz = positions.getZ(ib) + center.z;
      const cx = positions.getX(ic) + center.x;
      const cy = positions.getY(ic) + center.y;
      const cz = positions.getZ(ic) + center.z;

      const aInside = pointInsideMuseumBounds(ax, ay, az);
      const bInside = pointInsideMuseumBounds(bx, by, bz);
      const cInside = pointInsideMuseumBounds(cx, cy, cz);

      // Remove any triangle that enters the interior wall volume,
      // so the remaining outside half matches wall edges cleanly.
      if (!aInside && !bInside && !cInside) {
        filteredIndex.push(ia, ib, ic);
      }
    }

    geometry.setIndex(filteredIndex);
    geometry.computeVertexNormals();
    return geometry;
  }

  // Parking lot
  const parking = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 12),
    new THREE.MeshStandardMaterial({ color: 0x2f333a, roughness: 0.95 })
  );
  parking.rotation.x = -Math.PI / 2;
  parking.position.set(2, 0.01, 18);
  scene.add(parking);

  const parkingLineMat = new THREE.LineBasicMaterial({ color: 0xd9d9d9 });
  for (let i = -4; i <= 4; i += 2) {
    const geom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(i, 0.03, 13),
      new THREE.Vector3(i, 0.03, 23),
    ]);
    scene.add(new THREE.Line(geom, parkingLineMat));
  }

  const domeCenter = new THREE.Vector3(-3.5, 0.2, -3);
  const domeShellGeometry = createOutsideOnlyHemisphereGeometry(9, 48, 32, domeCenter);

  // White exterior
  const domeExterior = new THREE.Mesh(
    domeShellGeometry,
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.0,
      roughness: 0.95,
      side: THREE.FrontSide,
    })
  );
  domeExterior.position.copy(domeCenter);
  scene.add(domeExterior);

  // Keep interior appearance dark
  const domeInterior = new THREE.Mesh(
    domeShellGeometry,
    new THREE.MeshStandardMaterial({
      color: 0x05070f,
      metalness: 0.0,
      roughness: 1.0,
      side: THREE.BackSide,
    })
  );
  domeInterior.position.copy(domeCenter);
  scene.add(domeInterior);

  // Star dots inside the sphere
  const starMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  for (let i = 0; i < 320; i++) {
    const phi = Math.random() * Math.PI * 2;
    const theta = Math.random() * (Math.PI / 2);
    const r = 8.55;
    const sx = domeCenter.x + r * Math.cos(phi) * Math.cos(theta);
    const sy = domeCenter.y + r * Math.sin(theta);
    const sz = domeCenter.z + r * Math.sin(phi) * Math.cos(theta);

    if (pointInsideMuseumBounds(sx, sy, sz)) {
      continue;
    }

    const star = new THREE.Mesh(new THREE.SphereGeometry(0.045, 6, 6), starMat);
    star.position.set(sx, sy, sz);
    scene.add(star);
  }

  const brickTexture = createBrickTexture();

  const brickMat = new THREE.MeshStandardMaterial({
    map: brickTexture,
    roughness: 0.9,
    metalness: 0.05,
  });

  function addBrickWall(x, y, z, sx, sy, sz) {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), brickMat);
    wall.position.set(x, y, z);
    scene.add(wall);
  }

  // Exterior shell with real entrance opening in front wall
  addBrickWall(4, buildingHeight / 2, -13.0, 18, buildingHeight, 0.32); // back
  // Left wall split to create interior doorway to sphere
  addBrickWall(-5.0, buildingHeight / 2, -10.3, 0.32, buildingHeight, 5.4);
  addBrickWall(-5.0, buildingHeight / 2, -1.7, 0.32, buildingHeight, 5.4);
  addBrickWall(-5.0, (3.5 + buildingHeight) / 2, -6.0, 0.32, buildingHeight - 3.5, 3.2);
  addBrickWall(13.0, buildingHeight / 2, -6.0, 0.32, buildingHeight, 14); // right
  addBrickWall(1.8, buildingHeight / 2, 1.0, 13.6, buildingHeight, 0.32); // front left section
  addBrickWall(12.45, buildingHeight / 2, 1.0, 1.1, buildingHeight, 0.32); // front right section

  // Lintel above entrance opening
  const entranceOpeningTopY = 4.2;
  addBrickWall(
    10.25,
    (entranceOpeningTopY + buildingHeight) / 2,
    1.0,
    3.3,
    buildingHeight - entranceOpeningTopY,
    0.32
  );

  // Roof cap
  addBrickWall(4, buildingHeight + 0.16, -6.0, 18, 0.32, 14);

  // Exterior collision shell with front entrance opening
  const wallY = buildingHeight / 2;
  const wallH = buildingHeight;
  addAabbCollider(4, wallY, -13.0, 18, wallH, 0.25); // back wall
  // Left wall split with doorway opening to sphere
  addAabbCollider(-5.0, wallY, -10.3, 0.25, wallH, 5.4);
  addAabbCollider(-5.0, wallY, -1.7, 0.25, wallH, 5.4);
  addAabbCollider(-5.0, (3.5 + wallH) / 2, -6.0, 0.25, wallH - 3.5, 3.2);
  addAabbCollider(13.0, wallY, -6.0, 0.25, wallH, 14); // right wall
  addAabbCollider(1.8, wallY, 1.0, 13.6, wallH, 0.25); // front wall left section
  addAabbCollider(12.45, wallY, 1.0, 1.1, wallH, 0.25); // front wall right section

  // Interior floor slabs (8 floors)
  const slabMat = new THREE.MeshStandardMaterial({
    map: marbleTex,
    color: 0xffffff,
    roughness: 0.52,
    metalness: 0.14,
  });
  const slabSizeX = museumBounds.maxX - museumBounds.minX + 0.04;
  const slabSizeZ = museumBounds.maxZ - museumBounds.minZ + 0.04;
  const secondFloorFrontCutDepth = 3.2;
  for (let f = 1; f <= FLOOR_COUNT; f++) {
    let slabDepth = slabSizeZ;
    let slabZ = -6;

    // Pull back floor 2 from the front-door side to create an overlook to floor 1.
    if (f === 2) {
      slabDepth = slabSizeZ - secondFloorFrontCutDepth;
      slabZ = -6 - secondFloorFrontCutDepth / 2;
    }

    const slab = new THREE.Mesh(new THREE.BoxGeometry(slabSizeX, 0.16, slabDepth), slabMat);
    slab.position.set(4, getFloorY(f), slabZ);
    scene.add(slab);
  }

  // Second-floor overlook railings
  const railingPostMat = new THREE.MeshStandardMaterial({ color: 0x6f7a86, roughness: 0.45, metalness: 0.55 });
  const railingTopMat = new THREE.MeshStandardMaterial({ color: 0xaeb8c3, roughness: 0.35, metalness: 0.65 });
  const secondFloorY = getFloorY(2);
  const openingEdgeZ = museumBounds.maxZ - secondFloorFrontCutDepth;
  const railTopY = secondFloorY + 1.1;

  function addRailingLine(start, end, postCount) {
    const span = end.clone().sub(start);
    const length = span.length();
    const mid = start.clone().add(end).multiplyScalar(0.5);
    const angleY = Math.atan2(span.x, span.z);

    const topRail = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, length), railingTopMat);
    topRail.position.set(mid.x, railTopY, mid.z);
    topRail.rotation.y = angleY;
    scene.add(topRail);

    for (let i = 0; i < postCount; i++) {
      const t = postCount === 1 ? 0 : i / (postCount - 1);
      const px = THREE.MathUtils.lerp(start.x, end.x, t);
      const pz = THREE.MathUtils.lerp(start.z, end.z, t);
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.02, 0.06), railingPostMat);
      post.position.set(px, secondFloorY + 0.58, pz);
      scene.add(post);
    }
  }

  // Main front opening guard rail
  addRailingLine(
    new THREE.Vector3(museumBounds.minX + 0.45, secondFloorY, openingEdgeZ),
    new THREE.Vector3(museumBounds.maxX - 0.45, secondFloorY, openingEdgeZ),
    14
  );

  // Collision bar for the front overlook railing so player cannot walk through it.
  addAabbCollider(
    4,
    secondFloorY + 1.05,
    openingEdgeZ,
    slabSizeX - 0.95,
    2.2,
    0.22
  );

  // Planet floors: 1=Mercury ... 8=Neptune
  const planetExhibits = [];
  const infoCardTargets = [];
  const planetData = [
    {
      name: 'Mercury',
      color: 0xa7a39a,
      radius: 0.42,
      fact: 'Closest planet to the Sun. A year is only 88 Earth days.',
    },
    {
      name: 'Venus',
      color: 0xd9b17a,
      radius: 0.55,
      fact: 'Hottest planet due to a dense CO2 atmosphere and runaway greenhouse effect.',
    },
    {
      name: 'Earth',
      color: 0x4f91d7,
      radius: 0.58,
      fact: 'Only known world with stable surface liquid water and life.',
    },
    {
      name: 'Mars',
      color: 0xbe6c48,
      radius: 0.5,
      fact: 'Known as the red planet; home to Olympus Mons, the largest volcano.',
    },
    {
      name: 'Jupiter',
      color: 0xcba47a,
      radius: 0.92,
      fact: 'Largest planet in the Solar System with a giant storm called the Great Red Spot.',
    },
    {
      name: 'Saturn',
      color: 0xd8c38d,
      radius: 0.82,
      fact: 'Famous for spectacular rings made mostly of ice and rock particles.',
    },
    {
      name: 'Uranus',
      color: 0x8fd8e8,
      radius: 0.7,
      fact: 'An ice giant that rotates on its side, likely due to an ancient collision.',
    },
    {
      name: 'Neptune',
      color: 0x4d74dc,
      radius: 0.7,
      fact: 'Farthest major planet from the Sun, with extremely fast winds.',
    },
  ];

  const planetLoreCards = {
    'Mercury': [
      {
        title: 'Card 1: The Smallest & Fastest',
        dangerous: false,
        body: 'The Smallest: Mercury is the smallest planet in our solar system—only slightly larger than Earth\'s Moon. If Earth were the size of a nickel, Mercury would be about the size of a blueberry.\n\nThe Fastest Orbit: It is the fastest planet, traveling through space at nearly 47 km/s (107,000 mph). It completes a full trip around the Sun in just 88 Earth days.\n\nA "Year" is Shorter Than a "Day": While its year is 88 days, Mercury rotates so slowly that one full day-night cycle (a solar day) takes 176 Earth days.',
      },
      {
        title: 'Card 2: A Surface of Scars',
        dangerous: false,
        body: 'Moon-like Appearance: To the naked eye, Mercury looks almost exactly like our Moon. It is covered in thousands of impact craters from meteoroids and comets.\n\nThe Shrinking Planet: Mercury has a massive iron core that makes up about 85% of its radius. As this core cools, it is actually shrinking, causing the planet\'s crust to wrinkle and create massive cliffs called "lobate scarps" that are hundreds of miles long.\n\nWater Ice: Surprisingly, despite being so close to the Sun, NASA\'s MESSENGER mission found water ice in deep craters at the poles.',
      },
      {
        title: 'Card 3: The Ghostly Atmosphere',
        dangerous: false,
        body: 'The Exosphere: Mercury doesn\'t have a thick atmosphere like Earth. Instead, it has a thin "exosphere" made of atoms blasted off its surface by solar winds and meteoroid strikes.\n\nNo Protection: Because it lacks a proper atmosphere, the sky on Mercury always looks black, even during the day. There is also no weather—no wind, rain, or clouds.\n\nThe Sodium Tail: Solar radiation actually pushes atoms from the exosphere away from the planet, creating a faint, comet-like tail that stretches for millions of miles.',
      },
      {
        title: 'Card 4: Dangerous Temperature Swings',
        dangerous: true,
        body: 'The Solar System\'s Biggest Mood Swings: Mercury has the most extreme temperature fluctuations of any planet.\n\nDaytime: During the day, temperatures reach a scorching 430°C (800°F)—hot enough to melt lead.\n\nNighttime: Because there is no atmosphere to trap heat, the temperature plummets to -180°C (-290°F) at night.\n\nFatal Radiation: Being the closest planet to the Sun means Mercury is bombarded by intense solar radiation and high-energy particles.',
      },
      {
        title: 'Card 5: Magnetic Tornadoes',
        dangerous: true,
        body: 'Magnetic Storms: Despite its small size, Mercury has a magnetic field. When this field interacts with the solar wind, it creates "magnetic tornadoes"—funnels of hot, plasma-filled gas that are channeled directly down to the planet\'s surface.\n\nAtmospheric Erosion: These tornadoes are so powerful they actually strip atoms off the planet\'s surface, contributing to the thin exosphere.\n\nNo Shield: Unlike Earth’s strong magnetic field which protects us, Mercury’s field is 100 times weaker, leaving the surface exposed.',
      }
    ],
    'Venus': [
      {
        title: 'Card 1: Earth\'s Evil Twin',
        dangerous: false,
        body: 'Similar Size and Structure: Venus is often called Earth’s twin because they are incredibly similar in size, mass, and bulk composition.\n\nReverse Rotation: Venus spins in the opposite direction from most other planets, which means the sun rises in the west and sets in the east.\n\nExtremely Long Days: A single day on Venus (one rotation) takes 243 Earth days—longer than its entire year (225 Earth days)!',
      },
      {
        title: 'Card 2: The Brightest Planet',
        dangerous: false,
        body: 'Reflective Clouds: Venus is the second-brightest natural object in the night sky (after the Moon) because it is completely covered by thick, highly reflective clouds of sulfuric acid.\n\nPhases: Like our Moon, Venus goes through phases—from a thin crescent to full—which can be easily observed from Earth with a telescope.\n\nSurface Mapping: Because of the thick cloud cover, we couldn\'t see the surface until radar technology pierced the veil, revealing a volcanic landscape.',
      },
      {
        title: 'Card 3: A Volcanic Landscape',
        dangerous: false,
        body: 'Tens of Thousands of Volcanoes: Venus has more volcanoes than any other planet. While many are extinct, some recent evidence suggests a few may still be active.\n\nLava Plains: Most of the surface consists of gently rolling volcanic plains.\n\nNo Tectonic Plates: Unlike Earth, Venus lacks plate tectonics. Instead, heat builds up until the crust occasionally undergoes massive, planet-wide resurfacing events.',
      },
      {
        title: 'Card 4: The Runaway Greenhouse',
        dangerous: true,
        body: 'The Hottest Planet: Despite being further from the Sun than Mercury, Venus is significantly hotter. Its thick carbon dioxide atmosphere traps heat in a massive runaway greenhouse effect.\n\nLead-Melting Heat: Surface temperatures sit at a constant 475°C (900°F) day and night—hot enough to melt lead and zinc instantly.\n\nNo Escape: There is zero respite from the heat anywhere on the planet; the dense atmosphere distributes thermal energy uniformly across the globe.',
      },
      {
        title: 'Card 5: Crushing Acidic Depths',
        dangerous: true,
        body: 'Immense Atmospheric Pressure: The atmosphere is so heavy that standing on the surface of Venus feels like being roughly 1 mile (1.6 km) underwater on Earth.\n\nAcid Rain: The skies rain down highly corrosive sulfuric acid. Interestingly, it is so hot that the acid rain evaporates before it ever hits the ground.\n\nEquipment Destruction: Probes sent to the surface have only survived for a matter of hours before being crushed, melted, or corroded.',
      }
    ],
    'Earth': [
      {
        title: 'Card 1: The Blue Marble',
        dangerous: false,
        body: 'Our Home: Earth is the third planet from the Sun and the only astronomical object known to harbor life.\n\nAbundant Water: About 71% of Earth\'s surface is covered by liquid water, earning it the nickname "The Blue Marble." This liquid water is the critical solvent for all known life.\n\nDynamic Tectonics: Earth is the only planet known to have active plate tectonics, which constantly recycles the crust and creates mountains, earthquakes, and newly shaped continents over time.',
      },
      {
        title: 'Card 2: The Perfect Atmosphere',
        dangerous: false,
        body: 'Life-Sustaining Mix: Earth\'s atmosphere consists primarily of nitrogen (78%) and oxygen (21%), creating the exact perfect balance for complex respiration.\n\nTemperature Regulation: The atmosphere acts as a vital blanket, keeping the planet warm enough for liquid water without triggering a runaway greenhouse effect like Venus.\n\nOzone Protection: The higher ozone layer specifically absorbs the majority of the Sun\'s dangerous ultraviolet radiation, protecting the surface.',
      },
      {
        title: 'Card 3: A Magnetic Shield',
        dangerous: false,
        body: 'The Magnetosphere: The rapid spinning of Earth\'s molten iron core generates a massive magnetic field that extends into space.\n\nDeflecting Solar Winds: This unseen shield deflects the constant bombardment of charged particles from the solar wind. Without it, our atmosphere would be stripped away.\n\nAuroras: When some charged particles get trapped and funneled toward the magnetic poles, they collide with atmospheric gases, creating the beautiful Northern and Southern Lights.',
      },
      {
        title: 'Card 4: Seismic & Volcanic Risks',
        dangerous: true,
        body: 'Restless Ground: The very plate tectonics that make Earth dynamic also make it incredibly violent. As massive continental plates grind against each other, they generate catastrophic earthquakes.\n\nVolcanic Eruptions: Magma pressure under the crust constantly births volcanoes. While many are dormant, active eruptions can spew ash miles into the air, blocking sunlight and burying local biomes.\n\nTsunamis: Underwater seismic activity frequently displaces massive volumes of the ocean, triggering devastating tidal waves.',
      },
      {
        title: 'Card 5: Severe Atmospheric Weather',
        dangerous: true,
        body: 'Violent Storms: Because Earth\'s atmosphere is highly active and driven by solar heat and ocean currents, it produces incredibly destructive localized weather systems.\n\nHurricanes and Typhoons: Massive cyclonic storms form over warm oceans, capable of flattening coastlines with high winds and extreme flooding.\n\nTornadoes: Highly localized, extremely fierce atmospheric vortices can destroy physical structures instantly, demonstrating the raw power of Earth\'s environmental mechanics.',
      }
    ],
    'Mars': [
      {
        title: 'Card 1: The Red Planet',
        dangerous: false,
        body: 'Rusty Dust: Mars owes its striking red appearance to iron oxide (rust) widespread across its surface dust and rocks.\n\nA Cold Desert: Mars is a freezing, barren world. The average temperature is about -60°C (-80°F).\n\nTwo Moons: Mars is orbited by two tiny, irregularly shaped moons named Phobos and Deimos, which may be captured asteroids.',
      },
      {
        title: 'Card 2: Land of Extremes',
        dangerous: false,
        body: 'Olympus Mons: Mars features the largest volcano in the entire Solar System. Olympus Mons is roughly three times taller than Mount Everest!\n\nValles Marineris: The planet also hosts a massive canyon system that dwarfs the Grand Canyon. It stretches over 4,000 km (2,500 miles) long and can be up to 7 km (4 miles) deep.\n\nPolar Ice Caps: Like Earth, Mars has distinct polar ice caps. However, they are made of a combination of water ice and dry ice (frozen carbon dioxide).',
      },
      {
        title: 'Card 3: Evidence of Ancient Water',
        dangerous: false,
        body: 'Dry Riverbeds: Orbital imaging has revealed branching, dried-up river networks, deltas, and floodplains deeply carved into the Martian surface.\n\nMineral Clues: Rovers have discovered minerals like hematite and clays that only form in the prolonged presence of liquid water.\n\nA Warmer Past? These clues strongly suggest that billions of years ago, Mars had a thicker atmosphere and a much warmer climate, potentially capable of supporting microbial life before its magnetic field collapsed.',
      },
      {
        title: 'Card 4: Sub-Zero Radiation Desert',
        dangerous: true,
        body: 'No Magnetic Shield: Mars lost its global magnetic field billions of years ago. As a result, the surface is constantly pounded by dangerously high levels of solar and cosmic radiation.\n\nThin Atmosphere: The atmosphere is almost entirely (95%) carbon dioxide and is 100 times thinner than Earth\'s. It provides no protection from the cold or radiation.\n\nInstant Freezing: Liquid water cannot exist on the surface today. If you poured water, it would simultaneously boil and freeze due to the low pressure and extreme cold.',
      },
      {
        title: 'Card 5: Global Dust Storms',
        dangerous: true,
        body: 'Planet-Swallowing Storms: Because the air is so thin and dry, winds easily pick up the ultra-fine rusty dust.\n\nWeeks of Darkness: Once or twice a decade, regional storms grow so massive they essentially merge, engulfing the entire planet in a global dust storm that can last for weeks or months.\n\nSolar Blockage: During these events, the surface is plunged into deep shadow, making solar power generation almost impossible for landed equipment (which ultimately killed the Opportunity rover).',
      }
    ],
    'Jupiter': [
      {
        title: 'Card 1: The Gas Giant King',
        dangerous: false,
        body: 'Unmatched Size: Jupiter is the largest planet in our Solar System. It is more than twice as massive as all the other planets combined.\n\nNo Solid Surface: As a gas giant, Jupiter does not have a true surface. If you descended into it, the gas would just become denser and denser until it turned into a bizarre liquid metal.\n\nFastest Spinner: Despite its immense bulk, Jupiter rotates incredibly fast. A day on Jupiter takes only about 10 hours, which causes the planet to bulge noticeably at the equator.',
      },
      {
        title: 'Card 2: The Great Red Spot',
        dangerous: false,
        body: 'A Centuries-Old Cyclone: The most famous feature on Jupiter is the Great Red Spot—a colossal, persistent high-pressure storm.\n\nBigger Than Earth: This anticyclonic storm is so massive that the entire Earth could easily fit inside it.\n\nShrinking Over Time: While it has raged for at least 300 years (since telescopes first spotted it), modern observations show that the storm is actually slowly shrinking, though it remains a terrifying force of nature.',
      },
      {
        title: 'Card 3: A Mini Solar System',
        dangerous: false,
        body: 'Dozens of Moons: Jupiter essentially operates as its own miniature solar system, hosting over 90 known moons.\n\nThe Galilean Moons: The four largest (Io, Europa, Ganymede, and Callisto) were discovered by Galileo. Ganymede is actually larger than the planet Mercury!\n\nOcean Worlds: Europa is of intense interest to scientists because it hides a massive, global saltwater ocean beneath a thick crust of ice, making it one of the most likely places to find extraterrestrial microbial life.',
      },
      {
        title: 'Card 4: Lethal Radiation Belts',
        dangerous: true,
        body: 'The Ultimate Magnetosphere: Jupiter\'s magnetic field is a monstrous force—14 times stronger than Earth\'s and the most powerful planetary field in the Solar System.\n\nTrapped Death: This massive field traps highly charged particles, creating colossal radiation belts around the planet.\n\nInstant Fry: The radiation inside these belts is millions of times stronger than the lethal dose for a human. Any unshielded spacecraft—let alone organic life—entering this zone would be destroyed almost immediately.',
      },
      {
        title: 'Card 5: Atmospheric Crushing',
        dangerous: true,
        body: 'Violent Cloud Decks: The upper atmosphere is categorized into alternating bands of fast-moving winds (jets) traveling in opposite directions, causing intense turbulence and lightning strikes 1,000 times more powerful than Earth\'s.\n\nMetallic Hydrogen Depths: If you survived the upper winds, you would sink thousands of miles deep. The pressure becomes so intense it forces hydrogen gas to behave like a liquid metal.\n\nUltimate Pressure: The crushing weight of the atmosphere at the core equates to millions of times the atmospheric pressure at Earth\'s sea level.',
      }
    ],
    'Saturn': [
      {
        title: 'Card 1: The Jewel of the Solar System',
        dangerous: false,
        body: 'The Ringed Giant: Saturn is the second-largest planet, instantly recognizable by its dazzling, complex ring system.\n\nNearly buoyant: It is the only planet in our solar system with an average density less than water. Technically, if you had a bathtub big enough, Saturn would float!\n\nGas Composition: Like Jupiter, Saturn is a massive ball primarily made of hydrogen and helium, and it lacks a traditional solid surface.',
      },
      {
        title: 'Card 2: The Magnificent Rings',
        dangerous: false,
        body: 'Ice and Rock: The rings are not solid, but made of billions of individual chunks of water ice and rocky debris ranging in size from tiny dust grains to mountains.\n\nIncredibly Thin: While the ring system spans hundreds of thousands of miles wide, it is remarkably thin—in most places, it is only about 10 meters (30 feet) thick.\n\nShepherd Moons: Tiny moons orbit within the gaps of the rings. Their gravity acts like "shepherds," keeping the ring particles in sharp, organized bands.',
      },
      {
        title: 'Card 3: Fascinating Moons',
        dangerous: false,
        body: 'Titan: Saturn\'s largest moon, Titan, is larger than Mercury and is the only moon in the solar system with a thick, substantial atmosphere.\n\nLiquid Lakes: Titan actually has weather, rain, rivers, and lakes—but instead of water, they are filled with liquid methane and ethane!\n\nEnceladus: Another moon, Enceladus, shoots geysers of water ice out into space from a subsurface ocean, providing direct samples to orbiting spacecraft.',
      },
      {
        title: 'Card 4: Supersonic Hexagon Storm',
        dangerous: true,
        body: 'The North Pole Hexagon: Saturn hosts one of the most bizarre and dangerous atmospheric phenomena in the solar system—a persistent, massive six-sided jet stream at its north pole.\n\nMassive Scale: Each side of this geometric storm is wider than Earth.\n\nSupersonic Winds: The entire hexagonal structure rotates, fueled by churning atmospheric winds that blast continuously at over 320 km/h (200 mph) with no landmasses to slow them down.',
      },
      {
        title: 'Card 5: The Crushing Mantle',
        dangerous: true,
        body: 'Invisible Descent: Since there is no solid surface to land on, entering Saturn means just falling deeper and deeper into the gas.\n\nRising Temperatures: As you sink, the atmospheric pressure and heat radically increase. Deep inside the planet, the temperature reaches a searing 11,700°C (21,000°F).\n\nMetallic Core: Like Jupiter, the immense pressure eventually forces the hydrogen gas into a bizarre state of liquid metallic hydrogen, instantly crushing and completely disintegrating any physical object.',
      }
    ],
    'Uranus': [
      {
        title: 'Card 1: The Sideways Planet',
        dangerous: false,
        body: 'Extreme Tilt: Uranus is completely unique because it rotates on its side. Its equator is tilted by an astounding 98 degrees relative to its orbit.\n\nA Violent Past: Astronomers theorize that an Earth-sized impactor smashed into Uranus shortly after its formation, knocking the entire planet sideways.\n\nBizarre Seasons: Because of this tilt, each of its poles points almost directly at the Sun for 21 years at a time, plunging the other half of the planet into a multi-decade dark winter.',
      },
      {
        title: 'Card 2: An Ice Giant',
        dangerous: false,
        body: 'The Ice Giants: Unlike Jupiter and Saturn (gas giants), Uranus and Neptune are categorized as "ice giants."\n\nMantle Composition: Instead of mostly hydrogen and helium, the bulk of Uranus is a hot, dense fluid of "icy" materials—water, methane, and ammonia—wrapped around a small rocky core.\n\nThe Blue Hue: The methane gas in its upper atmosphere absorbs red light from the Sun and reflects blue and green light back into space, giving the planet its serene aquamarine color.',
      },
      {
        title: 'Card 3: Rings and Moons',
        dangerous: false,
        body: 'Vertical Rings: Because the planet is tipped on its side, the faint, dark ring system surrounding Uranus circles it vertically, resembling a bullseye from certain angles.\n\nLiterary Moons: Uranus has 27 known moons, but uniquely, almost all of them are named after characters from the works of William Shakespeare and Alexander Pope (e.g., Titania, Oberon, Miranda).\n\nMiranda\'s Scars: The moon Miranda looks like a jigsaw puzzle that was shattered and reassembled haphazardly, featuring deep canyons and towering ice cliffs.',
      },
      {
        title: 'Card 4: The Coldest Place',
        dangerous: true,
        body: 'Baffling Temperatures: Despite Neptune being further from the Sun, Uranus holds the absolute record for the coldest recorded temperature of any planet in the Solar System.\n\nThe Tropopause: The temperature in the lower atmosphere plummets to a bone-chilling -224°C (-371°F).\n\nMissing Heat: Uranus gives off almost no internal heat. For some unknown reason, it radiates very little energy back into space compared to the other giant planets, making it an insanely hostile, frozen deep-freeze.',
      },
      {
        title: 'Card 5: Ammonia and Diamond Rain',
        dangerous: true,
        body: 'Toxic Depths: Descending into Uranus means passing through thick clouds of highly toxic hydrogen sulfide—meaning the upper atmosphere smells deeply of rotten eggs.\n\nCrushing Ice Mantle: As you go deeper, the pressure of the slushy water-ammonia-methane ocean becomes unimaginable.\n\nDiamond Rain: Deep within the mantle, scientists calculate that the immense heat and pressure actually sever the carbon atoms out of the methane molecules, crystallizing them into diamonds that literally "rain" down toward the core.',
      }
    ],
    'Neptune': [
      {
        title: 'Card 1: The Deep Blue Giant',
        dangerous: false,
        body: 'The Furthest Planet: Since Pluto was reclassified, Neptune is the undisputed most distant major planet in our Solar System—about 30 times further from the Sun than Earth.\n\nMathematical Discovery: Neptune is the only planet located via mathematical prediction rather than empirical observation. Irregularities in Uranus\'s orbit led astronomers to predict where a disrupting gravity source must be hiding.\n\nVibrant Color: Like Uranus, its atmosphere contains a high amount of methane, masking its deep mantle and giving it a rich, striking azure blue color.',
      },
      {
        title: 'Card 2: A Captured Moon',
        dangerous: false,
        body: 'Triton: Neptune has 14 known moons, but the largest by far is Triton.\n\nRetrograde Orbit: Triton is entirely unique among large moons because it orbits Neptune backwards (retrograde) relative to the planet\'s rotation. This heavily suggests Triton wasn\'t formed with Neptune, but is actually a captured dwarf planet from the distant Kuiper Belt.\n\nCryovolcanism: Despite being wildly cold (-235°C), Triton is active, firing plumes of dark nitrogen gas and dust high into its thin atmosphere.',
      },
      {
        title: 'Card 3: Faint Arcs',
        dangerous: false,
        body: 'Clumpy Rings: Neptune has a faint ring system, but it doesn\'t look like Saturn’s smooth bands. \n\nRing Arcs: The outermost ring contains strange "arcs"—clumps where the dust and ice particles are concentrated much more thickly rather than spreading out evenly.\n\nGravity Shepherds: Astronomers believe the gravitational pull of a nearby tiny moon, Galatea, is responsible for keeping these unusual clumps from dispersing completely along the orbit.',
      },
      {
        title: 'Card 4: Fastest Winds in the System',
        dangerous: true,
        body: 'Supersonic Storms: Despite being incredibly far from the Sun’s heat (which drives Earth\'s weather), Neptune has the wildest, fastest weather in the Solar System.\n\nBreaking the Sound Barrier: The winds whip through clouds of frozen methane across the planet at a terrifying 2,100 km/h (1,300 mph)—faster than a fighter jet and 1.5 times the speed of sound!\n\nThe Great Dark Spot: These winds spawn massive, Earth-sized dark storms that appear and disappear over the years, tearing through the atmosphere with unimaginable force.',
      },
      {
        title: 'Card 5: The Slush Ocean',
        dangerous: true,
        body: 'No Solid Escape: Like Uranus, Neptune is an ice giant with no solid surface. Its gravity is slightly stronger than Earth\'s, meaning anything entering the atmosphere falls rapidly.\n\nThe Slushy Mantle: Beneath the freezing, violent supersonic winds is a superheated, highly pressurized fluid mantle composed of water, ammonia, and methane.\n\nElectrical Conductivity: This thick, supercritical fluid ocean is highly electrically conductive, powering the planet\'s strange and incredibly powerful offset magnetic field, which would instantly destroy unprotected electronics.',
      }
    ]
  };

  function createBoardTexture(variantIndex, title, dangerous, planetName, loadedImg) {
    const c = document.createElement('canvas');
    c.width = 700;
    c.height = 420;
    const ctx = c.getContext('2d');

    const bg = ctx.createLinearGradient(0, 0, 0, c.height);
    bg.addColorStop(0, dangerous ? '#341515' : '#16233d');
    bg.addColorStop(1, dangerous ? '#1e0d0d' : '#0f1730');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, c.width, c.height);

    for (let i = 0; i < 220; i++) {
      const x = Math.random() * c.width;
      const y = Math.random() * c.height;
      const alpha = 0.2 + Math.random() * 0.55;
      ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(2)})`;
      ctx.fillRect(x, y, 1.4, 1.4);
    }

    const mx = 160;
    const my = 210;
    const mr = 92;

    if (loadedImg && loadedImg.complete && loadedImg.naturalHeight > 0 && planetName === 'Mercury') {
      ctx.save();
      ctx.beginPath();
      ctx.arc(mx, my, mr, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(loadedImg, mx - mr, my - mr, mr*2, mr*2);
      ctx.restore();

      ctx.strokeStyle = dangerous ? '#f6ba82' : '#d6b28b';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(mx, my, mr, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      const grad = ctx.createRadialGradient(mx - 18, my - 20, 8, mx, my, mr + 6);
      grad.addColorStop(0, dangerous ? '#f6ba82' : '#d6b28b');
      grad.addColorStop(1, dangerous ? '#8d5539' : '#786351');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(mx, my, mr, 0, Math.PI * 2);
      ctx.fill();

      // Mercury variants (different looks)
      const craterSets = [
        [
          [120, 170, 16], [175, 185, 14], [145, 235, 11], [205, 250, 9], [98, 225, 10], [186, 135, 8],
        ],
        [
          [115, 150, 13], [145, 178, 17], [183, 210, 12], [132, 248, 14], [197, 158, 10], [92, 206, 8],
        ],
        [
          [100, 188, 15], [128, 148, 9], [166, 170, 16], [198, 224, 13], [139, 266, 11], [214, 188, 7],
        ],
        [
          [106, 162, 14], [150, 194, 10], [178, 236, 15], [125, 224, 12], [198, 162, 9], [92, 246, 8],
        ],
        [
          [112, 180, 12], [165, 152, 13], [192, 196, 16], [139, 214, 9], [173, 254, 11], [96, 214, 7],
        ],
      ];
      const selected = craterSets[variantIndex % craterSets.length];
      ctx.fillStyle = dangerous ? 'rgba(52,18,10,0.42)' : 'rgba(30,28,26,0.35)';
      for (const crater of selected) {
        ctx.beginPath();
        ctx.arc(crater[0], crater[1], crater[2], 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.strokeStyle = dangerous ? 'rgba(255,124,96,0.85)' : 'rgba(170,196,255,0.75)';
    ctx.lineWidth = 7;
    ctx.strokeRect(10, 10, c.width - 20, c.height - 20);

    ctx.fillStyle = dangerous ? '#ffd4c6' : '#e0ebff';
    ctx.font = '700 34px Arial';
    ctx.fillText(planetName.toUpperCase(), 295, 178);
    ctx.font = '600 22px Arial';
    ctx.fillStyle = dangerous ? '#ff9a7f' : '#9fc0ff';
    ctx.fillText(title, 295, 214);

    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  function createPlanetPosterTexture(planetName, planetColorHex, floorNum) {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 320;
    const ctx = c.getContext('2d');

    const g = ctx.createLinearGradient(0, 0, 0, c.height);
    g.addColorStop(0, '#0b1227');
    g.addColorStop(1, '#1a2748');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, c.width, c.height);

    for (let i = 0; i < 180; i++) {
      const x = Math.random() * c.width;
      const y = Math.random() * c.height;
      const a = 0.2 + Math.random() * 0.6;
      const s = 0.7 + Math.random() * 1.8;
      ctx.fillStyle = `rgba(255,255,255,${a.toFixed(2)})`;
      ctx.fillRect(x, y, s, s);
    }

    const px = c.width * 0.24;
    const py = c.height * 0.54;
    const pr = 68;
    ctx.fillStyle = `#${planetColorHex.toString(16).padStart(6, '0')}`;
    ctx.beginPath();
    ctx.arc(px, py, pr, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    for (let b = 0; b < 4; b++) {
      ctx.beginPath();
      ctx.ellipse(px - 12 + b * 8, py - 10 + b * 6, pr * 0.75, pr * 0.14, -0.45, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#d4e1ff';
    ctx.font = '700 38px Arial';
    ctx.fillText(planetName, 200, 125);
    ctx.font = '600 24px Arial';
    ctx.fillStyle = '#9cb7ff';
    ctx.fillText(`Floor ${floorNum} Exhibit`, 200, 165);
    ctx.font = '500 20px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Solar System Order Display', 200, 200);

    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  const podiumMat = new THREE.MeshStandardMaterial({ color: 0x808b97, roughness: 0.6, metalness: 0.25 });
  const infoCardMat = new THREE.MeshStandardMaterial({ color: 0xf7f9ff, roughness: 0.35, metalness: 0.05 });
  const posterFrameMat = new THREE.MeshStandardMaterial({ color: 0x3b4550, roughness: 0.55, metalness: 0.2 });

  function createPlanetFloorExhibit(planet, floorNumber) {
    const fy = getFloorY(floorNumber);
    const displayX = 2.0;
    const displayZ = -6.2;

    const podium = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.2, 0.8, 28), podiumMat);
    podium.position.set(displayX, fy + 0.4, displayZ);
    scene.add(podium);

    if (planet.name === 'Mercury') {
      const mercuryGroup = new THREE.Group();
      mercuryGroup.position.set(displayX, fy + 1.05 + planet.radius, displayZ);
      scene.add(mercuryGroup);
      planetExhibits.push({ mesh: mercuryGroup, baseY: mercuryGroup.position.y, speed: 0.22 });

      gltfLoader.load('../Mercury.glb', (gltf) => {
        const model = gltf.scene;
        model.scale.setScalar(0.42);
        mercuryGroup.add(model);
      });
    } else {
      const planetMesh = new THREE.Mesh(
        new THREE.SphereGeometry(planet.radius, 28, 28),
        new THREE.MeshStandardMaterial({ color: planet.color, roughness: 0.85, metalness: 0.05 })
      );
      planetMesh.position.set(displayX, fy + 1.05 + planet.radius, displayZ);
      scene.add(planetMesh);

      if (planet.name === 'Saturn') {
        const ring = new THREE.Mesh(
          new THREE.RingGeometry(planet.radius * 1.35, planet.radius * 1.95, 48),
          new THREE.MeshStandardMaterial({
            color: 0xcfc6a6,
            roughness: 0.7,
            metalness: 0.02,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.75,
          })
        );
        ring.rotation.x = Math.PI / 2.7;
        ring.position.copy(planetMesh.position);
        scene.add(ring);
        planetExhibits.push({ mesh: ring, baseY: ring.position.y, speed: 0.16 });
      }

      planetExhibits.push({ mesh: planetMesh, baseY: planetMesh.position.y, speed: 0.22 });
    }

    // Generate the 5 detailed info cards on EVERY floor, using the correct planet data
    const activeLoreCards = planetLoreCards[planet.name];
    if (activeLoreCards) {
      const rawBoardZ = museumBounds.maxZ - 0.36;
      // Pull floor 2 boards back by 3.2 so they sit solidly on the balcony floor.
      const boardZ = floorNumber === 2 ? rawBoardZ - 3.2 : rawBoardZ;
      const boardStepX = 2.0;
      const boardCenterX = 2.5;
      const boardStartX = boardCenterX - ((activeLoreCards.length - 1) * boardStepX) / 2;

      for (let i = 0; i < activeLoreCards.length; i++) {
        const cardData = activeLoreCards[i];
        const bx = boardStartX + i * boardStepX;

        const stand = new THREE.Mesh(new THREE.BoxGeometry(0.16, 1.62, 0.16), podiumMat);
        stand.position.set(bx, fy + 0.81, boardZ + 0.02);
        scene.add(stand);

        const boardFrame = new THREE.Mesh(
          new THREE.BoxGeometry(1.72, 1.24, 0.08),
          new THREE.MeshStandardMaterial({
            color: cardData.dangerous ? 0x6b3a3a : 0x4a5665,
            roughness: 0.55,
            metalness: 0.25,
          })
        );
        boardFrame.position.set(bx, fy + 1.55, boardZ - 0.02);
        boardFrame.rotation.y = Math.PI;
        scene.add(boardFrame);

        // We use the planet-specific board texture generator here
        const boardFace = new THREE.Mesh(
          new THREE.PlaneGeometry(1.58, 1.08),
          new THREE.MeshStandardMaterial({
            map: createBoardTexture(i, cardData.title, cardData.dangerous, planet.name, mercuryPic), // We can reuse the texture generator function
            roughness: 0.78,
            metalness: 0.05,
          })
        );
        boardFace.position.set(bx, fy + 1.55, boardZ - 0.07);
        boardFace.rotation.y = Math.PI;
        scene.add(boardFace);

        // Click-highlight border so this board reads as interactive.
        const boardBorderMat = new THREE.LineBasicMaterial({
          color: 0x6f7f95,
          transparent: true,
          opacity: 0.45,
        });
        const boardBorder = new THREE.LineSegments(
          new THREE.EdgesGeometry(new THREE.PlaneGeometry(1.62, 1.12)),
          boardBorderMat
        );
        boardBorder.position.set(bx, fy + 1.55, boardZ - 0.0725);
        boardBorder.rotation.y = Math.PI;
        scene.add(boardBorder);

        const hitArea = new THREE.Mesh(new THREE.BoxGeometry(1.62, 1.1, 0.1), infoCardMat);
        hitArea.visible = false;
        hitArea.position.set(bx, fy + 1.55, boardZ - 0.055);
        hitArea.rotation.y = Math.PI;
        hitArea.userData.popup = {
          title: `${planet.name} • ${cardData.title}`,
          body: cardData.body,
          floor: floorNumber,
          dangerous: cardData.dangerous,
        };
        hitArea.userData.borderMaterial = boardBorderMat;
        hitArea.userData.baseBorderColor = 0x6f7f95;
        scene.add(hitArea);
        infoCardTargets.push(hitArea);
      }
    }

    // Keep the extra image gallery only on the first floor
    if (floorNumber === 1 && planet.name === 'Mercury') {
      const galleryStartX = -1.4;
      const mercuryImages = ['../mercury_surface_1773690721650.png', '../mercury_angle_1773690735151.png'];
      for (let g = 0; g < 2; g++) {
        const gx = galleryStartX + g * 2.45;
        const frame = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.42, 0.08), posterFrameMat);
        frame.position.set(gx, fy + 1.95, -12.78);
        scene.add(frame);

        const img = new THREE.Mesh(
          new THREE.PlaneGeometry(2.04, 1.28),
          new THREE.MeshStandardMaterial({
            map: textureLoader.load(mercuryImages[g]),
            roughness: 0.82,
            metalness: 0.02,
          })
        );
        img.position.set(gx, fy + 1.95, -12.73);
        scene.add(img);
      }
    }


    // Two wall posters for this planet (back and right walls)
    const posterTexture = createPlanetPosterTexture(planet.name, planet.color, floorNumber);
    const posterMat = new THREE.MeshStandardMaterial({ map: posterTexture, roughness: 0.8, metalness: 0.02 });

    const backPosterFrame = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.65, 0.08), posterFrameMat);
    backPosterFrame.position.set(3.8, fy + 1.8, -12.78);
    scene.add(backPosterFrame);

    const backPoster = new THREE.Mesh(new THREE.PlaneGeometry(2.34, 1.5), posterMat);
    backPoster.position.set(3.8, fy + 1.8, -12.73);
    scene.add(backPoster);

    const sidePosterFrame = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.65, 2.5), posterFrameMat);
    sidePosterFrame.position.set(12.78, fy + 1.8, -6.8);
    scene.add(sidePosterFrame);

    const sidePoster = new THREE.Mesh(new THREE.PlaneGeometry(2.34, 1.5), posterMat);
    sidePoster.position.set(12.73, fy + 1.8, -6.8);
    sidePoster.rotation.y = -Math.PI / 2;
    scene.add(sidePoster);
  }

  for (let floorNum = 1; floorNum <= FLOOR_COUNT; floorNum++) {
    createPlanetFloorExhibit(planetData[floorNum - 1], floorNum);
  }

  // On-screen planet info popup
  const planetPopup = document.createElement('div');
  planetPopup.style.position = 'fixed';
  planetPopup.style.left = '50%';
  planetPopup.style.top = '50%';
  planetPopup.style.transform = 'translate(-50%, -50%)';
  planetPopup.style.width = 'min(520px, 84vw)';
  planetPopup.style.background = 'rgba(8,14,30,0.94)';
  planetPopup.style.border = '1px solid rgba(177,205,255,0.35)';
  planetPopup.style.borderRadius = '14px';
  planetPopup.style.padding = '18px 18px 14px';
  planetPopup.style.color = '#e9f1ff';
  planetPopup.style.fontFamily = 'Arial, sans-serif';
  planetPopup.style.boxShadow = '0 20px 60px rgba(0,0,0,0.55)';
  planetPopup.style.display = 'none';
  planetPopup.style.zIndex = '30';

  const popupTitle = document.createElement('div');
  popupTitle.style.fontSize = '26px';
  popupTitle.style.fontWeight = '700';
  popupTitle.style.marginBottom = '10px';

  const popupBody = document.createElement('div');
  popupBody.style.fontSize = '16px';
  popupBody.style.lineHeight = '1.5';
  popupBody.style.whiteSpace = 'pre-line';
  popupBody.style.marginBottom = '14px';

  const popupTag = document.createElement('div');
  popupTag.style.display = 'none';
  popupTag.style.fontSize = '12px';
  popupTag.style.fontWeight = '700';
  popupTag.style.letterSpacing = '0.08em';
  popupTag.style.textTransform = 'uppercase';
  popupTag.style.marginBottom = '10px';
  popupTag.style.padding = '6px 10px';
  popupTag.style.borderRadius = '8px';
  popupTag.style.width = 'fit-content';

  const popupEscHint = document.createElement('div');
  popupEscHint.textContent = 'Press ESC to close';
  popupEscHint.style.fontSize = '12px';
  popupEscHint.style.letterSpacing = '0.04em';
  popupEscHint.style.color = '#9fb7e8';
  popupEscHint.style.marginTop = '8px';

  planetPopup.appendChild(popupTitle);
  planetPopup.appendChild(popupTag);
  planetPopup.appendChild(popupBody);
  planetPopup.appendChild(popupEscHint);
  document.body.appendChild(planetPopup);

  function hidePlanetPopup() {
    planetPopup.style.display = 'none';
  }

  function showPlanetPopup(popup) {
    popupTitle.textContent = popup.title;
    popupBody.textContent = popup.body;

    if (popup.dangerous) {
      popupTag.style.display = 'inline-block';
      popupTag.style.background = 'rgba(255,80,80,0.16)';
      popupTag.style.border = '1px solid rgba(255,125,125,0.55)';
      popupTag.style.color = '#ffb7b7';
      popupTag.textContent = 'Dangerous Conditions';
      planetPopup.style.border = '1px solid rgba(255,110,110,0.5)';
    } else {
      popupTag.style.display = 'none';
      planetPopup.style.border = '1px solid rgba(177,205,255,0.35)';
    }

    planetPopup.style.display = 'block';
  }

  window.addEventListener('keydown', (e) => {
    if (e.code === 'Escape') hidePlanetPopup();
  });

  // Interior kept open for museum gallery space (walls removed)

  // Front entrance frame (open center, not a solid block)
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x717b86, roughness: 0.55, metalness: 0.2 });
  const frameLeft = new THREE.Mesh(new THREE.BoxGeometry(0.22, 4.2, 0.32), frameMat);
  const frameRight = new THREE.Mesh(new THREE.BoxGeometry(0.22, 4.2, 0.32), frameMat);
  const frameTop = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.26, 0.32), frameMat);
  frameLeft.position.set(8.17, 2.1, 1.05);
  frameRight.position.set(12.33, 2.1, 1.05);
  frameTop.position.set(10.25, 4.07, 1.05);
  scene.add(frameLeft, frameRight, frameTop);

  // Welcome sign above front glass doors
  const signCanvas = document.createElement('canvas');
  signCanvas.width = 1024;
  signCanvas.height = 256;
  const signCtx = signCanvas.getContext('2d');
  signCtx.fillStyle = '#06080f';
  signCtx.fillRect(0, 0, signCanvas.width, signCanvas.height);

  for (let i = 0; i < 420; i++) {
    const x = Math.random() * signCanvas.width;
    const y = Math.random() * signCanvas.height;
    const size = Math.random() < 0.85 ? 1.6 : 2.6;
    const alpha = 0.35 + Math.random() * 0.6;
    signCtx.fillStyle = `rgba(255,255,255,${alpha.toFixed(2)})`;
    signCtx.fillRect(x, y, size, size);
  }

  signCtx.strokeStyle = 'rgba(190,220,255,0.85)';
  signCtx.lineWidth = 10;
  signCtx.strokeRect(8, 8, signCanvas.width - 16, signCanvas.height - 16);

  signCtx.textAlign = 'center';
  signCtx.textBaseline = 'middle';
  signCtx.font = '700 120px Arial';

  const leftWord = 'WELC';
  const rightWord = 'ME';
  const leftWidth = signCtx.measureText(leftWord).width;
  const rightWidth = signCtx.measureText(rightWord).width;
  const sunDiameter = 74;
  const spacing = 20;
  const totalWidth = leftWidth + sunDiameter + spacing * 2 + rightWidth;
  const startX = signCanvas.width / 2 - totalWidth / 2;
  const textY = signCanvas.height / 2 + 4;

  signCtx.fillStyle = '#f2f7ff';
  signCtx.textAlign = 'left';
  signCtx.fillText(leftWord, startX, textY);

  const sunX = startX + leftWidth + spacing + sunDiameter / 2;
  const sunY = textY - 2;
  const sunGlow = signCtx.createRadialGradient(sunX, sunY, 6, sunX, sunY, 54);
  sunGlow.addColorStop(0, 'rgba(255,245,176,1)');
  sunGlow.addColorStop(0.65, 'rgba(255,207,74,0.95)');
  sunGlow.addColorStop(1, 'rgba(255,170,40,0.92)');
  signCtx.fillStyle = sunGlow;
  signCtx.beginPath();
  signCtx.arc(sunX, sunY, sunDiameter / 2, 0, Math.PI * 2);
  signCtx.fill();

  signCtx.strokeStyle = 'rgba(255,235,150,0.95)';
  signCtx.lineWidth = 4;
  signCtx.beginPath();
  signCtx.arc(sunX, sunY, sunDiameter / 2, 0, Math.PI * 2);
  signCtx.stroke();

  signCtx.fillStyle = '#f2f7ff';
  signCtx.fillText(rightWord, sunX + sunDiameter / 2 + spacing, textY);

  const welcomeSignTex = new THREE.CanvasTexture(signCanvas);
  welcomeSignTex.colorSpace = THREE.SRGBColorSpace;
  const welcomeSign = new THREE.Mesh(
    new THREE.PlaneGeometry(5.6, 1.35),
    new THREE.MeshStandardMaterial({
      map: welcomeSignTex,
      roughness: 0.65,
      metalness: 0.08,
      side: THREE.DoubleSide,
      emissive: 0x0c1120,
      emissiveIntensity: 0.18,
    })
  );
  // Place sign in front of wall surface so it is clearly visible from outside.
  welcomeSign.position.set(10.25, 4.95, 1.24);
  scene.add(welcomeSign);

  // Supermarket-style automatic sliding glass doors
  const doorGlassMat = new THREE.MeshStandardMaterial({
    color: 0xcfe8ff,
    metalness: 0.1,
    roughness: 0.08,
    transparent: true,
    opacity: 0.45,
  });
  const doorRailMat = new THREE.MeshStandardMaterial({ color: 0x6f7d89, metalness: 0.35, roughness: 0.35 });
  const leftDoor = new THREE.Mesh(new THREE.BoxGeometry(1.3, 3.2, 0.06), doorGlassMat);
  const rightDoor = new THREE.Mesh(new THREE.BoxGeometry(1.3, 3.2, 0.06), doorGlassMat);
  const leftRail = new THREE.Mesh(new THREE.BoxGeometry(1.34, 0.16, 0.08), doorRailMat);
  const rightRail = new THREE.Mesh(new THREE.BoxGeometry(1.34, 0.16, 0.08), doorRailMat);
  const doorCenter = new THREE.Vector3(10.25, 1.8, 1.08);
  const doorBaseLeftX = doorCenter.x - 0.76;
  const doorBaseRightX = doorCenter.x + 0.76;
  leftDoor.position.set(doorBaseLeftX, 1.8, doorCenter.z);
  rightDoor.position.set(doorBaseRightX, 1.8, doorCenter.z);
  leftRail.position.set(doorBaseLeftX, 3.28, doorCenter.z);
  rightRail.position.set(doorBaseRightX, 3.28, doorCenter.z);
  scene.add(leftDoor);
  scene.add(rightDoor);
  scene.add(leftRail);
  scene.add(rightRail);

  // Motion sensor above entrance door
  const sensorMat = new THREE.MeshStandardMaterial({ color: 0x202733, emissive: 0x1a2500 });
  const doorSensor = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.2, 0.2), sensorMat);
  doorSensor.position.set(doorCenter.x, 4.1, doorCenter.z + 0.02);
  scene.add(doorSensor);
  let doorOpenAmount = 0;

  // Automatic door between museum interior and sphere
  const sphereDoorCenter = new THREE.Vector3(-4.86, 1.7, -6.0);
  const sphereDoorMat = new THREE.MeshStandardMaterial({
    color: 0xcfe8ff,
    roughness: 0.1,
    metalness: 0.1,
    transparent: true,
    opacity: 0.38,
  });
  const sphereDoorRailMat = new THREE.MeshStandardMaterial({ color: 0x6f7d89, metalness: 0.3, roughness: 0.35 });
  const sphereDoorA = new THREE.Mesh(new THREE.BoxGeometry(0.06, 3.0, 1.25), sphereDoorMat);
  const sphereDoorB = new THREE.Mesh(new THREE.BoxGeometry(0.06, 3.0, 1.25), sphereDoorMat);
  const sphereDoorRailA = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.16, 1.28), sphereDoorRailMat);
  const sphereDoorRailB = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.16, 1.28), sphereDoorRailMat);
  const sphereDoorBaseAZ = sphereDoorCenter.z - 0.72;
  const sphereDoorBaseBZ = sphereDoorCenter.z + 0.72;
  sphereDoorA.position.set(sphereDoorCenter.x, 1.7, sphereDoorBaseAZ);
  sphereDoorB.position.set(sphereDoorCenter.x, 1.7, sphereDoorBaseBZ);
  sphereDoorRailA.position.set(sphereDoorCenter.x, 3.18, sphereDoorBaseAZ);
  sphereDoorRailB.position.set(sphereDoorCenter.x, 3.18, sphereDoorBaseBZ);
  scene.add(sphereDoorA, sphereDoorB, sphereDoorRailA, sphereDoorRailB);
  let sphereDoorOpenAmount = 0;

  // Elevator shell (back-right corner)
  const elevatorBaseX = museumBounds.maxX - 2.35;
  const elevatorBaseZ = museumBounds.minZ + 2.35;

  const elevatorGlassMat = new THREE.MeshStandardMaterial({
    color: 0xbfc7d1,
    roughness: 0.2,
    metalness: 0.95,
    transparent: false,
    side: THREE.DoubleSide,
  });
  const elevatorShaft = new THREE.Group();
  const shaftMidY = (buildingHeight - 0.5) / 2;
  const shaftH = buildingHeight - 0.5;

  function addShaftWall(x, y, z, sx, sy, sz) {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), elevatorGlassMat);
    wall.position.set(x, y, z);
    elevatorShaft.add(wall);
  }

  // Left, right, and back walls
  addShaftWall(elevatorBaseX - 1.44, shaftMidY, elevatorBaseZ, 0.12, shaftH, 3);
  addShaftWall(elevatorBaseX + 1.44, shaftMidY, elevatorBaseZ, 0.12, shaftH, 3);
  addShaftWall(elevatorBaseX, shaftMidY, elevatorBaseZ - 1.44, 3, shaftH, 0.12);
  // Front wall split around doorway opening (real hole in middle)
  addShaftWall(elevatorBaseX - 1.05, shaftMidY, elevatorBaseZ + 1.44, 0.9, shaftH, 0.12);
  addShaftWall(elevatorBaseX + 1.05, shaftMidY, elevatorBaseZ + 1.44, 0.9, shaftH, 0.12);
  // Top cap
  addShaftWall(elevatorBaseX, buildingHeight - 0.28, elevatorBaseZ, 3, 0.12, 3);

  scene.add(elevatorShaft);

  // Shaft collision shell: only front doorway can be used to enter/exit shaft
  const shaftWallT = 0.12;
  const shaftDoorOpeningW = 1.2;
  const shaftSideW = (3 - shaftDoorOpeningW) / 2;
  addElevatorAabbCollider(elevatorBaseX - 1.5 + shaftWallT / 2, wallY, elevatorBaseZ, shaftWallT, wallH, 3); // left
  addElevatorAabbCollider(elevatorBaseX + 1.5 - shaftWallT / 2, wallY, elevatorBaseZ, shaftWallT, wallH, 3); // right
  addElevatorAabbCollider(elevatorBaseX, wallY, elevatorBaseZ - 1.5 + shaftWallT / 2, 3, wallH, shaftWallT); // back
  addElevatorAabbCollider(
    elevatorBaseX - (shaftDoorOpeningW / 2 + shaftSideW / 2),
    wallY,
    elevatorBaseZ + 1.5 - shaftWallT / 2,
    shaftSideW,
    wallH,
    shaftWallT
  ); // front-left
  addElevatorAabbCollider(
    elevatorBaseX + (shaftDoorOpeningW / 2 + shaftSideW / 2),
    wallY,
    elevatorBaseZ + 1.5 - shaftWallT / 2,
    shaftSideW,
    wallH,
    shaftWallT
  ); // front-right

  // Elevator base floor
  const elevatorBaseFloor = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, 0.12, 2.4),
    new THREE.MeshStandardMaterial({
      color: 0xb7c0cb,
      roughness: 0.22,
      metalness: 0.85,
    })
  );
  elevatorBaseFloor.position.set(elevatorBaseX, getFloorY(1) + 0.06, elevatorBaseZ);
  scene.add(elevatorBaseFloor);

  const elevatorCabinMat = new THREE.MeshStandardMaterial({
    color: 0xc7cfda,
    roughness: 0.16,
    metalness: 0.92,
    transparent: false,
    side: THREE.DoubleSide,
  });
  const elevatorCabin = new THREE.Group();

  function addCabinWall(x, y, z, sx, sy, sz) {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), elevatorCabinMat);
    wall.position.set(x, y, z);
    elevatorCabin.add(wall);
  }

  // Cabin shell with real front opening for inner elevator doors
  addCabinWall(-1.04, 0, 0, 0.08, 2.5, 2.2); // left
  addCabinWall(1.04, 0, 0, 0.08, 2.5, 2.2); // right
  addCabinWall(0, 0, -1.04, 2.2, 2.5, 0.08); // back
  addCabinWall(-0.76, 0, 1.04, 0.68, 2.5, 0.08); // front-left
  addCabinWall(0.76, 0, 1.04, 0.68, 2.5, 0.08); // front-right
  addCabinWall(0, 1.19, 0, 2.2, 0.08, 2.2); // roof
  addCabinWall(0, -1.19, 0, 2.2, 0.08, 2.2); // cabin base floor

  elevatorCabin.position.set(elevatorBaseX, getFloorY(1) + 1.25, elevatorBaseZ);
  scene.add(elevatorCabin);

  // Glass elevator doors (cabin front)
  const elevatorDoorMat = new THREE.MeshStandardMaterial({
    color: 0x5b161b,
    roughness: 0.24,
    metalness: 0.78,
    transparent: false,
    side: THREE.DoubleSide,
  });
  const elevatorDoorRailMat = new THREE.MeshStandardMaterial({ color: 0x7a2a31, metalness: 0.72, roughness: 0.25 });
  const elevatorDoorLeft = new THREE.Mesh(new THREE.BoxGeometry(0.5, 2.0, 0.05), elevatorDoorMat);
  const elevatorDoorRight = new THREE.Mesh(new THREE.BoxGeometry(0.5, 2.0, 0.05), elevatorDoorMat);
  const elevatorDoorTopRail = new THREE.Mesh(new THREE.BoxGeometry(1.16, 0.12, 0.08), elevatorDoorRailMat);
  scene.add(elevatorDoorLeft, elevatorDoorRight, elevatorDoorTopRail);

  // Shaft front doors for every floor + elevator signs
  function createElevatorSignTexture() {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 128;
    const ctx = c.getContext('2d');
    const g = ctx.createLinearGradient(0, 0, 0, c.height);
    g.addColorStop(0, '#1f2a38');
    g.addColorStop(1, '#141b26');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.strokeStyle = 'rgba(210,220,235,0.8)';
    ctx.lineWidth = 6;
    ctx.strokeRect(6, 6, c.width - 12, c.height - 12);
    ctx.fillStyle = '#dfe6f2';
    ctx.font = '700 54px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('ELEVATOR', c.width / 2, c.height / 2 + 2);

    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  const elevatorSignTex = createElevatorSignTexture();
  const shaftDoorLevels = [];
  for (let f = 1; f <= FLOOR_COUNT; f++) {
    const center = new THREE.Vector3(elevatorBaseX, getFloorY(f) + 1.1, elevatorBaseZ + 1.47);
    const left = new THREE.Mesh(new THREE.BoxGeometry(0.52, 2.05, 0.06), elevatorDoorMat);
    const right = new THREE.Mesh(new THREE.BoxGeometry(0.52, 2.05, 0.06), elevatorDoorMat);
    const topRail = new THREE.Mesh(new THREE.BoxGeometry(1.22, 0.12, 0.1), elevatorDoorRailMat);

    left.position.set(center.x - 0.28, center.y, center.z);
    right.position.set(center.x + 0.28, center.y, center.z);
    topRail.position.set(center.x, center.y + 1.06, center.z);
    scene.add(left, right, topRail);

    const sign = new THREE.Mesh(
      new THREE.PlaneGeometry(1.5, 0.34),
      new THREE.MeshStandardMaterial({ map: elevatorSignTex, roughness: 0.5, metalness: 0.2 })
    );
    sign.position.set(center.x, center.y + 1.32, center.z + 0.035);
    scene.add(sign);

    shaftDoorLevels.push({ floor: f, center, left, right, topRail, openAmount: 1 });
  }

  const elevatorDoorCenter = new THREE.Vector3(elevatorBaseX, getFloorY(1) + 1.1, elevatorBaseZ + 1.14);
  const elevatorDoorBaseLeftX = elevatorDoorCenter.x - 0.26;
  const elevatorDoorBaseRightX = elevatorDoorCenter.x + 0.26;
  let elevatorDoorOpenAmount = 1;

  function updateElevatorDoors(dt) {
    const targetY = getFloorY(elevatorTargetFloor) + 1.25;
    const elevatorMoving = Math.abs(targetY - elevatorCabin.position.y) > 0.03;

    const inCabinX = Math.abs(camera.position.x - elevatorCabin.position.x) < 0.95;
    const inCabinZ = Math.abs(camera.position.z - elevatorCabin.position.z) < 0.95;
    const nearCabinY = Math.abs(camera.position.y - (elevatorCabin.position.y + 0.45)) < 1.4;
    const insideCabin = inCabinX && inCabinZ && nearCabinY;
    const deepInsideCabin =
      Math.abs(camera.position.x - elevatorCabin.position.x) < 0.85 &&
      Math.abs(camera.position.z - elevatorCabin.position.z) < 0.62 &&
      nearCabinY;

    // Cabin doors stay open until player enters the elevator.
    const targetOpen = !deepInsideCabin && !elevatorMoving ? 1 : 0;

    elevatorDoorOpenAmount += (targetOpen - elevatorDoorOpenAmount) * Math.min(1, 4.0 * dt);

    elevatorDoorCenter.set(
      elevatorCabin.position.x,
      elevatorCabin.position.y - 0.15,
      elevatorCabin.position.z + 1.14
    );

    elevatorDoorLeft.position.set(
      elevatorDoorBaseLeftX - 0.28 * elevatorDoorOpenAmount,
      elevatorDoorCenter.y,
      elevatorDoorCenter.z
    );
    elevatorDoorRight.position.set(
      elevatorDoorBaseRightX + 0.28 * elevatorDoorOpenAmount,
      elevatorDoorCenter.y,
      elevatorDoorCenter.z
    );
    elevatorDoorTopRail.position.set(
      elevatorDoorCenter.x,
      elevatorDoorCenter.y + 1.04,
      elevatorDoorCenter.z
    );

    const approxFloor = Math.max(
      1,
      Math.min(FLOOR_COUNT, Math.round((elevatorCabin.position.y - 1.25) / FLOOR_HEIGHT) + 1)
    );
    const cabinAlignedToFloor = Math.abs(elevatorCabin.position.y - (getFloorY(approxFloor) + 1.25)) < 0.14;

    for (const level of shaftDoorLevels) {
      const levelTargetOpen =
        level.floor === approxFloor && cabinAlignedToFloor && !deepInsideCabin && !elevatorMoving ? 1 : 0;
      level.openAmount += (levelTargetOpen - level.openAmount) * Math.min(1, 4.0 * dt);

      level.left.position.set(
        level.center.x - 0.28 - 0.28 * level.openAmount,
        level.center.y,
        level.center.z
      );
      level.right.position.set(
        level.center.x + 0.28 + 0.28 * level.openAmount,
        level.center.y,
        level.center.z
      );
      level.topRail.position.set(level.center.x, level.center.y + 1.06, level.center.z);
    }
  }

  const elevatorPanel = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 1.2, 0.8),
    new THREE.MeshStandardMaterial({ color: 0x222a33, roughness: 0.4, metalness: 0.2 })
  );
  elevatorPanel.position.set(elevatorBaseX - 1.25, getFloorY(1) + 1.4, elevatorBaseZ + 1.25);
  scene.add(elevatorPanel);

  let currentFloor = 1;
  let elevatorTargetFloor = 1;
  let previousCabinY = elevatorCabin.position.y;
  let isRidingElevator = false;

  const infoPoints = [];

  const keys = { KeyW: false, KeyA: false, KeyS: false, KeyD: false };
  const spawnLookTarget = new THREE.Vector3(4, 2, -4);
  let yaw = Math.atan2(
    spawnLookTarget.x - camera.position.x,
    spawnLookTarget.z - camera.position.z
  );
  let pitch = 0;
  const speed = 4.2;
  const clock = new THREE.Clock();

  const lookDir = new THREE.Vector3();
  const forward = new THREE.Vector3();
  const right = new THREE.Vector3();

  document.body.addEventListener('click', () => {
    if (document.pointerLockElement !== document.body) {
      document.body.requestPointerLock();
    }
  });

  document.addEventListener('mousemove', (e) => {
    if (document.pointerLockElement !== document.body) return;
    yaw -= e.movementX * 0.002;
    pitch -= e.movementY * 0.002;
    pitch = Math.max(-1.35, Math.min(1.35, pitch));
  });

  window.addEventListener('mousedown', (e) => {
    if (e.button !== 0 || document.pointerLockElement !== document.body) return;
    if (planetPopup.style.display === 'block') return;

    const clickDir = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion).normalize();
    raycaster.set(camera.position, clickDir);
    const hits = raycaster.intersectObjects(infoCardTargets, false);

    if (hits.length && hits[0].distance < 4.2) {
      const popup = hits[0].object.userData.popup;
      if (popup) {
        showPlanetPopup(popup);
      }
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.code in keys) keys[e.code] = true;

    // Elevator floor selection: 1-8 when near panel or physically inside cabin
    if (/^Digit[1-8]$/.test(e.code)) {
      const requestedFloor = Number(e.code.replace('Digit', ''));
      const distToPanel = camera.position.distanceTo(elevatorPanel.position);
      const inCabinX = Math.abs(camera.position.x - elevatorCabin.position.x) < 0.95;
      const inCabinZ = Math.abs(camera.position.z - elevatorCabin.position.z) < 0.95;
      const nearCabinY = Math.abs(camera.position.y - (elevatorCabin.position.y + 0.45)) < 1.4;
      const insideCabin = inCabinX && inCabinZ && nearCabinY;

      if (distToPanel < 2.5 || insideCabin) {
        elevatorTargetFloor = requestedFloor;
        infoEl.textContent = `Elevator going to floor ${requestedFloor}...`;
      }
    }
  });
  window.addEventListener('keyup', (e) => {
    if (e.code in keys) keys[e.code] = false;
  });

  const raycaster = new THREE.Raycaster();
  let shownText = '';

  function updatePlanetExhibits(elapsedTime) {
    for (const entry of planetExhibits) {
      entry.mesh.rotation.y += entry.speed * 0.01;
      entry.mesh.position.y = entry.baseY + Math.sin(elapsedTime * entry.speed * 2.2) * 0.03;
    }
  }

  function updateCameraDirection() {
    const cp = Math.cos(pitch);
    lookDir.set(Math.sin(yaw) * cp, Math.sin(pitch), Math.cos(yaw) * cp).normalize();
    camera.lookAt(camera.position.clone().add(lookDir));
  }

  function updateMovement(dt) {
    forward.set(Math.sin(yaw), 0, Math.cos(yaw)).normalize();
    right.set(forward.z, 0, -forward.x).normalize();

    const move = new THREE.Vector3();
    if (keys.KeyW) move.add(forward);
    if (keys.KeyS) move.sub(forward);
    if (keys.KeyD) move.sub(right);
    if (keys.KeyA) move.add(right);

    if (move.lengthSq() > 0) {
      move.normalize().multiplyScalar(speed * dt);

      const tryPosX = camera.position.clone();
      tryPosX.x += move.x;
      if (!isBlocked(tryPosX)) {
        camera.position.x = tryPosX.x;
      }

      const tryPosZ = camera.position.clone();
      tryPosZ.z += move.z;
      if (!isBlocked(tryPosZ)) {
        camera.position.z = tryPosZ.z;
      }
    }

    camera.position.x = Math.max(-20, Math.min(22, camera.position.x));
    camera.position.z = Math.max(-20, Math.min(26, camera.position.z));

    // keep user on current floor eye height unless elevator moves them
    if (!isRidingElevator) {
      camera.position.y = getCameraYForFloor(currentFloor);
    }
  }

  function isBlocked(candidatePos) {
    // Static walls/partitions
    for (const c of staticColliders) {
      if (pointInsideExpandedAabb(candidatePos, c, PLAYER_RADIUS)) {
        return true;
      }
    }

    // Elevator shaft uses tighter collision to avoid invisible wide blocking around corners
    for (const c of elevatorColliders) {
      if (pointInsideExpandedAabb(candidatePos, c, 0.12)) {
        return true;
      }
    }

    // Entrance door collision (blocked only while mostly closed)
    if (Math.abs(candidatePos.z - doorCenter.z) < 0.22) {
      const blockedHalfSpan = Math.max(0.06, 1.25 - 1.22 * doorOpenAmount);
      if (Math.abs(candidatePos.x - doorCenter.x) < blockedHalfSpan) {
        return true;
      }
    }

    // Sphere door collision (blocked until opening expands)
    if (Math.abs(candidatePos.x - sphereDoorCenter.x) < 0.16) {
      const blockedHalfSpan = Math.max(0.08, 1.05 - 0.98 * sphereDoorOpenAmount);
      if (Math.abs(candidatePos.z - sphereDoorCenter.z) < blockedHalfSpan) {
        return true;
      }
    }

    // Shaft entrance door collision on each floor
    for (const level of shaftDoorLevels) {
      if (Math.abs(candidatePos.y - level.center.y) > 1.45) continue;
      if (Math.abs(candidatePos.z - level.center.z) < 0.12) {
        const blockedHalfSpan = Math.max(0.08, 0.58 - 0.52 * level.openAmount);
        if (Math.abs(candidatePos.x - level.center.x) < blockedHalfSpan) {
          return true;
        }
      }
    }

    // Elevator cabin collision: sides/back always solid, front pass only through door opening
    const cabinHalfX = 1.1;
    const cabinHalfZ = 1.1;
    const cabinWallT = 0.08;
    const inCabinYBand = Math.abs(candidatePos.y - elevatorCabin.position.y) < 1.3;
    if (inCabinYBand) {
      const lx = candidatePos.x - elevatorCabin.position.x;
      const lz = candidatePos.z - elevatorCabin.position.z;
      const nearLeftWall = Math.abs(lx + cabinHalfX) < cabinWallT + PLAYER_RADIUS && Math.abs(lz) < cabinHalfZ + PLAYER_RADIUS;
      const nearRightWall = Math.abs(lx - cabinHalfX) < cabinWallT + PLAYER_RADIUS && Math.abs(lz) < cabinHalfZ + PLAYER_RADIUS;
      const nearBackWall = Math.abs(lz + cabinHalfZ) < cabinWallT + PLAYER_RADIUS && Math.abs(lx) < cabinHalfX + PLAYER_RADIUS;

      // Door opening grows with door movement; otherwise front acts as a wall.
      const doorOpeningHalf = Math.max(0.04, 0.3 * elevatorDoorOpenAmount);
      const nearFrontPlane = Math.abs(lz - cabinHalfZ) < cabinWallT + PLAYER_RADIUS;
      const withinFrontWallWidth = Math.abs(lx) < cabinHalfX + PLAYER_RADIUS;
      const frontBlocked = nearFrontPlane && withinFrontWallWidth && Math.abs(lx) > doorOpeningHalf;

      if (nearLeftWall || nearRightWall || nearBackWall || frontBlocked) {
        return true;
      }
    }

    // Interior door collision (auto opens on proximity)
    for (const door of interiorDoors) {
      if (door.openAmount > 0.75) continue;

      if (door.axis === 'z') {
        if (
          Math.abs(candidatePos.z - door.center.z) < 0.16 &&
          Math.abs(candidatePos.x - door.center.x) < 0.9 + PLAYER_RADIUS &&
          Math.abs(candidatePos.y - door.center.y) < 1.6
        ) {
          return true;
        }
      } else {
        if (
          Math.abs(candidatePos.x - door.center.x) < 0.16 &&
          Math.abs(candidatePos.z - door.center.z) < 0.9 + PLAYER_RADIUS &&
          Math.abs(candidatePos.y - door.center.y) < 1.6
        ) {
          return true;
        }
      }
    }

    return false;
  }

  function updateDoors(dt) {
    // Outside + inside motion zones to mimic supermarket automatic sensor door
    const dx = Math.abs(camera.position.x - doorCenter.x);
    const dy = Math.abs(camera.position.y - doorCenter.y);
    const dz = camera.position.z - doorCenter.z;
    const inOutsideSensorZone = dx < 2.8 && dy < 2.8 && dz > -0.2 && dz < 4.0;
    const inInsideSensorZone = dx < 2.8 && dy < 2.8 && dz < 0.2 && dz > -3.0;
    const targetOpen = inOutsideSensorZone || inInsideSensorZone ? 1 : 0;

    const doorSpeed = 2.8;
    doorOpenAmount += (targetOpen - doorOpenAmount) * Math.min(1, doorSpeed * dt);

    leftDoor.position.x = doorBaseLeftX - 0.8 * doorOpenAmount;
    rightDoor.position.x = doorBaseRightX + 0.8 * doorOpenAmount;
    leftRail.position.x = leftDoor.position.x;
    rightRail.position.x = rightDoor.position.x;

    // Sphere door motion sensor (both sides)
    const sdx = Math.abs(camera.position.x - sphereDoorCenter.x);
    const sdy = Math.abs(camera.position.y - sphereDoorCenter.y);
    const sdz = Math.abs(camera.position.z - sphereDoorCenter.z);
    const sphereDoorTarget = sdx < 2.8 && sdy < 2.8 && sdz < 2.8 ? 1 : 0;
    sphereDoorOpenAmount += (sphereDoorTarget - sphereDoorOpenAmount) * Math.min(1, 3.0 * dt);
    sphereDoorA.position.z = sphereDoorBaseAZ - 0.75 * sphereDoorOpenAmount;
    sphereDoorB.position.z = sphereDoorBaseBZ + 0.75 * sphereDoorOpenAmount;
    sphereDoorRailA.position.z = sphereDoorA.position.z;
    sphereDoorRailB.position.z = sphereDoorB.position.z;

    sensorMat.emissive.setHex(doorOpenAmount > 0.15 ? 0x3a5a00 : 0x1a2500);

    for (const door of interiorDoors) {
      const dist = camera.position.distanceTo(door.center);
      const target = dist < 2.2 ? 1 : 0;
      door.openAmount += (target - door.openAmount) * Math.min(1, 3.8 * dt);

      if (door.axis === 'z') {
        door.mesh.position.x = door.center.x - 0.55 * door.openAmount;
      } else {
        door.mesh.position.z = door.center.z - 0.55 * door.openAmount;
      }
    }
  }

  function updateElevator(dt) {
    const targetY = getFloorY(elevatorTargetFloor) + 1.25;
    const diff = targetY - elevatorCabin.position.y;
    const elevatorSpeed = 2.5;
    const step = Math.sign(diff) * Math.min(Math.abs(diff), elevatorSpeed * dt);
    elevatorCabin.position.y += step;

    // move player with cabin if standing inside it
    const inCabinX = Math.abs(camera.position.x - elevatorCabin.position.x) < 0.95;
    const inCabinZ = Math.abs(camera.position.z - elevatorCabin.position.z) < 0.95;
    const nearCabinY = Math.abs(camera.position.y - (elevatorCabin.position.y + 0.45)) < 1.4;
    const insideCabin = inCabinX && inCabinZ && nearCabinY;
    isRidingElevator = insideCabin && Math.abs(diff) > 0.02;

    const cabinDeltaY = elevatorCabin.position.y - previousCabinY;
    if (insideCabin && Math.abs(cabinDeltaY) > 0) {
      camera.position.y += cabinDeltaY;
    }
    previousCabinY = elevatorCabin.position.y;

    // snap when arrived
    if (Math.abs(diff) < 0.02) {
      elevatorCabin.position.y = targetY;
      if (insideCabin) {
        currentFloor = elevatorTargetFloor;
      }
    }
  }

  function updateInfoPrompt() {
    raycaster.set(camera.position, lookDir);
    const hits = raycaster.intersectObjects(infoPoints, false);
    const cardHits = raycaster.intersectObjects(infoCardTargets, false);

    // Reset card borders when not centered on a card.
    for (const cardTarget of infoCardTargets) {
      const borderMat = cardTarget.userData.borderMaterial;
      if (!borderMat) continue;
      borderMat.color.setHex(cardTarget.userData.baseBorderColor || 0x6f7f95);
      borderMat.opacity = 0.45;
    }

    const nearPanel = camera.position.distanceTo(elevatorPanel.position) < 2.5;

    if (cardHits.length && cardHits[0].distance < 4.2) {
      const hoveredCard = cardHits[0].object;
      const hoveredBorder = hoveredCard.userData.borderMaterial;
      if (hoveredBorder) {
        hoveredBorder.color.setHex(0x00d7ff);
        hoveredBorder.opacity = 1.0;
      }

      const popup = cardHits[0].object.userData.popup;
      shownText = 'card';
      if (popup) {
        infoEl.textContent = `${popup.title} • Click to open details • Floor ${popup.floor}`;
      }
    } else if (hits.length && hits[0].distance < 3.2) {
      const msg = hits[0].object.userData.text;
      if (msg !== shownText) {
        shownText = msg;
        infoEl.textContent = `${msg} | Floor ${currentFloor}`;
      }
    } else if (nearPanel) {
      shownText = 'panel';
      infoEl.textContent = `Near elevator panel. Press 1-8 to choose floor. Current: ${currentFloor}`;
    } else if (shownText !== '') {
      shownText = '';
      infoEl.textContent = `WASD move • Click to lock mouse • Floor ${currentFloor}`;
    }
  }

  function animate() {
    const dt = Math.min(clock.getDelta(), 0.05);
    const elapsedTime = clock.elapsedTime;
    updateCameraDirection();
    updatePlanetExhibits(elapsedTime);
    updateDoors(dt);
    updateElevator(dt);
    updateElevatorDoors(dt);
    updateMovement(dt);
    updateInfoPrompt();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  animate();
});
