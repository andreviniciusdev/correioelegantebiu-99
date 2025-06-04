
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Upload, Check, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useCreateCartinha, useUploadComprovante } from '@/hooks/useSupabaseCartinhas';
import { CreateCartinhaData } from '@/hooks/useSupabaseCartinhas';

interface ComprovanteUploadProps {
  cartinhaId: string;
  onUploadSuccess?: () => void;
  cartinhaData?: CreateCartinhaData;
}

const ComprovanteUpload = ({ cartinhaId, onUploadSuccess, cartinhaData }: ComprovanteUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [cartinhaCriada, setCartinhaCriada] = useState<string | null>(null);
  const createCartinha = useCreateCartinha();
  const uploadComprovante = useUploadComprovante();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Verificar se é uma imagem
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Tipo de arquivo inválido",
          description: "Por favor, selecione apenas arquivos de imagem (JPG, PNG, etc.)",
          variant: "destructive"
        });
        return;
      }
      
      // Verificar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: "O arquivo deve ter no máximo 5MB",
          variant: "destructive"
        });
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !cartinhaData) return;
    
    try {
      // Primeiro criar a cartinha no banco sem o comprovante
      const cartinhaSemComprovante = {
        ...cartinhaData,
      };

      console.log('Criando cartinha sem comprovante:', cartinhaSemComprovante);

      createCartinha.mutate(cartinhaSemComprovante, {
        onSuccess: (cartinhaCriada) => {
          console.log('Cartinha criada com sucesso:', cartinhaCriada);
          setCartinhaCriada(cartinhaCriada.id);
          
          // Agora fazer upload do comprovante
          console.log('Iniciando upload do comprovante para cartinha:', cartinhaCriada.id);
          uploadComprovante.mutate(
            { file: selectedFile, cartinhaId: cartinhaCriada.id },
            {
              onSuccess: (cartinhaAtualizada) => {
                console.log('Upload do comprovante concluído:', cartinhaAtualizada);
                setSelectedFile(null);
                onUploadSuccess?.();
              },
              onError: (error) => {
                console.error('Erro no upload do comprovante:', error);
              }
            }
          );
        },
        onError: (error) => {
          console.error('Erro ao criar cartinha:', error);
        }
      });
    } catch (error) {
      console.error('Erro geral no processo:', error);
      toast({
        title: "Erro ao enviar",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const isLoading = createCartinha.isPending || uploadComprovante.isPending;

  return (
    <Card className="border-pink-200">
      <CardHeader className="text-center">
        <CardTitle className="text-lg text-pink-700 flex items-center justify-center gap-2">
          <Upload className="w-5 h-5" />
          Enviar Comprovante de Pagamento
        </CardTitle>
        <p className="text-sm text-gray-600">
          Anexe uma foto do comprovante do PIX ou transferência
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!selectedFile ? (
          <div className="space-y-3">
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="border-pink-300 focus:border-pink-500"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 text-center">
              Formatos aceitos: JPG, PNG, GIF (máximo 5MB)
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-pink-50 rounded border border-pink-200">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-700">
                  {selectedFile.name}
                </span>
              </div>
              <Button
                onClick={removeFile}
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                disabled={isLoading}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <Button
              onClick={handleUpload}
              disabled={isLoading}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white"
              size="lg"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  {createCartinha.isPending ? 'Criando pedido...' : 'Enviando comprovante...'}
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Enviar Comprovante
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ComprovanteUpload;
