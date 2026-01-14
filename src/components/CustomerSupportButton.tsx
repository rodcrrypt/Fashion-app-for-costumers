import { MessageCircle, Phone, X } from 'lucide-react';
import { useState } from 'react';

const CustomerSupportButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const whatsappNumber = '07038315942';
  const internationalNumber = '+2347038315942';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Contact options popup */}
      {isOpen && (
        <div className="bg-card border border-border rounded-xl shadow-xl p-4 animate-in slide-in-from-bottom-2 fade-in duration-300">
          <p className="text-sm font-medium text-foreground mb-3">Contact us via:</p>
          <div className="flex flex-col gap-2">
            <a
              href={`https://web.whatsapp.com/send?phone=${internationalNumber.replace('+', '')}&text=Hello! I need assistance.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#20BA5C] text-white rounded-lg transition-colors text-sm font-medium"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Web
            </a>
            <a
              href={`tel:${internationalNumber}`}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors text-sm font-medium"
            >
              <Phone className="w-4 h-4" />
              Call: {whatsappNumber}
            </a>
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            {whatsappNumber}
          </p>
        </div>
      )}

      {/* Main button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20BA5C] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#25D366]/50"
        aria-label={isOpen ? "Close contact options" : "Open contact options"}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>
    </div>
  );
};

export default CustomerSupportButton;
