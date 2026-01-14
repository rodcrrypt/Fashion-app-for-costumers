import { MessageCircle } from 'lucide-react';
import { useState } from 'react';

const CustomerSupportButton = () => {
  const [isHovered, setIsHovered] = useState(false);
  const whatsappNumber = '2347038315942';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hello! I need assistance.`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#25D366] hover:bg-[#20BA5C] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#25D366]/50 px-4 py-3"
      aria-label="Chat with us on WhatsApp"
      role="button"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      <MessageCircle className="w-6 h-6" aria-hidden="true" />
      <span 
        className={`font-medium text-sm whitespace-nowrap transition-all duration-300 ${
          isHovered ? 'max-w-32 opacity-100' : 'max-w-0 opacity-0 overflow-hidden'
        }`}
      >
        Chat with us
      </span>
      <span className="sr-only">Opens WhatsApp in a new window</span>
    </a>
  );
};

export default CustomerSupportButton;
