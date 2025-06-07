
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ADMIN_CONFIG } from '@/config/adminConfig';

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
  // Palavrões e ofensas diretas
  'caralho', 'porra', 'merda', 'bosta', 'cacete', 'puta', 'viado', 'bicha',
  'cuzão', 'fdp', 'filho da puta', 'desgraça', 'desgraçado',
  'pqp', 'que porra', 'vai se foder', 'vai tomar no cu', 'corno', 'boiola',

  // Abreviações e variações
  'krl', 'crlh', 'crl', 'pqp', 'vsf', 'vtmnc', 'tnc', 'fdp', 'fdm',
  'tmnc', 'vtnc', 'vtnc', 'pqpp', 'kct', 'ktc', 'crl', 'sfd', 'sfdp',

  // Insultos pessoais
  'idiota', 'burro', 'otário', 'feio', 'estúpido', 'imbecil', 'babaca',
  'trouxa', 'lerdo', 'tapado', 'mongolóide', 'retardado', 'cretino',
  'asno', 'jumento', 'besta', 'animal', 'inútil', 'lixo',
  'porcaria', 'nojento', 'fedorento', 'sujo', 'porco', 'gorda',
  'magra', 'feia', 'horrível', 'nojenta', 'ridícula', 'patética',

  // Termos machistas e misóginos
  'vaca', 'cachorra', 'cadela', 'piranha', 'vagabunda', 'safada',
  'sem vergonha', 'mal comida', 'mal amada', 'barraqueira',

  // Xenofobia e regionalismos pejorativos
  'paraíba', 'baianada', 'baiano preguiçoso', 'nordestino de merda', 'favelado',

  // Racismo e termos racistas
  'macaco', 'preto fedido', 'crioulo', 'neguinho', 'preto safado',

  // Homofobia e transfobia
  'viadinho', 'boiolinha', 'traveco', 'baitola', 'mariquinha', 'sapatão', 'dyke',

  // Capacitismo
  'aleijado', 'aleijada', 'defeituoso', 'débil', 'retardado', 'mongol', 'lesado',

  // Idadismo
  'velho inútil', 'velha chata', 'múmia', 'gaga', 'senil',

  // Gordofobia e aparência
  'baleia', 'rolha de poço', 'saco de banha', 'frango', 'palito', 'vara', 'esqueleto',

  // Insultos infantis e pejorativos
  'pirralho', 'moleque', 'fedelho', 'peste', 'marmanjo', 'criança idiota',

  // Expressões pejorativas indiretas
  'ninguém te suporta', 'ninguém gosta de você', 'sua cara é um lixo', 'te odeio',
  'você é um erro', 'você é uma vergonha', 'morre', 'suma daqui', 'desaparece',

  // Ofensas disfarçadas
  'se enxerga', 'olha pra sua cara', 'acorda pra vida', 'você é patético',
  'vai cuidar da sua vida', 'ninguém liga pra você', 'você fede', 'escória',

  // Variações fonéticas e comumente usadas na internet
  'carai', 'caray', 'porraa', 'merdaa', 'cuzao', 'crlh', 'krlh', 'kct', 'ktc', 'pqpp',
  'vsfd', 'vtmn', 'vtnc', 'tmnc', 'vai se ferrar', 'vai pastar', 'vai se lascar', 'vai pro inferno',

  // Com substituição de letras
  'p*ta', 'p@ta', 'p#ta', 'c*rlho', 'crl#', 'krlh', 'crlh', 'p*qp', 'f*d*p', 'c*z*o',
  'v*ado', 'v@ado', 'v!ado', 'b1cha', 'b!cha', 'bix@', 'b1xa',

  // Com espaçamentos e quebras
  'c r l', 'k r l', 'p q p', 'v s f', 't n c', 'v t m n c', 'f d p', 'c u z a o'
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

  // Se o texto limpo estiver vazio, não há palavras ofensivas
  if (!textoLimpo) return false;

  // Verifica se alguma palavra ofensiva está presente no texto
  return palavrasOfensivas.some(palavra => {
    const palavraLimpa = palavra
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    // Ignora palavras muito curtas (1-2 caracteres) para evitar falsos positivos
    if (palavraLimpa.length <= 2) {
      return false;
    }

    // Para palavras com espaços (frases), verifica se a frase completa está presente
    if (palavraLimpa.includes(' ')) {
      const regex = new RegExp(`\\b${palavraLimpa.replace(/\s+/g, '\\s+')}\\b`, 'i');
      return regex.test(textoLimpo);
    }

    // Para palavras simples de 3+ caracteres, verifica se aparece como palavra completa
    // Adiciona verificação extra para garantir que não seja uma letra isolada
    if (palavraLimpa.length >= 3) {
      const regex = new RegExp(`\\b${palavraLimpa}\\b`, 'i');
      return regex.test(textoLimpo);
    }

    return false;
  });
};

export const useCorreioStore = create<CorreioState>()(
  persist(
    (set, get) => ({
      cartinhas: [],
      adminConfig: {
        qrCodeCombo1: '',
        qrCodeCombo2: '',
        senha: ADMIN_CONFIG.PASSWORD
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
        // Força a atualização da senha no adminConfig para a nova senha
        const currentConfig = get().adminConfig;
        if (currentConfig.senha !== ADMIN_CONFIG.PASSWORD) {
          set((state) => ({
            adminConfig: { ...state.adminConfig, senha: ADMIN_CONFIG.PASSWORD }
          }));
        }

        // Verifica apenas a nova senha
        if (password === ADMIN_CONFIG.PASSWORD) {
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
      name: 'correio-storage',
      version: 1, // Adicionando versão para forçar migração
      migrate: (persistedState: any, version: number) => {
        // Migração para garantir que a senha seja sempre a nova
        if (version === 0) {
          return {
            ...persistedState,
            adminConfig: {
              ...persistedState.adminConfig,
              senha: ADMIN_CONFIG.PASSWORD
            }
          };
        }
        return persistedState;
      }
    }
  )
);
