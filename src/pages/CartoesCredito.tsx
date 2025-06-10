
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  CreditCard,
  TrendingUp,
  Calendar,
  AlertCircle,
  DollarSign,
  Loader2
} from "lucide-react";
import { useCartoesCredito } from "@/hooks/useCartoesCredito";

const CartoesCredito = () => {
  const { cartoes, loading, addCartao, updateCartao, deleteCartao } = useCartoesCredito();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCartao, setEditingCartao] = useState<any>(null);
  const [formData, setFormData] = useState({
    nome: '',
    limite: '',
    limite_usado: '',
    vencimento_fatura: '',
    melhor_dia_compra: '',
    ativo: true,
  });

  // Calcular estatísticas baseadas nos dados reais
  const cartoesAtivos = cartoes.filter(c => c.ativo);
  const limiteTotal = cartoes.reduce((total, cartao) => total + cartao.limite, 0);
  const limiteUsado = cartoes.reduce((total, cartao) => total + cartao.limite_usado, 0);
  const utilizacaoMedia = limiteTotal > 0 ? (limiteUsado / limiteTotal) * 100 : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.limite) {
      return;
    }

    const cartaoData = {
      nome: formData.nome,
      limite: parseFloat(formData.limite),
      limite_usado: parseFloat(formData.limite_usado) || 0,
      vencimento_fatura: formData.vencimento_fatura ? parseInt(formData.vencimento_fatura) : null,
      melhor_dia_compra: formData.melhor_dia_compra ? parseInt(formData.melhor_dia_compra) : null,
      ativo: formData.ativo,
    };

    if (editingCartao) {
      await updateCartao(editingCartao.id, cartaoData);
    } else {
      await addCartao(cartaoData);
    }

    setFormData({ 
      nome: '', 
      limite: '', 
      limite_usado: '', 
      vencimento_fatura: '', 
      melhor_dia_compra: '', 
      ativo: true 
    });
    setEditingCartao(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (cartao: any) => {
    setEditingCartao(cartao);
    setFormData({
      nome: cartao.nome,
      limite: cartao.limite.toString(),
      limite_usado: cartao.limite_usado.toString(),
      vencimento_fatura: cartao.vencimento_fatura?.toString() || '',
      melhor_dia_compra: cartao.melhor_dia_compra?.toString() || '',
      ativo: cartao.ativo,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteCartao(id);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getUtilizacaoColor = (percentual: number) => {
    if (percentual >= 80) return 'text-red-400';
    if (percentual >= 50) return 'text-yellow-400';
    return 'text-green-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="flex items-center gap-3 text-white">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Carregando cartões...</span>
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
              <h1 className="text-2xl font-bold text-white">Cartões de Crédito</h1>
              <p className="text-gray-400">Gerencie seus cartões e controle o limite</p>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-white">
                <Plus className="w-4 h-4 mr-2" />
                Novo Cartão
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {editingCartao ? 'Editar Cartão' : 'Adicionar Novo Cartão'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome" className="text-gray-300">Nome do Cartão</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    placeholder="Ex: Visa Gold, Mastercard Black"
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="limite" className="text-gray-300">Limite Total (R$)</Label>
                    <Input
                      id="limite"
                      type="number"
                      step="0.01"
                      value={formData.limite}
                      onChange={(e) => setFormData({...formData, limite: e.target.value})}
                      placeholder="0,00"
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="limite_usado" className="text-gray-300">Limite Usado (R$)</Label>
                    <Input
                      id="limite_usado"
                      type="number"
                      step="0.01"
                      value={formData.limite_usado}
                      onChange={(e) => setFormData({...formData, limite_usado: e.target.value})}
                      placeholder="0,00"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vencimento_fatura" className="text-gray-300">Vencimento da Fatura</Label>
                    <Input
                      id="vencimento_fatura"
                      type="number"
                      min="1"
                      max="31"
                      value={formData.vencimento_fatura}
                      onChange={(e) => setFormData({...formData, vencimento_fatura: e.target.value})}
                      placeholder="Dia do mês"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="melhor_dia_compra" className="text-gray-300">Melhor Dia p/ Compra</Label>
                    <Input
                      id="melhor_dia_compra"
                      type="number"
                      min="1"
                      max="31"
                      value={formData.melhor_dia_compra}
                      onChange={(e) => setFormData({...formData, melhor_dia_compra: e.target.value})}
                      placeholder="Dia do mês"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="ativo"
                    checked={formData.ativo}
                    onCheckedChange={(checked) => setFormData({...formData, ativo: checked})}
                  />
                  <Label htmlFor="ativo" className="text-gray-300">Cartão ativo</Label>
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
                    {editingCartao ? 'Atualizar' : 'Adicionar'}
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
          <Card className="card-glass border-blue-500/20 animate-fade-in">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-blue-400" />
                Total de Cartões
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">{cartoes.length}</div>
              <p className="text-xs text-gray-500 mt-1">{cartoesAtivos.length} ativos</p>
            </CardContent>
          </Card>

          <Card className="card-glass border-green-500/20 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                Limite Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{formatCurrency(limiteTotal)}</div>
              <p className="text-xs text-gray-500 mt-1">Todos os cartões</p>
            </CardContent>
          </Card>

          <Card className="card-glass border-yellow-500/20 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-yellow-400" />
                Limite Usado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">{formatCurrency(limiteUsado)}</div>
              <p className="text-xs text-gray-500 mt-1">Total utilizado</p>
            </CardContent>
          </Card>

          <Card className="card-glass border-purple-500/20 animate-fade-in" style={{ animationDelay: '300ms' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-purple-400" />
                Utilização
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getUtilizacaoColor(utilizacaoMedia)}`}>
                {utilizacaoMedia.toFixed(1)}%
              </div>
              <p className="text-xs text-gray-500 mt-1">Média geral</p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Cartões */}
        <Card className="card-glass animate-slide-up">
          <CardHeader>
            <CardTitle className="text-white">Seus Cartões de Crédito</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cartoes.map((cartao, index) => {
                const utilizacao = cartao.limite > 0 ? (cartao.limite_usado / cartao.limite) * 100 : 0;
                const disponivel = cartao.limite - cartao.limite_usado;
                
                return (
                  <div 
                    key={cartao.id} 
                    className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        cartao.ativo ? 'bg-blue-500/20' : 'bg-gray-500/20'
                      }`}>
                        <CreditCard className={`w-6 h-6 ${
                          cartao.ativo ? 'text-blue-400' : 'text-gray-400'
                        }`} />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold flex items-center gap-2">
                          {cartao.nome}
                          {!cartao.ativo && (
                            <span className="px-2 py-1 bg-gray-600/50 text-gray-400 text-xs rounded-full">
                              Inativo
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {cartao.vencimento_fatura && `Venc: ${cartao.vencimento_fatura}`}
                          {cartao.melhor_dia_compra && ` • Melhor dia: ${cartao.melhor_dia_compra}`}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-right min-w-[200px]">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-400">Utilização</span>
                          <span className={`text-sm font-semibold ${getUtilizacaoColor(utilizacao)}`}>
                            {utilizacao.toFixed(1)}%
                          </span>
                        </div>
                        <Progress value={utilizacao} className="h-2 mb-2" />
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Usado: {formatCurrency(cartao.limite_usado)}</span>
                          <span className="text-green-400">Disponível: {formatCurrency(disponivel)}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Limite: {formatCurrency(cartao.limite)}
                        </p>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(cartao)}
                          className="border-gray-600 text-blue-400 hover:bg-blue-500/20"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(cartao.id)}
                          className="border-gray-600 text-red-400 hover:bg-red-500/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {cartoes.length === 0 && (
                <div className="text-center py-12">
                  <CreditCard className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">Nenhum cartão cadastrado</h3>
                  <p className="text-gray-500 mb-4">Adicione seus cartões para melhor controle financeiro</p>
                  <Button 
                    onClick={() => setIsDialogOpen(true)}
                    className="gradient-primary text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Primeiro Cartão
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Dicas de Uso */}
        {cartoes.length > 0 && (
          <Card className="card-glass animate-slide-up">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
                Dicas de Uso Responsável
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-white/5 rounded-lg">
                  <h4 className="text-green-400 font-semibold mb-2">Utilização Ideal</h4>
                  <p className="text-gray-300 text-sm">
                    Mantenha o uso abaixo de 30% do limite para um score melhor.
                  </p>
                </div>
                
                <div className="p-4 bg-white/5 rounded-lg">
                  <h4 className="text-blue-400 font-semibold mb-2">Pagamento em Dia</h4>
                  <p className="text-gray-300 text-sm">
                    Pague sempre o valor total da fatura até o vencimento.
                  </p>
                </div>
                
                <div className="p-4 bg-white/5 rounded-lg">
                  <h4 className="text-purple-400 font-semibold mb-2">Melhor Dia de Compra</h4>
                  <p className="text-gray-300 text-sm">
                    Compre logo após o fechamento para ter mais tempo para pagar.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CartoesCredito;
