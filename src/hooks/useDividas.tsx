
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Divida {
  id: string;
  credor: string;
  valor_total: number;
  valor_pago: number;
  valor_restante: number;
  data_inicio: string;
  data_vencimento?: string;
  taxa_juros?: number;
  status: string;
  observacoes?: string;
}

export const useDividas = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [dividas, setDividas] = useState<Divida[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDividas = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('dividas')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar dívidas:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar dívidas",
          variant: "destructive"
        });
        return;
      }

      setDividas(data || []);
    } catch (error) {
      console.error('Erro ao buscar dívidas:', error);
    } finally {
      setLoading(false);
    }
  };

  const addDivida = async (novaDivida: Omit<Divida, 'id' | 'valor_restante'>) => {
    if (!user) return;

    try {
      // Garantir que os dados estão no formato correto e remover valor_restante
      const dividaData = {
        user_id: user.id,
        credor: novaDivida.credor,
        valor_total: Number(novaDivida.valor_total),
        valor_pago: Number(novaDivida.valor_pago) || 0,
        data_inicio: novaDivida.data_inicio,
        data_vencimento: novaDivida.data_vencimento || null,
        taxa_juros: novaDivida.taxa_juros ? Number(novaDivida.taxa_juros) : null,
        status: novaDivida.status || 'ativa',
        observacoes: novaDivida.observacoes || null
      };

      console.log('Dados sendo enviados para o banco:', dividaData);

      const { data, error } = await supabase
        .from('dividas')
        .insert(dividaData)
        .select()
        .single();

      if (error) {
        console.error('Erro ao adicionar dívida:', error);
        toast({
          title: "Erro",
          description: "Erro ao adicionar dívida",
          variant: "destructive"
        });
        return;
      }

      if (data) {
        setDividas(prev => [data, ...prev]);
        toast({
          title: "Sucesso",
          description: "Dívida adicionada com sucesso!"
        });
      }
    } catch (error) {
      console.error('Erro ao adicionar dívida:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao adicionar dívida",
        variant: "destructive"
      });
    }
  };

  const updateDivida = async (id: string, dividaAtualizada: Partial<Divida>) => {
    if (!user) return;

    try {
      // Garantir que os dados estão no formato correto e remover valor_restante das atualizações
      const updates: any = {};
      
      if (dividaAtualizada.credor !== undefined) updates.credor = dividaAtualizada.credor;
      if (dividaAtualizada.valor_total !== undefined) updates.valor_total = Number(dividaAtualizada.valor_total);
      if (dividaAtualizada.valor_pago !== undefined) updates.valor_pago = Number(dividaAtualizada.valor_pago);
      if (dividaAtualizada.data_inicio !== undefined) updates.data_inicio = dividaAtualizada.data_inicio;
      if (dividaAtualizada.data_vencimento !== undefined) updates.data_vencimento = dividaAtualizada.data_vencimento || null;
      if (dividaAtualizada.taxa_juros !== undefined) {
        updates.taxa_juros = dividaAtualizada.taxa_juros ? Number(dividaAtualizada.taxa_juros) : null;
      }
      if (dividaAtualizada.status !== undefined) updates.status = dividaAtualizada.status;
      if (dividaAtualizada.observacoes !== undefined) updates.observacoes = dividaAtualizada.observacoes || null;

      console.log('Dados sendo atualizados:', updates);

      const { error } = await supabase
        .from('dividas')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Erro ao atualizar dívida:', error);
        toast({
          title: "Erro",
          description: "Erro ao atualizar dívida",
          variant: "destructive"
        });
        return;
      }

      setDividas(prev => prev.map(divida => 
        divida.id === id ? { ...divida, ...updates } : divida
      ));

      toast({
        title: "Sucesso",
        description: "Dívida atualizada com sucesso!"
      });
    } catch (error) {
      console.error('Erro ao atualizar dívida:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao atualizar dívida",
        variant: "destructive"
      });
    }
  };

  const deleteDivida = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('dividas')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Erro ao deletar dívida:', error);
        toast({
          title: "Erro",
          description: "Erro ao remover dívida",
          variant: "destructive"
        });
        return;
      }

      setDividas(prev => prev.filter(divida => divida.id !== id));
      toast({
        title: "Sucesso",
        description: "Dívida removida com sucesso!"
      });
    } catch (error) {
      console.error('Erro ao deletar dívida:', error);
    }
  };

  useEffect(() => {
    fetchDividas();
  }, [user]);

  return {
    dividas,
    loading,
    addDivida,
    updateDivida,
    deleteDivida,
    refetch: fetchDividas
  };
};
