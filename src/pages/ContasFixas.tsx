
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  CheckCircle, 
  Clock, 
  Calculator,
  CreditCard,
  Home,
  Zap,
  Wifi,
  ShoppingCart,
  Car,
  Heart,
  Loader2
} from "lucide-react";
import { useContasFixas } from "@/hooks/useContasFixas";

const categoriasIcones = {
  moradia: Home,
  energia: Zap,
  agua: Home,
  internet: Wifi,
  transporte: Car,
  alimentacao: ShoppingCart,
  saude: Heart,
  financiamento: CreditCard,
  outros: CreditCard,
};

const ContasFixas = () => {
  const { contas, loading, addConta, updateConta, deleteConta, toggleStatus } = useContasFixas();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingConta, setEditingConta] = useState<any>(null);
  const [formData, setFormData] = useState({
    nome: '',
    valor: '',
    vencimento: '',
    categoria: '',
  });

  const totalContasFixas = contas.reduce((total, conta) => total + conta.valor, 0);
  const contasPendentes = contas.filter(conta => conta.status === 'pendente');
  const contasPagas = contas.filter(conta => conta.status === 'pago');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.valor || !formData.vencimento || !formData.categoria) {
      return;
    }

    const contaData = {
      nome: formData.nome,
      valor: parseFloat(formData.valor),
      vencimento: parseInt(formData.vencimento),
      categoria: formData.categoria,
      status: 'pendente' as const,
    };

    if (editingConta) {
      await updateConta(editingConta.id, contaData);
    } else {
      await addConta(contaData);
    }

    setFormData({ nome: '', valor: '', vencimento: '', categoria: '' });
    setEditingConta(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (conta: any) => {
    setEditingConta(conta);
    setFormData({
      nome: conta.nome,
      valor: conta.valor.toString(),
      vencimento: conta.vencimento.toString(),
      categoria: conta.categoria,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteConta(id);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="flex items-center gap-3 text-white">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Carregando contas fixas...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="border-b border-gray-800 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="text-white hover:bg-white/10" />
            <div>
              <h1 className="text-2xl font-bold text-white">Contas Fixas</h1>
              <p className="text-gray-400">Gerencie suas despesas mensais</p>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-white">
                <Plus className="w-4 h-4 mr-2" />
                Nova Conta
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {editingConta ? 'Editar Conta' : 'Adicionar Nova Conta'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome" className="text-gray-300">Nome da Conta</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    placeholder="Ex: Conta de Luz"
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="valor" className="text-gray-300">Valor (R$)</Label>
                  <Input
                    id="valor"
                    type="number"
                    step="0.01"
                    value={formData.valor}
                    onChange={(e) => setFormData({...formData, valor: e.target.value})}
                    placeholder="0,00"
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vencimento" className="text-gray-300">Dia do Vencimento</Label>
                  <Input
                    id="vencimento"
                    type="number"
                    min="1"
                    max="31"
                    value={formData.vencimento}
                    onChange={(e) => setFormData({...formData, vencimento: e.target.value})}
                    placeholder="15"
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoria" className="text-gray-300">Categoria</Label>
                  <Select 
                    value={formData.categoria} 
                    onValueChange={(value) => setFormData({...formData, categoria: value})}
                    required
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="moradia">Moradia</SelectItem>
                      <SelectItem value="energia">Energia</SelectItem>
                      <SelectItem value="agua">Água</SelectItem>
                      <SelectItem value="internet">Internet</SelectItem>
                      <SelectItem value="transporte">Transporte</SelectItem>
                      <SelectItem value="alimentacao">Alimentação</SelectItem>
                      <SelectItem value="saude">Saúde</SelectItem>
                      <SelectItem value="financiamento">Financiamento</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                    className="flex-1 border-gray-600 text-gray-300"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1 gradient-primary text-white">
                    {editingConta ? 'Atualizar' : 'Adicionar'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="card-glass border-blue-500/20 animate-fade-in">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-blue-400" />
                Total Mensal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">{formatCurrency(totalContasFixas)}</div>
              <p className="text-xs text-gray-500 mt-1">{contas.length} contas cadastradas</p>
            </CardContent>
          </Card>

          <Card className="card-glass border-red-500/20 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-400" />
                Pendentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">{contasPendentes.length}</div>
              <p className="text-xs text-gray-500 mt-1">
                {formatCurrency(contasPendentes.reduce((total, conta) => total + conta.valor, 0))}
              </p>
            </CardContent>
          </Card>

          <Card className="card-glass border-green-500/20 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Pagas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{contasPagas.length}</div>
              <p className="text-xs text-gray-500 mt-1">
                {formatCurrency(contasPagas.reduce((total, conta) => total + conta.valor, 0))}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Contas */}
        <Card className="card-glass animate-slide-up">
          <CardHeader>
            <CardTitle className="text-white">Suas Contas Fixas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {contas.map((conta, index) => {
                const IconeComponent = categoriasIcones[conta.categoria as keyof typeof categoriasIcones] || CreditCard;
                return (
                  <div 
                    key={conta.id} 
                    className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        conta.status === 'pago' ? 'bg-green-500/20' : 'bg-gray-500/20'
                      }`}>
                        <IconeComponent className={`w-6 h-6 ${
                          conta.status === 'pago' ? 'text-green-400' : 'text-gray-400'
                        }`} />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{conta.nome}</h3>
                        <p className="text-sm text-gray-400">
                          Vencimento: dia {conta.vencimento} • {conta.categoria}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-bold text-white">{formatCurrency(conta.valor)}</p>
                        <p className={`text-sm ${
                          conta.status === 'pago' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {conta.status === 'pago' ? 'Pago' : 'Pendente'}
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleStatus(conta.id)}
                          className={`border-gray-600 ${
                            conta.status === 'pago' 
                              ? 'text-green-400 hover:bg-green-500/20' 
                              : 'text-red-400 hover:bg-red-500/20'
                          }`}
                        >
                          {conta.status === 'pago' ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(conta)}
                          className="border-gray-600 text-blue-400 hover:bg-blue-500/20"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(conta.id)}
                          className="border-gray-600 text-red-400 hover:bg-red-500/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {contas.length === 0 && (
                <div className="text-center py-12">
                  <CreditCard className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">Nenhuma conta cadastrada</h3>
                  <p className="text-gray-500 mb-4">Adicione suas primeiras contas fixas para começar</p>
                  <Button 
                    onClick={() => setIsDialogOpen(true)}
                    className="gradient-primary text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Primeira Conta
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContasFixas;
