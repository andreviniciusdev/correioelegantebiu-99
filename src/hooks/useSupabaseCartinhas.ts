
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface CartinhaSupabase {
  id: string;
  remetente: string;
  destinatario: string;
  serie: string;
  mensagem: string;
  combo: 'combo1' | 'combo2';
  valor: number;
  status: 'pendente' | 'pago';
  data_envio: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCartinhaData {
  remetente: string;
  destinatario: string;
  serie: string;
  mensagem: string;
  combo: 'combo1' | 'combo2';
  valor: number;
}

// Hook para buscar todas as cartinhas
export const useCartinhas = () => {
  return useQuery({
    queryKey: ['cartinhas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cartinhas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar cartinhas:', error);
        throw error;
      }

      return data as CartinhaSupabase[];
    },
  });
};

// Hook para criar uma nova cartinha
export const useCreateCartinha = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cartinhaData: CreateCartinhaData) => {
      const { data, error } = await supabase
        .from('cartinhas')
        .insert([{
          ...cartinhaData,
          data_envio: new Date().toISOString(),
        }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar cartinha:', error);
        throw error;
      }

      return data as CartinhaSupabase;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cartinhas'] });
      toast({
        title: "Cartinha criada com sucesso! 💌",
        description: "Sua cartinha foi registrada e será entregue no dia do evento.",
      });
    },
    onError: (error) => {
      console.error('Erro ao criar cartinha:', error);
      toast({
        title: "Erro ao enviar cartinha",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    },
  });
};

// Hook para atualizar o status de uma cartinha
export const useUpdateCartinhaStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'pendente' | 'pago' }) => {
      const { data, error } = await supabase
        .from('cartinhas')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar status:', error);
        throw error;
      }

      return data as CartinhaSupabase;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cartinhas'] });
    },
    onError: (error) => {
      console.error('Erro ao atualizar status:', error);
      toast({
        title: "Erro ao atualizar status",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    },
  });
};

// Hook para obter estatísticas
export const useCartinhasStats = () => {
  return useQuery({
    queryKey: ['cartinhas-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cartinhas')
        .select('status, valor');

      if (error) {
        console.error('Erro ao buscar estatísticas:', error);
        throw error;
      }

      const stats = {
        total: data.length,
        pagas: data.filter(c => c.status === 'pago').length,
        pendentes: data.filter(c => c.status === 'pendente').length,
        receita: data.filter(c => c.status === 'pago').reduce((sum, c) => sum + Number(c.valor), 0)
      };

      return stats;
    },
  });
};
