
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

// Tipos permitidos conforme a constraint do banco
export const TIPOS_INVESTIMENTO = [
  'Renda Fixa',
  'Ações', 
  'Fundos',
  'Criptomoedas'
] as const;

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

    // Validar se o tipo está entre os permitidos
    if (!TIPOS_INVESTIMENTO.includes(novoInvestimento.tipo as any)) {
      toast({
        title: "Erro",
        description: "Tipo de investimento inválido. Use: Renda Fixa, Ações, Fundos ou Criptomoedas",
        variant: "destructive"
      });
      return;
    }

    try {
      // Garantir que os dados estão no formato correto
      const investimentoData = {
        user_id: user.id,
        nome: novoInvestimento.nome,
        tipo: novoInvestimento.tipo,
        valor_investido: Number(novoInvestimento.valor_investido),
        data_investimento: novoInvestimento.data_investimento,
        rentabilidade_esperada: novoInvestimento.rentabilidade_esperada ? Number(novoInvestimento.rentabilidade_esperada) : null,
        valor_atual: novoInvestimento.valor_atual ? Number(novoInvestimento.valor_atual) : null,
        vencimento: novoInvestimento.vencimento || null,
        observacoes: novoInvestimento.observacoes || null
      };

      console.log('Dados sendo enviados para o banco:', investimentoData);

      const { data, error } = await supabase
        .from('investimentos')
        .insert(investimentoData)
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
      toast({
        title: "Erro",
        description: "Erro inesperado ao adicionar investimento",
        variant: "destructive"
      });
    }
  };

  const updateInvestimento = async (id: string, investimentoAtualizado: Partial<Investimento>) => {
    if (!user) return;

    // Validar se o tipo está entre os permitidos (se foi passado)
    if (investimentoAtualizado.tipo && !TIPOS_INVESTIMENTO.includes(investimentoAtualizado.tipo as any)) {
      toast({
        title: "Erro",
        description: "Tipo de investimento inválido. Use: Renda Fixa, Ações, Fundos ou Criptomoedas",
        variant: "destructive"
      });
      return;
    }

    try {
      // Garantir que os dados estão no formato correto para atualização
      const updates: any = {};
      
      if (investimentoAtualizado.nome !== undefined) updates.nome = investimentoAtualizado.nome;
      if (investimentoAtualizado.tipo !== undefined) updates.tipo = investimentoAtualizado.tipo;
      if (investimentoAtualizado.valor_investido !== undefined) updates.valor_investido = Number(investimentoAtualizado.valor_investido);
      if (investimentoAtualizado.data_investimento !== undefined) updates.data_investimento = investimentoAtualizado.data_investimento;
      if (investimentoAtualizado.rentabilidade_esperada !== undefined) {
        updates.rentabilidade_esperada = investimentoAtualizado.rentabilidade_esperada ? Number(investimentoAtualizado.rentabilidade_esperada) : null;
      }
      if (investimentoAtualizado.valor_atual !== undefined) {
        updates.valor_atual = investimentoAtualizado.valor_atual ? Number(investimentoAtualizado.valor_atual) : null;
      }
      if (investimentoAtualizado.vencimento !== undefined) updates.vencimento = investimentoAtualizado.vencimento || null;
      if (investimentoAtualizado.observacoes !== undefined) updates.observacoes = investimentoAtualizado.observacoes || null;

      console.log('Dados sendo atualizados:', updates);

      const { error } = await supabase
        .from('investimentos')
        .update(updates)
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
        investimento.id === id ? { ...investimento, ...updates } : investimento
      ));

      toast({
        title: "Sucesso",
        description: "Investimento atualizado com sucesso!"
      });
    } catch (error) {
      console.error('Erro ao atualizar investimento:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao atualizar investimento",
        variant: "destructive"
      });
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
    refetch: fetchInvestimentos,
    tiposPermitidos: TIPOS_INVESTIMENTO
  };
};
