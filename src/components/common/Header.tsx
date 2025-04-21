import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield, LogIn, UserCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Button } from './Button';
import { cn } from '../../utils/cn';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuthStore();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Courses', path: '/courses' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled 
          ? 'bg-tactical-900/95 backdrop-blur-sm py-2 shadow-md' 
          : 'bg-transparent py-4'
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center" onClick={closeMenu}>
          <Shield className="w-7 h-7 text-accent-500 mr-2" />
          <span className="text-white font-heading font-semibold text-xl">
            ELITE TACTICAL
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <ul className="flex space-x-8">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-white',
                    location.pathname === item.path 
                      ? 'text-white' 
                      : 'text-gray-300'
                  )}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm" className="text-white">
                    <UserCircle className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={() => logout()} className="text-white border-gray-600">
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-white">
                    <LogIn className="w-4 h-4 mr-2" />
                    Log In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="accent" size="sm">
                    Join Now
                  </Button>
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="p-2 md:hidden text-white"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-tactical-900/95 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <ul className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      'block text-base font-medium py-2 transition-colors hover:text-white',
                      location.pathname === item.path 
                        ? 'text-white' 
                        : 'text-gray-300'
                    )}
                    onClick={closeMenu}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              
              <li className="border-t border-gray-800 pt-4 mt-4">
                {isAuthenticated ? (
                  <>
                    <Link 
                      to="/dashboard" 
                      className="block text-white py-2"
                      onClick={closeMenu}
                    >
                      Dashboard
                    </Link>
                    <button 
                      className="block text-gray-300 py-2"
                      onClick={() => {
                        logout();
                        closeMenu();
                      }}
                    >
                      Log Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      className="block text-white py-2"
                      onClick={closeMenu}
                    >
                      Log In
                    </Link>
                    <Link 
                      to="/register" 
                      className="block text-accent-500 py-2"
                      onClick={closeMenu}
                    >
                      Join Now
                    </Link>
                  </>
                )}
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
};