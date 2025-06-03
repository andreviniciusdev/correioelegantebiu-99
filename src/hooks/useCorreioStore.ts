
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Cartinha {
  id: string;
  remetente: string;
  destinatario: string;
  serie: string;
  mensagem: string;
  combo: 'combo1' | 'combo2';
  valor: number;
  status: 'pendente' | 'pago';
  dataEnvio: string;
}

export interface AdminConfig {
  qrCodeCombo1: string;
  qrCodeCombo2: string;
  senha: string;
}

interface CorreioState {
  cartinhas: Cartinha[];
  adminConfig: AdminConfig;
  currentCartinha: Partial<Cartinha>;
  isAuthenticated: boolean;
  
  // Actions
  addCartinha: (cartinha: Omit<Cartinha, 'id' | 'dataEnvio'>) => void;
  updateCartinhaStatus: (id: string, status: 'pendente' | 'pago') => void;
  updateCurrentCartinha: (data: Partial<Cartinha>) => void;
  clearCurrentCartinha: () => void;
  updateAdminConfig: (config: Partial<AdminConfig>) => void;
  authenticate: (password: string) => boolean;
  logout: () => void;
}

const palavrasOfensivas = [
  'idiota', 'burro', 'otário', 'feio', 'estúpido', 'imbecil', 'babaca', 
  'trouxa', 'lerdo', 'tapado', 'mongolóide', 'retardado', 'cretino',
  'asno', 'jumento', 'besta', 'animal', 'inútil', 'lixo', 'merda',
  'porcaria', 'nojento', 'fedorento', 'sujo', 'porco', 'gorda',
  'magra', 'feia', 'horrível', 'nojenta', 'ridícula', 'patética'
];

export const verificarPalavrasOfensivas = (texto: string): boolean => {
  const textoLimpo = texto.toLowerCase().replace(/[^a-záàâãéèêíïóôõöúçñ\s]/gi, '');
  return palavrasOfensivas.some(palavra => textoLimpo.includes(palavra));
};

export const useCorreioStore = create<CorreioState>()(
  persist(
    (set, get) => ({
      cartinhas: [],
      adminConfig: {
        qrCodeCombo1: '',
        qrCodeCombo2: '',
        senha: 'admin123'
      },
      currentCartinha: {},
      isAuthenticated: false,

      addCartinha: (cartinha) => {
        const newCartinha: Cartinha = {
          ...cartinha,
          id: Date.now().toString(),
          dataEnvio: new Date().toLocaleDateString('pt-BR'),
          status: 'pendente'
        };
        
        set((state) => ({
          cartinhas: [...state.cartinhas, newCartinha]
        }));
      },

      updateCartinhaStatus: (id, status) => {
        set((state) => ({
          cartinhas: state.cartinhas.map(cartinha =>
            cartinha.id === id ? { ...cartinha, status } : cartinha
          )
        }));
      },

      updateCurrentCartinha: (data) => {
        set((state) => ({
          currentCartinha: { ...state.currentCartinha, ...data }
        }));
      },

      clearCurrentCartinha: () => {
        set({ currentCartinha: {} });
      },

      updateAdminConfig: (config) => {
        set((state) => ({
          adminConfig: { ...state.adminConfig, ...config }
        }));
      },

      authenticate: (password) => {
        const { adminConfig } = get();
        if (password === adminConfig.senha) {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },

      logout: () => {
        set({ isAuthenticated: false });
      }
    }),
    {
      name: 'correio-storage'
    }
  )
);
