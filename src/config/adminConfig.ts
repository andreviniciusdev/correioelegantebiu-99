
// Configurações administrativas - edite aqui conforme necessário
export const ADMIN_CONFIG = {
  // Senha do painel administrativo
  PASSWORD: 'sesi2025',
  
  // URLs das imagens dos QR codes
  QR_CODES: {
    combo1: '/qr-combo1.png', // QR Code para Combo Clássico (R$ 2,50)
    combo2: '/qr-combo2.png', // QR Code para Combo Premium (R$ 3,00)
  },
  
  // Links de pagamento direto
  PAYMENT_LINKS: {
    combo1: 'https://pix.example.com/combo1', // Link para pagamento do Combo Clássico
    combo2: 'https://pix.example.com/combo2', // Link para pagamento do Combo Premium
  },
  
  // Valores dos combos
  COMBO_PRICES: {
    combo1: 2.50,
    combo2: 3.00,
  }
};
