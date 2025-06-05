
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
import { ArrowRight, AlertTriangle, XCircle } from 'lucide-react';

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
    '1º Ano A', '1º Ano B', '1º Ano C', '1º Ano D', '1º Ano E', '1º Ano F', '1º Ano G', '1º Ano H', '1º Ano I',
    '2º Ano A', '2º Ano B', '2º Ano C', '2º Ano D', '2º Ano E', '2º Ano F', '2º Ano G', '2º Ano H',
    '3º Ano A', '3º Ano B', '3º Ano C', '3º Ano D', '3º Ano E', '3º Ano F', '3º Ano G'
  ];

  // Verificação em tempo real se há palavras ofensivas
  const hasOffensiveWords = currentCartinha.mensagem && verificarPalavrasOfensivas(currentCartinha.mensagem);

  return (
    <div className="min-h-screen bg-gradient-pink py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="shadow-pink border-pink-soft">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-gradient-pink mb-2">
              Crie sua Cartinha
            </CardTitle>
            <p className="text-gray-600">
              Envie uma mensagem carinhosa para alguém especial!
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
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

            <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
              <h4 className="font-medium text-pink-800 mb-2">📝 Observações Importantes:</h4>
              <ul className="text-sm text-pink-700 space-y-1">
                <li>🌷 Todas as mensagens serão revisadas pelo NAPED antes da entrega</li>
                <li>🚫 Não serão permitidas mensagens com conteúdo ofensivo, discriminatório ou de duplo sentido</li>
                <li>💸 Caso a mensagem seja reprovada, não haverá reembolso do valor pago</li>
                <li>🎯 É obrigatório identificar claramente para quem a mensagem será enviada (nome completo, turma ou outra referência)</li>
                <li>🎭 A identidade do remetente será mantida em sigilo</li>
                <li>💖 Capriche na sua mensagem! Escreva algo doce e amigável para que a pessoa que receber se sinta especial. 🌹</li>
              </ul>
            </div>

            <Button 
              onClick={handleSubmit}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 text-lg shadow-pink"
              size="lg"
              disabled={hasOffensiveWords}
            >
              Avançar para Combos
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CartinhaForm;
