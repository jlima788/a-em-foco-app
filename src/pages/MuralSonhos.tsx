
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Target,
  Car,
  Home,
  Plane,
  Calculator,
  Loader2
} from "lucide-react";
import { useMuralSonhos } from "@/hooks/useMuralSonhos";

const categoriasIcones = {
  veiculo: { icone: Car, cor: '#3b82f6' },
  imovel: { icone: Home, cor: '#10b981' },
  viagem: { icone: Plane, cor: '#f59e0b' },
  outros: { icone: Target, cor: '#8b5cf6' },
};

const MuralSonhos = () => {
  const { sonhos, loading, addSonho, updateSonho, deleteSonho } = useMuralSonhos();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSonho, setEditingSonho] = useState<any>(null);
  const [showCalculator, setShowCalculator] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    valor_meta: '',
    valor_atual: '',
    data_meta: '',
    categoria: '',
    prioridade: 'media',
  });

  // Calcular totais baseados nos dados reais
  const totalSonhos = sonhos.reduce((total, sonho) => total + sonho.valor_meta, 0);
  const totalEconomizado = sonhos.reduce((total, sonho) => total + sonho.valor_atual, 0);
  const progressoGeral = totalSonhos > 0 ? (totalEconomizado / totalSonhos) * 100 : 0;

  const calcularTempoRestante = (sonho: any) => {
    const valorRestante = sonho.valor_meta - sonho.valor_atual;
    if (valorRestante <= 0) return "Concluído";
    return "Em andamento";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titulo || !formData.valor_meta) {
      return;
    }

    const sonhoData = {
      titulo: formData.titulo,
      descricao: formData.descricao || null,
      valor_meta: parseFloat(formData.valor_meta),
      valor_atual: parseFloat(formData.valor_atual) || 0,
      data_meta: formData.data_meta || null,
      categoria: formData.categoria || null,
      prioridade: formData.prioridade,
      status: 'ativo',
    };

    if (editingSonho) {
      await updateSonho(editingSonho.id, sonhoData);
    } else {
      await addSonho(sonhoData);
    }

    setFormData({ 
      titulo: '', 
      descricao: '', 
      valor_meta: '', 
      valor_atual: '', 
      data_meta: '', 
      categoria: '', 
      prioridade: 'media' 
    });
    setEditingSonho(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (sonho: any) => {
    setEditingSonho(sonho);
    setFormData({
      titulo: sonho.titulo,
      descricao: sonho.descricao || '',
      valor_meta: sonho.valor_meta.toString(),
      valor_atual: sonho.valor_atual.toString(),
      data_meta: sonho.data_meta || '',
      categoria: sonho.categoria || '',
      prioridade: sonho.prioridade,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteSonho(id);
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
          <span>Carregando sonhos...</span>
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
                  <Label htmlFor="titulo" className="text-gray-300">Título do Sonho</Label>
                  <Input
                    id="titulo"
                    value={formData.titulo}
                    onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                    placeholder="Ex: Carro novo, Casa própria"
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao" className="text-gray-300">Descrição</Label>
                  <Input
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                    placeholder="Descrição do sonho"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="valor_meta" className="text-gray-300">Valor Meta (R$)</Label>
                    <Input
                      id="valor_meta"
                      type="number"
                      step="0.01"
                      value={formData.valor_meta}
                      onChange={(e) => setFormData({...formData, valor_meta: e.target.value})}
                      placeholder="0,00"
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="valor_atual" className="text-gray-300">Valor Atual (R$)</Label>
                    <Input
                      id="valor_atual"
                      type="number"
                      step="0.01"
                      value={formData.valor_atual}
                      onChange={(e) => setFormData({...formData, valor_atual: e.target.value})}
                      placeholder="0,00"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="data_meta" className="text-gray-300">Data Meta</Label>
                  <Input
                    id="data_meta"
                    type="date"
                    value={formData.data_meta}
                    onChange={(e) => setFormData({...formData, data_meta: e.target.value})}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                        <SelectItem value="veiculo">Veículo</SelectItem>
                        <SelectItem value="imovel">Imóvel</SelectItem>
                        <SelectItem value="viagem">Viagem</SelectItem>
                        <SelectItem value="outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="prioridade" className="text-gray-300">Prioridade</Label>
                    <Select 
                      value={formData.prioridade} 
                      onValueChange={(value) => setFormData({...formData, prioridade: value})}
                    >
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Selecione a prioridade" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="alta">Alta</SelectItem>
                        <SelectItem value="media">Média</SelectItem>
                        <SelectItem value="baixa">Baixa</SelectItem>
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
                Progresso Geral
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">{progressoGeral.toFixed(1)}%</div>
              <p className="text-xs text-gray-500 mt-1">De todos os sonhos</p>
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
            const progresso = sonho.valor_meta > 0 ? (sonho.valor_atual / sonho.valor_meta) * 100 : 0;
            const categoriaInfo = categoriasIcones[sonho.categoria as keyof typeof categoriasIcones] || categoriasIcones.outros;
            const IconeComponent = categoriaInfo.icone;
            const tempoRestante = calcularTempoRestante(sonho);
            
            return (
              <Card 
                key={sonho.id} 
                className="card-glass animate-fade-in relative overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div 
                  className="absolute top-0 left-0 w-full h-1"
                  style={{ backgroundColor: categoriaInfo.cor }}
                />
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-2">
                      <IconeComponent className="w-5 h-5" style={{ color: categoriaInfo.cor }} />
                      {sonho.titulo}
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
                  {sonho.descricao && (
                    <p className="text-gray-400 text-sm">{sonho.descricao}</p>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-400">Meta</p>
                      <p className="text-lg font-bold text-white">{formatCurrency(sonho.valor_meta)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Economizado</p>
                      <p className="text-lg font-bold text-green-400">{formatCurrency(sonho.valor_atual)}</p>
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
                      <p className="text-sm text-gray-400">Prioridade</p>
                      <p className="text-sm font-semibold text-blue-400">
                        {sonho.prioridade}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Status</p>
                      <p className="text-sm font-semibold text-yellow-400">{tempoRestante}</p>
                    </div>
                  </div>
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
