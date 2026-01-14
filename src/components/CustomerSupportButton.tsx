import { MessageCircle } from 'lucide-react';

const CustomerSupportButton = () => {
  const whatsappNumber = '2347038315942';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hello! I need assistance.`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20BA5C] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
      aria-label="Contact Support via WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  );
};

export default CustomerSupportButton;
