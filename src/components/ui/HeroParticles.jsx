import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function HeroParticles() {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Establish mobile responsiveness criteria
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(hover: none) or (max-width: 768px)').matches);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    if (isMobile) {
      return () => window.removeEventListener('resize', checkMobile);
    }

    const container = containerRef.current;
    if (!container) return;

    // Three.js Scene setup
    const scene = new THREE.Scene();
    
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Perspective Camera setup
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 6;

    // Antialiased alpha renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Create custom textures for Star and Crescent Moon
    const createStarTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#FAF3E0';
      ctx.beginPath();
      const cx = 32, cy = 32, spikes = 5, outerRadius = 28, innerRadius = 12;
      let rot = Math.PI / 2 * 3, step = Math.PI / spikes;
      ctx.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        ctx.lineTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius);
        rot += step;
        ctx.lineTo(cx + Math.cos(rot) * innerRadius, cy + Math.sin(rot) * innerRadius);
        rot += step;
      }
      ctx.closePath();
      ctx.fill();
      return new THREE.CanvasTexture(canvas);
    };

    const createMoonTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#FAF3E0';
      ctx.beginPath();
      ctx.arc(32, 32, 26, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(22, 22, 22, 0, Math.PI * 2);
      ctx.fill();
      return new THREE.CanvasTexture(canvas);
    };

    const starTexture = createStarTexture();
    const moonTexture = createMoonTexture();

    const particleGroup = new THREE.Group();
    scene.add(particleGroup);

    const createParticles = (texture, count, size) => {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 14;     // X
        positions[i + 1] = (Math.random() - 0.5) * 8;  // Y
        positions[i + 2] = (Math.random() - 0.5) * 6;  // Z
      }
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const material = new THREE.PointsMaterial({
        color: 0xC9952A,
        size: size,
        map: texture,
        transparent: true,
        opacity: 0.6,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      return new THREE.Points(geometry, material);
    };

    const stars = createParticles(starTexture, 150, 0.12);
    const moons = createParticles(moonTexture, 50, 0.18);

    particleGroup.add(stars);
    particleGroup.add(moons);

    // Interactive mouse trackers
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX / window.innerWidth) - 0.5;
      targetMouseY = (e.clientY / window.innerHeight) - 0.5;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      if (!container || !renderer.domElement) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Rendering Tick Loop
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Recurrent upward drift calculations
      const updateParticles = (points) => {
        const positionsArr = points.geometry.attributes.position.array;
        for (let i = 1; i < positionsArr.length; i += 3) {
          positionsArr[i] += 0.002; // Slower, smoother drift
          if (positionsArr[i] > 4) {
            positionsArr[i] = -4;
          }
        }
        points.geometry.attributes.position.needsUpdate = true;
      };

      updateParticles(stars);
      updateParticles(moons);

      // Mouse Parallax easing interpolation
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      particleGroup.rotation.y = mouseX * 0.3;
      particleGroup.rotation.x = -mouseY * 0.3;
      
      // Gentle spin overlay
      particleGroup.rotation.z = elapsedTime * 0.01;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      
      stars.geometry.dispose();
      stars.material.dispose();
      moons.geometry.dispose();
      moons.material.dispose();
      starTexture.dispose();
      moonTexture.dispose();
      renderer.dispose();
    };
  }, [isMobile]);

  if (isMobile) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
        <div className="absolute w-1 h-1 bg-[#C9952A] rounded-full opacity-60 animate-[pulse_3s_infinite] top-[18%] left-[12%]" />
        <div className="absolute w-2 h-2 bg-[#C9952A] rounded-full opacity-40 animate-[pulse_4s_infinite] top-[38%] left-[78%]" />
        <div className="absolute w-1.5 h-1.5 bg-[#C9952A] rounded-full opacity-50 animate-[pulse_3.5s_infinite] top-[72%] left-[22%]" />
        <div className="absolute w-1 h-1 bg-[#C9952A] rounded-full opacity-35 animate-[pulse_5s_infinite] top-[58%] left-[68%]" />
      </div>
    );
  }

  return <div ref={containerRef} className="absolute inset-0 pointer-events-none z-0 overflow-hidden" />;
}
