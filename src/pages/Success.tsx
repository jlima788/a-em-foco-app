
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/hooks/useSubscription';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Success = () => {
  const navigate = useNavigate();
  const { checkSubscription } = useSubscription();
  const { toast } = useToast();

  useEffect(() => {
    // Check subscription status after successful payment
    const timer = setTimeout(() => {
      checkSubscription();
      toast({
        title: "Pagamento Processado!",
        description: "Sua assinatura foi ativada com sucesso.",
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [checkSubscription, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-white text-2xl">
            Pagamento Realizado!
          </CardTitle>
          <CardDescription className="text-gray-400">
            Sua assinatura foi ativada com sucesso. Bem-vindo ao ExperienceApp!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-white font-semibold mb-2">O que você pode fazer agora:</h3>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• Gerenciar suas finanças</li>
              <li>• Controlar cartões de crédito</li>
              <li>• Acompanhar investimentos</li>
              <li>• Criar seu mural dos sonhos</li>
            </ul>
          </div>
          
          <Button 
            onClick={() => navigate('/')}
            className="w-full gradient-primary hover:opacity-90"
          >
            Ir para o Dashboard
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Success;
