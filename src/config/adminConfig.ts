
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
    combo1: 'sua-chave-pix-combo1@email.com', // Chave PIX para Combo Clássico
    combo2: 'sua-chave-pix-combo2@email.com', // Chave PIX para Combo Premium
  },
  
  // Valores dos combos
  COMBO_PRICES: {
    combo1: 2.50,
    combo2: 3.00,
  }
};
