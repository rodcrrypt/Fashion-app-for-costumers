import { MessageCircle, Phone, X, Mail, Copy, Check } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { toast } from '@/hooks/use-toast';

const CustomerSupportButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const whatsappNumber = '07038315942';
  const internationalNumber = '+2347038315942';
  const email = 'dressbyorekelewa@gmail.com';

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText(internationalNumber);
      setCopied(true);
      toast({
        title: 'Copied!',
        description: 'Phone number copied to clipboard',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: 'Unable to copy',
        description: 'Please copy manually: ' + whatsappNumber,
        variant: 'destructive',
      });
    }
  };

  return (
    <div ref={containerRef} className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Contact options popup */}
      {isOpen && (
        <div 
          className="bg-card border border-border rounded-2xl shadow-2xl p-5 animate-in slide-in-from-bottom-4 fade-in duration-300 w-72"
          role="dialog"
          aria-labelledby="contact-dialog-title"
          aria-modal="true"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 id="contact-dialog-title" className="font-display text-lg font-semibold text-foreground">
              Contact Us
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-secondary transition-colors focus-ring"
              aria-label="Close contact options"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">
            Choose your preferred way to reach us:
          </p>

          <div className="flex flex-col gap-2">
            {/* WhatsApp Web */}
            <a
              href={`https://web.whatsapp.com/send?phone=${internationalNumber.replace('+', '')}&text=Hello! I need assistance.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 bg-[#25D366] hover:bg-[#20BA5C] text-white rounded-xl transition-all duration-200 hover-lift focus-ring text-sm font-medium"
            >
              <MessageCircle className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
              <div className="flex-1 text-left">
                <span className="block font-medium">WhatsApp Web</span>
                <span className="block text-xs text-white/80">Opens in browser</span>
              </div>
            </a>

            {/* Direct Call */}
            <a
              href={`tel:${internationalNumber}`}
              className="flex items-center gap-3 px-4 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl transition-all duration-200 hover-lift focus-ring text-sm font-medium"
            >
              <Phone className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
              <div className="flex-1 text-left">
                <span className="block font-medium">Call Us</span>
                <span className="block text-xs opacity-80">{whatsappNumber}</span>
              </div>
            </a>

            {/* Email */}
            <a
              href={`mailto:${email}?subject=Inquiry from Website`}
              className="flex items-center gap-3 px-4 py-3 bg-secondary hover:bg-secondary/80 text-foreground rounded-xl transition-all duration-200 hover-lift focus-ring text-sm font-medium border border-border"
            >
              <Mail className="w-5 h-5 flex-shrink-0 text-muted-foreground" aria-hidden="true" />
              <div className="flex-1 text-left">
                <span className="block font-medium">Email Us</span>
                <span className="block text-xs text-muted-foreground truncate">{email}</span>
              </div>
            </a>

            {/* Copy Number */}
            <button
              onClick={copyNumber}
              className="flex items-center gap-3 px-4 py-3 bg-muted/50 hover:bg-muted text-foreground rounded-xl transition-all duration-200 focus-ring text-sm font-medium border border-border/50"
            >
              {copied ? (
                <Check className="w-5 h-5 flex-shrink-0 text-green-500" aria-hidden="true" />
              ) : (
                <Copy className="w-5 h-5 flex-shrink-0 text-muted-foreground" aria-hidden="true" />
              )}
              <div className="flex-1 text-left">
                <span className="block font-medium">{copied ? 'Copied!' : 'Copy Number'}</span>
                <span className="block text-xs text-muted-foreground">{whatsappNumber}</span>
              </div>
            </button>
          </div>

          {/* Hours */}
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              Available Mon-Sat, 9am - 6pm WAT
            </p>
          </div>
        </div>
      )}

      {/* Main button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center w-16 h-16 bg-[#25D366] hover:bg-[#20BA5C] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-[#25D366]/50 ${
          isOpen ? 'rotate-0' : 'animate-pulse-soft'
        }`}
        aria-label={isOpen ? "Close contact options" : "Open contact options - Chat with us on WhatsApp or call"}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        {isOpen ? (
          <X className="w-7 h-7" aria-hidden="true" />
        ) : (
          <MessageCircle className="w-7 h-7" aria-hidden="true" />
        )}
      </button>
      
      {/* Tooltip when closed */}
      {!isOpen && (
        <span className="sr-only">
          Contact us via WhatsApp, phone call, or email
        </span>
      )}
    </div>
  );
};

export default CustomerSupportButton;
