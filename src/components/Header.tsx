
import { Heart, Mail } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-pink-soft sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-center gap-3">
          <div className="relative">
            <Mail className="w-8 h-8 text-pink-500" />
            <Heart className="w-4 h-4 text-pink-400 absolute -top-1 -right-1" />
          </div>
          <h1 className="text-2xl font-bold text-gradient-pink">
            Correio Elegante Escolar
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
