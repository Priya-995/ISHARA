import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
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
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navItems = [
    { label: 'Home', href: 'home', public: true },
    { label: 'Features', href: 'features', public: true },
    { label: 'Use Cases', href: 'use-cases', public: true },
    { label: 'Impact', href: 'impact', public: true },
    { label: 'Pricing', href: 'pricing', public: true },
    { label: 'About', href: 'about', public: true },
    { label: 'Support', href: 'support', public: true },
  ];

  const isActiveRoute = (href: string) => {
    return location.pathname === href;
  };

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const isHomePage = location.pathname === '/';

    if (isHomePage && (href.startsWith('features') || href.startsWith('use-cases') || href.startsWith('impact') || href.startsWith('pricing') || href.startsWith('about'))) {
      return (
        <ScrollLink
          to={href}
          smooth={true}
          duration={500}
          offset={-80}
          className="cursor-pointer text-sm font-semibold transition-colors text-gray-600 hover:text-ishara-blue"
        >
          {children}
        </ScrollLink>
      );
    }

    if (!isHomePage && (href.startsWith('features') || href.startsWith('use-cases') || href.startsWith('impact') || href.startsWith('pricing') || href.startsWith('about'))) {
        return (
            <RouterLink to={`/#${href}`} className="text-sm font-semibold transition-colors text-gray-600 hover:text-ishara-blue">
                {children}
            </RouterLink>
        );
    }
      
    return (
      <RouterLink
        to={href === 'home' ? '/' : `/${href}`}
        className={`text-sm font-semibold transition-colors hover:text-ishara-blue ${
          location.pathname === `/${href}` || (href === 'home' && location.pathname === '/')
            ? 'text-ishara-blue'
            : 'text-gray-600'
        }`}
      >
        {children}
      </RouterLink>
    );
  };

  return (
    <nav className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled ? 'border-b border-gray-200/50 bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <RouterLink to="/" className="flex items-center space-x-2 font-bold text-2xl text-ishara-blue hover:text-ishara-teal transition-colors">
            <img src="/lk5GFyFTTvqYupHbQQDAQQ-removebg-preview.png" alt="Ishara Logo" className="w-16 h-16" />
            <span className="font-extrabold tracking-tight">ISHARA</span>
          </RouterLink>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
                <NavLink key={item.href} href={item.href}>
                    {item.label}
                </NavLink>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="sm" asChild>
                    <RouterLink to="/dashboard">Dashboard</RouterLink>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.photoURL || "/avatar-placeholder.png"} alt={user.displayName || "User"} />
                        <AvatarFallback>{user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
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
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <RouterLink to="/profile">Profile</RouterLink>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <RouterLink to="/dashboard">Dashboard</RouterLink>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-red-500 focus:text-red-500">
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                    <RouterLink to="/login">Login</RouterLink>
                </Button>
                <Button className="bg-ishara-gradient hover:opacity-90 text-white rounded-full px-5" size="sm" asChild>
                    <RouterLink to="/signup">Sign Up</RouterLink>
                </Button>
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-4 pt-2">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <RouterLink
                  key={item.href}
                  to={item.href.includes('#') ? item.href : `/${item.href}`}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActiveRoute(item.href)
                      ? 'bg-ishara-blue/10 text-ishara-blue'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </RouterLink>
              ))}
              
              <div className="border-t pt-4 mt-4">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-3 py-2">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.photoURL || "/avatar-placeholder.png"} alt={user.displayName || "User"} />
                        <AvatarFallback>{user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{user.displayName || 'User'}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <RouterLink to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>Profile</RouterLink>
                    <RouterLink to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>Dashboard</RouterLink>
                    <button onClick={() => { logout(); setIsMenuOpen(false); }} className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-red-50">
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full" asChild>
                        <RouterLink to="/login" onClick={() => setIsMenuOpen(false)}>Login</RouterLink>
                    </Button>
                    <Button className="w-full bg-ishara-gradient text-white" asChild>
                        <RouterLink to="/signup" onClick={() => setIsMenuOpen(false)}>Sign Up</RouterLink>
                    </Button>
                  </div>
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
