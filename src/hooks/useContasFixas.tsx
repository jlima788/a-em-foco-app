
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface ContaFixa {
  id: string;
  nome: string;
  valor: number;
  vencimento: number;
  categoria: string;
  status: 'pago' | 'pendente';
}

export const useContasFixas = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [contas, setContas] = useState<ContaFixa[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContas = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('contas_fixas')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar contas:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar contas fixas",
          variant: "destructive"
        });
        return;
      }

      const contasFormatadas = data?.map(conta => ({
        id: conta.id,
        nome: conta.nome,
        valor: Number(conta.valor),
        vencimento: conta.vencimento,
        categoria: conta.categoria_id || 'outros', // Temporário até mapear categorias
        status: conta.status as 'pago' | 'pendente'
      })) || [];

      setContas(contasFormatadas);
    } catch (error) {
      console.error('Erro ao buscar contas:', error);
    } finally {
      setLoading(false);
    }
  };

  const addConta = async (novaConta: Omit<ContaFixa, 'id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('contas_fixas')
        .insert({
          user_id: user.id,
          nome: novaConta.nome,
          valor: novaConta.valor,
          vencimento: novaConta.vencimento,
          status: novaConta.status
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao adicionar conta:', error);
        toast({
          title: "Erro",
          description: "Erro ao adicionar conta fixa",
          variant: "destructive"
        });
        return;
      }

      if (data) {
        const contaFormatada: ContaFixa = {
          id: data.id,
          nome: data.nome,
          valor: Number(data.valor),
          vencimento: data.vencimento,
          categoria: data.categoria_id || 'outros',
          status: data.status as 'pago' | 'pendente'
        };

        setContas(prev => [contaFormatada, ...prev]);
        toast({
          title: "Sucesso",
          description: "Conta adicionada com sucesso!"
        });
      }
    } catch (error) {
      console.error('Erro ao adicionar conta:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar conta fixa",
        variant: "destructive"
      });
    }
  };

  const updateConta = async (id: string, contaAtualizada: Partial<ContaFixa>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('contas_fixas')
        .update({
          nome: contaAtualizada.nome,
          valor: contaAtualizada.valor,
          vencimento: contaAtualizada.vencimento,
          status: contaAtualizada.status
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Erro ao atualizar conta:', error);
        toast({
          title: "Erro",
          description: "Erro ao atualizar conta fixa",
          variant: "destructive"
        });
        return;
      }

      setContas(prev => prev.map(conta => 
        conta.id === id ? { ...conta, ...contaAtualizada } : conta
      ));

      toast({
        title: "Sucesso",
        description: "Conta atualizada com sucesso!"
      });
    } catch (error) {
      console.error('Erro ao atualizar conta:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar conta fixa",
        variant: "destructive"
      });
    }
  };

  const deleteConta = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('contas_fixas')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Erro ao deletar conta:', error);
        toast({
          title: "Erro",
          description: "Erro ao remover conta fixa",
          variant: "destructive"
        });
        return;
      }

      setContas(prev => prev.filter(conta => conta.id !== id));
      toast({
        title: "Sucesso",
        description: "Conta removida com sucesso!"
      });
    } catch (error) {
      console.error('Erro ao deletar conta:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover conta fixa",
        variant: "destructive"
      });
    }
  };

  const toggleStatus = async (id: string) => {
    const conta = contas.find(c => c.id === id);
    if (!conta) return;

    const novoStatus = conta.status === 'pago' ? 'pendente' : 'pago';
    await updateConta(id, { status: novoStatus });
  };

  useEffect(() => {
    fetchContas();
  }, [user]);

  return {
    contas,
    loading,
    addConta,
    updateConta,
    deleteConta,
    toggleStatus,
    refetch: fetchContas
  };
};
