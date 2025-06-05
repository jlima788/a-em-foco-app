
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  TrendingUp,
  PiggyBank,
  DollarSign,
  LineChart,
  BarChart2,
  Calendar,
  Landmark
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useToast } from "@/hooks/use-toast";

interface Investimento {
  id: string;
  produto: string;
  valorInvestido: number;
  rentabilidade: number;
  dataInvestimento: string;
  categoria: string;
  icone: any;
  cor: string;
}

const categoriasIcones = {
  rendafixa: { icone: Landmark, cor: '#3b82f6' },
  acoes: { icone: BarChart2, cor: '#f59e0b' },
  fundos: { icone: PiggyBank, cor: '#10b981' },
  cripto: { icone: TrendingUp, cor: '#8b5cf6' },
};

const compararComIndices = [
  { nome: 'Seu Portfolio', valor: 9.8, cor: '#8b5cf6' },
  { nome: 'CDI', valor: 8.5, cor: '#3b82f6' },
  { nome: 'IPCA', valor: 6.2, cor: '#f59e0b' },
  { nome: 'Poupança', valor: 4.5, cor: '#10b981' },
];

const projecaoAnual = [
  { ano: '2024', valor: 15000 },
  { ano: '2025', valor: 25000 },
  { ano: '2026', valor: 40000 },
  { ano: '2027', valor: 65000 },
  { ano: '2028', valor: 95000 },
];

