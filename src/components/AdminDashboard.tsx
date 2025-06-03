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
  Eye
} from 'lucide-react';

const AdminDashboard = () => {
  const { 
    cartinhas, 
    adminConfig, 
    updateCartinhaStatus, 
    updateAdminConfig, 
    logout 
  } = useCorreioStore();
  
  const [config, setConfig] = useState(adminConfig);

  const handleUpdateConfig = () => {
    updateAdminConfig(config);
    toast({
      title: "Configurações atualizadas!",
      description: "As alterações foram salvas com sucesso.",
    });
  };

  const toggleStatus = (id: string, currentStatus: 'pendente' | 'pago') => {
    const newStatus = currentStatus === 'pendente' ? 'pago' : 'pendente';
    updateCartinhaStatus(id, newStatus);
    toast({
      title: `Status atualizado!`,
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
      `R$ ${cartinha.valor.toFixed(2)}`,
      cartinha.status,
      cartinha.dataEnvio
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
      title: "Exportação concluída!",
      description: "O arquivo CSV foi baixado com sucesso.",
    });
  };

  const stats = {
    total: cartinhas.length,
    pagas: cartinhas.filter(c => c.status === 'pago').length,
    pendentes: cartinhas.filter(c => c.status === 'pendente').length,
    receita: cartinhas.filter(c => c.status === 'pago').reduce((sum, c) => sum + c.valor, 0)
  };

  return (
    <div className="min-h-screen bg-gradient-pink">
      <header className="bg-white/80 backdrop-blur-sm border-b border-pink-soft p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gradient-pink">
            Painel Administrativo
          </h1>
          <Button 
            onClick={logout}
            variant="outline" 
            className="border-pink-soft text-pink-700 hover:bg-pink-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="cartinhas">Cartinhas</TabsTrigger>
            <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="shadow-pink border-pink-soft">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-pink-600 font-medium">Total de Cartinhas</p>
                      <p className="text-3xl font-bold text-pink-800">{stats.total}</p>
                    </div>
                    <Mail className="w-8 h-8 text-pink-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-pink border-pink-soft">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-600 font-medium">Pagas</p>
                      <p className="text-3xl font-bold text-green-800">{stats.pagas}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-pink border-pink-soft">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-600 font-medium">Pendentes</p>
                      <p className="text-3xl font-bold text-orange-800">{stats.pendentes}</p>
                    </div>
                    <XCircle className="w-8 h-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-pink border-pink-soft">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-pink-600 font-medium">Receita</p>
                      <p className="text-3xl font-bold text-pink-800">
                        R$ {stats.receita.toFixed(2)}
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-pink-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="cartinhas">
            <Card className="shadow-pink border-pink-soft">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-pink-800">Todas as Cartinhas</CardTitle>
                  <Button 
                    onClick={exportToCsv}
                    className="bg-pink-500 hover:bg-pink-600 text-white"
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
                      <TableRow>
                        <TableHead>Remetente</TableHead>
                        <TableHead>Destinatário</TableHead>
                        <TableHead>Série</TableHead>
                        <TableHead>Mensagem</TableHead>
                        <TableHead>Combo</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cartinhas.map((cartinha) => (
                        <TableRow key={cartinha.id}>
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
                          <TableCell>R$ {cartinha.valor.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={cartinha.status === 'pago' ? 'default' : 'secondary'}
                              className={cartinha.status === 'pago' ? 'bg-green-500' : 'bg-orange-500'}
                            >
                              {cartinha.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{cartinha.dataEnvio}</TableCell>
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
                    <div className="text-center py-8 text-gray-500">
                      Nenhuma cartinha enviada ainda.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="configuracoes">
            <div className="grid gap-6">
              <Card className="shadow-pink border-pink-soft">
                <CardHeader>
                  <CardTitle className="text-pink-800 flex items-center gap-2">
                    <QrCode className="w-5 h-5" />
                    Configuração de QR Codes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="qrCodeCombo1" className="text-pink-700 font-medium">
                      QR Code - Combo Clássico (R$ 2,50)
                    </Label>
                    <Input
                      id="qrCodeCombo1"
                      placeholder="URL da imagem do QR Code..."
                      value={config.qrCodeCombo1}
                      onChange={(e) => setConfig(prev => ({ ...prev, qrCodeCombo1: e.target.value }))}
                      className="border-pink-soft focus:ring-pink-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="qrCodeCombo2" className="text-pink-700 font-medium">
                      QR Code - Combo Premium (R$ 3,00)
                    </Label>
                    <Input
                      id="qrCodeCombo2"
                      placeholder="URL da imagem do QR Code..."
                      value={config.qrCodeCombo2}
                      onChange={(e) => setConfig(prev => ({ ...prev, qrCodeCombo2: e.target.value }))}
                      className="border-pink-soft focus:ring-pink-500"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-pink border-pink-soft">
                <CardHeader>
                  <CardTitle className="text-pink-800 flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Configurações de Segurança
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="senha" className="text-pink-700 font-medium">
                      Senha do Painel Administrativo
                    </Label>
                    <Input
                      id="senha"
                      type="password"
                      placeholder="Nova senha..."
                      value={config.senha}
                      onChange={(e) => setConfig(prev => ({ ...prev, senha: e.target.value }))}
                      className="border-pink-soft focus:ring-pink-500"
                    />
                  </div>
                </CardContent>
              </Card>

              <Button 
                onClick={handleUpdateConfig}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 shadow-pink"
                size="lg"
              >
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
