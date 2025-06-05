
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Target,
  Car,
  Home,
  Plane,
  Calculator
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Sonho {
  id: string;
  nome: string;
  valorTotal: number;
  valorEconomizado: number;
  investimentoMensal: number;
  categoria: string;
  icone: any;
  cor: string;
}

const categoriasIcones = {
  veiculo: { icone: Car, cor: '#3b82f6' },
  imovel: { icone: Home, cor: '#10b981' },
  viagem: { icone: Plane, cor: '#f59e0b' },
  outros: { icone: Target, cor: '#8b5cf6' },
};

const MuralSonhos = () => {
  const { toast } = useToast();
  const [sonhos, setSonhos] = useState<Sonho[]>([
    { 
      id: '1', 
      nome: 'Carro Novo', 
      valorTotal: 50000, 
      valorEconomizado: 15000, 
      investimentoMensal: 800,
      categoria: 'veiculo',
      icone: Car,
      cor: '#3b82f6'
    },
    { 
      id: '2', 
      nome: 'Casa Própria', 
      valorTotal: 200000, 
      valorEconomizado: 45000, 
      investimentoMensal: 1200,
      categoria: 'imovel',
      icone: Home,
      cor: '#10b981'
    },
    { 
      id: '3', 
      nome: 'Viagem Europa', 
      valorTotal: 15000, 
      valorEconomizado: 8000, 
      investimentoMensal: 400,
      categoria: 'viagem',
      icone: Plane,
      cor: '#f59e0b'
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSonho, setEditingSonho] = useState<Sonho | null>(null);
  const [showCalculator, setShowCalculator] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    valorTotal: '',
    valorEconomizado: '',
    investimentoMensal: '',
    categoria: '',
  });

  const totalSonhos = sonhos.reduce((total, sonho) => total + sonho.valorTotal, 0);
  const totalEconomizado = sonhos.reduce((total, sonho) => total + sonho.valorEconomizado, 0);
  const totalInvestimentoMensal = sonhos.reduce((total, sonho) => total + sonho.investimentoMensal, 0);
  const progressoGeral = totalSonhos > 0 ? (totalEconomizado / totalSonhos) * 100 : 0;

  const calcularTempoRestante = (sonho: Sonho) => {
    const valorRestante = sonho.valorTotal - sonho.valorEconomizado;
    if (sonho.investimentoMensal <= 0) return "∞";
    const mesesRestantes = Math.ceil(valorRestante / sonho.investimentoMensal);
    const anos = Math.floor(mesesRestantes / 12);
    const meses = mesesRestantes % 12;
    
    if (anos > 0) {
      return `${anos}a ${meses}m`;
    }
    return `${meses}m`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.valorTotal || !formData.categoria) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const categoriaInfo = categoriasIcones[formData.categoria as keyof typeof categoriasIcones] || categoriasIcones.outros;

    const novoSonho: Sonho = {
      id: editingSonho ? editingSonho.id : Date.now().toString(),
      nome: formData.nome,
      valorTotal: parseFloat(formData.valorTotal),
      valorEconomizado: parseFloat(formData.valorEconomizado) || 0,
      investimentoMensal: parseFloat(formData.investimentoMensal) || 0,
      categoria: formData.categoria,
      icone: categoriaInfo.icone,
      cor: categoriaInfo.cor,
    };

    if (editingSonho) {
      setSonhos(sonhos.map(sonho => sonho.id === editingSonho.id ? novoSonho : sonho));
      toast({
        title: "Sucesso",
        description: "Sonho atualizado com sucesso!"
      });
    } else {
      setSonhos([...sonhos, novoSonho]);
      toast({
        title: "Sucesso",
        description: "Novo sonho adicionado com sucesso!"
      });
    }

    setFormData({ nome: '', valorTotal: '', valorEconomizado: '', investimentoMensal: '', categoria: '' });
    setEditingSonho(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (sonho: Sonho) => {
    setEditingSonho(sonho);
    setFormData({
      nome: sonho.nome,
      valorTotal: sonho.valorTotal.toString(),
      valorEconomizado: sonho.valorEconomizado.toString(),
      investimentoMensal: sonho.investimentoMensal.toString(),
      categoria: sonho.categoria,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setSonhos(sonhos.filter(sonho => sonho.id !== id));
    toast({
      title: "Sucesso",
      description: "Sonho removido com sucesso!"
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="border-b border-gray-800 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="text-white hover:bg-white/10" />
            <div>
              <h1 className="text-2xl font-bold text-white">Mural dos Sonhos</h1>
              <p className="text-gray-400">Transforme seus sonhos em metas alcançáveis</p>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-white">
                <Plus className="w-4 h-4 mr-2" />
                Novo Sonho
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {editingSonho ? 'Editar Sonho' : 'Adicionar Novo Sonho'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome" className="text-gray-300">Nome do Sonho</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    placeholder="Ex: Carro novo, Casa própria"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="valorTotal" className="text-gray-300">Valor Total (R$)</Label>
                  <Input
                    id="valorTotal"
                    type="number"
                    step="0.01"
                    value={formData.valorTotal}
                    onChange={(e) => setFormData({...formData, valorTotal: e.target.value})}
                    placeholder="0,00"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="valorEconomizado" className="text-gray-300">Valor Já Economizado (R$)</Label>
                  <Input
                    id="valorEconomizado"
                    type="number"
                    step="0.01"
                    value={formData.valorEconomizado}
                    onChange={(e) => setFormData({...formData, valorEconomizado: e.target.value})}
                    placeholder="0,00"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="investimentoMensal" className="text-gray-300">Investimento Mensal (R$)</Label>
                  <Input
                    id="investimentoMensal"
                    type="number"
                    step="0.01"
                    value={formData.investimentoMensal}
                    onChange={(e) => setFormData({...formData, investimentoMensal: e.target.value})}
                    placeholder="0,00"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoria" className="text-gray-300">Categoria</Label>
                  <select
                    id="categoria"
                    value={formData.categoria}
                    onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                    className="w-full p-2 bg-gray-700 border border-gray-600 text-white rounded-md"
                  >
                    <option value="">Selecione uma categoria</option>
                    <option value="veiculo">Veículo</option>
                    <option value="imovel">Imóvel</option>
                    <option value="viagem">Viagem</option>
                    <option value="outros">Outros</option>
                  </select>
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
                    {editingSonho ? 'Atualizar' : 'Adicionar'}
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
          <Card className="card-glass border-purple-500/20 animate-fade-in">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-400" />
                Total dos Sonhos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">{formatCurrency(totalSonhos)}</div>
              <p className="text-xs text-gray-500 mt-1">{sonhos.length} sonhos ativos</p>
            </CardContent>
          </Card>

          <Card className="card-glass border-green-500/20 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <Target className="w-4 h-4 text-green-400" />
                Já Economizado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{formatCurrency(totalEconomizado)}</div>
              <p className="text-xs text-gray-500 mt-1">{progressoGeral.toFixed(1)}% do total</p>
            </CardContent>
          </Card>

          <Card className="card-glass border-blue-500/20 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-blue-400" />
                Investimento Mensal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">{formatCurrency(totalInvestimentoMensal)}</div>
              <p className="text-xs text-gray-500 mt-1">Total mensal planejado</p>
            </CardContent>
          </Card>

          <Card className="card-glass border-yellow-500/20 animate-fade-in" style={{ animationDelay: '300ms' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <Target className="w-4 h-4 text-yellow-400" />
                Restante
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">{formatCurrency(totalSonhos - totalEconomizado)}</div>
              <p className="text-xs text-gray-500 mt-1">Para alcançar todos</p>
            </CardContent>
          </Card>
        </div>

        {/* Progresso Geral */}
        <Card className="card-glass animate-slide-up">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-400" />
              Progresso Geral dos Sonhos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Progresso Total</span>
                <span className="text-purple-400 font-semibold">{progressoGeral.toFixed(1)}%</span>
              </div>
              <Progress value={progressoGeral} className="h-3" />
              <div className="flex justify-between text-sm text-gray-400">
                <span>{formatCurrency(totalEconomizado)}</span>
                <span>{formatCurrency(totalSonhos)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Sonhos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sonhos.map((sonho, index) => {
            const progresso = (sonho.valorEconomizado / sonho.valorTotal) * 100;
            const IconeComponent = sonho.icone;
            const tempoRestante = calcularTempoRestante(sonho);
            
            return (
              <Card 
                key={sonho.id} 
                className="card-glass animate-fade-in relative overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div 
                  className="absolute top-0 left-0 w-full h-1"
                  style={{ backgroundColor: sonho.cor }}
                />
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-2">
                      <IconeComponent className="w-5 h-5" style={{ color: sonho.cor }} />
                      {sonho.nome}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowCalculator(showCalculator === sonho.id ? null : sonho.id)}
                        className="border-gray-600 text-purple-400 hover:bg-purple-500/20"
                      >
                        <Calculator className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(sonho)}
                        className="border-gray-600 text-blue-400 hover:bg-blue-500/20"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(sonho.id)}
                        className="border-gray-600 text-red-400 hover:bg-red-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-400">Meta</p>
                      <p className="text-lg font-bold text-white">{formatCurrency(sonho.valorTotal)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Economizado</p>
                      <p className="text-lg font-bold text-green-400">{formatCurrency(sonho.valorEconomizado)}</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-400">Progresso</span>
                      <span className="text-sm font-semibold text-purple-400">{progresso.toFixed(1)}%</span>
                    </div>
                    <Progress value={progresso} className="h-2" />
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-gray-700">
                    <div>
                      <p className="text-sm text-gray-400">Investimento Mensal</p>
                      <p className="text-sm font-semibold text-blue-400">
                        {formatCurrency(sonho.investimentoMensal)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Tempo Restante</p>
                      <p className="text-sm font-semibold text-yellow-400">{tempoRestante}</p>
                    </div>
                  </div>

                  {showCalculator === sonho.id && (
                    <div className="mt-4 p-4 bg-white/5 rounded-lg space-y-3">
                      <h4 className="text-white font-semibold">Simulador de Cenários</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">Restante:</p>
                          <p className="text-white font-semibold">
                            {formatCurrency(sonho.valorTotal - sonho.valorEconomizado)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">Com +R$ 200/mês:</p>
                          <p className="text-green-400 font-semibold">
                            {Math.ceil((sonho.valorTotal - sonho.valorEconomizado) / (sonho.investimentoMensal + 200))}m
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">Com valor dobrado:</p>
                          <p className="text-blue-400 font-semibold">
                            {Math.ceil((sonho.valorTotal - sonho.valorEconomizado) / (sonho.investimentoMensal * 2))}m
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">Meta para 1 ano:</p>
                          <p className="text-purple-400 font-semibold">
                            {formatCurrency((sonho.valorTotal - sonho.valorEconomizado) / 12)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {sonhos.length === 0 && (
          <Card className="card-glass animate-fade-in">
            <CardContent className="text-center py-12">
              <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">Nenhum sonho cadastrado</h3>
              <p className="text-gray-500 mb-4">Comece definindo seus objetivos financeiros</p>
              <Button 
                onClick={() => setIsDialogOpen(true)}
                className="gradient-primary text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Primeiro Sonho
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MuralSonhos;
