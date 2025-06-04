
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

      // 2. Obter URL pública do arquivo - agora que o bucket é público
      const { data: urlData } = supabase.storage
        .from('comprovantes')
        .getPublicUrl(filePath);

      console.log('URL pública gerada:', urlData.publicUrl);

      // 3. Salvar registro na tabela comprovantes com a URL pública
      const comprovanteData: CreateComprovanteData = {
        cartinha_id: cartinhaId,
        arquivo_url: urlData.publicUrl,
        nome_arquivo: file.name,
        tamanho_arquivo: file.size,
        tipo_arquivo: file.type,
      };

      console.log('Salvando dados do comprovante:', comprovanteData);

      const { data, error } = await supabase
        .from('comprovantes')
        .insert([comprovanteData])
        .select()
        .single();

      if (error) {
        console.error('Erro ao salvar comprovante:', error);
        throw error;
      }

      console.log('Comprovante salvo com sucesso:', data);
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

// Função melhorada para obter URL válida do storage
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
