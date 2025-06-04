
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCorreioStore } from '@/hooks/useCorreioStore';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Heart, Home, QrCode, Copy } from 'lucide-react';
import { ADMIN_CONFIG } from '@/config/adminConfig';
import ComprovanteUpload from './ComprovanteUpload';
import { toast } from '@/hooks/use-toast';

const Confirmacao = () => {
  const navigate = useNavigate();
  const { currentCartinha, clearCurrentCartinha } = useCorreioStore();
  const [comprovanteEnviado, setComprovanteEnviado] = useState(false);

  useEffect(() => {
    if (!currentCartinha.remetente || !currentCartinha.combo) {
      navigate('/');
      return;
    }
  }, []);

  const handleComprovanteSuccess = () => {
    // Apenas marcar que o comprovante foi enviado
    // A cartinha já foi criada no ComprovanteUpload
    setComprovanteEnviado(true);
    toast({
      title: "Pedido enviado aos administradores! 📨",
      description: "Seu pedido foi registrado e será processado em breve.",
    });
  };

  const handleNovaCartinha = () => {
    clearCurrentCartinha();
    navigate('/');
  };

  const combos = {
    combo1: { 
      name: 'Combo Clássico', 
      qrCode: ADMIN_CONFIG.QR_CODES.combo1,
      pixKey: ADMIN_CONFIG.PIX_KEYS.combo1
    },
    combo2: { 
      name: 'Combo Premium', 
      qrCode: ADMIN_CONFIG.QR_CODES.combo2,
      pixKey: ADMIN_CONFIG.PIX_KEYS.combo2
    }
  };

  const selectedCombo = currentCartinha.combo ? combos[currentCartinha.combo] : null;

  const handleCopyPixKey = async (pixKey: string) => {
    try {
      await navigator.clipboard.writeText(pixKey);
      toast({
        title: "Link de pagamento copiado!",
        description: "O link de pagamento foi copiado para a área de transferência.",
      });
    } catch (error) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar a chave PIX. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-pink py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="shadow-pink border-pink-soft">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-3xl text-gradient-pink mb-2">
              {comprovanteEnviado ? 'Pedido Enviado! 🎉' : 'Realize o Pagamento 💳'}
            </CardTitle>
            <p className="text-gray-600">
              {comprovanteEnviado 
                ? 'Seu pedido foi enviado aos administradores e será processado em breve'
                : 'Revise os dados, realize o pagamento e envie o comprovante'
              }
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-pink-50 p-6 rounded-lg border border-pink-200">
              <h3 className="font-semibold text-pink-800 mb-4 flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Resumo do Seu Pedido
              </h3>
              
              <div className="space-y-3 text-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <strong className="text-pink-700">Remetente:</strong>
                    <p className="break-words">{currentCartinha.remetente}</p>
                  </div>
                  <div>
                    <strong className="text-pink-700">Destinatário:</strong>
                    <p className="break-words">{currentCartinha.destinatario}</p>
                  </div>
                  <div>
                    <strong className="text-pink-700">Série:</strong>
                    <p className="break-words">{currentCartinha.serie}</p>
                  </div>
                  <div>
                    <strong className="text-pink-700">Combo:</strong>
                    <p className="break-words">{selectedCombo?.name}</p>
                  </div>
                </div>
                
                <div>
                  <strong className="text-pink-700">Mensagem:</strong>
                  <div className="mt-1 p-3 bg-white rounded border border-pink-200">
                    <p className="italic text-gray-700 break-words overflow-wrap-anywhere whitespace-pre-wrap">
                      "{currentCartinha.mensagem}"
                    </p>
                  </div>
                </div>
                
                <div className="text-center pt-2">
                  <span className="text-2xl font-bold text-pink-600">
                    Total: R$ {currentCartinha.valor?.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {selectedCombo?.qrCode && (
              <div className="bg-white p-6 rounded-lg border border-pink-200 text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <QrCode className="w-5 h-5 text-pink-600" />
                  <h3 className="font-semibold text-pink-800">QR Code para Pagamento</h3>
                </div>
                <img 
                  src={selectedCombo.qrCode} 
                  alt="QR Code para pagamento" 
                  className="mx-auto max-w-48 max-h-48 border border-gray-200 rounded mb-4"
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
                
                {selectedCombo.pixKey && (
                  <div className="pt-4">
                    <p className="text-sm text-gray-600 mb-3">
                      Ou copie o link de pagamento abaixo:
                    </p>
                    <div className="bg-gray-50 p-3 rounded border mb-3">
                      <code className="text-sm text-gray-700 break-all">
                        {selectedCombo.pixKey}
                      </code>
                    </div>
                    <Button
                      onClick={() => handleCopyPixKey(selectedCombo.pixKey)}
                      variant="outline"
                      className="border-pink-300 text-pink-600 hover:bg-pink-50"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar Link de Pagamento
                    </Button>
                  </div>
                )}
              </div>
            )}

            {!comprovanteEnviado && (
              <ComprovanteUpload 
                cartinhaId="temp" 
                onUploadSuccess={handleComprovanteSuccess}
                cartinhaData={{
                  remetente: currentCartinha.remetente!,
                  destinatario: currentCartinha.destinatario!,
                  serie: currentCartinha.serie!,
                  mensagem: currentCartinha.mensagem!,
                  combo: currentCartinha.combo!,
                  valor: currentCartinha.valor!,
                }}
              />
            )}

            {comprovanteEnviado && (
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-6 rounded-lg border border-green-200 text-center">
                <h3 className="font-semibold text-green-800 mb-2">✅ Comprovante Enviado</h3>
                <p className="text-green-700">
                  Seu comprovante foi recebido com sucesso! Seu pedido foi enviado aos administradores.
                </p>
              </div>
            )}

            <div className="bg-gradient-to-r from-pink-100 to-purple-100 p-6 rounded-lg border border-pink-200 text-center">
              <h3 className="font-semibold text-pink-800 mb-2">💌 Informações Importantes</h3>
              <p className="text-pink-700">
                {comprovanteEnviado 
                  ? 'Seu pedido será processado em breve. Sua cartinha será entregue no dia do evento!'
                  : 'Após realizar o pagamento, envie o comprovante para finalizar seu pedido.'
                }
                <br />
                <strong>Obrigado por participar! 🎉</strong>
              </p>
            </div>

            <div className="text-center space-y-4">
              <Button 
                onClick={handleNovaCartinha}
                disabled={!comprovanteEnviado}
                className={`w-full py-3 text-lg shadow-pink ${
                  comprovanteEnviado 
                    ? 'bg-pink-500 hover:bg-pink-600 text-white' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                size="lg"
              >
                <Home className="w-5 h-5 mr-2" />
                Enviar Nova Cartinha
              </Button>
              
              <p className="text-sm text-gray-500">
                {comprovanteEnviado 
                  ? 'Quer enviar mais cartinhas? Clique no botão acima!'
                  : 'Envie o comprovante para habilitar o envio de nova cartinha'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Confirmacao;
