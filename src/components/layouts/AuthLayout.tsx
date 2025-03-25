import React, { useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AuthLayout() {
  const starsRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  useEffect(() => {
    const stars = Array.from({ length: 50 }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      velocity: Math.random() * 0.2 + 0.1,
    }));

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!starsRef.current) return;
      const rect = starsRef.current.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    };

    const animate = (time: number) => {
      if (previousTimeRef.current !== undefined) {
        stars.forEach((star, i) => {
          if (!starsRef.current) return;
          const starEl = starsRef.current.children[i] as HTMLDivElement;
          if (!starEl) return;

          star.y -= star.velocity;
          if (star.y < -10) star.y = 110;

          // Add subtle movement based on mouse position
          const offsetX = mouseX * 2;
          const offsetY = mouseY * 2;

          starEl.style.transform = `translate(
            ${star.x + offsetX}%,
            ${star.y + offsetY}%
          )`;
        });
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    // Create star elements
    if (starsRef.current) {
      starsRef.current.innerHTML = '';
      stars.forEach((star) => {
        const starEl = document.createElement('div');
        starEl.className = 'absolute rounded-full bg-white';
        starEl.style.width = starEl.style.height = `${star.size}px`;
        starEl.style.opacity = `${Math.random() * 0.7 + 0.3}`;
        starEl.style.transform = `translate(${star.x}%, ${star.y}%)`;
        starsRef.current?.appendChild(starEl);
      });
    }

    window.addEventListener('mousemove', handleMouseMove);
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gray-900">
      <div ref={starsRef} className="absolute inset-0 pointer-events-none" />
      
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-gray-900 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      />

      <motion.div 
        className="relative max-w-md w-full space-y-8 bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.8,
          delay: 0.2,
          ease: [0.4, 0, 0.2, 1]
        }}
      >
        <Outlet />
      </motion.div>
    </div>
  );
}