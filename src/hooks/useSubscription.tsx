
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionData {
  subscribed: boolean;
  subscription_tier?: string;
  subscription_end?: string;
}

export const useSubscription = () => {
  const { user, session } = useAuth();
  const { toast } = useToast();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
    subscribed: false
  });
  const [loading, setLoading] = useState(true);

  const checkSubscription = async () => {
    if (!user || !session) {
      setSubscriptionData({ subscribed: false });
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Error checking subscription:', error);
        setSubscriptionData({ subscribed: false });
      } else {
        setSubscriptionData(data);
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
      setSubscriptionData({ subscribed: false });
    } finally {
      setLoading(false);
    }
  };

  const createCheckout = async () => {
    if (!user || !session) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para fazer uma assinatura.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        toast({
          title: "Erro",
          description: "Erro ao criar sessão de pagamento.",
          variant: "destructive"
        });
        return;
      }

      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao processar pagamento.",
        variant: "destructive"
      });
    }
  };

  const openCustomerPortal = async () => {
    if (!user || !session) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para gerenciar sua assinatura.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        toast({
          title: "Erro",
          description: "Erro ao abrir portal do cliente.",
          variant: "destructive"
        });
        return;
      }

      // Open customer portal in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao abrir portal do cliente.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    checkSubscription();
  }, [user, session]);

  return {
    ...subscriptionData,
    loading,
    checkSubscription,
    createCheckout,
    openCustomerPortal
  };
};
