import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  ChevronDown,
  Menu,
  Paintbrush,
  ShoppingBag,
  User,
  Users,
  X,
  ShieldAlert
} from 'lucide-react';

const NavLink = ({ to, children, className }: { to: string; children: React.ReactNode; className?: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={cn(
        'relative font-medium text-sm px-3 py-2 transition-all duration-300',
        isActive 
          ? 'text-foreground after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-foreground' 
          : 'text-muted-foreground hover:text-foreground',
        className
      )}
    >
      {children}
    </Link>
  );
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    // Check if user is admin (for demo purposes)
    const checkAdmin = async () => {
      try {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
          const parsedUser = JSON.parse(currentUser);
          // For demo purposes, we consider the user with email rahulparathyagency@gmail.com as admin
          setIsAdmin(parsedUser.email === 'rahulparathyagency@gmail.com');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    checkAdmin();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 px-6 transition-all duration-300 ease-in-out',
        scrolled 
          ? 'py-4 bg-white/80 backdrop-blur-lg border-b' 
          : 'py-6 bg-transparent'
      )}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        <Link 
          to="/" 
          className="font-serif text-2xl font-bold tracking-tight flex items-center gap-2"
        >
          <span className="bg-gradient-to-r from-brand-blue to-brand-purple bg-clip-text text-transparent animate-pulse-soft">
            Bolt.diy
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/generate">Create</NavLink>
          <NavLink to="/marketplace">Marketplace</NavLink>
          <NavLink to="/creators">Creators</NavLink>
          <NavLink to="/dashboard">Dashboard</NavLink>
          {isAdmin && (
            <NavLink to="/admin">
              <div className="flex items-center">
                <ShieldAlert className="mr-1 h-4 w-4" />
                Admin
              </div>
            </NavLink>
          )}
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          <NavLink to="/auth">Sign In</NavLink>
          <Button size="sm" className="rounded-full" asChild>
            <Link to="/auth?action=signup">Get Started</Link>
          </Button>
        </div>
        
        {/* Mobile Navigation Toggle */}
        <button 
          className="md:hidden p-2 rounded-md"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>
      
      {/* Mobile Navigation Menu */}
      <div className={cn(
        'fixed inset-0 bg-white z-40 pt-24 px-6 transition-all duration-300 transform',
        mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      )}>
        <div className="flex flex-col space-y-6">
          <Link 
            to="/" 
            className="flex items-center gap-2 p-2" 
            onClick={() => setMobileMenuOpen(false)}
          >
            <Paintbrush size={20} />
            <span>Home</span>
          </Link>
          <Link 
            to="/generate" 
            className="flex items-center gap-2 p-2" 
            onClick={() => setMobileMenuOpen(false)}
          >
            <Paintbrush size={20} />
            <span>Create Art</span>
          </Link>
          <Link 
            to="/marketplace" 
            className="flex items-center gap-2 p-2" 
            onClick={() => setMobileMenuOpen(false)}
          >
            <ShoppingBag size={20} />
            <span>Marketplace</span>
          </Link>
          <Link 
            to="/creators" 
            className="flex items-center gap-2 p-2" 
            onClick={() => setMobileMenuOpen(false)}
          >
            <Users size={20} />
            <span>Creators</span>
          </Link>
          <Link 
            to="/dashboard" 
            className="flex items-center gap-2 p-2" 
            onClick={() => setMobileMenuOpen(false)}
          >
            <User size={20} />
            <span>Dashboard</span>
          </Link>
          {isAdmin && (
            <Link 
              to="/admin" 
              className="flex items-center gap-2 p-2" 
              onClick={() => setMobileMenuOpen(false)}
            >
              <ShieldAlert size={20} />
              <span>Admin</span>
            </Link>
          )}
          <div className="border-t pt-6 mt-4">
            <Button className="w-full mb-4" asChild>
              <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
            </Button>
            <Button className="w-full" variant="outline" asChild>
              <Link to="/auth?action=signup" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
