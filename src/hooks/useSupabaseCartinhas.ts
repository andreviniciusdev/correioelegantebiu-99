
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
  comprovante_url: string | null;
  comprovante_nome: string | null;
  comprovante_tamanho: number | null;
  comprovante_tipo: string | null;
  comprovante_enviado_at: string | null;
}

export interface CreateCartinhaData {
  remetente: string;
  destinatario: string;
  serie: string;
  mensagem: string;
  combo: 'combo1' | 'combo2';
  valor: number;
}

export interface UploadComprovanteData {
  comprovante_url: string;
  comprovante_nome: string;
  comprovante_tamanho: number;
  comprovante_tipo: string;
  comprovante_enviado_at?: string;
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

// Hook para fazer upload de comprovante
export const useUploadComprovante = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, cartinhaId }: { file: File; cartinhaId: string }) => {
      console.log('Iniciando upload do comprovante:', { fileName: file.name, cartinhaId });
      
      // 1. Upload do arquivo para o Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${cartinhaId}/${fileName}`;

      console.log('Caminho do arquivo:', filePath);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('comprovantes')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Erro no upload:', uploadError);
        throw uploadError;
      }

      console.log('Upload realizado com sucesso:', uploadData);

      // 2. Obter URL pública do arquivo
      const { data: urlData } = supabase.storage
        .from('comprovantes')
        .getPublicUrl(filePath);

      console.log('URL pública gerada:', urlData.publicUrl);

      // 3. Atualizar a cartinha com os dados do comprovante
      const comprovanteData: UploadComprovanteData = {
        comprovante_url: urlData.publicUrl,
        comprovante_nome: file.name,
        comprovante_tamanho: file.size,
        comprovante_tipo: file.type,
        comprovante_enviado_at: new Date().toISOString(),
      };

      console.log('Atualizando cartinha com dados do comprovante:', comprovanteData);

      const { data, error } = await supabase
        .from('cartinhas')
        .update(comprovanteData)
        .eq('id', cartinhaId)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar cartinha com comprovante:', error);
        throw error;
      }

      console.log('Cartinha atualizada com sucesso:', data);
      return data as CartinhaSupabase;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cartinhas'] });
      toast({
        title: "Comprovante enviado! 📎",
        description: "Seu comprovante foi recebido com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Erro ao enviar comprovante:', error);
      toast({
        title: "Erro ao enviar comprovante",
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

// Função para obter URL válida do storage
export const getStorageUrl = (filePath: string) => {
  if (!filePath) return null;
  
  // Se já é uma URL completa, retorna como está
  if (filePath.startsWith('http')) {
    return filePath;
  }
  
  // Se é um caminho do storage, gera a URL pública
  const { data } = supabase.storage
    .from('comprovantes')
    .getPublicUrl(filePath);
    
  return data.publicUrl;
};
