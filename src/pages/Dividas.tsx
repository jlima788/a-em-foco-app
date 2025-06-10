
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
  Zap,
  Loader2
} from "lucide-react";
import { useDividas } from "@/hooks/useDividas";

const tiposIcones = {
  emprestimo: { icone: Building, cor: '#ef4444' },
  cartao: { icone: CreditCard, cor: '#f97316' },
  financiamento: { icone: FileText, cor: '#eab308' },
  spc: { icone: AlertTriangle, cor: '#dc2626' },
};

const Dividas = () => {
  const { dividas, loading, addDivida, updateDivida, deleteDivida } = useDividas();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDivida, setEditingDivida] = useState<any>(null);
  const [estrategiaAtiva, setEstrategiaAtiva] = useState('bola_neve');
  const [simulacaoValor, setSimulacaoValor] = useState('');
  const [formData, setFormData] = useState({
    credor: '',
    valor_total: '',
    valor_pago: '',
    valor_restante: '',
    data_inicio: '',
    data_vencimento: '',
    taxa_juros: '',
    status: 'ativa',
    observacoes: '',
  });

  const totalDividas = dividas.reduce((total, divida) => total + divida.valor_restante, 0);
  const mediaJuros = dividas.length > 0 ? dividas.reduce((total, divida) => total + (divida.taxa_juros || 0), 0) / dividas.length : 0;
  const dividaAltoRisco = dividas.filter(d => (d.taxa_juros || 0) > 5).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.credor || !formData.valor_total || !formData.data_inicio) {
      return;
    }

    const dividaData = {
      credor: formData.credor,
      valor_total: parseFloat(formData.valor_total),
      valor_pago: parseFloat(formData.valor_pago) || 0,
      valor_restante: parseFloat(formData.valor_total) - (parseFloat(formData.valor_pago) || 0),
      data_inicio: formData.data_inicio,
      data_vencimento: formData.data_vencimento || null,
      taxa_juros: parseFloat(formData.taxa_juros) || null,
      status: formData.status,
      observacoes: formData.observacoes || null,
    };

    if (editingDivida) {
      await updateDivida(editingDivida.id, dividaData);
    } else {
      await addDivida(dividaData);
    }

    setFormData({ 
      credor: '', 
      valor_total: '', 
      valor_pago: '', 
      valor_restante: '', 
      data_inicio: '', 
      data_vencimento: '', 
      taxa_juros: '', 
      status: 'ativa', 
      observacoes: '' 
    });
    setEditingDivida(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (divida: any) => {
    setEditingDivida(divida);
    setFormData({
      credor: divida.credor,
      valor_total: divida.valor_total.toString(),
      valor_pago: divida.valor_pago.toString(),
      valor_restante: divida.valor_restante.toString(),
      data_inicio: divida.data_inicio,
      data_vencimento: divida.data_vencimento || '',
      taxa_juros: divida.taxa_juros?.toString() || '',
      status: divida.status,
      observacoes: divida.observacoes || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteDivida(id);
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

  const calcularBolaDeNeve = () => {
    return [...dividas].sort((a, b) => a.valor_restante - b.valor_restante);
  };

  const calcularAvalanche = () => {
    return [...dividas].sort((a, b) => (b.taxa_juros || 0) - (a.taxa_juros || 0));
  };

  const simularQuitacao = (valor: number) => {
    const totalJurosAnual = dividas.reduce((total, divida) => {
      return total + (divida.valor_restante * ((divida.taxa_juros || 0) / 100) * 12);
    }, 0);
    
    const mesesParaQuitar = Math.ceil(totalDividas / valor);
    const economiaJuros = (totalJurosAnual / 12) * mesesParaQuitar;
    
    return { mesesParaQuitar, economiaJuros };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="flex items-center gap-3 text-white">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Carregando dívidas...</span>
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
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="valor_total" className="text-gray-300">Valor Total (R$)</Label>
                    <Input
                      id="valor_total"
                      type="number"
                      step="0.01"
                      value={formData.valor_total}
                      onChange={(e) => setFormData({...formData, valor_total: e.target.value})}
                      placeholder="0,00"
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="valor_pago" className="text-gray-300">Valor Pago (R$)</Label>
                    <Input
                      id="valor_pago"
                      type="number"
                      step="0.01"
                      value={formData.valor_pago}
                      onChange={(e) => setFormData({...formData, valor_pago: e.target.value})}
                      placeholder="0,00"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="data_inicio" className="text-gray-300">Data de Início</Label>
                    <Input
                      id="data_inicio"
                      type="date"
                      value={formData.data_inicio}
                      onChange={(e) => setFormData({...formData, data_inicio: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="data_vencimento" className="text-gray-300">Vencimento</Label>
                    <Input
                      id="data_vencimento"
                      type="date"
                      value={formData.data_vencimento}
                      onChange={(e) => setFormData({...formData, data_vencimento: e.target.value})}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxa_juros" className="text-gray-300">Taxa de Juros (% a.m.)</Label>
                  <Input
                    id="taxa_juros"
                    type="number"
                    step="0.01"
                    value={formData.taxa_juros}
                    onChange={(e) => setFormData({...formData, taxa_juros: e.target.value})}
                    placeholder="0,00"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
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
                      alert(`Quitação em aproximadamente ${mesesParaQuitar} meses.`);
                    }
                  }}
                >
                  <Calculator className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Dívidas */}
        <Card className="card-glass animate-slide-up">
          <CardHeader>
            <CardTitle className="text-white">Suas Dívidas Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dividas.map((divida, index) => (
                <div 
                  key={divida.id} 
                  className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{divida.credor}</h3>
                      <p className="text-sm text-gray-400">
                        {divida.data_vencimento ? formatDate(divida.data_vencimento) : 'Sem vencimento'} • 
                        Taxa: {divida.taxa_juros ? `${divida.taxa_juros}%` : 'N/A'} a.m.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Valor Original: {formatCurrency(divida.valor_total)}</p>
                      <p className="text-lg font-bold text-red-400">{formatCurrency(divida.valor_restante)}</p>
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
              ))}
              
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
      </div>
    </div>
  );
};

export default Dividas;