const Investimentos = () => {
  const { toast } = useToast();
  const [investimentos, setInvestimentos] = useState<Investimento[]>([
    { 
      id: '1', 
      produto: 'CDB Pré-fixado', 
      valorInvestido: 5000, 
      rentabilidade: 9.5, 
      dataInvestimento: '2023-10-15',
      categoria: 'rendafixa',
      icone: Landmark,
      cor: '#3b82f6'
    },
    { 
      id: '2', 
      produto: 'Fundo Imobiliário', 
      valorInvestido: 8000, 
      rentabilidade: 12, 
      dataInvestimento: '2023-08-20',
      categoria: 'fundos',
      icone: PiggyBank,
      cor: '#10b981'
    },
    { 
      id: '3', 
      produto: 'Ações PETR4', 
      valorInvestido: 3000, 
      rentabilidade: 7.5, 
      dataInvestimento: '2023-11-05',
      categoria: 'acoes',
      icone: BarChart2,
      cor: '#f59e0b'
    },
    { 
      id: '4', 
      produto: 'Bitcoin', 
      valorInvestido: 2000, 
      rentabilidade: 15, 
      dataInvestimento: '2023-09-10',
      categoria: 'cripto',
      icone: TrendingUp,
      cor: '#8b5cf6'
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInvestimento, setEditingInvestimento] = useState<Investimento | null>(null);
  const [formData, setFormData] = useState({
    produto: '',
    valorInvestido: '',
    rentabilidade: '',
    dataInvestimento: '',
    categoria: '',
  });

  const totalInvestido = investimentos.reduce((total, inv) => total + inv.valorInvestido, 0);
  const rentabilidadeMedia = investimentos.length > 0 ? 
    investimentos.reduce((total, inv) => total + (inv.rentabilidade * inv.valorInvestido), 0) / totalInvestido : 0;
  
  const distribuicaoData = investimentos.reduce<{nome: string; valor: number; cor: string}[]>((acc, inv) => {
    const existingCategory = acc.find(item => item.nome === inv.categoria);
    if (existingCategory) {
      existingCategory.valor += inv.valorInvestido;
    } else {
      const categoriaInfo = categoriasIcones[inv.categoria as keyof typeof categoriasIcones] || categoriasIcones.rendafixa;
      acc.push({ 
        nome: inv.categoria, 
        valor: inv.valorInvestido,
        cor: categoriaInfo.cor
      });
    }
    return acc;
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.produto || !formData.valorInvestido || !formData.rentabilidade || !formData.categoria) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const categoriaInfo = categoriasIcones[formData.categoria as keyof typeof categoriasIcones] || categoriasIcones.rendafixa;

    const novoInvestimento: Investimento = {
      id: editingInvestimento ? editingInvestimento.id : Date.now().toString(),
      produto: formData.produto,
      valorInvestido: parseFloat(formData.valorInvestido),
      rentabilidade: parseFloat(formData.rentabilidade),
      dataInvestimento: formData.dataInvestimento,
      categoria: formData.categoria,
      icone: categoriaInfo.icone,
      cor: categoriaInfo.cor,
    };

    if (editingInvestimento) {
      setInvestimentos(investimentos.map(inv => inv.id === editingInvestimento.id ? novoInvestimento : inv));
      toast({
        title: "Sucesso",
        description: "Investimento atualizado com sucesso!"
      });
    } else {
      setInvestimentos([...investimentos, novoInvestimento]);
      toast({
        title: "Sucesso",
        description: "Novo investimento adicionado com sucesso!"
      });
    }

    setFormData({ produto: '', valorInvestido: '', rentabilidade: '', dataInvestimento: '', categoria: '' });
    setEditingInvestimento(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (investimento: Investimento) => {
    setEditingInvestimento(investimento);
    setFormData({
      produto: investimento.produto,
      valorInvestido: investimento.valorInvestido.toString(),
      rentabilidade: investimento.rentabilidade.toString(),
      dataInvestimento: investimento.dataInvestimento,
      categoria: investimento.categoria,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setInvestimentos(investimentos.filter(inv => inv.id !== id));
    toast({
      title: "Sucesso",
      description: "Investimento removido com sucesso!"
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const calcularValorFuturo = (principal: number, taxa: number, anos: number) => {
    return principal * Math.pow(1 + taxa / 100, anos);
  };

  const getNomeTipoPorId = (categoria: string) => {
    const tipos = {
      rendafixa: 'Renda Fixa',
      acoes: 'Ações',
      fundos: 'Fundos',
      cripto: 'Criptomoedas',
    };
    return tipos[categoria as keyof typeof tipos] || categoria;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="border-b border-gray-800 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="text-white hover:bg-white/10" />
            <div>
              <h1 className="text-2xl font-bold text-white">Investimentos</h1>
              <p className="text-gray-400">Acompanhe e planeje seu patrimônio</p>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-success text-white">
                <Plus className="w-4 h-4 mr-2" />
                Novo Investimento
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {editingInvestimento ? 'Editar Investimento' : 'Adicionar Novo Investimento'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="produto" className="text-gray-300">Nome do Produto</Label>
                  <Input
                    id="produto"
                    value={formData.produto}
                    onChange={(e) => setFormData({...formData, produto: e.target.value})}
                    placeholder="Ex: CDB, Tesouro Direto, Ações"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="valorInvestido" className="text-gray-300">Valor Investido (R$)</Label>
                    <Input
                      id="valorInvestido"
                      type="number"
                      step="0.01"
                      value={formData.valorInvestido}
                      onChange={(e) => setFormData({...formData, valorInvestido: e.target.value})}
                      placeholder="0,00"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rentabilidade" className="text-gray-300">Rentabilidade (% a.a.)</Label>
                    <Input
                      id="rentabilidade"
                      type="number"
                      step="0.01"
                      value={formData.rentabilidade}
                      onChange={(e) => setFormData({...formData, rentabilidade: e.target.value})}
                      placeholder="0,00"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dataInvestimento" className="text-gray-300">Data do Investimento</Label>
                    <Input
                      id="dataInvestimento"
                      type="date"
                      value={formData.dataInvestimento}
                      onChange={(e) => setFormData({...formData, dataInvestimento: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="categoria" className="text-gray-300">Categoria</Label>
                    <Select 
                      value={formData.categoria} 
                      onValueChange={(value) => setFormData({...formData, categoria: value})}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="rendafixa">Renda Fixa</SelectItem>
                        <SelectItem value="acoes">Ações</SelectItem>
                        <SelectItem value="fundos">Fundos</SelectItem>
                        <SelectItem value="cripto">Criptomoedas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
                    {editingInvestimento ? 'Atualizar' : 'Adicionar'}
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
                <DollarSign className="w-4 h-4 text-green-400" />
                Total Investido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{formatCurrency(totalInvestido)}</div>
              <p className="text-xs text-gray-500 mt-1">{investimentos.length} investimentos ativos</p>
            </CardContent>
          </Card>

          <Card className="card-glass border-blue-500/20 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                Rentabilidade Média
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">{rentabilidadeMedia.toFixed(2)}%</div>
              <p className="text-xs text-gray-500 mt-1">Ao ano</p>
            </CardContent>
          </Card>

          <Card className="card-glass border-purple-500/20 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400" />
                Projeção 1 Ano
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">
                {formatCurrency(calcularValorFuturo(totalInvestido, rentabilidadeMedia, 1))}
              </div>
              <p className="text-xs text-gray-500 mt-1">Valor estimado</p>
            </CardContent>
          </Card>

          <Card className="card-glass border-yellow-500/20 animate-fade-in" style={{ animationDelay: '300ms' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-yellow-400" />
                Projeção 5 Anos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">
                {formatCurrency(calcularValorFuturo(totalInvestido, rentabilidadeMedia, 5))}
              </div>
              <p className="text-xs text-gray-500 mt-1">Valor estimado</p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="card-glass animate-slide-up">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <PiggyBank className="w-5 h-5 text-green-400" />
                Distribuição do Portfolio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distribuicaoData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="valor"
                      label={({ nome, percent }) => `${nome} ${(percent * 100).toFixed(0)}%`}
                    >
                      {distribuicaoData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.cor} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => formatCurrency(value as number)}
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                {distribuicaoData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.cor }}
                    />
                    <span className="text-sm text-gray-400 capitalize">{getNomeTipoPorId(item.nome)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="card-glass animate-slide-up">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <LineChart className="w-5 h-5 text-blue-400" />
                Comparativo com Índices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={compararComIndices} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis type="number" stroke="#9ca3af" />
                    <YAxis dataKey="nome" type="category" stroke="#9ca3af" />
                    <Tooltip 
                      formatter={(value) => [`${value}% a.a.`, 'Rendimento']}
                      contentStyle={{ 
                        backgroundColor: '#1f2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }} 
                    />
                    <Bar dataKey="valor" radius={[0, 4, 4, 0]}>
                      {compararComIndices.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.cor} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projeção Futura */}
        <Card className="card-glass animate-slide-up">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              Projeção de Crescimento (5 Anos)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projecaoAnual}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="ano" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(value as number), 'Valor Projetado']}
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar dataKey="valor" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 p-4 bg-purple-900/20 border border-purple-800 rounded-lg">
              <h4 className="text-white font-semibold mb-2">Considerações sobre a projeção</h4>
              <p className="text-gray-300 text-sm">
                Esta projeção assume a manutenção da rentabilidade média atual e aportes mensais consistentes. 
                Fatores como inflação e mudanças de mercado podem afetar os resultados reais.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Investimentos */}
        <Card className="card-glass animate-slide-up">
          <CardHeader>
            <CardTitle className="text-white">Seu Portfolio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {investimentos.map((investimento, index) => {
                const IconeComponent = investimento.icone;
                return (
                  <div 
                    key={investimento.id} 
                    className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center" 
                        style={{ backgroundColor: `${investimento.cor}20` }}
                      >
                        <IconeComponent className="w-6 h-6" style={{ color: investimento.cor }} />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{investimento.produto}</h3>
                        <p className="text-sm text-gray-400">
                          {new Date(investimento.dataInvestimento).toLocaleDateString('pt-BR')} • {getNomeTipoPorId(investimento.categoria)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-400">{formatCurrency(investimento.valorInvestido)}</p>
                        <p className="text-sm text-blue-400">Rend: {investimento.rentabilidade}% a.a.</p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(investimento)}
                          className="border-gray-600 text-blue-400 hover:bg-blue-500/20"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(investimento.id)}
                          className="border-gray-600 text-red-400 hover:bg-red-500/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {investimentos.length === 0 && (
                <div className="text-center py-12">
                  <PiggyBank className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">Nenhum investimento cadastrado</h3>
                  <p className="text-gray-500 mb-4">Comece a construir seu patrimônio agora</p>
                  <Button 
                    onClick={() => setIsDialogOpen(true)}
                    className="gradient-success text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Primeiro Investimento
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

export default Investimentos;
