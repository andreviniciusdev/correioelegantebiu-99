
import { Heart, Mail, Sparkles } from 'lucide-react';

const Header = () => {
  return (
    <header className="glass-effect border-b border-pink-200/50 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-center gap-4">
          <div className="relative animate-float">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full blur-lg opacity-30 animate-pulse-soft"></div>
            <div className="relative bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-elegant">
              <Mail className="w-8 h-8 text-pink-500" />
              <Heart className="w-4 h-4 text-pink-400 absolute -top-1 -right-1 animate-pulse" />
              <Sparkles className="w-3 h-3 text-purple-400 absolute -bottom-1 -left-1 animate-pulse" />
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gradient-pink mb-1">
              Correio Elegante Escolar
            </h1>
            <p className="text-sm text-pink-600/70 font-medium">
              Envie mensagens especiais com carinho 💌
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
