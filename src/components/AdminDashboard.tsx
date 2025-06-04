import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { useCorreioStore } from '@/hooks/useCorreioStore';
import { useCartinhas, useCartinhasStats, useUpdateCartinhaStatus } from '@/hooks/useSupabaseCartinhas';
import { useComprovantes, getStorageUrl } from '@/hooks/useSupabaseComprovantes';
import { toast } from '@/hooks/use-toast';
import { ADMIN_CONFIG } from '@/config/adminConfig';
import {
  LogOut,
  Mail,
  Download,
  CheckCircle,
  QrCode,
  Eye,
  TrendingUp,
  Calendar,
  Info,
  FileImage
} from 'lucide-react';

const AdminDashboard = () => {
  const { logout } = useCorreioStore();
  const { data: cartinhas = [], isLoading } = useCartinhas();
  const { data: stats } = useCartinhasStats();
  const { data: comprovantes = [] } = useComprovantes();
  const updateStatus = useUpdateCartinhaStatus();

  const handleLogout = () => {
    logout();
  };

  const toggleStatus = (id: string, currentStatus: 'pendente' | 'pago') => {
    const newStatus = currentStatus === 'pendente' ? 'pago' : 'pendente';
    updateStatus.mutate({ id, status: newStatus });
    toast({
      title: `Status atualizado! 🎉`,
      description: `Cartinha marcada como ${newStatus}.`,
    });
  };

  const exportToCsv = () => {
    const headers = ['Remetente', 'Destinatário', 'Série', 'Mensagem', 'Combo', 'Valor', 'Status', 'Data'];
    const rows = cartinhas.map(cartinha => [
      cartinha.remetente,
      cartinha.destinatario,
      cartinha.serie,
      cartinha.mensagem,
      cartinha.combo === 'combo1' ? 'Clássico' : 'Premium',
      `R$ ${Number(cartinha.valor).toFixed(2)}`,
      cartinha.status,
      new Date(cartinha.data_envio).toLocaleDateString('pt-BR')
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'cartinhas_correio_elegante.csv';
    link.click();

    toast({
      title: "Exportação concluída! 📊",
      description: "O arquivo CSV foi baixado com sucesso.",
    });
  };

  const getComprovantesForCartinha = (cartinhaId: string) => {
    return comprovantes.filter(comp => comp.cartinha_id === cartinhaId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-elegant flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-500 border-t-transparent mx-auto shadow-elegant"></div>
          <div className="mt-6 space-y-2">
            <p className="text-xl font-semibold text-gradient-pink">Carregando dados...</p>
            <p className="text-pink-600/70">Aguarde um momento</p>
          </div>
        </div>
      </div>
    );
  }

  console.log('Comprovantes carregados no dashboard:', comprovantes);
  console.log('Total de comprovantes:', comprovantes.length);

  return (
    <div className="min-h-screen bg-gradient-elegant">
      <header className="glass-effect border-b border-pink-200/50 p-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <img
                src="/logocorreioelegante.png"
                alt="Ícone"
                className="w-12 h-12 object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-pink-600">
              Painel Administrativo
            </h1>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-pink-300 text-pink-700 hover:bg-pink-50 hover:border-pink-400 shadow-soft"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-white/70 backdrop-blur-sm border-0 shadow-soft p-1 rounded-xl">
            <TabsTrigger
              value="dashboard"
              className="rounded-lg font-semibold data-[state=active]:bg-pink-500 data-[state=active]:text-white"
            >
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="cartinhas" className="rounded-lg font-semibold data-[state=active]:bg-pink-500 data-[state=active]:text-white">
              Cartinhas
            </TabsTrigger>
            <TabsTrigger value="configuracoes" className="rounded-lg font-semibold data-[state=active]:bg-pink-500 data-[state=active]:text-white">
              QR Codes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="shadow-elegant border-0 glass-effect card-hover">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-pink-600 font-semibold text-sm">Total de Cartinhas</p>
                      <p className="text-3xl font-bold text-gradient-pink">{stats?.total || 0}</p>
                      <p className="text-xs text-pink-500 mt-1">📧 Mensagens enviadas</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-pink-200 rounded-xl flex items-center justify-center">
                      <Mail className="w-6 h-6 text-pink-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-elegant border-0 glass-effect card-hover">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-600 font-semibold text-sm">Pagas</p>
                      <p className="text-3xl font-bold text-green-700">{stats?.pagas || 0}</p>
                      <p className="text-xs text-green-500 mt-1">✅ Confirmadas</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-elegant border-0 glass-effect card-hover">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-600 font-semibold text-sm">Pendentes</p>
                      <p className="text-3xl font-bold text-orange-700">{stats?.pendentes || 0}</p>
                      <p className="text-xs text-orange-500 mt-1">⏳ Aguardando</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-elegant border-0 glass-effect card-hover">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-600 font-semibold text-sm">Receita</p>
                      <p className="text-3xl font-bold text-gradient-purple">
                        R$ {(stats?.receita || 0).toFixed(2)}
                      </p>
                      <p className="text-xs text-purple-500 mt-1">💰 Total arrecadado</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="cartinhas">
            <Card className="shadow-elegant border-0 glass-effect">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-gradient-pink flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Todas as Cartinhas
                  </CardTitle>
                  <Button
                    onClick={exportToCsv}
                    className="btn-elegant text-white border-0 shadow-soft"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Exportar CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-pink-200/50">
                        <TableHead className="font-semibold text-pink-700">Remetente</TableHead>
                        <TableHead className="font-semibold text-pink-700">Destinatário</TableHead>
                        <TableHead className="font-semibold text-pink-700">Série</TableHead>
                        <TableHead className="font-semibold text-pink-700">Mensagem</TableHead>
                        <TableHead className="font-semibold text-pink-700">Combo</TableHead>
                        <TableHead className="font-semibold text-pink-700">Valor</TableHead>
                        <TableHead className="font-semibold text-pink-700">Status</TableHead>
                        <TableHead className="font-semibold text-pink-700">Comprovante</TableHead>
                        <TableHead className="font-semibold text-pink-700">Data</TableHead>
                        <TableHead className="font-semibold text-pink-700">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cartinhas.map((cartinha) => {
                        const comprovantesDaCartinha = getComprovantesForCartinha(cartinha.id);
                        console.log(`Comprovantes para cartinha ${cartinha.id}:`, comprovantesDaCartinha);
                        
                        return (
                          <TableRow key={cartinha.id} className="border-pink-100/50 hover:bg-pink-50/30">
                            <TableCell className="font-medium">{cartinha.remetente}</TableCell>
                            <TableCell>{cartinha.destinatario}</TableCell>
                            <TableCell>{cartinha.serie}</TableCell>
                            <TableCell className="max-w-xs">
                              <div className="flex items-center gap-2">
                                <span className="truncate" title={cartinha.mensagem}>
                                  {cartinha.mensagem.length > 50
                                    ? `${cartinha.mensagem.substring(0, 50)}...`
                                    : cartinha.mensagem
                                  }
                                </span>
                                {cartinha.mensagem.length > 50 && (
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-6 w-6 p-0 text-pink-600 hover:text-pink-800 hover:bg-pink-50"
                                      >
                                        <Eye className="w-4 h-4" />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-md">
                                      <DialogHeader>
                                        <DialogTitle className="text-pink-800">
                                          Mensagem Completa
                                        </DialogTitle>
                                        <DialogDescription>
                                          Visualize a mensagem completa da cartinha enviada.
                                        </DialogDescription>
                                      </DialogHeader>
                                      <div className="mt-4">
                                        <p className="text-gray-700 leading-relaxed break-words">
                                          {cartinha.mensagem}
                                        </p>
                                        <div className="mt-4 pt-4 border-t border-pink-200 text-sm text-gray-500">
                                          <p><strong>De:</strong> {cartinha.remetente}</p>
                                          <p><strong>Para:</strong> {cartinha.destinatario}</p>
                                          <p><strong>Série:</strong> {cartinha.serie}</p>
                                        </div>
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {cartinha.combo === 'combo1' ? 'Clássico' : 'Premium'}
                            </TableCell>
                            <TableCell>R$ {Number(cartinha.valor).toFixed(2)}</TableCell>
                            <TableCell>
                              <Badge
                                variant={cartinha.status === 'pago' ? 'default' : 'secondary'}
                                className={cartinha.status === 'pago' ? 'bg-green-500' : 'bg-orange-500'}
                              >
                                {cartinha.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {comprovantesDaCartinha.length > 0 ? (
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="border-pink-300 text-pink-600 hover:bg-pink-50"
                                    >
                                      <FileImage className="w-4 h-4 mr-1" />
                                      Ver ({comprovantesDaCartinha.length})
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-lg">
                                    <DialogHeader>
                                      <DialogTitle className="text-pink-800">
                                        Comprovantes de Pagamento
                                      </DialogTitle>
                                      <DialogDescription>
                                        Comprovantes enviados para esta cartinha.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="mt-4 space-y-4 max-h-96 overflow-y-auto">
                                      {comprovantesDaCartinha.map((comprovante, index) => {
                                        console.log(`Renderizando comprovante ${index}:`, comprovante);
                                        
                                        // Garantir que temos uma URL válida
                                        const imageUrl = getStorageUrl(comprovante.arquivo_url) || comprovante.arquivo_url;
                                        console.log(`URL final para comprovante ${index}:`, imageUrl);
                                        
                                        return (
                                          <div key={comprovante.id} className="border border-pink-200 rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-2">
                                              <span className="text-sm font-medium text-gray-700">
                                                {comprovante.nome_arquivo}
                                              </span>
                                              <span className="text-xs text-gray-500">
                                                {new Date(comprovante.created_at).toLocaleDateString('pt-BR')} às {new Date(comprovante.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                              </span>
                                            </div>
                                            <div className="relative">
                                              <img 
                                                src={imageUrl} 
                                                alt={comprovante.nome_arquivo}
                                                className="w-full max-h-64 object-contain border border-gray-200 rounded bg-gray-50"
                                                loading="lazy"
                                                onLoad={(e) => {
                                                  console.log('✅ Imagem carregada com sucesso:', imageUrl);
                                                  console.log('Dimensões da imagem:', e.currentTarget.naturalWidth, 'x', e.currentTarget.naturalHeight);
                                                }}
                                                onError={(e) => {
                                                  console.error('❌ Erro ao carregar imagem:', imageUrl);
                                                  console.error('Objeto do comprovante:', comprovante);
                                                  const target = e.currentTarget as HTMLImageElement;
                                                  target.style.display = 'none';
                                                  const errorDiv = document.createElement('div');
                                                  errorDiv.className = 'w-full h-32 flex items-center justify-center bg-red-50 border border-red-200 rounded text-red-600 text-sm';
                                                  errorDiv.innerHTML = `
                                                    <div class="text-center">
                                                      <div>❌ Erro ao carregar imagem</div>
                                                      <div class="text-xs mt-1">URL: ${imageUrl}</div>
                                                    </div>
                                                  `;
                                                  target.parentNode?.insertBefore(errorDiv, target);
                                                }}
                                              />
                                            </div>
                                            {comprovante.tamanho_arquivo && (
                                              <p className="text-xs text-gray-500 mt-2">
                                                Tamanho: {(comprovante.tamanho_arquivo / 1024 / 1024).toFixed(2)} MB
                                              </p>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              ) : (
                                <span className="text-gray-400 text-sm">Nenhum</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {new Date(cartinha.data_envio).toLocaleDateString('pt-BR')}
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => toggleStatus(cartinha.id, cartinha.status)}
                                className="border-pink-soft text-pink-700 hover:bg-pink-50"
                              >
                                {cartinha.status === 'pendente' ? 'Marcar Pago' : 'Marcar Pendente'}
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>

                  {cartinhas.length === 0 && (
                    <div className="text-center py-12">
                      <Mail className="w-16 h-16 text-pink-300 mx-auto mb-4" />
                      <p className="text-lg font-semibold text-pink-600 mb-2">Nenhuma cartinha enviada ainda</p>
                      <p className="text-pink-500">As cartinhas aparecerão aqui quando forem enviadas</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="configuracoes">
            <div className="grid gap-6">
              <Card className="shadow-elegant border-0 glass-effect">
                <CardHeader>
                  <CardTitle className="text-gradient-pink flex items-center gap-2">
                    <QrCode className="w-5 h-5" />
                    QR Codes de Pagamento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* QR Code Combo 1 */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-pink-700">
                        Combo Clássico - R$ {ADMIN_CONFIG.COMBO_PRICES.combo1.toFixed(2)}
                      </h3>
                      <div className="bg-white/50 p-4 rounded-xl border border-pink-200/50">
                        <img
                          src={ADMIN_CONFIG.QR_CODES.combo1}
                          alt="QR Code Combo Clássico"
                          className="w-full max-w-48 mx-auto rounded-lg shadow-soft"
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmaWxsPSIjOUNBM0FGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9InN5c3RlbS11aSIgZm9udC1zaXplPSIxNCI+UVIgQ29kZTwvdGV4dD4KPC9zdmc+';
                          }}
                        />
                        <p className="text-center text-sm text-pink-600 mt-2">
                          Para alterar, substitua a imagem em: <br />
                          <code className="bg-pink-100 px-2 py-1 rounded text-xs">
                            public/qr-combo1.png
                          </code>
                        </p>
                      </div>
                    </div>

                    {/* QR Code Combo 2 */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-pink-700">
                        Combo Premium - R$ {ADMIN_CONFIG.COMBO_PRICES.combo2.toFixed(2)}
                      </h3>
                      <div className="bg-white/50 p-4 rounded-xl border border-pink-200/50">
                        <img
                          src={ADMIN_CONFIG.QR_CODES.combo2}
                          alt="QR Code Combo Premium"
                          className="w-full max-w-48 mx-auto rounded-lg shadow-soft"
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmaWxsPSIjOUNBM0FGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9InN5c3RlbS11aSIgZm9udC1zaXplPSIxNCI+UVIgQ29kZTwvdGV4dD4KPC9zdmc+';
                          }}
                        />
                        <p className="text-center text-sm text-pink-600 mt-2">
                          Para alterar, substitua a imagem em: <br />
                          <code className="bg-pink-100 px-2 py-1 rounded text-xs">
                            public/qr-combo2.png
                          </code>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-800 mb-1">Como alterar as configurações:</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• <strong>QR Codes:</strong> Substitua as imagens <code>qr-combo1.png</code> e <code>qr-combo2.png</code> na pasta <code>public/</code></li>
                          <li>• <strong>Senha:</strong> Edite a constante <code>PASSWORD</code> no arquivo <code>src/config/adminConfig.ts</code></li>
                          <li>• <strong>Preços:</strong> Altere os valores em <code>COMBO_PRICES</code> no mesmo arquivo</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
