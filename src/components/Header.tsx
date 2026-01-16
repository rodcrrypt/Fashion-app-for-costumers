import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogIn, LogOut, User, ChevronDown, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import brandLogo from '@/assets/brand-logo.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#services', label: 'Services' },
    { href: '#booking', label: 'Book Appointment' },
    { href: '#track', label: 'Track Order' },
    { href: '#contact', label: 'Contact' },
  ];

  const scrollToSection = (href: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const id = href.replace('#', '');
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const id = href.replace('#', '');
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Skip Link for Accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-background/95 backdrop-blur-md shadow-md' 
            : 'bg-background/80 backdrop-blur-sm'
        } border-b border-border/50`}
        role="banner"
      >
        <div className="container-narrow mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <a 
              href="#" 
              className="flex items-center gap-2 focus-ring rounded-lg"
              aria-label="Beauty in it's entirety - Home"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <img 
                src={brandLogo} 
                alt="" 
                className="h-10 md:h-12 w-auto transition-transform hover:scale-105" 
                aria-hidden="true"
              />
              <span className="sr-only">Beauty in it's entirety</span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1" role="navigation" aria-label="Main navigation">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className="font-body text-sm text-muted-foreground hover:text-primary px-4 py-2 rounded-lg transition-all duration-300 hover:bg-primary/5 focus-ring"
                >
                  {link.label}
                </button>
              ))}
              {isAdmin && (
                <>
                  <span className="w-px h-6 bg-border/50 mx-2" aria-hidden="true" />
                  <button
                    onClick={() => navigate('/admin')}
                    className={`font-body text-sm font-medium px-4 py-2 rounded-lg transition-all duration-300 focus-ring flex items-center gap-2 ${
                      location.pathname === '/admin' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-primary hover:bg-primary/10'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Admin Dashboard
                  </button>
                </>
              )}
            </nav>

            {/* Auth Buttons - Desktop */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-border/50">
                    <User className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                    <span className="text-sm text-muted-foreground">
                      {isAdmin ? (
                        <span className="text-primary font-medium">Owner</span>
                      ) : (
                        'Account'
                      )}
                    </span>
                  </div>
                  <Button 
                    variant="outline" 
                    className="rounded-full px-4 focus-ring"
                    onClick={() => signOut()}
                    aria-label="Sign out of your account"
                  >
                    <LogOut className="w-4 h-4 mr-2" aria-hidden="true" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <a href="/auth">
                  <Button className="btn-primary rounded-full px-6 focus-ring group">
                    <LogIn className="w-4 h-4 mr-2" aria-hidden="true" />
                    Login
                    <ChevronDown className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity rotate-[-90deg]" aria-hidden="true" />
                  </Button>
                </a>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-foreground rounded-lg focus-ring hover:bg-secondary/50 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          <nav
            id="mobile-menu"
            className={`md:hidden overflow-hidden transition-all duration-300 ${
              isMenuOpen ? 'max-h-96 opacity-100 py-4' : 'max-h-0 opacity-0'
            } border-t border-border/50`}
            role="navigation"
            aria-label="Mobile navigation"
            aria-hidden={!isMenuOpen}
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className="font-body text-base text-muted-foreground hover:text-primary transition-colors duration-300 py-3 px-4 rounded-lg hover:bg-primary/5 text-left focus-ring"
                  tabIndex={isMenuOpen ? 0 : -1}
                >
                  {link.label}
                </button>
              ))}
              {isAdmin && (
                <>
                  <div className="pt-2 mt-2 border-t border-border/50">
                    <span className="text-xs text-muted-foreground px-4 uppercase tracking-wider">Admin</span>
                  </div>
                  <button
                    onClick={() => {
                      navigate('/admin');
                      setIsMenuOpen(false);
                    }}
                    className={`font-body text-base font-medium transition-colors duration-300 py-3 px-4 rounded-lg text-left focus-ring flex items-center gap-2 ${
                      location.pathname === '/admin' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-primary hover:bg-primary/10'
                    }`}
                    tabIndex={isMenuOpen ? 0 : -1}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Admin Dashboard
                  </button>
                </>
              )}
              
              <div className="pt-4 mt-2 border-t border-border/50">
                {user ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 px-4 py-2">
                      <User className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                      <span className="text-sm text-muted-foreground">
                        {isAdmin ? (
                          <span className="text-primary font-medium">Owner Account</span>
                        ) : (
                          'Customer Account'
                        )}
                      </span>
                    </div>
                    <Button 
                      variant="outline" 
                      className="rounded-full w-full focus-ring"
                      onClick={() => signOut()}
                      tabIndex={isMenuOpen ? 0 : -1}
                    >
                      <LogOut className="w-4 h-4 mr-2" aria-hidden="true" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <a href="/auth" onClick={() => setIsMenuOpen(false)} tabIndex={isMenuOpen ? 0 : -1}>
                    <Button className="btn-primary rounded-full w-full focus-ring">
                      <LogIn className="w-4 h-4 mr-2" aria-hidden="true" />
                      Login
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
