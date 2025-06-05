
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
  PiggyBank
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Ganho {
  id: string;
  fonte: string;
  valor: number;
  frequencia: 'mensal' | 'semanal' | 'unica';
  categoria: string;
  dataRecebimento: string;
  icone: any;
}

const categoriasIcones = {
  salario: Briefcase,
  freelance: Gift,
  investimento: PiggyBank,
  extra: DollarSign,
};

const dadosGraficos = [
  { mes: 'Jan', valor: 4500 },
  { mes: 'Fev', valor: 5200 },
  { mes: 'Mar', valor: 4800 },
  { mes: 'Abr', valor: 5500 },
  { mes: 'Mai', valor: 5000 },
  { mes: 'Jun', valor: 5800 },
];

const Ganhos = () => {
  const { toast } = useToast();
  const [ganhos, setGanhos] = useState<Ganho[]>([
    { 
      id: '1', 
      fonte: 'Salário Principal', 
      valor: 4500, 
      frequencia: 'mensal', 
      categoria: 'salario', 
      dataRecebimento: '2024-01-05',
      icone: Briefcase 
    },
    { 
      id: '2', 
      fonte: 'Freelance Design', 
      valor: 800, 
      frequencia: 'unica', 
      categoria: 'freelance', 
      dataRecebimento: '2024-01-15',
      icone: Gift 
    },
    { 
      id: '3', 
      fonte: 'Dividendos', 
      valor: 150, 
      frequencia: 'mensal', 
      categoria: 'investimento', 
      dataRecebimento: '2024-01-10',
      icone: PiggyBank 
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGanho, setEditingGanho] = useState<Ganho | null>(null);
  const [formData, setFormData] = useState({
    fonte: '',
    valor: '',
    frequencia: '',
    categoria: '',
    dataRecebimento: '',
  });

  const totalMensal = ganhos.reduce((total, ganho) => {
    if (ganho.frequencia === 'mensal') return total + ganho.valor;
    if (ganho.frequencia === 'semanal') return total + (ganho.valor * 4);
    return total; // Não inclui ganhos únicos no cálculo mensal
  }, 0);

  const totalAnual = totalMensal * 12;
  const ganhosMensais = ganhos.filter(g => g.frequencia === 'mensal');
  const ganhosExtras = ganhos.filter(g => g.frequencia === 'unica');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fonte || !formData.valor || !formData.frequencia || !formData.categoria || !formData.dataRecebimento) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const novoGanho: Ganho = {
      id: editingGanho ? editingGanho.id : Date.now().toString(),
      fonte: formData.fonte,
      valor: parseFloat(formData.valor),
      frequencia: formData.frequencia as 'mensal' | 'semanal' | 'unica',
      categoria: formData.categoria,
      dataRecebimento: formData.dataRecebimento,
      icone: categoriasIcones[formData.categoria as keyof typeof categoriasIcones] || DollarSign,
    };

    if (editingGanho) {
      setGanhos(ganhos.map(ganho => ganho.id === editingGanho.id ? novoGanho : ganho));
      toast({
        title: "Sucesso",
        description: "Ganho atualizado com sucesso!"
      });
    } else {
      setGanhos([...ganhos, novoGanho]);
      toast({
        title: "Sucesso",
        description: "Novo ganho adicionado com sucesso!"
      });
    }

    setFormData({ fonte: '', valor: '', frequencia: '', categoria: '', dataRecebimento: '' });
    setEditingGanho(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (ganho: Ganho) => {
    setEditingGanho(ganho);
    setFormData({
      fonte: ganho.fonte,
      valor: ganho.valor.toString(),
      frequencia: ganho.frequencia,
      categoria: ganho.categoria,
      dataRecebimento: ganho.dataRecebimento,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setGanhos(ganhos.filter(ganho => ganho.id !== id));
    toast({
      title: "Sucesso",
      description: "Ganho removido com sucesso!"
    });
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
                  <Label htmlFor="fonte" className="text-gray-300">Fonte de Renda</Label>
                  <Input
                    id="fonte"
                    value={formData.fonte}
                    onChange={(e) => setFormData({...formData, fonte: e.target.value})}
                    placeholder="Ex: Salário, Freelance"
                    className="bg-gray-700 border-gray-600 text-white"
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
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="frequencia" className="text-gray-300">Frequência</Label>
                  <Select 
                    value={formData.frequencia} 
                    onValueChange={(value) => setFormData({...formData, frequencia: value})}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Selecione a frequência" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="mensal">Mensal</SelectItem>
                      <SelectItem value="semanal">Semanal</SelectItem>
                      <SelectItem value="unica">Única</SelectItem>
                    </SelectContent>
                  </Select>
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

                <div className="space-y-2">
                  <Label htmlFor="dataRecebimento" className="text-gray-300">Data de Recebimento</Label>
                  <Input
                    id="dataRecebimento"
                    type="date"
                    value={formData.dataRecebimento}
                    onChange={(e) => setFormData({...formData, dataRecebimento: e.target.value})}
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
                Total Mensal
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
              <p className="text-xs text-gray-500 mt-1">Baseado na renda mensal</p>
            </CardContent>
          </Card>

          <Card className="card-glass border-purple-500/20 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-purple-400" />
                Fontes Ativas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">{ganhosMensais.length}</div>
              <p className="text-xs text-gray-500 mt-1">Receitas mensais</p>
            </CardContent>
          </Card>

          <Card className="card-glass border-yellow-500/20 animate-fade-in" style={{ animationDelay: '300ms' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <Gift className="w-4 h-4 text-yellow-400" />
                Renda Extra
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">{ganhosExtras.length}</div>
              <p className="text-xs text-gray-500 mt-1">
                {formatCurrency(ganhosExtras.reduce((total, ganho) => total + ganho.valor, 0))} este mês
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de Evolução */}
        <Card className="card-glass animate-slide-up">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Evolução dos Ganhos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dadosGraficos}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="mes" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="valor" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Lista de Ganhos */}
        <Card className="card-glass animate-slide-up" style={{ animationDelay: '100ms' }}>
          <CardHeader>
            <CardTitle className="text-white">Suas Fontes de Renda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ganhos.map((ganho, index) => {
                const IconeComponent = ganho.icone;
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
                        <h3 className="text-white font-semibold">{ganho.fonte}</h3>
                        <p className="text-sm text-gray-400">
                          {ganho.frequencia} • {formatDate(ganho.dataRecebimento)} • {ganho.categoria}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-400">{formatCurrency(ganho.valor)}</p>
                        <p className="text-sm text-gray-400 capitalize">{ganho.frequencia}</p>
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
