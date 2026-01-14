import { Instagram, Facebook, MessageCircle, Mail, Phone, MapPin, ArrowUp, Heart } from 'lucide-react';
import brandLogo from '@/assets/brand-logo.png';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-charcoal text-cream section-padding relative" role="contentinfo">
      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center focus-ring"
        aria-label="Scroll back to top"
      >
        <ArrowUp className="w-5 h-5" aria-hidden="true" />
      </button>

      <div className="container-narrow mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <a 
              href="#" 
              className="flex items-center gap-2 mb-4 focus-ring rounded-lg inline-block"
              onClick={(e) => {
                e.preventDefault();
                scrollToTop();
              }}
              aria-label="Beauty in it's entirety - Back to top"
            >
              <img src={brandLogo} alt="" className="h-12 w-auto" aria-hidden="true" />
            </a>
            <p className="font-body text-sm text-cream/70 mb-6 leading-relaxed">
              Crafting elegance, one stitch at a time. 
              Your home-based bespoke tailoring experience.
            </p>
            <div className="flex gap-3" role="list" aria-label="Social media links">
              <a 
                href="https://instagram.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-cream/10 hover:bg-primary text-cream hover:text-primary-foreground transition-all duration-300 hover:scale-110 focus-ring"
                aria-label="Follow us on Instagram"
                role="listitem"
              >
                <Instagram className="w-5 h-5" aria-hidden="true" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-cream/10 hover:bg-primary text-cream hover:text-primary-foreground transition-all duration-300 hover:scale-110 focus-ring"
                aria-label="Follow us on Facebook"
                role="listitem"
              >
                <Facebook className="w-5 h-5" aria-hidden="true" />
              </a>
              <a 
                href="https://web.whatsapp.com/send?phone=2347038315942"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-cream/10 hover:bg-[#25D366] text-cream transition-all duration-300 hover:scale-110 focus-ring"
                aria-label="Message us on WhatsApp"
                role="listitem"
              >
                <MessageCircle className="w-5 h-5" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <nav aria-label="Footer navigation">
            <h4 className="font-display text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3 font-body text-sm text-cream/70">
              <li>
                <a 
                  href="#services" 
                  className="hover:text-primary transition-colors focus-ring rounded inline-block py-1"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Services
                </a>
              </li>
              <li>
                <a 
                  href="#booking" 
                  className="hover:text-primary transition-colors focus-ring rounded inline-block py-1"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Book Appointment
                </a>
              </li>
              <li>
                <a 
                  href="#track" 
                  className="hover:text-primary transition-colors focus-ring rounded inline-block py-1"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('track')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Track Order
                </a>
              </li>
              <li>
                <a 
                  href="/auth" 
                  className="hover:text-primary transition-colors focus-ring rounded inline-block py-1"
                >
                  Customer Login
                </a>
              </li>
            </ul>
          </nav>

          {/* Services */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-3 font-body text-sm text-cream/70">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" aria-hidden="true" />
                Custom Tailoring
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" aria-hidden="true" />
                Alterations
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" aria-hidden="true" />
                Bridal Wear
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" aria-hidden="true" />
                Consultations
              </li>
            </ul>
          </div>

          {/* Contact */}
          <address className="not-italic">
            <h4 className="font-display text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-4 font-body text-sm text-cream/70">
              <li>
                <a 
                  href="tel:+2347038315942" 
                  className="flex items-center gap-3 hover:text-primary transition-colors focus-ring rounded py-1"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-primary" aria-hidden="true" />
                  </div>
                  07038315942
                </a>
              </li>
              <li>
                <a 
                  href="https://web.whatsapp.com/send?phone=2347038315942"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 hover:text-primary transition-colors focus-ring rounded py-1"
                >
                  <div className="w-8 h-8 rounded-full bg-[#25D366]/20 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-4 h-4 text-[#25D366]" aria-hidden="true" />
                  </div>
                  WhatsApp: 07038315942
                </a>
              </li>
              <li>
                <a 
                  href="mailto:dressbyorekelewa@gmail.com"
                  className="flex items-center gap-3 hover:text-primary transition-colors focus-ring rounded py-1"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-primary" aria-hidden="true" />
                  </div>
                  <span className="break-all">dressbyorekelewa@gmail.com</span>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-primary" aria-hidden="true" />
                </div>
                <span>Peter Odili Road,<br />Port-Harcourt, Rivers, Nigeria</span>
              </li>
            </ul>
          </address>
        </div>

        <div className="pt-8 border-t border-cream/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <p className="font-body text-sm text-cream/50">
              © {currentYear} Beauty in it's entirety. All rights reserved.
            </p>
            <p className="font-body text-sm text-cream/50 flex items-center gap-1">
              Crafted with <Heart className="w-4 h-4 text-primary fill-primary" aria-label="love" /> in Nigeria
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
