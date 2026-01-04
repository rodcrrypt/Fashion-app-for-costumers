import { Scissors, Instagram, Facebook, MessageCircle, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer id="contact" className="bg-charcoal text-cream section-padding">
      <div className="container-narrow mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <a href="#" className="flex items-center gap-2 mb-4">
              <Scissors className="w-6 h-6 text-primary" />
              <span className="font-display text-xl font-semibold">
                Beauty
              </span>
            </a>
            <p className="font-body text-sm text-cream/70 mb-6">
              Crafting elegance, one stitch at a time. 
              Your home-based bespoke tailoring experience.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 rounded-full bg-cream/10 hover:bg-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-cream/10 hover:bg-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-cream/10 hover:bg-primary transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 font-body text-sm text-cream/70">
              <li><a href="#services" className="hover:text-primary transition-colors">Services</a></li>
              <li><a href="#booking" className="hover:text-primary transition-colors">Book Appointment</a></li>
              <li><a href="#track" className="hover:text-primary transition-colors">Track Order</a></li>
              <li><a href="#setup" className="hover:text-primary transition-colors">Setup Guide</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2 font-body text-sm text-cream/70">
              <li>Custom Tailoring</li>
              <li>Alterations</li>
              <li>Bridal Wear</li>
              <li>Consultations</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 font-body text-sm text-cream/70">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary" />
                07038315942
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle className="w-4 h-4 text-primary" />
                WhatsApp: 07038315942
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary" />
                dressbyorekelewa@gmail.com
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary mt-1" />
                Peter Odili Road,<br />Port-Harcourt, Rivers, Nigeria
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-cream/20 text-center">
          <p className="font-body text-sm text-cream/50">
            © 2026 Beauty. Crafted with love.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
