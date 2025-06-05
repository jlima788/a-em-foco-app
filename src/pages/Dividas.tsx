
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  AlertTriangle,
  Calculator,
  TrendingDown,
  DollarSign,
  Building,
  CreditCard,
  FileText,
  Snowflake,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Divida {
  id: string;
  credor: string;
  valorOriginal: number;
  saldoDevedor: number;
  taxaJuros: number;
  vencimento: string;
  tipo: string;
  icone: any;
  cor: string;
}

const tiposIcones = {
  emprestimo: { icone: Building, cor: '#ef4444' },
  cartao: { icone: CreditCard, cor: '#f97316' },
  financiamento: { icone: FileText, cor: '#eab308' },
  spc: { icone: AlertTriangle, cor: '#dc2626' },
};

const Dividas = () => {
  const { toast } = useToast();
  const [dividas, setDividas] = useState<Divida[]>([
    { 
      id: '1', 
      credor: 'Banco Fictício', 
      valorOriginal: 10000, 
      saldoDevedor: 8500, 
      taxaJuros: 2.5,
      vencimento: '2024-12-15',
      tipo: 'emprestimo',
      icone: Building,
      cor: '#ef4444'
    },
    { 
      id: '2', 
      credor: 'Cartão Visa', 
      valorOriginal: 3000, 
      saldoDevedor: 2800, 
      taxaJuros: 8.5,
      vencimento: '2024-01-20',
      tipo: 'cartao',
      icone: CreditCard,
      cor: '#f97316'
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDivida, setEditingDivida] = useState<Divida | null>(null);
  const [estrategiaAtiva, setEstrategiaAtiva] = useState('bola_neve');
  const [simulacaoValor, setSimulacaoValor] = useState('');
  const [formData, setFormData] = useState({
    credor: '',
    valorOriginal: '',
    saldoDevedor: '',
    taxaJuros: '',
    vencimento: '',
    tipo: '',
  });

  const totalDividas = dividas.reduce((total, divida) => total + divida.saldoDevedor, 0);
  const mediaJuros = dividas.length > 0 ? dividas.reduce((total, divida) => total + divida.taxaJuros, 0) / dividas.length : 0;
  const dividaAltoRisco = dividas.filter(d => d.taxaJuros > 5).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.credor || !formData.valorOriginal || !formData.saldoDevedor || !formData.tipo) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const tipoInfo = tiposIcones[formData.tipo as keyof typeof tiposIcones] || tiposIcones.emprestimo;

    const novaDivida: Divida = {
      id: editingDivida ? editingDivida.id : Date.now().toString(),
      credor: formData.credor,
      valorOriginal: parseFloat(formData.valorOriginal),
      saldoDevedor: parseFloat(formData.saldoDevedor),
      taxaJuros: parseFloat(formData.taxaJuros) || 0,
      vencimento: formData.vencimento,
      tipo: formData.tipo,
      icone: tipoInfo.icone,
      cor: tipoInfo.cor,
    };

    if (editingDivida) {
      setDividas(dividas.map(divida => divida.id === editingDivida.id ? novaDivida : divida));
      toast({
        title: "Sucesso",
        description: "Dívida atualizada com sucesso!"
      });
    } else {
      setDividas([...dividas, novaDivida]);
      toast({
        title: "Sucesso",
        description: "Nova dívida adicionada com sucesso!"
      });
    }

    setFormData({ credor: '', valorOriginal: '', saldoDevedor: '', taxaJuros: '', vencimento: '', tipo: '' });
    setEditingDivida(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (divida: Divida) => {
    setEditingDivida(divida);
    setFormData({
      credor: divida.credor,
      valorOriginal: divida.valorOriginal.toString(),
      saldoDevedor: divida.saldoDevedor.toString(),
      taxaJuros: divida.taxaJuros.toString(),
      vencimento: divida.vencimento,
      tipo: divida.tipo,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setDividas(dividas.filter(divida => divida.id !== id));
    toast({
      title: "Sucesso",
      description: "Dívida removida com sucesso!"
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const calcularBolaDeNeve = () => {
    return [...dividas].sort((a, b) => a.saldoDevedor - b.saldoDevedor);
  };

  const calcularAvalanche = () => {
    return [...dividas].sort((a, b) => b.taxaJuros - a.taxaJuros);
  };

  const simularQuitacao = (valor: number) => {
    const totalJurosAnual = dividas.reduce((total, divida) => {
      return total + (divida.saldoDevedor * (divida.taxaJuros / 100) * 12);
    }, 0);
    
    const mesesParaQuitar = Math.ceil(totalDividas / valor);
    const economiaJuros = (totalJurosAnual / 12) * mesesParaQuitar;
    
    return { mesesParaQuitar, economiaJuros };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="border-b border-gray-800 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="text-white hover:bg-white/10" />
            <div>
              <h1 className="text-2xl font-bold text-white">Controle de Dívidas</h1>
              <p className="text-gray-400">Gerencie e quite suas dívidas estrategicamente</p>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-danger text-white">
                <Plus className="w-4 h-4 mr-2" />
                Nova Dívida
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {editingDivida ? 'Editar Dívida' : 'Adicionar Nova Dívida'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="credor" className="text-gray-300">Credor</Label>
                  <Input
                    id="credor"
                    value={formData.credor}
                    onChange={(e) => setFormData({...formData, credor: e.target.value})}
                    placeholder="Ex: Banco, Loja"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="valorOriginal" className="text-gray-300">Valor Original (R$)</Label>
                    <Input
                      id="valorOriginal"
                      type="number"
                      step="0.01"
                      value={formData.valorOriginal}
                      onChange={(e) => setFormData({...formData, valorOriginal: e.target.value})}
                      placeholder="0,00"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="saldoDevedor" className="text-gray-300">Saldo Devedor (R$)</Label>
                    <Input
                      id="saldoDevedor"
                      type="number"
                      step="0.01"
                      value={formData.saldoDevedor}
                      onChange={(e) => setFormData({...formData, saldoDevedor: e.target.value})}
                      placeholder="0,00"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="taxaJuros" className="text-gray-300">Taxa de Juros (% a.m.)</Label>
                    <Input
                      id="taxaJuros"
                      type="number"
                      step="0.01"
                      value={formData.taxaJuros}
                      onChange={(e) => setFormData({...formData, taxaJuros: e.target.value})}
                      placeholder="0,00"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vencimento" className="text-gray-300">Vencimento</Label>
                    <Input
                      id="vencimento"
                      type="date"
                      value={formData.vencimento}
                      onChange={(e) => setFormData({...formData, vencimento: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo" className="text-gray-300">Tipo de Dívida</Label>
                  <Select 
                    value={formData.tipo} 
                    onValueChange={(value) => setFormData({...formData, tipo: value})}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="emprestimo">Empréstimo Bancário</SelectItem>
                      <SelectItem value="cartao">Cartão de Crédito</SelectItem>
                      <SelectItem value="financiamento">Financiamento</SelectItem>
                      <SelectItem value="spc">Dívida SPC/Serasa</SelectItem>
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
                  <Button type="submit" className="flex-1 gradient-danger text-white">
                    {editingDivida ? 'Atualizar' : 'Adicionar'}
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
          <Card className="card-glass border-red-500/20 animate-fade-in">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                Total Dívidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">{formatCurrency(totalDividas)}</div>
              <p className="text-xs text-gray-500 mt-1">{dividas.length} dívidas ativas</p>
            </CardContent>
          </Card>

          <Card className="card-glass border-orange-500/20 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-orange-400" />
                Juros Médio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-400">{mediaJuros.toFixed(1)}%</div>
              <p className="text-xs text-gray-500 mt-1">Taxa média mensal</p>
            </CardContent>
          </Card>

          <Card className="card-glass border-yellow-500/20 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                Alto Risco
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">{dividaAltoRisco}</div>
              <p className="text-xs text-gray-500 mt-1">Dívidas com juros &gt; 5%</p>
            </CardContent>
          </Card>

          <Card className="card-glass border-purple-500/20 animate-fade-in" style={{ animationDelay: '300ms' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-purple-400" />
                Simulador
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Valor mensal"
                  value={simulacaoValor}
                  onChange={(e) => setSimulacaoValor(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
                <Button 
                  size="sm" 
                  className="gradient-primary"
                  onClick={() => {
                    if (simulacaoValor) {
                      const valor = parseFloat(simulacaoValor);
                      const { mesesParaQuitar } = simularQuitacao(valor);
                      toast({
                        title: "Simulação",
                        description: `Quitação em aproximadamente ${mesesParaQuitar} meses.`
                      });
                    }
                  }}
                >
                  <Calculator className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="dividas" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="dividas" className="text-white">Minhas Dívidas</TabsTrigger>
            <TabsTrigger value="estrategias" className="text-white">Estratégias de Quitação</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dividas" className="space-y-6">
            {/* Lista de Dívidas */}
            <Card className="card-glass animate-slide-up">
              <CardHeader>
                <CardTitle className="text-white">Suas Dívidas Ativas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dividas.map((divida, index) => {
                    const IconeComponent = divida.icone;
                    return (
                      <div 
                        key={divida.id} 
                        className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 animate-fade-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                            <IconeComponent className="w-6 h-6 text-red-400" />
                          </div>
                          <div>
                            <h3 className="text-white font-semibold">{divida.credor}</h3>
                            <p className="text-sm text-gray-400">
                              {new Date(divida.vencimento).toLocaleDateString('pt-BR')} • Taxa: {divida.taxaJuros}% a.m.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm text-gray-400">Valor Original: {formatCurrency(divida.valorOriginal)}</p>
                            <p className="text-lg font-bold text-red-400">{formatCurrency(divida.saldoDevedor)}</p>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(divida)}
                              className="border-gray-600 text-blue-400 hover:bg-blue-500/20"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(divida.id)}
                              className="border-gray-600 text-red-400 hover:bg-red-500/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {dividas.length === 0 && (
                    <div className="text-center py-12">
                      <DollarSign className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-400 mb-2">Nenhuma dívida cadastrada</h3>
                      <p className="text-gray-500 mb-4">Mantenha suas finanças saudáveis</p>
                      <Button 
                        onClick={() => setIsDialogOpen(true)}
                        className="gradient-danger text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Dívida
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Calculadora de Juros */}
            {dividas.length > 0 && (
              <Card className="card-glass animate-slide-up">
                <CardHeader>
                  <CardTitle className="text-white">Juros Acumulados (Projeção)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-white/5 rounded-lg">
                      <h3 className="text-red-400 text-lg font-semibold mb-2">Próximo Mês</h3>
                      <p className="text-white text-xl font-bold mb-1">
                        {formatCurrency(dividas.reduce((total, divida) => 
                          total + (divida.saldoDevedor * (divida.taxaJuros / 100)), 0))}
                      </p>
                      <p className="text-gray-400 text-sm">Total de juros no próximo mês</p>
                    </div>
                    
                    <div className="p-4 bg-white/5 rounded-lg">
                      <h3 className="text-red-400 text-lg font-semibold mb-2">Em 6 Meses</h3>
                      <p className="text-white text-xl font-bold mb-1">
                        {formatCurrency(dividas.reduce((total, divida) => 
                          total + (divida.saldoDevedor * (divida.taxaJuros / 100) * 6), 0))}
                      </p>
                      <p className="text-gray-400 text-sm">Total de juros acumulados</p>
                    </div>
                    
                    <div className="p-4 bg-white/5 rounded-lg">
                      <h3 className="text-red-400 text-lg font-semibold mb-2">Em 1 Ano</h3>
                      <p className="text-white text-xl font-bold mb-1">
                        {formatCurrency(dividas.reduce((total, divida) => 
                          total + (divida.saldoDevedor * (divida.taxaJuros / 100) * 12), 0))}
                      </p>
                      <p className="text-gray-400 text-sm">Total de juros acumulados</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="estrategias" className="space-y-6">
            <Card className="card-glass animate-slide-up">
              <CardHeader>
                <CardTitle className="text-white">Estratégias de Pagamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <Button
                      variant={estrategiaAtiva === 'bola_neve' ? 'default' : 'outline'}
                      onClick={() => setEstrategiaAtiva('bola_neve')}
                      className={estrategiaAtiva === 'bola_neve' 
                        ? 'gradient-primary text-white' 
                        : 'border-gray-600 text-white hover:bg-white/10'}
                    >
                      <Snowflake className="w-4 h-4 mr-2" />
                      Bola de Neve
                    </Button>
                    <Button
                      variant={estrategiaAtiva === 'avalanche' ? 'default' : 'outline'}
                      onClick={() => setEstrategiaAtiva('avalanche')}
                      className={estrategiaAtiva === 'avalanche' 
                        ? 'gradient-danger text-white' 
                        : 'border-gray-600 text-white hover:bg-white/10'}
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Avalanche
                    </Button>
                  </div>

                  <div className="p-4 bg-white/5 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {estrategiaAtiva === 'bola_neve' ? 'Método Bola de Neve' : 'Método Avalanche'}
                    </h3>
                    <p className="text-gray-300 mb-4">
                      {estrategiaAtiva === 'bola_neve' 
                        ? 'Priorize as dívidas menores primeiro para criar momentum e motivação. A cada dívida quitada, use o valor para a próxima.' 
                        : 'Priorize as dívidas com maiores taxas de juros primeiro para economizar no longo prazo, independente do valor total.'}
                    </p>

                    <div className="space-y-4">
                      {(estrategiaAtiva === 'bola_neve' ? calcularBolaDeNeve() : calcularAvalanche()).map((divida, index) => (
                        <div 
                          key={divida.id} 
                          className={`p-4 rounded-lg bg-white/5 border-l-4 ${
                            index === 0 ? 'border-green-500' : index === 1 ? 'border-yellow-500' : 'border-gray-500'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="text-white font-semibold">{index + 1}. {divida.credor}</span>
                              <p className="text-sm text-gray-400">
                                {formatCurrency(divida.saldoDevedor)} • {divida.taxaJuros}% a.m.
                              </p>
                            </div>
                            {index === 0 && (
                              <div className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-semibold rounded-full">
                                Prioridade
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 p-4 rounded-lg bg-blue-900/20 border border-blue-800">
                      <h4 className="text-white font-semibold flex items-center gap-2 mb-2">
                        <Calculator className="w-4 h-4 text-blue-400" />
                        Simulação de Economia
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-400">Total a ser pago com pagamento mínimo:</p>
                          <p className="text-red-400 font-bold">
                            {formatCurrency(totalDividas * 1.5)} <span className="text-xs">(estimativa)</span>
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Economia com estratégia otimizada:</p>
                          <p className="text-green-400 font-bold">
                            {formatCurrency(totalDividas * 0.2)} <span className="text-xs">(estimativa)</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-glass animate-slide-up">
              <CardHeader>
                <CardTitle className="text-white">Comparação de Estratégias</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-white/5 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-400 mb-2 flex items-center gap-2">
                      <Snowflake className="w-5 h-5" />
                      Bola de Neve
                    </h3>
                    <div className="space-y-3">
                      <p className="text-white text-sm">✓ Motivação psicológica</p>
                      <p className="text-white text-sm">✓ Vitórias rápidas</p>
                      <p className="text-white text-sm">✓ Simplifica o processo</p>
                      <p className="text-red-400 text-sm">✗ Pode custar mais em juros</p>
                      <p className="text-gray-400 text-sm mt-4">
                        Ideal para quem precisa de motivação e tem várias pequenas dívidas.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-lg">
                    <h3 className="text-lg font-semibold text-red-400 mb-2 flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      Avalanche
                    </h3>
                    <div className="space-y-3">
                      <p className="text-white text-sm">✓ Economiza mais dinheiro no longo prazo</p>
                      <p className="text-white text-sm">✓ Reduz juros totais</p>
                      <p className="text-white text-sm">✓ Matematicamente mais eficiente</p>
                      <p className="text-red-400 text-sm">✗ Pode demorar para ver resultados</p>
                      <p className="text-gray-400 text-sm mt-4">
                        Ideal para quem tem disciplina financeira e quer minimizar juros.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dividas;
