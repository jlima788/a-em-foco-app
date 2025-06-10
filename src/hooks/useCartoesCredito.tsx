
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface CartaoCredito {
  id: string;
  nome: string;
  limite: number;
  limite_usado: number;
  vencimento_fatura?: number;
  melhor_dia_compra?: number;
  ativo: boolean;
}

export const useCartoesCredito = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [cartoes, setCartoes] = useState<CartaoCredito[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCartoes = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('cartoes_credito')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar cartões:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar cartões de crédito",
          variant: "destructive"
        });
        return;
      }

      setCartoes(data || []);
    } catch (error) {
      console.error('Erro ao buscar cartões:', error);
    } finally {
      setLoading(false);
    }
  };

  const addCartao = async (novoCartao: Omit<CartaoCredito, 'id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('cartoes_credito')
        .insert({
          user_id: user.id,
          ...novoCartao
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao adicionar cartão:', error);
        toast({
          title: "Erro",
          description: "Erro ao adicionar cartão de crédito",
          variant: "destructive"
        });
        return;
      }

      if (data) {
        setCartoes(prev => [data, ...prev]);
        toast({
          title: "Sucesso",
          description: "Cartão adicionado com sucesso!"
        });
      }
    } catch (error) {
      console.error('Erro ao adicionar cartão:', error);
    }
  };

  const updateCartao = async (id: string, cartaoAtualizado: Partial<CartaoCredito>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('cartoes_credito')
        .update(cartaoAtualizado)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Erro ao atualizar cartão:', error);
        toast({
          title: "Erro",
          description: "Erro ao atualizar cartão de crédito",
          variant: "destructive"
        });
        return;
      }

      setCartoes(prev => prev.map(cartao => 
        cartao.id === id ? { ...cartao, ...cartaoAtualizado } : cartao
      ));

      toast({
        title: "Sucesso",
        description: "Cartão atualizado com sucesso!"
      });
    } catch (error) {
      console.error('Erro ao atualizar cartão:', error);
    }
  };

  const deleteCartao = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('cartoes_credito')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Erro ao deletar cartão:', error);
        toast({
          title: "Erro",
          description: "Erro ao remover cartão de crédito",
          variant: "destructive"
        });
        return;
      }

      setCartoes(prev => prev.filter(cartao => cartao.id !== id));
      toast({
        title: "Sucesso",
        description: "Cartão removido com sucesso!"
      });
    } catch (error) {
      console.error('Erro ao deletar cartão:', error);
    }
  };

  useEffect(() => {
    fetchCartoes();
  }, [user]);

  return {
    cartoes,
    loading,
    addCartao,
    updateCartao,
    deleteCartao,
    refetch: fetchCartoes
  };
};
