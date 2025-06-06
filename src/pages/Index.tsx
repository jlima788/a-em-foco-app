
import { useFinancialData } from '@/hooks/useFinancialData';
import { FinancialSummaryCard } from '@/components/dashboard/FinancialSummaryCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DollarSign, 
  CreditCard, 
  TrendingDown, 
  TrendingUp, 
  Target,
  Wallet
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const { summary, loading } = useFinancialData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {Array(6).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const saldoTotal = summary.totalGanhos - summary.totalContasFixas - summary.totalDividas;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Dashboard Financeiro
          </h1>
          <p className="text-gray-400">
            Tenha uma visão completa da sua situação financeira
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <FinancialSummaryCard
            title="Ganhos do Mês"
            value={summary.totalGanhos}
            icon={DollarSign}
            color="text-green-500"
          />
          
          <FinancialSummaryCard
            title="Contas Fixas Pendentes"
            value={summary.totalContasFixas}
            icon={TrendingDown}
            color="text-red-500"
          />
          
          <FinancialSummaryCard
            title="Total em Dívidas"
            value={summary.totalDividas}
            icon={CreditCard}
            color="text-orange-500"
          />
          
          <FinancialSummaryCard
            title="Investimentos"
            value={summary.totalInvestimentos}
            icon={TrendingUp}
            color="text-blue-500"
          />
          
          <FinancialSummaryCard
            title="Cartões Ativos"
            value={summary.cartoesAtivos}
            icon={Wallet}
            color="text-purple-500"
            isCurrency={false}
          />
          
          <FinancialSummaryCard
            title="Sonhos Ativos"
            value={summary.sonhosAtivos}
            icon={Target}
            color="text-pink-500"
            isCurrency={false}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Saldo Estimado
              </CardTitle>
              <CardDescription className="text-gray-400">
                Baseado nos seus ganhos e gastos fixos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${saldoTotal >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(saldoTotal)}
              </div>
              <p className="text-gray-400 text-sm mt-2">
                {saldoTotal >= 0 ? 'Situação positiva' : 'Atenção: saldo negativo'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="h-5 w-5" />
                Resumo Geral
              </CardTitle>
              <CardDescription className="text-gray-400">
                Visão geral das suas finanças
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Total de ganhos:</span>
                <span className="text-green-500 font-medium">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(summary.totalGanhos)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Total de gastos fixos:</span>
                <span className="text-red-500 font-medium">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(summary.totalContasFixas)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Total investido:</span>
                <span className="text-blue-500 font-medium">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(summary.totalInvestimentos)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
