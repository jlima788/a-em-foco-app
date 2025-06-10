
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Sonho {
  id: string;
  titulo: string;
  descricao?: string;
  valor_meta: number;
  valor_atual: number;
  data_meta?: string;
  prioridade: string;
  status: string;
  categoria?: string;
  imagem_url?: string;
}

export const useMuralSonhos = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sonhos, setSonhos] = useState<Sonho[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSonhos = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('mural_sonhos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar sonhos:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar sonhos",
          variant: "destructive"
        });
        return;
      }

      setS sonhos(data || []);
    } catch (error) {
      console.error('Erro ao buscar sonhos:', error);
    } finally {
      setLoading(false);
    }
  };

  const addSonho = async (novoSonho: Omit<Sonho, 'id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('mural_sonhos')
        .insert({
          user_id: user.id,
          ...novoSonho
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao adicionar sonho:', error);
        toast({
          title: "Erro",
          description: "Erro ao adicionar sonho",
          variant: "destructive"
        });
        return;
      }

      if (data) {
        setSonhos(prev => [data, ...prev]);
        toast({
          title: "Sucesso",
          description: "Sonho adicionado com sucesso!"
        });
      }
    } catch (error) {
      console.error('Erro ao adicionar sonho:', error);
    }
  };

  const updateSonho = async (id: string, sonhoAtualizado: Partial<Sonho>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('mural_sonhos')
        .update(sonhoAtualizado)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Erro ao atualizar sonho:', error);
        toast({
          title: "Erro",
          description: "Erro ao atualizar sonho",
          variant: "destructive"
        });
        return;
      }

      setSonhos(prev => prev.map(sonho => 
        sonho.id === id ? { ...sonho, ...sonhoAtualizado } : sonho
      ));

      toast({
        title: "Sucesso",
        description: "Sonho atualizado com sucesso!"
      });
    } catch (error) {
      console.error('Erro ao atualizar sonho:', error);
    }
  };

  const deleteSonho = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('mural_sonhos')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Erro ao deletar sonho:', error);
        toast({
          title: "Erro",
          description: "Erro ao remover sonho",
          variant: "destructive"
        });
        return;
      }

      setSonhos(prev => prev.filter(sonho => sonho.id !== id));
      toast({
        title: "Sucesso",
        description: "Sonho removido com sucesso!"
      });
    } catch (error) {
      console.error('Erro ao deletar sonho:', error);
    }
  };

  useEffect(() => {
    fetchSonhos();
  }, [user]);

  return {
    sonhos,
    loading,
    addSonho,
    updateSonho,
    deleteSonho,
    refetch: fetchSonhos
  };
};
