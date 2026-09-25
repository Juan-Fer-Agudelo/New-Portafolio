import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  color: string;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

interface BackgroundProps {
  variant?: 'navbar' | 'footer';
}

export const Background: React.FC<BackgroundProps> = ({ variant = 'footer' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = container.offsetWidth);
    let height = (canvas.height = container.offsetHeight);

    const mouse = { x: -1000, y: -1000, radius: variant === 'navbar' ? 80 : 120, active: false };

    const colors = [
      'rgba(59, 130, 246, ',
      'rgba(99, 102, 241, ',
      'rgba(168, 85, 247, ',
      'rgba(14, 165, 233, ',
    ];

    // Cantidad reducida y limpia de partículas
    const particleCount =
      variant === 'navbar'
        ? Math.max(6, Math.min(Math.floor(width / 140), 12))
        : Math.max(14, Math.min(Math.floor((width * height) / 18000), 28));

    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const colorBase = colors[i % colors.length];
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (variant === 'navbar' ? 0.35 : 0.5),
        vy: (Math.random() - 0.5) * (variant === 'navbar' ? 0.35 : 0.5),
        radius: variant === 'navbar' ? Math.random() * 1.2 + 0.8 : Math.random() * 1.5 + 1.0,
        baseAlpha: variant === 'navbar' ? Math.random() * 0.25 + 0.15 : Math.random() * 0.35 + 0.2,
        color: colorBase,
      });
    }

    const ripples: Ripple[] = [];

    const handleResize = () => {
      if (!canvas || !container) return;
      width = canvas.width = container.offsetWidth;
      height = canvas.height = container.offsetHeight;
    };

    // Coordenadas relativas al contenedor (footer)
    const toLocal = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const handleMouseMove = (e: MouseEvent) => {
      const { x, y } = toLocal(e.clientX, e.clientY);
      mouse.x = x;
      mouse.y = y;
      mouse.active = x >= 0 && y >= 0 && x <= width && y <= height;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleClick = (e: MouseEvent) => {
      const { x, y } = toLocal(e.clientX, e.clientY);
      if (x < 0 || y < 0 || x > width || y > height) return;
      if (ripples.length < 4) {
        ripples.push({ x, y, radius: 0, maxRadius: 150, alpha: 0.5 });
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleClick);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (mouse.active && mouse.x > 0 && mouse.y > 0) {
        const gradient = ctx.createRadialGradient(
          mouse.x, mouse.y, 0, mouse.x, mouse.y, mouse.radius
        );
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.1)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, mouse.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += 3.5;
        r.alpha -= 0.015;
        if (r.alpha <= 0 || r.radius >= r.maxRadius) {
          ripples.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(99, 102, 241, ${r.alpha})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const distSq = dx * dx + dy * dy;
        let currentAlpha = p.baseAlpha;

        if (distSq < mouse.radius * mouse.radius) {
          const dist = Math.sqrt(distSq) || 1;
          const force = (mouse.radius - dist) / mouse.radius;
          p.x += (dx / dist) * force * 1.1;
          p.y += (dy / dist) * force * 1.1;
          currentAlpha = Math.min(0.9, p.baseAlpha + force * 0.3);
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${currentAlpha})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const ndx = p.x - p2.x;
          const ndy = p.y - p2.y;
          const nDistSq = ndx * ndx + ndy * ndy;
          const maxDist = variant === 'navbar' ? 85 : 115;
          if (nDistSq < maxDist * maxDist) {
            const nDist = Math.sqrt(nDistSq);
            const lineAlpha = (1 - nDist / maxDist) * (variant === 'navbar' ? 0.14 : 0.2);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="footer-bg-animation"
      id="footer-background-container"
      aria-hidden="true"
    >
      {/* 1. Rejilla de puntos tecnológica */}
      <div
        className="footer-bg-grid"
        style={{
          backgroundImage: 'radial-gradient(circle, #3b82f6 1.2px, transparent 1.2px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* 2. Canvas de partículas interactivas */}
      <canvas ref={canvasRef} className="footer-bg-canvas" />

      {/* 3. Orbes de resplandor con movimiento flotante */}
      <motion.div
        animate={{ y: [0, -35, 0], x: [0, 25, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        className="footer-bg-orb footer-bg-orb--1"
      />
      <motion.div
        animate={{ y: [0, 30, 0], x: [0, -30, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        className="footer-bg-orb footer-bg-orb--2"
      />
      <motion.div
        animate={{ y: [0, -25, 0], x: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="footer-bg-orb footer-bg-orb--3"
      />
    </div>
  );
};
