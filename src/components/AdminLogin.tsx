import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCorreioStore } from '@/hooks/useCorreioStore';
import { toast } from '@/hooks/use-toast';
import { Lock, KeyRound } from 'lucide-react';
import { ADMIN_CONFIG } from '@/config/adminConfig';

interface AdminLoginProps {
  onLogin: () => void;
}

const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [password, setPassword] = useState('');
  const { authenticate } = useCorreioStore();

  const handleLogin = () => {
    if (authenticate(password)) {
      toast({
        title: "Login realizado com sucesso! ✨",
        description: "Bem-vindo ao painel administrativo.",
      });
      onLogin();
    } else {
      toast({
        title: "Senha incorreta",
        description: "Por favor, verifique sua senha e tente novamente.",
        variant: "destructive"
      });
      setPassword('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-elegant flex items-center justify-center py-12 px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-pink-300/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-pink-400/20 rounded-full blur-2xl animate-pulse-soft"></div>
      </div>

      <Card className="w-full max-w-md shadow-elegant border-0 glass-effect card-hover relative z-10">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto mb-6">
            <img
              src="/logocorreioelegante.png"
              alt="Logo"
              className="w-24 h-24 object-contain"
            />
          </div>

          <CardTitle className="text-3xl font-bold text-gradient-pink mb-2">
            Painel Administrativo
          </CardTitle>
          <p className="text-gray-600 font-medium">
            Acesso restrito para administradores
          </p>
        </CardHeader>

        <CardContent className="space-y-6 px-8 pb-8">
          <div className="space-y-3">
            <Label htmlFor="password" className="text-pink-700 font-semibold flex items-center gap-2">
              <KeyRound className="w-4 h-4" />
              Senha de Acesso
            </Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pink-500" />
              <Input
                id="password"
                type="password"
                placeholder="Digite a senha..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-12 py-3 text-lg input-elegant border-0 rounded-xl"
              />
            </div>
          </div>

          <Button
            onClick={handleLogin}
            className="w-full btn-elegant text-white py-4 text-lg font-semibold rounded-xl border-0"
            disabled={!password.trim()}
          >
            Entrar no Painel
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
