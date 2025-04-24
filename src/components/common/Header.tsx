import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogIn, UserCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Button } from './Button';
import { cn } from '../../utils/cn';

// Define the variant prop type
interface HeaderProps {
  variant?: 'default' | 'dark-text';
}

export const Header: React.FC<HeaderProps> = ({ variant = 'default' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuthStore();

  // Define text colors based on variant
  const logoTextColor = variant === 'dark-text' ? 'text-tactical-900' : 'text-white';
  const activeLinkColor = variant === 'dark-text' ? 'text-tactical-900' : 'text-white';
  const inactiveLinkColor = variant === 'dark-text' ? 'text-gray-700' : 'text-gray-300';
  const hoverLinkColor = variant === 'dark-text' ? 'hover:text-tactical-900' : 'hover:text-white';
  const buttonTextColor = variant === 'dark-text' ? 'text-tactical-900' : 'text-white';
  const mobileMenuTextColor = variant === 'dark-text' ? 'text-tactical-900' : 'text-white';
  const mobileInactiveLinkColor = variant === 'dark-text' ? 'text-gray-700' : 'text-gray-300';


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

  // Determine header background based on scroll, menu state, and variant
  const headerBgClass = variant === 'dark-text'
    ? 'bg-white/95 backdrop-blur-sm py-2 shadow-md'
    : isScrolled
    ? 'bg-tactical-900/95 backdrop-blur-sm py-2 shadow-md'
    : 'bg-transparent py-4';

  // Determine mobile menu background based on variant
  const mobileMenuBgClass = variant === 'dark-text' ? 'bg-white/95' : 'bg-tactical-900/95';


  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        headerBgClass
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between py-1 md:py-2 lg:py-2">
        <Link to="/" className="flex items-center" onClick={closeMenu}>
          <img src="https://i.imgur.com/0jZnTpQ.png" alt="Elite Tactical Logo" className="h-10 w-auto md:h-12 lg:h-12 max-h-12" style={{ maxWidth: '120px' }} />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <ul className="flex space-x-8">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    'text-sm font-medium transition-colors',
                     hoverLinkColor, // Apply conditional hover color
                    location.pathname === item.path
                      ? activeLinkColor // Apply conditional active color
                      : inactiveLinkColor // Apply conditional inactive color
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
                  <Button variant="ghost" size="sm" className={cn(
                    buttonTextColor,
                    // Custom hover for Dashboard button
                    "hover:text-accent-600 hover:bg-accent-100"
                  )}>
                    <UserCircle className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button
                    variant="outline" // Use standard outline variant
                    size="sm"
                    onClick={() => logout()}
                    // Apply conditional text and border colors for the dark-text variant
                    className={cn(
                      variant === 'dark-text'
                        ? 'text-tactical-700 border-gray-400 hover:bg-gray-100 hover:text-tactical-900'
                        : 'text-white border-gray-600 hover:bg-white/10 hover:text-white'
                    )}
                 >
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className={cn(
                    buttonTextColor,
                    // Custom hover for Log In button
                    "hover:text-accent-600 hover:bg-accent-100"
                  )}>
                    <LogIn className="w-4 h-4 mr-2" />
                    Log In
                  </Button>
                </Link>
                <Link to="/register">
                  {/* Accent button likely doesn't need text color change, but check visually */}
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
          className={cn("p-2 md:hidden", buttonTextColor)} // Apply conditional text color
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
         <div className={cn("md:hidden backdrop-blur-sm", mobileMenuBgClass)}> {/* Apply conditional mobile menu background */}
          <div className="container mx-auto px-4 py-4">
            <ul className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      'block text-base font-medium py-2 transition-colors',
                      hoverLinkColor, // Apply conditional hover color
                      location.pathname === item.path
                        ? mobileMenuTextColor // Use mobile-specific active color
                        : mobileInactiveLinkColor // Use mobile-specific inactive color
                    )}
                    onClick={closeMenu}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}

              <li className={cn(
                  "border-t pt-4 mt-4",
                  variant === 'dark-text' ? 'border-gray-300' : 'border-gray-800' // Adjust border color
                 )}
              >
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/dashboard"
                      className={cn("block py-2", mobileMenuTextColor)} // Apply conditional mobile text color
                      onClick={closeMenu}
                    >
                      Dashboard
                    </Link>
                    <button
                      className={cn("block w-full text-left py-2", mobileInactiveLinkColor)} // Apply conditional mobile text color
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
                      className={cn("block py-2", mobileMenuTextColor)} // Apply conditional mobile text color
                      onClick={closeMenu}
                    >
                      Log In
                    </Link>
                    <Link
                      to="/register"
                      // Adjust accent color slightly if needed for contrast on white background
                      className={cn("block py-2", variant === 'dark-text' ? 'text-accent-600 hover:text-accent-700' : 'text-accent-500 hover:text-accent-400')}
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