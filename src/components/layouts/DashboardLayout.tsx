import React, { useEffect, useRef } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { motion } from 'framer-motion';
import { Home, LogOut, Settings } from 'lucide-react';

export default function DashboardLayout() {
  const { signOut, isAdmin } = useAuthStore();
  const navigate = useNavigate();
  const starsRef = useRef<HTMLDivElement>(null);
  const starlightRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  // Create shooting star
  const createShootingStar = () => {
    if (!starsRef.current) return;
    
    const star = document.createElement('div');
    star.className = 'shooting-star';
    
    // Random position at the top of the screen
    const startX = Math.random() * window.innerWidth;
    star.style.left = `${startX}px`;
    star.style.top = '0px';
    
    starsRef.current.appendChild(star);
    
    // Remove the star after animation
    setTimeout(() => {
      star.remove();
    }, 1000);
  };

  // Create starlight effect
  const createStarlight = () => {
    if (!starlightRef.current) return;
    
    const starlight = document.createElement('div');
    starlight.className = 'starlight';
    
    const size = Math.random() * 100 + 50;
    starlight.style.width = `${size}px`;
    starlight.style.height = `${size}px`;
    
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * 200;
    
    starlight.style.left = `${x}px`;
    starlight.style.top = `${y}px`;
    
    starlightRef.current.appendChild(starlight);
    
    // Remove after animation
    setTimeout(() => {
      starlight.remove();
    }, 4000);
  };

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

    // Start shooting stars
    const shootingStarInterval = setInterval(createShootingStar, 2000);
    
    // Start starlight effect
    const starlightInterval = setInterval(createStarlight, 1000);

    window.addEventListener('mousemove', handleMouseMove);
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      clearInterval(shootingStarInterval);
      clearInterval(starlightInterval);
    };
  }, []);

  return (
    <div className="dashboard-container overflow-hidden">
      <div ref={starsRef} className="absolute inset-0 pointer-events-none" />
      <div ref={starlightRef} className="starlight-container" />
      
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-transparent via-[--dashboard-bg]/50 to-[--dashboard-bg] pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      />

      <nav className="relative z-10 bg-[--card-bg] backdrop-blur-xl border-b border-[--card-border]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-semibold text-white">
                {isAdmin ? 'Admin Dashboard' : 'Dashboard'}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="text-white/60 hover:text-white transition-colors duration-200"
              >
                <Home className="h-5 w-5" />
              </Link>
              <Link
                to="/settings"
                className="text-white/60 hover:text-white transition-colors duration-200"
              >
                <Settings className="h-5 w-5" />
              </Link>
              <button
                onClick={handleSignOut}
                className="text-white/60 hover:text-white transition-colors duration-200"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <motion.div 
          className="dashboard-card p-8"
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
      </main>
    </div>
  );
}