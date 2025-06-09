
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

  const checkLocalSubscription = async () => {
    if (!user) {
      setSubscriptionData({ subscribed: false });
      setLoading(false);
      return false;
    }

    try {
      // First check local database for existing subscription data
      const { data: localData, error } = await supabase
        .from('subscribers')
        .select('*')
        .eq('email', user.email)
        .single();

      if (!error && localData && localData.subscribed) {
        // User has local subscription data, use it immediately
        setSubscriptionData({
          subscribed: localData.subscribed,
          subscription_tier: localData.subscription_tier,
          subscription_end: localData.subscription_end
        });
        setLoading(false);
        return true;
      }
    } catch (error) {
      console.log('No local subscription data found, will check Stripe');
    }

    return false;
  };

  const checkSubscription = async () => {
    if (!user || !session) {
      setSubscriptionData({ subscribed: false });
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('check-payment', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Error checking payment:', error);
        setSubscriptionData({ subscribed: false });
      } else {
        setSubscriptionData(data);
      }
    } catch (error) {
      console.error('Error checking payment:', error);
      setSubscriptionData({ subscribed: false });
    } finally {
      setLoading(false);
    }
  };

  const createCheckout = async () => {
    if (!user || !session) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para fazer uma compra.",
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
        description: "Você precisa estar logado para gerenciar seu pagamento.",
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
    const initializeSubscription = async () => {
      // First try to get local data immediately
      const hasLocalData = await checkLocalSubscription();
      
      // If no local data or user wants fresh data, check Stripe
      if (!hasLocalData) {
        await checkSubscription();
      }
    };

    initializeSubscription();
  }, [user, session]);

  return {
    ...subscriptionData,
    loading,
    checkSubscription,
    createCheckout,
    openCustomerPortal
  };
};
