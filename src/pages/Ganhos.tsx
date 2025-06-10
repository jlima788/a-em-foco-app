
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
  TrendingUp,
  DollarSign,
  Calendar,
  Briefcase,
  Gift,
  PiggyBank,
  Loader2
} from "lucide-react";
import { useGanhos } from "@/hooks/useGanhos";

const categoriasIcones = {
  salario: Briefcase,
  freelance: Gift,
  investimento: PiggyBank,
  extra: DollarSign,
};

const Ganhos = () => {
  const { ganhos, loading, addGanho, updateGanho, deleteGanho } = useGanhos();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGanho, setEditingGanho] = useState<any>(null);
  const [formData, setFormData] = useState({
    descricao: '',
    valor: '',
    data_recebimento: '',
    categoria: '',
    recorrente: false,
    observacoes: '',
  });

  // Calcular totais baseados nos dados reais
  const ganhosRecorrentes = ganhos.filter(g => g.recorrente);
  const ganhosUnicos = ganhos.filter(g => !g.recorrente);
  const totalMensal = ganhosRecorrentes.reduce((total, ganho) => total + ganho.valor, 0);
  const totalAnual = totalMensal * 12;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.descricao || !formData.valor || !formData.data_recebimento) {
      return;
    }

    const ganhoData = {
      descricao: formData.descricao,
      valor: parseFloat(formData.valor),
      data_recebimento: formData.data_recebimento,
      categoria_id: formData.categoria || null,
      recorrente: formData.recorrente,
      observacoes: formData.observacoes || null,
    };

    if (editingGanho) {
      await updateGanho(editingGanho.id, ganhoData);
    } else {
      await addGanho(ganhoData);
    }

    setFormData({ descricao: '', valor: '', data_recebimento: '', categoria: '', recorrente: false, observacoes: '' });
    setEditingGanho(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (ganho: any) => {
    setEditingGanho(ganho);
    setFormData({
      descricao: ganho.descricao,
      valor: ganho.valor.toString(),
      data_recebimento: ganho.data_recebimento,
      categoria: ganho.categoria_id || '',
      recorrente: ganho.recorrente,
      observacoes: ganho.observacoes || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteGanho(id);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="flex items-center gap-3 text-white">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Carregando ganhos...</span>
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
              <h1 className="text-2xl font-bold text-white">Ganhos</h1>
              <p className="text-gray-400">Acompanhe suas fontes de renda</p>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-success text-white">
                <Plus className="w-4 h-4 mr-2" />
                Novo Ganho
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {editingGanho ? 'Editar Ganho' : 'Adicionar Novo Ganho'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="descricao" className="text-gray-300">Descrição</Label>
                  <Input
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                    placeholder="Ex: Salário, Freelance"
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
                  <Label htmlFor="data_recebimento" className="text-gray-300">Data de Recebimento</Label>
                  <Input
                    id="data_recebimento"
                    type="date"
                    value={formData.data_recebimento}
                    onChange={(e) => setFormData({...formData, data_recebimento: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoria" className="text-gray-300">Categoria</Label>
                  <Select 
                    value={formData.categoria} 
                    onValueChange={(value) => setFormData({...formData, categoria: value})}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="salario">Salário</SelectItem>
                      <SelectItem value="freelance">Freelance</SelectItem>
                      <SelectItem value="investimento">Investimento</SelectItem>
                      <SelectItem value="extra">Renda Extra</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="recorrente"
                    checked={formData.recorrente}
                    onChange={(e) => setFormData({...formData, recorrente: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="recorrente" className="text-gray-300">Ganho recorrente</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observacoes" className="text-gray-300">Observações</Label>
                  <Input
                    id="observacoes"
                    value={formData.observacoes}
                    onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                    placeholder="Observações adicionais"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
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
                  <Button type="submit" className="flex-1 gradient-success text-white">
                    {editingGanho ? 'Atualizar' : 'Adicionar'}
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="card-glass border-green-500/20 animate-fade-in">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                Total Mensal Recorrente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{formatCurrency(totalMensal)}</div>
              <p className="text-xs text-gray-500 mt-1">Renda recorrente</p>
            </CardContent>
          </Card>

          <Card className="card-glass border-blue-500/20 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                Projeção Anual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">{formatCurrency(totalAnual)}</div>
              <p className="text-xs text-gray-500 mt-1">Baseado na renda mensal recorrente</p>
            </CardContent>
          </Card>

          <Card className="card-glass border-purple-500/20 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-purple-400" />
                Ganhos Recorrentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">{ganhosRecorrentes.length}</div>
              <p className="text-xs text-gray-500 mt-1">Receitas mensais</p>
            </CardContent>
          </Card>

          <Card className="card-glass border-yellow-500/20 animate-fade-in" style={{ animationDelay: '300ms' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <Gift className="w-4 h-4 text-yellow-400" />
                Ganhos Únicos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">{ganhosUnicos.length}</div>
              <p className="text-xs text-gray-500 mt-1">
                {formatCurrency(ganhosUnicos.reduce((total, ganho) => total + ganho.valor, 0))} total
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Ganhos */}
        <Card className="card-glass animate-slide-up">
          <CardHeader>
            <CardTitle className="text-white">Suas Fontes de Renda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ganhos.map((ganho, index) => {
                const IconeComponent = categoriasIcones[ganho.categoria_id as keyof typeof categoriasIcones] || DollarSign;
                return (
                  <div 
                    key={ganho.id} 
                    className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                        <IconeComponent className="w-6 h-6 text-green-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{ganho.descricao}</h3>
                        <p className="text-sm text-gray-400">
                          {formatDate(ganho.data_recebimento)} • {ganho.recorrente ? 'Recorrente' : 'Único'}
                          {ganho.observacoes && ` • ${ganho.observacoes}`}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-400">{formatCurrency(ganho.valor)}</p>
                        <p className="text-sm text-gray-400">{ganho.recorrente ? 'Mensal' : 'Único'}</p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(ganho)}
                          className="border-gray-600 text-blue-400 hover:bg-blue-500/20"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(ganho.id)}
                          className="border-gray-600 text-red-400 hover:bg-red-500/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {ganhos.length === 0 && (
                <div className="text-center py-12">
                  <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">Nenhum ganho cadastrado</h3>
                  <p className="text-gray-500 mb-4">Adicione suas fontes de renda para começar</p>
                  <Button 
                    onClick={() => setIsDialogOpen(true)}
                    className="gradient-success text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Primeiro Ganho
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

export default Ganhos;
