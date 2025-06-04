
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Upload, Check, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useCreateCartinha } from '@/hooks/useSupabaseCartinhas';
import { CreateCartinhaData } from '@/hooks/useSupabaseCartinhas';

interface ComprovanteUploadProps {
  cartinhaId: string;
  onUploadSuccess?: () => void;
  cartinhaData?: CreateCartinhaData;
}

const ComprovanteUpload = ({ cartinhaId, onUploadSuccess, cartinhaData }: ComprovanteUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const createCartinha = useCreateCartinha();

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
    
    setIsUploading(true);
    
    try {
      // Primeiro criar a cartinha no banco com os dados do comprovante
      const cartinhaComComprovante = {
        ...cartinhaData,
        comprovante_nome: selectedFile.name,
        comprovante_tamanho: selectedFile.size,
        comprovante_tipo: selectedFile.type,
      };

      createCartinha.mutate(cartinhaComComprovante, {
        onSuccess: (cartinhaCriada) => {
          toast({
            title: "Comprovante enviado! 📎",
            description: "Seu comprovante foi recebido e o pedido foi enviado aos administradores.",
          });
          setSelectedFile(null);
          onUploadSuccess?.();
        },
        onError: () => {
          setIsUploading(false);
        }
      });
    } catch (error) {
      console.error('Erro ao enviar comprovante:', error);
      toast({
        title: "Erro ao enviar comprovante",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

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
                disabled={isUploading}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <Button
              onClick={handleUpload}
              disabled={isUploading || createCartinha.isPending}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white"
            >
              {isUploading || createCartinha.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Enviando...
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
