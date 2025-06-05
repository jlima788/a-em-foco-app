
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  Target,
  AlertTriangle,
  Plus,
  Eye,
  EyeOff
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const mockData = [
  { name: 'Jan', receitas: 4000, gastos: 2400 },
  { name: 'Fev', receitas: 3000, gastos: 1398 },
  { name: 'Mar', receitas: 2000, gastos: 9800 },
  { name: 'Abr', receitas: 2780, gastos: 3908 },
  { name: 'Mai', receitas: 1890, gastos: 4800 },
  { name: 'Jun', receitas: 2390, gastos: 3800 },
];

const pieData = [
  { name: 'Contas Fixas', value: 2500, color: '#8b5cf6' },
  { name: 'Alimentação', value: 800, color: '#06b6d4' },
  { name: 'Transporte', value: 600, color: '#10b981' },
  { name: 'Lazer', value: 400, color: '#f59e0b' },
];

const Index = () => {
  const [showValues, setShowValues] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCurrency = (value: number) => {
    if (!showValues) return "•••••";
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
              <h1 className="text-2xl font-bold text-white">Dashboard Financeiro</h1>
              <p className="text-gray-400">
                {currentTime.toLocaleDateString('pt-BR', { 
                  weekday: 'long',
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowValues(!showValues)}
              className="border-gray-600 text-gray-300 hover:bg-white/10"
            >
              {showValues ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showValues ? 'Ocultar' : 'Mostrar'}
            </Button>
            <Button size="sm" className="gradient-primary text-white">
              <Plus className="w-4 h-4 mr-2" />
              Nova Transação
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="card-glass border-green-500/20 animate-fade-in">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                Receitas Totais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{formatCurrency(5500)}</div>
              <p className="text-xs text-gray-500 mt-1">+12% em relação ao mês anterior</p>
            </CardContent>
          </Card>

          <Card className="card-glass border-red-500/20 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-red-400" />
                Gastos Totais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">{formatCurrency(4300)}</div>
              <p className="text-xs text-gray-500 mt-1">-8% em relação ao mês anterior</p>
            </CardContent>
          </Card>

          <Card className="card-glass border-blue-500/20 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-blue-400" />
                Saldo Atual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">{formatCurrency(1200)}</div>
              <p className="text-xs text-gray-500 mt-1">Disponível para gastos</p>
            </CardContent>
          </Card>

          <Card className="card-glass border-purple-500/20 animate-fade-in" style={{ animationDelay: '300ms' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-400" />
                Meta Mensal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">78%</div>
              <p className="text-xs text-gray-500 mt-1">Meta de economia atingida</p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="card-glass animate-slide-up">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                Evolução Mensal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
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
                    dataKey="receitas" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="gastos" 
                    stroke="#ef4444" 
                    strokeWidth={3}
                    dot={{ fill: '#ef4444', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="card-glass animate-slide-up" style={{ animationDelay: '100ms' }}>
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-400" />
                Distribuição de Gastos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1f2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {pieData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-400">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alertas e Próximos Vencimentos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="card-glass border-yellow-500/20 animate-fade-in">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                Próximos Vencimentos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { nome: "Conta de Luz", valor: 180, vencimento: "15/12", tipo: "urgente" },
                { nome: "Cartão Nubank", valor: 850, vencimento: "18/12", tipo: "normal" },
                { nome: "Aluguel", valor: 1200, vencimento: "20/12", tipo: "normal" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <div>
                    <p className="text-white font-medium">{item.nome}</p>
                    <p className="text-sm text-gray-400">Venc: {item.vencimento}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${item.tipo === 'urgente' ? 'text-red-400' : 'text-yellow-400'}`}>
                      {formatCurrency(item.valor)}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="card-glass border-purple-500/20 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-400" />
                Progresso dos Sonhos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { nome: "Carro Novo", meta: 50000, atual: 15000, progresso: 30 },
                { nome: "Casa Própria", meta: 200000, atual: 45000, progresso: 22.5 },
                { nome: "Viagem Europa", meta: 15000, atual: 8000, progresso: 53 },
              ].map((sonho, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white font-medium">{sonho.nome}</span>
                    <span className="text-purple-400">{sonho.progresso.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="gradient-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${sonho.progresso}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-400">
                    {formatCurrency(sonho.atual)} de {formatCurrency(sonho.meta)}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
