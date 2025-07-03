
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Car, Globe, Users, LogIn, User, Menu, X, Zap } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'CabBuddy', path: '/cabbuddy', icon: Car, emoji: '🚕' },
    { name: 'TripBuddy', path: '/tripbuddy', icon: Globe, emoji: '🌍' },
    { name: 'OutingBuddy', path: '/outingbuddy', icon: Users, emoji: '🧍' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-red-600/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <Zap className="w-8 h-8 text-red-500 group-hover:text-red-400 transition-colors" />
            <span className="sith-text text-xl font-bold bg-gradient-to-r from-red-500 to-purple-500 bg-clip-text text-transparent">
              VITravelBuddy
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  className={`
                    lightsaber-glow transition-all duration-300
                    ${isActive(item.path) 
                      ? 'bg-red-600 text-white border-red-500' 
                      : 'text-gray-300 hover:text-white hover:bg-red-600/20 border-transparent'
                    }
                  `}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  <span className="hidden lg:inline">{item.emoji}</span>
                  {item.name}
                </Button>
              </Link>
            ))}
          </div>

          {/* Auth Button */}
          <div className="hidden md:flex items-center">
            {user ? (
              <Link to="/dashboard">
                <Button variant="outline" className="lightsaber-glow bg-black/50 border-purple-600 text-white hover:bg-purple-600/20">
                  <User className="w-4 h-4 mr-2" />
                  Imperial Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button variant="outline" className="lightsaber-glow bg-black/50 border-red-600 text-white hover:bg-red-600/20">
                  <LogIn className="w-4 h-4 mr-2" />
                  Join the Empire
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:bg-red-600/20"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-red-600/30">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link 
                  key={item.path} 
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button
                    variant={isActive(item.path) ? "default" : "ghost"}
                    className={`
                      w-full justify-start lightsaber-glow
                      ${isActive(item.path) 
                        ? 'bg-red-600 text-white' 
                        : 'text-gray-300 hover:text-white hover:bg-red-600/20'
                      }
                    `}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.emoji} {item.name}
                  </Button>
                </Link>
              ))}
              
              <div className="pt-2 border-t border-gray-700">
                {user ? (
                  <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-start lightsaber-glow bg-black/50 border-purple-600 text-white hover:bg-purple-600/20">
                      <User className="w-4 h-4 mr-2" />
                      Imperial Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-start lightsaber-glow bg-black/50 border-red-600 text-white hover:bg-red-600/20">
                      <LogIn className="w-4 h-4 mr-2" />
                      Join the Empire
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
