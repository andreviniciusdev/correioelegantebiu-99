
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface ComprovanteSupabase {
  id: string;
  cartinha_id: string | null;
  arquivo_url: string;
  nome_arquivo: string;
  tamanho_arquivo: number | null;
  tipo_arquivo: string | null;
  created_at: string;
}

export interface CreateComprovanteData {
  cartinha_id: string;
  arquivo_url: string;
  nome_arquivo: string;
  tamanho_arquivo: number;
  tipo_arquivo: string;
}

// Hook para buscar comprovantes de uma cartinha
export const useComprovantes = (cartinhaId?: string) => {
  return useQuery({
    queryKey: ['comprovantes', cartinhaId],
    queryFn: async () => {
      const query = supabase.from('comprovantes').select('*');
      
      if (cartinhaId) {
        query.eq('cartinha_id', cartinhaId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar comprovantes:', error);
        throw error;
      }

      return data as ComprovanteSupabase[];
    },
    enabled: !!cartinhaId || cartinhaId === undefined,
  });
};

// Hook para fazer upload de comprovante
export const useUploadComprovante = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, cartinhaId }: { file: File; cartinhaId: string }) => {
      // 1. Upload do arquivo para o Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${cartinhaId}/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('comprovantes')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Erro no upload:', uploadError);
        throw uploadError;
      }

      // 2. Obter URL pública do arquivo
      const { data: urlData } = supabase.storage
        .from('comprovantes')
        .getPublicUrl(filePath);

      // 3. Salvar registro na tabela comprovantes
      const comprovanteData: CreateComprovanteData = {
        cartinha_id: cartinhaId,
        arquivo_url: urlData.publicUrl,
        nome_arquivo: file.name,
        tamanho_arquivo: file.size,
        tipo_arquivo: file.type,
      };

      const { data, error } = await supabase
        .from('comprovantes')
        .insert([comprovanteData])
        .select()
        .single();

      if (error) {
        console.error('Erro ao salvar comprovante:', error);
        throw error;
      }

      return data as ComprovanteSupabase;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comprovantes'] });
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
