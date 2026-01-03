import { useState } from 'react';
import { Menu, X, Scissors } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: '#services', label: 'Services' },
    { href: '#booking', label: 'Book Appointment' },
    { href: '#track', label: 'Track Order' },
    { href: '#about', label: 'About' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container-narrow mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2">
            <Scissors className="w-6 h-6 text-primary" />
            <span className="font-display text-xl md:text-2xl font-semibold text-foreground">
              Orekelewa
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-body text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA Button - Desktop */}
          <Button className="hidden md:inline-flex btn-primary rounded-full px-6">
            Book Now
          </Button>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="font-body text-base text-muted-foreground hover:text-primary transition-colors duration-300 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <Button className="btn-primary rounded-full w-full mt-2">
                Book Now
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
