import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export const ArchitecturalModel3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleMotionChange);

    // Check WebGL availability
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      setHasWebGL(false);
      return () => mediaQuery.removeEventListener('change', handleMotionChange);
    }

    const container = containerRef.current;
    if (!container) return () => mediaQuery.removeEventListener('change', handleMotionChange);

    // Dimensions
    const width = container.clientWidth || 540;
    const height = container.clientHeight || 560;

    // Detect software rendering for performance safety
    const isSoftwareGl = (() => {
      try {
        const glCtx = canvas.getContext('webgl2');
        if (!glCtx) return false;
        const ext = glCtx.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : glCtx.RENDERER;
        const gpu = String(glCtx.getParameter(param));
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    // Scene
    const scene = new THREE.Scene();

    // Camera: Elevated architectural perspective
    const camera = new THREE.PerspectiveCamera(28, width / height, 0.1, 100);
    camera.position.set(10.5, 7.8, 12.5);
    camera.lookAt(0, 1.2, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);

    // Lighting: Studio architectural setup
    const ambientLight = new THREE.AmbientLight(0xf5f3ed, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffbf2, 1.6);
    keyLight.position.set(8, 14, 10);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe8ebf0, 0.8);
    fillLight.position.set(-8, 6, -6);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xdfd9ce, 0.6);
    rimLight.position.set(0, 10, -12);
    scene.add(rimLight);

    // Material Library: Matte ivory, warm stone, and subtle glass
    const stoneMaterial = new THREE.MeshStandardMaterial({
      color: 0xedeae2,
      roughness: 0.85,
      metalness: 0.05,
    });

    const warmIvoryMaterial = new THREE.MeshStandardMaterial({
      color: 0xf5f3ed,
      roughness: 0.75,
      metalness: 0.08,
    });

    const bronzeTrimMaterial = new THREE.MeshStandardMaterial({
      color: 0xc8aa6c,
      roughness: 0.45,
      metalness: 0.35,
    });

    const darkAccentMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e2e42,
      roughness: 0.5,
      metalness: 0.3,
    });

    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x243b53,
      metalness: 0.1,
      roughness: 0.15,
      transparent: true,
      opacity: 0.55,
      transmission: isSoftwareGl ? 0 : 0.4,
      ior: 1.5,
    });

    // Root model group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // Plinth / Display Base
    const plinthGeo = new THREE.BoxGeometry(6.4, 0.22, 5.4);
    const plinth = new THREE.Mesh(plinthGeo, stoneMaterial);
    plinth.position.y = -0.11;
    modelGroup.add(plinth);

    // Soft Radial Contact Shadow beneath base
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const ctx = shadowCanvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(64, 64, 10, 64, 64, 62);
      gradient.addColorStop(0, 'rgba(26, 25, 24, 0.28)');
      gradient.addColorStop(0.5, 'rgba(26, 25, 24, 0.12)');
      gradient.addColorStop(1, 'rgba(26, 25, 24, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 128, 128);
    }
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeo = new THREE.PlaneGeometry(7.2, 6.2);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -0.22;
    modelGroup.add(shadowMesh);

    // Podium / Lower Terraces
    const podiumGeo = new THREE.BoxGeometry(4.6, 0.7, 3.8);
    const podium = new THREE.Mesh(podiumGeo, stoneMaterial);
    podium.position.set(0, 0.35, 0);
    modelGroup.add(podium);

    // Tower Tier 1: Main Core Body
    const towerCoreGeo = new THREE.BoxGeometry(2.6, 3.8, 2.4);
    const towerCore = new THREE.Mesh(towerCoreGeo, warmIvoryMaterial);
    towerCore.position.set(-0.3, 2.6, 0);
    modelGroup.add(towerCore);

    // Tower Tier 2: Staggered High Rise
    const towerHighGeo = new THREE.BoxGeometry(1.8, 4.4, 1.8);
    const towerHigh = new THREE.Mesh(towerHighGeo, warmIvoryMaterial);
    towerHigh.position.set(-0.4, 4.2, -0.1);
    modelGroup.add(towerHigh);

    // Tower Tier 3: Secondary Stepped Volume (East Pavilion)
    const pavilionGeo = new THREE.BoxGeometry(1.6, 2.2, 1.9);
    const pavilion = new THREE.Mesh(pavilionGeo, stoneMaterial);
    pavilion.position.set(1.1, 1.8, 0.3);
    modelGroup.add(pavilion);

    // Glazing Bands: Recessed architectural glass panels
    const glassStripGeo1 = new THREE.BoxGeometry(2.64, 0.35, 2.44);
    for (let i = 0; i < 6; i++) {
      const glassStrip = new THREE.Mesh(glassStripGeo1, glassMaterial);
      glassStrip.position.set(-0.3, 1.2 + i * 0.58, 0);
      modelGroup.add(glassStrip);
    }

    const highGlassGeo = new THREE.BoxGeometry(1.84, 0.32, 1.84);
    for (let i = 0; i < 5; i++) {
      const highGlass = new THREE.Mesh(highGlassGeo, glassMaterial);
      highGlass.position.set(-0.4, 3.8 + i * 0.52, -0.1);
      modelGroup.add(highGlass);
    }

    // Cantilevered Terrace Balconies
    const balconyGeo1 = new THREE.BoxGeometry(2.9, 0.08, 0.9);
    const balcony1 = new THREE.Mesh(balconyGeo1, stoneMaterial);
    balcony1.position.set(-0.3, 2.1, 1.4);
    modelGroup.add(balcony1);

    const balconyGeo2 = new THREE.BoxGeometry(0.8, 0.08, 2.6);
    const balcony2 = new THREE.Mesh(balconyGeo2, stoneMaterial);
    balcony2.position.set(1.15, 3.1, 0.1);
    modelGroup.add(balcony2);

    const balconyGeo3 = new THREE.BoxGeometry(2.1, 0.08, 0.8);
    const balcony3 = new THREE.Mesh(balconyGeo3, stoneMaterial);
    balcony3.position.set(-0.4, 4.6, 0.95);
    modelGroup.add(balcony3);

    // Delicate Architectural Fin Details (Bronze trim accents)
    const finGeo = new THREE.BoxGeometry(0.04, 3.2, 0.2);
    for (let i = 0; i < 4; i++) {
      const fin = new THREE.Mesh(finGeo, bronzeTrimMaterial);
      fin.position.set(-1.4 - i * 0.02, 2.8, -0.6 + i * 0.4);
      modelGroup.add(fin);
    }

    // Rooftop Canopy & Pergola Frame
    const roofTrellisGeo = new THREE.BoxGeometry(2.2, 0.06, 2.2);
    const roofTrellis = new THREE.Mesh(roofTrellisGeo, darkAccentMaterial);
    roofTrellis.position.set(-0.4, 6.45, -0.1);
    modelGroup.add(roofTrellis);

    const pavilionRoofGeo = new THREE.BoxGeometry(1.8, 0.06, 2.1);
    const pavilionRoof = new THREE.Mesh(pavilionRoofGeo, bronzeTrimMaterial);
    pavilionRoof.position.set(1.1, 2.95, 0.3);
    modelGroup.add(pavilionRoof);

    // Initial baseline rotation (3/4 architectural angle)
    const BASE_ROTATION_Y = 0.52;
    const BASE_ROTATION_X = 0.05;
    modelGroup.rotation.y = BASE_ROTATION_Y;
    modelGroup.rotation.x = BASE_ROTATION_X;

    // Gentle entrance animation state
    let entranceProgress = 0;
    const isReduced = mediaQuery.matches;
    if (isReduced) {
      entranceProgress = 1;
      modelGroup.position.y = 0;
      modelGroup.scale.set(1, 1, 1);
    } else {
      modelGroup.position.y = -0.4;
      modelGroup.scale.set(0.92, 0.92, 0.92);
    }

    // Pointer-responsive target rotation (strictly clamped to ±4 degrees / ~0.07 rad)
    const targetRotation = { y: BASE_ROTATION_Y, x: BASE_ROTATION_X };
    const MAX_ROT_Y = 0.07; // ~4 degrees
    const MAX_ROT_X = 0.035; // ~2 degrees

    const handlePointerMove = (e: MouseEvent) => {
      if (isReduced) return;
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      targetRotation.y = BASE_ROTATION_Y + Math.max(-MAX_ROT_Y, Math.min(MAX_ROT_Y, nx * MAX_ROT_Y));
      targetRotation.x = BASE_ROTATION_X + Math.max(-MAX_ROT_X, Math.min(MAX_ROT_X, -ny * MAX_ROT_X));
    };

    const handlePointerLeave = () => {
      targetRotation.y = BASE_ROTATION_Y;
      targetRotation.x = BASE_ROTATION_X;
    };

    // Attach pointer events to container (never intercept wheel / scroll)
    container.addEventListener('mousemove', handlePointerMove, { passive: true });
    container.addEventListener('mouseleave', handlePointerLeave, { passive: true });

    // Handle viewport resize
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      if (newW > 0 && newH > 0) {
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH);
      }
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // Visibility / Intersection Observer: pause rendering when offscreen
    let isVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting;
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    // Animation Loop
    let animationFrameId = 0;
    let lastTime = performance.now();

    const animate = (time: number) => {
      animationFrameId = requestAnimationFrame(animate);

      // Only render if visible and tab is active
      if (!isVisible || document.hidden) return;

      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Entrance interpolation
      if (entranceProgress < 1 && !isReduced) {
        entranceProgress = Math.min(1, entranceProgress + delta * 1.8);
        const ease = 1 - Math.pow(1 - entranceProgress, 3);
        modelGroup.position.y = -0.4 + ease * 0.4;
        const s = 0.92 + ease * 0.08;
        modelGroup.scale.set(s, s, s);
      }

      // Smooth pointer easing (subtle damping)
      if (!isReduced) {
        modelGroup.rotation.y = THREE.MathUtils.damp(modelGroup.rotation.y, targetRotation.y, 3.5, delta);
        modelGroup.rotation.x = THREE.MathUtils.damp(modelGroup.rotation.x, targetRotation.x, 3.5, delta);
      }

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Cleanup resources on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      mediaQuery.removeEventListener('change', handleMotionChange);
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('mouseleave', handlePointerLeave);

      // Dispose geometries and materials
      plinthGeo.dispose();
      shadowGeo.dispose();
      shadowTexture.dispose();
      shadowMat.dispose();
      podiumGeo.dispose();
      towerCoreGeo.dispose();
      towerHighGeo.dispose();
      pavilionGeo.dispose();
      glassStripGeo1.dispose();
      highGlassGeo.dispose();
      balconyGeo1.dispose();
      balconyGeo2.dispose();
      balconyGeo3.dispose();
      finGeo.dispose();
      roofTrellisGeo.dispose();
      pavilionRoofGeo.dispose();

      stoneMaterial.dispose();
      warmIvoryMaterial.dispose();
      bronzeTrimMaterial.dispose();
      darkAccentMaterial.dispose();
      glassMaterial.dispose();

      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Polished Static Fallback (for mobile, unsupported WebGL, or reduced-motion)
  if (!hasWebGL) {
    return (
      <div className="w-full h-full min-h-[380px] flex items-center justify-center p-6 bg-[#F7F5EE] rounded-xs border border-[#E6E4DF]">
        <div className="text-center space-y-3 max-w-sm">
          <div className="w-16 h-24 mx-auto border-2 border-[#162E52]/40 rounded-xs flex flex-col justify-end p-2 bg-white/60">
            <div className="w-full h-1/2 border-t border-[#BFA054] flex gap-1 pt-1">
              <div className="w-1/2 h-full bg-[#162E52]/10" />
              <div className="w-1/2 h-full bg-[#162E52]/10" />
            </div>
          </div>
          <p className="text-xs text-[#7A7771] uppercase tracking-wider font-medium">
            Architectural Form Concept
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[380px] sm:h-[460px] lg:h-[520px] select-none touch-pan-y"
      aria-hidden="true"
    />
  );
};

export default ArchitecturalModel3D;
