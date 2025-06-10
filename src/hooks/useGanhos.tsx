
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Ganho {
  id: string;
  descricao: string;
  valor: number;
  data_recebimento: string;
  categoria_id?: string;
  recorrente: boolean;
  observacoes?: string;
}

export const useGanhos = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [ganhos, setGanhos] = useState<Ganho[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGanhos = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('ganhos')
        .select('*')
        .eq('user_id', user.id)
        .order('data_recebimento', { ascending: false });

      if (error) {
        console.error('Erro ao buscar ganhos:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar ganhos",
          variant: "destructive"
        });
        return;
      }

      setGanhos(data || []);
    } catch (error) {
      console.error('Erro ao buscar ganhos:', error);
    } finally {
      setLoading(false);
    }
  };

  const addGanho = async (novoGanho: Omit<Ganho, 'id'>) => {
    if (!user) return;

    try {
      // Se categoria_id for uma string como 'salario', 'freelance', etc., não enviar como UUID
      const categoria_id = novoGanho.categoria_id && 
        ['salario', 'freelance', 'investimento', 'extra'].includes(novoGanho.categoria_id) 
        ? null 
        : novoGanho.categoria_id;

      const { data, error } = await supabase
        .from('ganhos')
        .insert({
          user_id: user.id,
          descricao: novoGanho.descricao,
          valor: novoGanho.valor,
          data_recebimento: novoGanho.data_recebimento,
          categoria_id: categoria_id,
          recorrente: novoGanho.recorrente,
          observacoes: novoGanho.observacoes
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao adicionar ganho:', error);
        toast({
          title: "Erro",
          description: "Erro ao adicionar ganho",
          variant: "destructive"
        });
        return;
      }

      if (data) {
        setGanhos(prev => [data, ...prev]);
        toast({
          title: "Sucesso",
          description: "Ganho adicionado com sucesso!"
        });
      }
    } catch (error) {
      console.error('Erro ao adicionar ganho:', error);
    }
  };

  const updateGanho = async (id: string, ganhoAtualizado: Partial<Ganho>) => {
    if (!user) return;

    try {
      // Mesmo tratamento para categoria_id na atualização
      const updates = { ...ganhoAtualizado };
      if (updates.categoria_id && 
        ['salario', 'freelance', 'investimento', 'extra'].includes(updates.categoria_id)) {
        updates.categoria_id = null;
      }

      const { error } = await supabase
        .from('ganhos')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Erro ao atualizar ganho:', error);
        toast({
          title: "Erro",
          description: "Erro ao atualizar ganho",
          variant: "destructive"
        });
        return;
      }

      setGanhos(prev => prev.map(ganho => 
        ganho.id === id ? { ...ganho, ...updates } : ganho
      ));

      toast({
        title: "Sucesso",
        description: "Ganho atualizado com sucesso!"
      });
    } catch (error) {
      console.error('Erro ao atualizar ganho:', error);
    }
  };

  const deleteGanho = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('ganhos')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Erro ao deletar ganho:', error);
        toast({
          title: "Erro",
          description: "Erro ao remover ganho",
          variant: "destructive"
        });
        return;
      }

      setGanhos(prev => prev.filter(ganho => ganho.id !== id));
      toast({
        title: "Sucesso",
        description: "Ganho removido com sucesso!"
      });
    } catch (error) {
      console.error('Erro ao deletar ganho:', error);
    }
  };

  useEffect(() => {
    fetchGanhos();
  }, [user]);

  return {
    ganhos,
    loading,
    addGanho,
    updateGanho,
    deleteGanho,
    refetch: fetchGanhos
  };
};
