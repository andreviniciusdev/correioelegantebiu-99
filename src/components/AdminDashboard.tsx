import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { useCorreioStore } from '@/hooks/useCorreioStore';
import { useCartinhas, useCartinhasStats, useUpdateCartinhaStatus } from '@/hooks/useSupabaseCartinhas';
import { toast } from '@/hooks/use-toast';
import {
  LogOut,
  Users,
  Mail,
  DollarSign,
  Settings,
  Download,
  CheckCircle,
  XCircle,
  QrCode,
  Eye,
  TrendingUp,
  Calendar,
  Sparkles
} from 'lucide-react';

const AdminDashboard = () => {
  const {
    adminConfig,
    updateAdminConfig,
    logout
  } = useCorreioStore();

  const { data: cartinhas = [], isLoading } = useCartinhas();
  const { data: stats } = useCartinhasStats();
  const updateStatus = useUpdateCartinhaStatus();

  const [config, setConfig] = useState(adminConfig);

  const handleUpdateConfig = () => {
    updateAdminConfig(config);
    toast({
      title: "Configurações atualizadas! ✨",
      description: "As alterações foram salvas com sucesso.",
    });
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
            onClick={logout}
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
              Configurações
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
                        <TableHead className="font-semibold text-pink-700">Data</TableHead>
                        <TableHead className="font-semibold text-pink-700">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cartinhas.map((cartinha) => (
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
                      ))}
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
                    Configuração de QR Codes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="qrCodeCombo1" className="text-pink-700 font-semibold">
                      QR Code - Combo Clássico (R$ 2,50)
                    </Label>
                    <Input
                      id="qrCodeCombo1"
                      placeholder="URL da imagem do QR Code..."
                      value={config.qrCodeCombo1}
                      onChange={(e) => setConfig(prev => ({ ...prev, qrCodeCombo1: e.target.value }))}
                      className="input-elegant border-0 rounded-xl"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="qrCodeCombo2" className="text-pink-700 font-semibold">
                      QR Code - Combo Premium (R$ 3,00)
                    </Label>
                    <Input
                      id="qrCodeCombo2"
                      placeholder="URL da imagem do QR Code..."
                      value={config.qrCodeCombo2}
                      onChange={(e) => setConfig(prev => ({ ...prev, qrCodeCombo2: e.target.value }))}
                      className="input-elegant border-0 rounded-xl"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-elegant border-0 glass-effect">
                <CardHeader>
                  <CardTitle className="text-gradient-pink flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Configurações de Segurança
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Label htmlFor="senha" className="text-pink-700 font-semibold">
                      Senha do Painel Administrativo
                    </Label>
                    <Input
                      id="senha"
                      type="password"
                      placeholder="Nova senha..."
                      value={config.senha}
                      onChange={(e) => setConfig(prev => ({ ...prev, senha: e.target.value }))}
                      className="input-elegant border-0 rounded-xl"
                    />
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={handleUpdateConfig}
                className="w-full btn-elegant text-white py-4 text-lg font-semibold rounded-xl border-0 shadow-elegant"
                size="lg"
              >
                <Settings className="w-5 h-5 mr-2" />
                Salvar Configurações
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
