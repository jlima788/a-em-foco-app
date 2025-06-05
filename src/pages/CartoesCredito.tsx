
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
  CreditCard,
  AlertTriangle,
  CheckCircle,
  TrendingUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CartaoCredito {
  id: string;
  banco: string;
  limite: number;
  faturaAtual: number;
  vencimentoFatura: number;
  cor: string;
}

const bancosCores = {
  nubank: '#8A05BE',
  c6bank: '#FFD700',
  itau: '#EC7000',
  bradesco: '#CC092F',
  bb: '#FFFF00',
  picpay: '#21C25E',
  xp: '#FF6B35',
  outros: '#6B7280'
};

const CartoesCredito = () => {
  const { toast } = useToast();
  const [cartoes, setCartoes] = useState<CartaoCredito[]>([
    { 
      id: '1', 
      banco: 'nubank', 
      limite: 5000, 
      faturaAtual: 1250, 
      vencimentoFatura: 15,
      cor: bancosCores.nubank
    },
    { 
      id: '2', 
      banco: 'c6bank', 
      limite: 3000, 
      faturaAtual: 890, 
      vencimentoFatura: 10,
      cor: bancosCores.c6bank
    },
    { 
      id: '3', 
      banco: 'itau', 
      limite: 8000, 
      faturaAtual: 2100, 
      vencimentoFatura: 25,
      cor: bancosCores.itau
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCartao, setEditingCartao] = useState<CartaoCredito | null>(null);
  const [formData, setFormData] = useState({
    banco: '',
    limite: '',
    faturaAtual: '',
    vencimentoFatura: '',
  });

  const totalLimites = cartoes.reduce((total, cartao) => total + cartao.limite, 0);
  const totalFaturas = cartoes.reduce((total, cartao) => total + cartao.faturaAtual, 0);
  const limiteDisponivel = totalLimites - totalFaturas;
  const percentualUtilizacao = (totalFaturas / totalLimites) * 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.banco || !formData.limite || !formData.faturaAtual || !formData.vencimentoFatura) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const novoCartao: CartaoCredito = {
      id: editingCartao ? editingCartao.id : Date.now().toString(),
      banco: formData.banco,
      limite: parseFloat(formData.limite),
      faturaAtual: parseFloat(formData.faturaAtual),
      vencimentoFatura: parseInt(formData.vencimentoFatura),
      cor: bancosCores[formData.banco as keyof typeof bancosCores] || bancosCores.outros,
    };

    if (editingCartao) {
      setCartoes(cartoes.map(cartao => cartao.id === editingCartao.id ? novoCartao : cartao));
      toast({
        title: "Sucesso",
        description: "Cartão atualizado com sucesso!"
      });
    } else {
      setCartoes([...cartoes, novoCartao]);
      toast({
        title: "Sucesso",
        description: "Novo cartão adicionado com sucesso!"
      });
    }

    setFormData({ banco: '', limite: '', faturaAtual: '', vencimentoFatura: '' });
    setEditingCartao(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (cartao: CartaoCredito) => {
    setEditingCartao(cartao);
    setFormData({
      banco: cartao.banco,
      limite: cartao.limite.toString(),
      faturaAtual: cartao.faturaAtual.toString(),
      vencimentoFatura: cartao.vencimentoFatura.toString(),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setCartoes(cartoes.filter(cartao => cartao.id !== id));
    toast({
      title: "Sucesso",
      description: "Cartão removido com sucesso!"
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getBancoNome = (banco: string) => {
    const nomes = {
      nubank: 'Nubank',
      c6bank: 'C6 Bank',
      itau: 'Itaú',
      bradesco: 'Bradesco',
      bb: 'Banco do Brasil',
      picpay: 'PicPay',
      xp: 'XP Investimentos',
      outros: 'Outros'
    };
    return nomes[banco as keyof typeof nomes] || banco;
  };

  const getUtilizacaoStatus = (utilizacao: number) => {
    if (utilizacao < 30) return { status: 'Bom', color: 'text-green-400', bgColor: 'bg-green-500/20' };
    if (utilizacao < 60) return { status: 'Atenção', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' };
    return { status: 'Alto', color: 'text-red-400', bgColor: 'bg-red-500/20' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="border-b border-gray-800 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="text-white hover:bg-white/10" />
            <div>
              <h1 className="text-2xl font-bold text-white">Cartões de Crédito</h1>
              <p className="text-gray-400">Gerencie seus cartões e faturas</p>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-warning text-white">
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
                  <Label htmlFor="banco" className="text-gray-300">Banco</Label>
                  <Select 
                    value={formData.banco} 
                    onValueChange={(value) => setFormData({...formData, banco: value})}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Selecione o banco" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="nubank">Nubank</SelectItem>
                      <SelectItem value="c6bank">C6 Bank</SelectItem>
                      <SelectItem value="itau">Itaú</SelectItem>
                      <SelectItem value="bradesco">Bradesco</SelectItem>
                      <SelectItem value="bb">Banco do Brasil</SelectItem>
                      <SelectItem value="picpay">PicPay</SelectItem>
                      <SelectItem value="xp">XP Investimentos</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="limite" className="text-gray-300">Limite (R$)</Label>
                  <Input
                    id="limite"
                    type="number"
                    step="0.01"
                    value={formData.limite}
                    onChange={(e) => setFormData({...formData, limite: e.target.value})}
                    placeholder="0,00"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="faturaAtual" className="text-gray-300">Fatura Atual (R$)</Label>
                  <Input
                    id="faturaAtual"
                    type="number"
                    step="0.01"
                    value={formData.faturaAtual}
                    onChange={(e) => setFormData({...formData, faturaAtual: e.target.value})}
                    placeholder="0,00"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vencimentoFatura" className="text-gray-300">Dia do Vencimento</Label>
                  <Input
                    id="vencimentoFatura"
                    type="number"
                    min="1"
                    max="31"
                    value={formData.vencimentoFatura}
                    onChange={(e) => setFormData({...formData, vencimentoFatura: e.target.value})}
                    placeholder="15"
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
                  <Button type="submit" className="flex-1 gradient-warning text-white">
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
                Limite Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">{formatCurrency(totalLimites)}</div>
              <p className="text-xs text-gray-500 mt-1">{cartoes.length} cartões ativos</p>
            </CardContent>
          </Card>

          <Card className="card-glass border-red-500/20 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                Fatura Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">{formatCurrency(totalFaturas)}</div>
              <p className="text-xs text-gray-500 mt-1">A pagar este mês</p>
            </CardContent>
          </Card>

          <Card className="card-glass border-green-500/20 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Disponível
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{formatCurrency(limiteDisponivel)}</div>
              <p className="text-xs text-gray-500 mt-1">Limite disponível</p>
            </CardContent>
          </Card>

          <Card className="card-glass border-purple-500/20 animate-fade-in" style={{ animationDelay: '300ms' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                Utilização
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">{percentualUtilizacao.toFixed(1)}%</div>
              <p className="text-xs text-gray-500 mt-1">Do limite total</p>
            </CardContent>
          </Card>
        </div>

        {/* Status de Utilização */}
        <Card className="card-glass animate-slide-up">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              Status de Utilização
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Utilização Total</span>
                <span className={`font-semibold ${getUtilizacaoStatus(percentualUtilizacao).color}`}>
                  {getUtilizacaoStatus(percentualUtilizacao).status}
                </span>
              </div>
              <Progress value={percentualUtilizacao} className="h-3" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="text-center p-3 rounded-lg bg-green-500/10">
                  <div className="text-green-400 font-semibold">0-30%</div>
                  <div className="text-gray-400">Utilização Ideal</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-yellow-500/10">
                  <div className="text-yellow-400 font-semibold">30-60%</div>
                  <div className="text-gray-400">Atenção</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-red-500/10">
                  <div className="text-red-400 font-semibold">60%+</div>
                  <div className="text-gray-400">Alto Risco</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Cartões */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {cartoes.map((cartao, index) => {
            const utilizacaoCartao = (cartao.faturaAtual / cartao.limite) * 100;
            const statusCartao = getUtilizacaoStatus(utilizacaoCartao);
            
            return (
              <Card 
                key={cartao.id} 
                className="card-glass animate-fade-in relative overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div 
                  className="absolute top-0 left-0 w-full h-1"
                  style={{ backgroundColor: cartao.cor }}
                />
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-2">
                      <CreditCard className="w-5 h-5" style={{ color: cartao.cor }} />
                      {getBancoNome(cartao.banco)}
                    </CardTitle>
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
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-400">Limite</p>
                      <p className="text-lg font-bold text-white">{formatCurrency(cartao.limite)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Fatura Atual</p>
                      <p className="text-lg font-bold text-red-400">{formatCurrency(cartao.faturaAtual)}</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-400">Utilização</span>
                      <span className={`text-sm font-semibold ${statusCartao.color}`}>
                        {utilizacaoCartao.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={utilizacaoCartao} className="h-2" />
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-gray-700">
                    <div>
                      <p className="text-sm text-gray-400">Disponível</p>
                      <p className="text-sm font-semibold text-green-400">
                        {formatCurrency(cartao.limite - cartao.faturaAtual)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Vencimento</p>
                      <p className="text-sm font-semibold text-white">Dia {cartao.vencimentoFatura}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {cartoes.length === 0 && (
          <Card className="card-glass animate-fade-in">
            <CardContent className="text-center py-12">
              <CreditCard className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">Nenhum cartão cadastrado</h3>
              <p className="text-gray-500 mb-4">Adicione seus cartões de crédito para começar</p>
              <Button 
                onClick={() => setIsDialogOpen(true)}
                className="gradient-warning text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Primeiro Cartão
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CartoesCredito;
