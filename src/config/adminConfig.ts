
// Configurações administrativas - edite aqui conforme necessário
export const ADMIN_CONFIG = {
  // Senha do painel administrativo
  PASSWORD: 'sesi2025',
  
  // URLs das imagens dos QR codes
  QR_CODES: {
    combo1: '/qr-combo1.png', // QR Code para Combo Clássico (R$ 2,50)
    combo2: '/qr-combo2.png', // QR Code para Combo Premium (R$ 3,00)
  },
  
  // Chaves PIX para pagamento
  PIX_KEYS: {
    combo1: '00020101021126330014br.gov.bcb.pix01111273526147652040000530398654042.505802BR5921ELOANY B L DOS SANTOS6006MACEIO62070503***6304E6D1', // Chave PIX para Combo Clássico
    combo2: '00020101021126330014br.gov.bcb.pix01111273526147652040000530398654043.005802BR5921ELOANY B L DOS SANTOS6006MACEIO62070503***6304B7D2', // Chave PIX para Combo Premium
  },
  
  // Valores dos combos
  COMBO_PRICES: {
    combo1: 2.50,
    combo2: 3.00,
  }
};
