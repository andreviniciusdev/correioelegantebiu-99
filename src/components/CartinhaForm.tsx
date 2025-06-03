import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCorreioStore, verificarPalavrasOfensivas } from '@/hooks/useCorreioStore';
import { toast } from '@/hooks/use-toast';
import { ArrowRight, AlertTriangle, XCircle, Heart, Mail, Sparkles } from 'lucide-react';

const CartinhaForm = () => {
  const navigate = useNavigate();
  const { currentCartinha, updateCurrentCartinha } = useCorreioStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    updateCurrentCartinha({ [field]: value });
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!currentCartinha.remetente?.trim()) {
      newErrors.remetente = 'Nome do remetente é obrigatório';
    }

    if (!currentCartinha.destinatario?.trim()) {
      newErrors.destinatario = 'Nome do destinatário é obrigatório';
    }

    if (!currentCartinha.serie?.trim()) {
      newErrors.serie = 'Série do destinatário é obrigatória';
    }

    if (!currentCartinha.mensagem?.trim()) {
      newErrors.mensagem = 'Mensagem é obrigatória';
    } else if (verificarPalavrasOfensivas(currentCartinha.mensagem)) {
      newErrors.mensagem = '⚠️ Sua mensagem contém palavras impróprias. Por favor, reescreva usando apenas palavras carinhosas e respeitosas. Lembre-se: espalhe amor e positividade! 💖';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      navigate('/combos');
    } else {
      // Toast específico para palavras ofensivas
      if (currentCartinha.mensagem && verificarPalavrasOfensivas(currentCartinha.mensagem)) {
        toast({
          title: "🚫 Linguagem inadequada detectada",
          description: "Sua mensagem contém palavras impróprias. Por favor, reescreva com carinho e respeito.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Erro no formulário",
          description: "Por favor, corrija os campos destacados.",
          variant: "destructive"
        });
      }
    }
  };

  const series = [
    '1º Ano A', '1º Ano B', '1º Ano C',
    '2º Ano A', '2º Ano B', '2º Ano C',
    '3º Ano A', '3º Ano B', '3º Ano C',
    '6º Ano', '7º Ano', '8º Ano', '9º Ano'
  ];

  // Verificação em tempo real se há palavras ofensivas
  const hasOffensiveWords = currentCartinha.mensagem && verificarPalavrasOfensivas(currentCartinha.mensagem);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        {/* Beautiful Header Section */}
        <div className="text-center mb-8 space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <Mail className="w-8 h-8 text-white" />
                <Heart className="w-4 h-4 text-pink-200 absolute -top-1 -right-1" />
              </div>
              <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-2 -left-2 animate-pulse" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Correio Elegante
          </h1>
          
          <p className="text-xl text-gray-600 font-medium">
            Espalhe amor e carinho pela escola! 💌
          </p>
          
          <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mx-auto"></div>
        </div>

        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-t-lg">
            <CardTitle className="text-2xl text-gray-800 mb-2">
              Criar sua Cartinha Especial ✨
            </CardTitle>
            <p className="text-gray-600">
              Envie uma mensagem carinhosa para alguém especial!
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6 p-8">
            <div className="space-y-2">
              <Label htmlFor="remetente" className="text-pink-700 font-medium">
                Seu Nome (Remetente)
              </Label>
              <Input
                id="remetente"
                placeholder="Digite seu nome..."
                value={currentCartinha.remetente || ''}
                onChange={(e) => handleInputChange('remetente', e.target.value)}
                className={`border-pink-soft focus:ring-pink-500 ${errors.remetente ? 'border-red-500' : ''}`}
              />
              {errors.remetente && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  {errors.remetente}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="destinatario" className="text-pink-700 font-medium">
                Nome do Destinatário
              </Label>
              <Input
                id="destinatario"
                placeholder="Para quem é a cartinha?"
                value={currentCartinha.destinatario || ''}
                onChange={(e) => handleInputChange('destinatario', e.target.value)}
                className={`border-pink-soft focus:ring-pink-500 ${errors.destinatario ? 'border-red-500' : ''}`}
              />
              {errors.destinatario && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  {errors.destinatario}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="serie" className="text-pink-700 font-medium">
                Série do Destinatário
              </Label>
              <Select
                value={currentCartinha.serie || ''}
                onValueChange={(value) => handleInputChange('serie', value)}
              >
                <SelectTrigger className={`border-pink-soft focus:ring-pink-500 ${errors.serie ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Selecione a série..." />
                </SelectTrigger>
                <SelectContent>
                  {series.map((serie) => (
                    <SelectItem key={serie} value={serie}>
                      {serie}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.serie && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  {errors.serie}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mensagem" className="text-pink-700 font-medium">
                Sua Mensagem
              </Label>
              <Textarea
                id="mensagem"
                placeholder="Escreva uma mensagem carinhosa, divertida e amigável..."
                value={currentCartinha.mensagem || ''}
                onChange={(e) => handleInputChange('mensagem', e.target.value)}
                className={`min-h-32 border-pink-soft focus:ring-pink-500 resize-none ${
                  errors.mensagem ? 'border-red-500' : hasOffensiveWords ? 'border-red-400' : ''
                }`}
                maxLength={500}
              />
              
              {/* Aviso em tempo real para palavras ofensivas */}
              {hasOffensiveWords && !errors.mensagem && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm flex items-start gap-2">
                    <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Atenção:</strong> Sua mensagem contém palavras inadequadas. 
                      Por favor, reescreva usando apenas palavras carinhosas e positivas! 💖
                    </span>
                  </p>
                </div>
              )}
              
              <div className="flex justify-between items-start">
                <div className="text-sm text-gray-500">
                  {currentCartinha.mensagem?.length || 0}/500 caracteres
                </div>
                {errors.mensagem && (
                  <p className="text-red-500 text-sm flex items-center gap-1 max-w-xs">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    {errors.mensagem}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-xl border border-pink-200/50">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-500" />
                Dicas para uma cartinha perfeita:
              </h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
                  Use mensagens carinhosas, divertidas e amigáveis
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                  Proibido qualquer tipo de ofensa ou conteúdo impróprio
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
                  Espalhe amor e positividade!
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
                  Seja criativo e genuíno em suas palavras
                </li>
              </ul>
            </div>

            <Button 
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-4 text-lg font-semibold shadow-lg transform transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              size="lg"
              disabled={hasOffensiveWords}
            >
              <span className="flex items-center gap-2">
                Avançar para Combos
                <ArrowRight className="w-5 h-5" />
              </span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CartinhaForm;
