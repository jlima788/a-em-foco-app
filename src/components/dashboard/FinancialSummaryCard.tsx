
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface FinancialSummaryCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
  isCurrency?: boolean;
}

export const FinancialSummaryCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  isCurrency = true 
}: FinancialSummaryCardProps) => {
  const formatValue = (val: number) => {
    if (isCurrency) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(val);
    }
    return val.toString();
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-400">
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">
          {formatValue(value)}
        </div>
      </CardContent>
    </Card>
  );
};
