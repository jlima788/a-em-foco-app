
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface FinancialSummary {
  totalGanhos: number;
  totalContasFixas: number;
  totalDividas: number;
  totalInvestimentos: number;
  cartoesAtivos: number;
  sonhosAtivos: number;
}

export const useFinancialData = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState<FinancialSummary>({
    totalGanhos: 0,
    totalContasFixas: 0,
    totalDividas: 0,
    totalInvestimentos: 0,
    cartoesAtivos: 0,
    sonhosAtivos: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchFinancialSummary = async () => {
      try {
        setLoading(true);

        // Buscar ganhos do mês atual (apenas recorrentes + únicos do mês atual)
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        
        const { data: ganhos } = await supabase
          .from('ganhos')
          .select('valor, recorrente, data_recebimento')
          .eq('user_id', user.id);

        // Calcular total de ganhos (recorrentes + únicos do mês atual)
        const totalGanhos = ganhos?.reduce((sum, ganho) => {
          if (ganho.recorrente) {
            return sum + Number(ganho.valor);
          } else {
            const ganhoDate = new Date(ganho.data_recebimento);
            if (ganhoDate.getMonth() + 1 === currentMonth && ganhoDate.getFullYear() === currentYear) {
              return sum + Number(ganho.valor);
            }
          }
          return sum;
        }, 0) || 0;

        // Buscar contas fixas pendentes
        const { data: contasFixas } = await supabase
          .from('contas_fixas')
          .select('valor')
          .eq('user_id', user.id)
          .eq('status', 'pendente');

        // Buscar dívidas ativas
        const { data: dividas } = await supabase
          .from('dividas')
          .select('valor_restante')
          .eq('user_id', user.id)
          .eq('status', 'ativa');

        // Buscar investimentos
        const { data: investimentos } = await supabase
          .from('investimentos')
          .select('valor_atual, valor_investido')
          .eq('user_id', user.id);

        // Buscar cartões ativos
        const { data: cartoes } = await supabase
          .from('cartoes_credito')
          .select('id')
          .eq('user_id', user.id)
          .eq('ativo', true);

        // Buscar sonhos ativos
        const { data: sonhos } = await supabase
          .from('mural_sonhos')
          .select('id')
          .eq('user_id', user.id)
          .eq('status', 'ativo');

        setSummary({
          totalGanhos,
          totalContasFixas: contasFixas?.reduce((sum, item) => sum + Number(item.valor), 0) || 0,
          totalDividas: dividas?.reduce((sum, item) => sum + Number(item.valor_restante), 0) || 0,
          totalInvestimentos: investimentos?.reduce((sum, item) => sum + Number(item.valor_atual || item.valor_investido), 0) || 0,
          cartoesAtivos: cartoes?.length || 0,
          sonhosAtivos: sonhos?.length || 0,
        });
      } catch (error) {
        console.error('Erro ao buscar dados financeiros:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialSummary();
  }, [user]);

  return { summary, loading };
};
