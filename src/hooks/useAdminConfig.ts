
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface AdminConfig {
  id: string;
  qr_code_combo1: string | null;
  qr_code_combo2: string | null;
  senha_admin: string;
  created_at: string;
  updated_at: string;
}

// Hook para buscar configurações do admin
export const useAdminConfig = () => {
  return useQuery({
    queryKey: ['admin-config'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_config')
        .select('*')
        .limit(1)
        .single();

      if (error) {
        console.error('Erro ao buscar configurações:', error);
        throw error;
      }

      return data as AdminConfig;
    },
  });
};

// Hook para atualizar configurações do admin
export const useUpdateAdminConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: {
      qr_code_combo1: string;
      qr_code_combo2: string;
      senha_admin: string;
    }) => {
      // Primeiro, buscar o registro existente
      const { data: existingConfig, error: fetchError } = await supabase
        .from('admin_config')
        .select('id')
        .limit(1)
        .single();

      if (fetchError) {
        console.error('Erro ao buscar configuração existente:', fetchError);
        throw fetchError;
      }

      // Atualizar o registro existente
      const { data, error } = await supabase
        .from('admin_config')
        .update({
          qr_code_combo1: config.qr_code_combo1,
          qr_code_combo2: config.qr_code_combo2,
          senha_admin: config.senha_admin,
        })
        .eq('id', existingConfig.id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar configurações:', error);
        throw error;
      }

      return data as AdminConfig;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-config'] });
      toast({
        title: "Configurações atualizadas! ✨",
        description: "As alterações foram salvas no banco de dados.",
      });
    },
    onError: (error) => {
      console.error('Erro ao atualizar configurações:', error);
      toast({
        title: "Erro ao salvar configurações",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    },
  });
};

// Hook para verificar senha do admin
export const useAuthenticateAdmin = () => {
  return useMutation({
    mutationFn: async (password: string) => {
      const { data, error } = await supabase
        .from('admin_config')
        .select('senha_admin')
        .limit(1)
        .single();

      if (error) {
        console.error('Erro ao verificar senha:', error);
        throw error;
      }

      return data.senha_admin === password;
    },
  });
};
