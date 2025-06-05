import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Volume2, Eye, Accessibility } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { label: 'Home', href: '/', public: true },
    { label: 'Features', href: '#features', public: true },
    { label: 'Use Cases', href: '#use-cases', public: true },
    { label: 'Impact', href: '#impact', public: true },
    { label: 'Pricing', href: '#pricing', public: true },
    { label: 'About', href: '#about', public: true },
    { label: 'Support', href: '/support', public: true },
  ];

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
    document.body.classList.toggle('high-contrast');
  };

  const isActiveRoute = (href: string) => {
    return location.pathname === href;
  };

  return (
    <nav className={`sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 ${highContrast ? 'high-contrast' : ''}`}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 font-bold text-2xl text-ishara-blue hover:text-ishara-teal transition-colors">
            <img src="/lk5GFyFTTvqYupHbQQDAQQ-removebg-preview.png" alt="Ishara Logo" className="w-14 h-14" />
            <span>ISHARA</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              if (!item.public && !user) return null;
              if (item.href.startsWith('#')) {
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`text-sm font-medium transition-colors hover:text-ishara-blue ${
                      location.hash === item.href
                        ? 'text-ishara-blue border-b-2 border-ishara-blue'
                        : 'text-gray-600'
                    }`}
                  >
                    {item.label}
                  </a>
                );
              }
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`text-sm font-medium transition-colors hover:text-ishara-blue ${
                    isActiveRoute(item.href)
                      ? 'text-ishara-blue border-b-2 border-ishara-blue'
                      : 'text-gray-600'
                  }`}
                  aria-current={isActiveRoute(item.href) ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Accessibility Tools & Auth */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center space-x-2">
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm">Dashboard</Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.photoURL || "/avatar-placeholder.png"} alt={user.displayName || "User"} />
                        <AvatarFallback>{user.displayName ? user.displayName.charAt(0) : 'U'}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.displayName || 'User'}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.disabilityType || 'Not specified'}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link to="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link to="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-ishara-gradient hover:opacity-90 text-white" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 pt-2 border-t">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => {
                if (!item.public && !user) return null;
                if (item.href.startsWith('#')) {
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      className={`text-sm font-medium transition-colors hover:text-ishara-blue px-2 py-1 ${
                        location.hash === item.href ? 'text-ishara-blue' : 'text-gray-600'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  );
                }
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`text-sm font-medium transition-colors hover:text-ishara-blue px-2 py-1 ${
                      isActiveRoute(item.href) ? 'text-ishara-blue' : 'text-gray-600'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
              
              {/* Mobile Auth */}
              {user ? (
                <>
                  <div className="px-2 py-2 border-b">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.photoURL || "/avatar-placeholder.png"} alt={user.displayName || "User"} />
                        <AvatarFallback>{user.displayName ? user.displayName.charAt(0) : 'U'}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{user.displayName || 'User'}</span>
                        <span className="text-xs text-gray-500">{user.email}</span>
                      </div>
                    </div>
                  </div>
                  <Link to="/profile" className="px-2 py-1" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start">Profile</Button>
                  </Link>
                  <Link to="/dashboard" className="px-2 py-1" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start">Dashboard</Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={() => { logout(); setIsMenuOpen(false); }} className="w-full justify-start text-red-500 hover:text-red-600">
                    Logout
                  </Button>
                </>
              ) : (
                <div className="flex flex-col space-y-2 px-2 pt-2">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full">Login</Button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                    <Button className="bg-ishara-gradient hover:opacity-90 text-white w-full" size="sm">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
