
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCorreioStore } from '@/hooks/useCorreioStore';
import { toast } from '@/hooks/use-toast';
import { Lock, Shield } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
}

const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [password, setPassword] = useState('');
  const { authenticate } = useCorreioStore();

  const handleLogin = () => {
    if (authenticate(password)) {
      toast({
        title: "Login realizado com sucesso!",
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
    <div className="min-h-screen bg-gradient-pink flex items-center justify-center py-8">
      <Card className="w-full max-w-md shadow-pink border-pink-soft">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-pink-600" />
          </div>
          <CardTitle className="text-2xl text-gradient-pink">
            Painel Administrativo
          </CardTitle>
          <p className="text-gray-600">
            Acesso restrito para administradores
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-pink-700 font-medium">
              Senha de Acesso
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-pink-500" />
              <Input
                id="password"
                type="password"
                placeholder="Digite a senha..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10 border-pink-soft focus:ring-pink-500"
              />
            </div>
          </div>

          <Button 
            onClick={handleLogin}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 shadow-pink"
            disabled={!password.trim()}
          >
            Entrar no Painel
          </Button>

          <div className="text-center text-sm text-gray-500">
            <p>Senha padrão: admin123</p>
            <p className="text-xs mt-1">
              (Pode ser alterada nas configurações)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
