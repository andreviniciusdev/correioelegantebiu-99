
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCorreioStore } from '@/hooks/useCorreioStore';
import { useNavigate } from 'react-router-dom';
import { Gift, Heart, QrCode, ExternalLink } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { ADMIN_CONFIG } from '@/config/adminConfig';

const ComboSelection = () => {
  const navigate = useNavigate();
  const { currentCartinha, updateCurrentCartinha } = useCorreioStore();
  const [selectedCombo, setSelectedCombo] = useState<'combo1' | 'combo2' | null>(null);

  // Se não há dados da cartinha, redireciona
  if (!currentCartinha.remetente) {
    navigate('/');
    return null;
  }

  const combos = {
    combo1: {
      name: 'Combo Clássico',
      description: 'Cartinha + Envelope',
      price: ADMIN_CONFIG.COMBO_PRICES.combo1,
      icon: '💌',
      qrCode: ADMIN_CONFIG.QR_CODES.combo1,
      paymentLink: ADMIN_CONFIG.PAYMENT_LINKS.combo1
    },
    combo2: {
      name: 'Combo Premium',
      description: 'Cartinha + Envelope + Bombom',
      price: ADMIN_CONFIG.COMBO_PRICES.combo2,
      icon: '🍫',
      qrCode: ADMIN_CONFIG.QR_CODES.combo2,
      paymentLink: ADMIN_CONFIG.PAYMENT_LINKS.combo2
    }
  };

  const handleComboSelect = (combo: 'combo1' | 'combo2') => {
    setSelectedCombo(combo);
    updateCurrentCartinha({
      combo,
      valor: combos[combo].price
    });
  };

  const handleFinalizarPedido = () => {
    if (!selectedCombo) {
      toast({
        title: "Selecione um combo",
        description: "Por favor, escolha um dos combos disponíveis.",
        variant: "destructive"
      });
      return;
    }

    navigate('/confirmacao');
  };

  return (
    <div className="min-h-screen bg-gradient-pink py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gradient-pink mb-2">
            Escolha seu Combo
          </h1>
          <p className="text-gray-600">
            Selecione o combo perfeito para sua cartinha especial
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {Object.entries(combos).map(([key, combo]) => (
            <Card 
              key={key}
              className={`cursor-pointer transition-all duration-300 shadow-pink border-2 ${
                selectedCombo === key 
                  ? 'border-pink-400 bg-pink-50 shadow-lg scale-105' 
                  : 'border-pink-soft hover:border-pink-300 hover:shadow-lg'
              }`}
              onClick={() => handleComboSelect(key as 'combo1' | 'combo2')}
            >
              <CardHeader className="text-center">
                <div className="text-4xl mb-2">{combo.icon}</div>
                <CardTitle className="text-xl text-pink-700">
                  {combo.name}
                </CardTitle>
                <p className="text-gray-600">{combo.description}</p>
              </CardHeader>
              
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-pink-600 mb-4">
                  R$ {combo.price.toFixed(2)}
                </div>
                
                {selectedCombo === key && (
                  <div className="flex items-center justify-center gap-2 text-pink-600">
                    <Heart className="w-5 h-5 fill-current" />
                    <span className="font-medium">Selecionado</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedCombo && combos[selectedCombo].qrCode && (
          <Card className="shadow-pink border-pink-soft mb-8">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <QrCode className="w-6 h-6 text-pink-600" />
                <CardTitle className="text-xl text-pink-700">
                  QR Code para Pagamento
                </CardTitle>
              </div>
              <p className="text-gray-600">
                Use o QR Code abaixo para realizar o pagamento
              </p>
            </CardHeader>
            
            <CardContent className="text-center space-y-4">
              <img 
                src={combos[selectedCombo].qrCode} 
                alt="QR Code para pagamento" 
                className="mx-auto max-w-48 max-h-48 border border-gray-200 rounded"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = 'none';
                  const nextElement = target.nextElementSibling as HTMLElement;
                  if (nextElement) {
                    nextElement.style.display = 'block';
                  }
                }}
              />
              <div style={{display: 'none'}} className="text-gray-500 py-8">
                QR Code não disponível
              </div>
              
              {combos[selectedCombo].paymentLink && (
                <div className="pt-4">
                  <p className="text-sm text-gray-600 mb-3">
                    Ou clique no link abaixo para pagar direto do celular:
                  </p>
                  <Button
                    onClick={() => window.open(combos[selectedCombo].paymentLink, '_blank')}
                    variant="outline"
                    className="border-pink-300 text-pink-600 hover:bg-pink-50"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Abrir Link de Pagamento
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="text-center">
          <Button 
            onClick={handleFinalizarPedido}
            disabled={!selectedCombo}
            className="w-full md:w-auto bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 text-lg shadow-pink"
            size="lg"
          >
            <Gift className="w-5 h-5 mr-2" />
            Finalizar Pedido
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ComboSelection;
