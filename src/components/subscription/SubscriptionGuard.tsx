
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, CheckCircle, AlertCircle } from 'lucide-react';

interface SubscriptionGuardProps {
  children: React.ReactNode;
}

const SubscriptionGuard = ({ children }: SubscriptionGuardProps) => {
  const { user } = useAuth();
  const { subscribed, loading, createCheckout, openCustomerPortal, subscription_tier, subscription_end } = useSubscription();

  if (!user) {
    return null; // AuthGuard will handle this
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-lg">Verificando pagamento...</div>
      </div>
    );
  }

  if (!subscribed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-800 border-gray-700">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-white text-2xl">
              Acesso Premium Necessário
            </CardTitle>
            <CardDescription className="text-gray-400">
              Para acessar o ExperienceApp, você precisa adquirir o acesso premium.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-white font-semibold mb-2">Acesso Premium - R$ 49,99</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Controle financeiro completo
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Gestão de cartões de crédito
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Mural dos sonhos
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Controle de investimentos
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  Acesso vitalício
                </li>
              </ul>
            </div>
            
            <Button 
              onClick={createCheckout}
              className="w-full gradient-primary hover:opacity-90"
            >
              Comprar Agora - R$ 49,99
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      {children}
      {/* Payment status indicator */}
      <div className="fixed bottom-4 right-4 z-50">
        <Card className="bg-green-900 border-green-700">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-green-100">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">
                {subscription_tier} - Ativo
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default SubscriptionGuard;
