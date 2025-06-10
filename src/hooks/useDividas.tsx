
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

  const addDivida = async (novaDivida: Omit<Divida, 'id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('dividas')
        .insert({
          user_id: user.id,
          ...novaDivida
        })
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
    }
  };

  const updateDivida = async (id: string, dividaAtualizada: Partial<Divida>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('dividas')
        .update(dividaAtualizada)
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
        divida.id === id ? { ...divida, ...dividaAtualizada } : divida
      ));

      toast({
        title: "Sucesso",
        description: "Dívida atualizada com sucesso!"
      });
    } catch (error) {
      console.error('Erro ao atualizar dívida:', error);
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
