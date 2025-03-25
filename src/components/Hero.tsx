import React, { useEffect, useRef } from 'react';
import { ArrowRight, UserCircle, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

interface Particle {
  id: number;
  x: string;
  y: number;
  velocity: number;
  amplitude: number;
  phase: number;
}

const Particle = ({ delay = 0, x, y }: { delay: number; x: string; y: number }) => (
  <motion.div
    className="absolute w-2 h-2 rounded-full bg-primary/20 dark:bg-primary/40"
    initial={{ opacity: 0, scale: 0, y }}
    animate={{ 
      opacity: [0, 1, 0],
      scale: [0, 1.5, 0],
      y: [y, y - 40],
    }}
    transition={{ 
      duration: 3,
      delay,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    style={{ left: x }}
  />
);

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = React.useState<Particle[]>([]);
  const animationRef = useRef<number>();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/signup');
  };

  useEffect(() => {
    if (containerRef.current) {
      const width = containerRef.current.offsetWidth;
      const particleCount = Math.floor(width / 100);
      
      // Create particles with bouncing properties
      const newParticles = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: `${(i * 100 / particleCount)}%`,
        y: Math.random() * 100,
        velocity: Math.random() * 2 + 1,
        amplitude: Math.random() * 30 + 20,
        phase: Math.random() * Math.PI * 2
      }));
      
      setParticles(newParticles);

      // Animate particles
      let frame = 0;
      const animate = () => {
        frame += 0.02;
        setParticles(prev => prev.map(particle => ({
          ...particle,
          y: particle.y + Math.sin(frame + particle.phase) * 0.5
        })));
        animationRef.current = requestAnimationFrame(animate);
      };
      
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="relative min-h-screen flex items-center bg-white dark:bg-black transition-colors duration-300" ref={containerRef}>
      <motion.div 
        className="absolute inset-0"
        animate={{
          background: [
            "linear-gradient(to bottom, rgb(249 250 251 / 0.8), rgb(255 255 255 / 0.8))",
            "linear-gradient(to bottom, rgb(248 250 252 / 0.8), rgb(255 255 255 / 0.8))",
            "linear-gradient(to bottom, rgb(249 250 251 / 0.8), rgb(255 255 255 / 0.8))"
          ]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="absolute inset-0 dark:hidden"
      />
      
      <motion.div 
        className="absolute inset-0 hidden dark:block"
        animate={{
          background: [
            "linear-gradient(to bottom, rgb(17 24 39 / 0.8), rgb(0 0 0 / 0.8))",
            "linear-gradient(to bottom, rgb(24 31 46 / 0.8), rgb(0 0 0 / 0.8))",
            "linear-gradient(to bottom, rgb(17 24 39 / 0.8), rgb(0 0 0 / 0.8))"
          ]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      {particles.map((particle) => (
        <Particle
          key={particle.id}
          delay={particle.id * 0.2}
          x={particle.x}
          y={particle.y}
        />
      ))}
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white transition-colors duration-300">
            <span className="block">Personalized Solutions for</span>
            <span className="block text-primary mt-2">Creators</span>
          </h1>
          
          <motion.p 
            className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto transition-colors duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8,
              delay: 0.3,
              ease: [0.4, 0, 0.2, 1]
            }}
          >
            A Step Above General Social Media Support. Customized Solutions For Your Unique Needs
          </motion.p>
          
          <div className="mt-10 flex flex-col items-center space-y-4">
            <div className="flex justify-center gap-4">
              <Link to="/login" className="apple-button-primary inline-flex items-center">
                <UserCircle className="mr-2 h-5 w-5" />
                User Sign In
              </Link>
              <Link to="/admin/login" className="apple-button-secondary inline-flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Admin Sign In
              </Link>
            </div>
            
            <div className="flex justify-center gap-4">
              <button 
                onClick={handleGetStarted}
                className="apple-button-primary inline-flex items-center"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button className="apple-button-secondary border border-gray-200 dark:border-gray-800">
                Learn More
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}