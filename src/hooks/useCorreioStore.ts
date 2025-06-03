
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
  // Palavrões e termos ofensivos
  'caralho', 'porra', 'merda', 'bosta', 'cacete', 'puta', 'viado', 'bicha',
  'cu', 'cuzão', 'fdp', 'filho da puta', 'desgraça', 'desgraçado',
  'pqp', 'que porra', 'vai se foder', 'vai tomar no cu', 'corno',
  
  // Insultos pessoais
  'idiota', 'burro', 'otário', 'feio', 'estúpido', 'imbecil', 'babaca', 
  'trouxa', 'lerdo', 'tapado', 'mongolóide', 'retardado', 'cretino',
  'asno', 'jumento', 'besta', 'animal', 'inútil', 'lixo',
  'porcaria', 'nojento', 'fedorento', 'sujo', 'porco', 'gorda',
  'magra', 'feia', 'horrível', 'nojenta', 'ridícula', 'patética',
  
  // Termos depreciativos
  'vaca', 'cachorra', 'cadela', 'piranha', 'vagabunda', 'safada',
  'sem vergonha', 'pirralho', 'moleque', 'fedelho', 'peste',
  
  // Abreviações e gírias ofensivas
  'vsf', 'vtmnc', 'tnc', 'tmj', 'mlk', 'fdm', 'cdf'
];

export const verificarPalavrasOfensivas = (texto: string): boolean => {
  // Remove acentos e caracteres especiais, mantém apenas letras e espaços
  const textoLimpo = texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z\s]/g, ' ') // Remove pontuação e números
    .replace(/\s+/g, ' ') // Remove espaços extras
    .trim();
  
  // Verifica se alguma palavra ofensiva está presente no texto
  return palavrasOfensivas.some(palavra => {
    const palavraLimpa = palavra
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    
    // Verifica se a palavra aparece como palavra completa ou parte de uma palavra
    const regex = new RegExp(`\\b${palavraLimpa.replace(/\s+/g, '\\s+')}\\b`, 'i');
    return regex.test(textoLimpo) || textoLimpo.includes(palavraLimpa);
  });
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
