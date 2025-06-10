
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Investimento {
  id: string;
  nome: string;
  tipo: string;
  valor_investido: number;
  valor_atual?: number;
  data_investimento: string;
  vencimento?: string;
  rentabilidade_esperada?: number;
  observacoes?: string;
}

export const useInvestimentos = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [investimentos, setInvestimentos] = useState<Investimento[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInvestimentos = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('investimentos')
        .select('*')
        .eq('user_id', user.id)
        .order('data_investimento', { ascending: false });

      if (error) {
        console.error('Erro ao buscar investimentos:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar investimentos",
          variant: "destructive"
        });
        return;
      }

      setInvestimentos(data || []);
    } catch (error) {
      console.error('Erro ao buscar investimentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const addInvestimento = async (novoInvestimento: Omit<Investimento, 'id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('investimentos')
        .insert({
          user_id: user.id,
          ...novoInvestimento
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao adicionar investimento:', error);
        toast({
          title: "Erro",
          description: "Erro ao adicionar investimento",
          variant: "destructive"
        });
        return;
      }

      if (data) {
        setInvestimentos(prev => [data, ...prev]);
        toast({
          title: "Sucesso",
          description: "Investimento adicionado com sucesso!"
        });
      }
    } catch (error) {
      console.error('Erro ao adicionar investimento:', error);
    }
  };

  const updateInvestimento = async (id: string, investimentoAtualizado: Partial<Investimento>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('investimentos')
        .update(investimentoAtualizado)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Erro ao atualizar investimento:', error);
        toast({
          title: "Erro",
          description: "Erro ao atualizar investimento",
          variant: "destructive"
        });
        return;
      }

      setInvestimentos(prev => prev.map(investimento => 
        investimento.id === id ? { ...investimento, ...investimentoAtualizado } : investimento
      ));

      toast({
        title: "Sucesso",
        description: "Investimento atualizado com sucesso!"
      });
    } catch (error) {
      console.error('Erro ao atualizar investimento:', error);
    }
  };

  const deleteInvestimento = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('investimentos')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Erro ao deletar investimento:', error);
        toast({
          title: "Erro",
          description: "Erro ao remover investimento",
          variant: "destructive"
        });
        return;
      }

      setInvestimentos(prev => prev.filter(investimento => investimento.id !== id));
      toast({
        title: "Sucesso",
        description: "Investimento removido com sucesso!"
      });
    } catch (error) {
      console.error('Erro ao deletar investimento:', error);
    }
  };

  useEffect(() => {
    fetchInvestimentos();
  }, [user]);

  return {
    investimentos,
    loading,
    addInvestimento,
    updateInvestimento,
    deleteInvestimento,
    refetch: fetchInvestimentos
  };
};
