'use client';

import { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number;
}

interface ParticleBgProps {
  particleCount?: number;
  connectionDistance?: number;
  mouseInfluence?: number;
  className?: string;
  colors?: number[]; // hue range [start, end]
  speed?: number; // 0-1, default 0.4
}

export default function ParticleBg({
  particleCount = 100,
  connectionDistance = 150,
  mouseInfluence = 80,
  className = '',
  colors = [260, 200], // violet to cyan
  speed = 0.4,
}: ParticleBgProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const animFrameRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.parentElement?.getBoundingClientRect();
    if (rect) {
      canvas.width = rect.width;
      canvas.height = rect.height;
    }
  }, []);

  const initParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { width, height } = canvas;
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const hueStart = colors[0];
      const hueEnd = colors[1];
      const hue = hueStart + Math.random() * (hueEnd - hueStart);
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: 0.6 + Math.random() * 2.4,
        opacity: 0.15 + Math.random() * 0.45,
        hue,
      });
    }
    particlesRef.current = particles;
  }, [particleCount, colors]);

  useEffect(() => {
    resizeCanvas();
    initParticles();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [resizeCanvas, initParticles]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };
    const handleMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const animate = (now: number) => {
      const dt = Math.min((now - lastTime) / 16.67, 3); // cap delta
      lastTime = now;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      for (const p of particles) {
        // Mouse attraction
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouseInfluence && dist > 0) {
          const force = (1 - dist / mouseInfluence) * 0.03 * speed;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        // Move
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        // Dampen velocity
        p.vx *= 0.999;
        p.vy *= 0.999;

        // Wrap around
        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;
        if (p.y < -20) p.y = canvas.height + 20;
        if (p.y > canvas.height + 20) p.y = -20;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 70%, 70%, ${p.opacity})`;
        ctx.fill();
      }

      // Draw constellation lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.15;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `hsla(${a.hue}, 60%, 65%, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [connectionDistance, mouseInfluence, speed]);

  return (
    <div ref={containerRef} className={`fixed inset-0 -z-10 overflow-hidden pointer-events-none ${className}`}>
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </div>
  );
}
