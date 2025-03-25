import React, { useState, useEffect } from 'react';
import { MessageSquare, Menu, X, Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isDarkMode, toggleDarkMode } = useThemeStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/80 dark:bg-black/80 backdrop-blur-xl shadow-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 text-primary" />
            <span className="ml-2 text-xl font-semibold">Sendo</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Home</a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">About</a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Services</a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">Contact</a>
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button className="apple-button-primary">
              Get Help
            </button>
          </nav>

          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-black shadow-lg">
            <div className="px-4 py-6 space-y-4">
              <a href="#" className="block text-sm font-medium hover:text-primary">Home</a>
              <a href="#" className="block text-sm font-medium hover:text-primary">About</a>
              <a href="#" className="block text-sm font-medium hover:text-primary">Services</a>
              <a href="#" className="block text-sm font-medium hover:text-primary">Contact</a>
              <button className="w-full apple-button-primary">
                Get Help
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}