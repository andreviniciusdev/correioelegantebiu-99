
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCorreioStore } from '@/hooks/useCorreioStore';
import { Check, Gift, Mail, QrCode } from 'lucide-react';

const ComboSelection = () => {
  const navigate = useNavigate();
  const { currentCartinha, updateCurrentCartinha, adminConfig } = useCorreioStore();
  const [selectedCombo, setSelectedCombo] = useState<'combo1' | 'combo2' | null>(null);

  const combos = [
    {
      id: 'combo1' as const,
      name: 'Combo Clássico',
      items: ['Cartinha personalizada', 'Envelope decorado'],
      price: 2.50,
      icon: <Mail className="w-8 h-8" />,
      qrCode: adminConfig.qrCodeCombo1
    },
    {
      id: 'combo2' as const,
      name: 'Combo Premium',
      items: ['Cartinha personalizada', 'Envelope decorado', 'Bombom especial'],
      price: 3.00,
      icon: <Gift className="w-8 h-8" />,
      qrCode: adminConfig.qrCodeCombo2
    }
  ];

  const handleComboSelect = (combo: 'combo1' | 'combo2') => {
    setSelectedCombo(combo);
    const selectedComboData = combos.find(c => c.id === combo);
    updateCurrentCartinha({ 
      combo, 
      valor: selectedComboData?.price || 0 
    });
  };

  const handleFinalizarPedido = () => {
    if (selectedCombo) {
      navigate('/confirmacao');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-pink py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gradient-pink mb-4">
            Escolha seu Combo 🎁
          </h1>
          <p className="text-gray-600">
            Selecione o combo perfeito para sua cartinha especial
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {combos.map((combo) => (
            <Card 
              key={combo.id}
              className={`cursor-pointer transition-all duration-300 shadow-pink border-2 ${
                selectedCombo === combo.id 
                  ? 'border-pink-500 ring-4 ring-pink-200 shadow-lg' 
                  : 'border-pink-soft hover:border-pink-400 hover:shadow-lg'
              }`}
              onClick={() => handleComboSelect(combo.id)}
            >
              <CardHeader className="text-center pb-4">
                <div className={`mx-auto p-3 rounded-full mb-3 ${
                  selectedCombo === combo.id ? 'bg-pink-500 text-white' : 'bg-pink-100 text-pink-500'
                }`}>
                  {combo.icon}
                </div>
                <CardTitle className="text-xl text-pink-700">
                  {combo.name}
                </CardTitle>
                <div className="text-3xl font-bold text-pink-600">
                  R$ {combo.price.toFixed(2)}
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-4">
                  {combo.items.map((item, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-700">
                      <Check className="w-4 h-4 text-pink-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                
                {selectedCombo === combo.id && (
                  <div className="mt-4 p-4 bg-pink-50 rounded-lg border border-pink-200">
                    <div className="flex items-center gap-2 mb-2">
                      <QrCode className="w-5 h-5 text-pink-600" />
                      <span className="font-medium text-pink-700">QR Code para Pagamento:</span>
                    </div>
                    {combo.qrCode ? (
                      <div className="bg-white p-3 rounded border text-center">
                        <img 
                          src={combo.qrCode} 
                          alt="QR Code para pagamento" 
                          className="mx-auto max-w-32 max-h-32"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling!.style.display = 'block';
                          }}
                        />
                        <div style={{display: 'none'}} className="text-gray-500 py-8">
                          QR Code não disponível
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white p-8 rounded border text-center text-gray-500">
                        QR Code será configurado pelo administrador
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedCombo && (
          <div className="text-center">
            <Card className="max-w-md mx-auto shadow-pink border-pink-soft">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold text-pink-700 mb-2">
                  Resumo do Pedido
                </h3>
                <div className="space-y-2 text-gray-600 mb-4">
                  <p><strong>Para:</strong> {currentCartinha.destinatario}</p>
                  <p><strong>Série:</strong> {currentCartinha.serie}</p>
                  <p><strong>Combo:</strong> {combos.find(c => c.id === selectedCombo)?.name}</p>
                  <p className="text-xl font-bold text-pink-600">
                    Total: R$ {currentCartinha.valor?.toFixed(2)}
                  </p>
                </div>
                
                <Button 
                  onClick={handleFinalizarPedido}
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 text-lg shadow-pink"
                  size="lg"
                >
                  Finalizar Pedido ✔️
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComboSelection;
