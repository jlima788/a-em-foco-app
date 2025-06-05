
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { LogOut, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const UserMenu = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: "Erro ao sair",
        description: "Ocorreu um erro ao tentar sair. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  if (!user) return null;

  const initials = user.email ? user.email.charAt(0).toUpperCase() : 'U';

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 rounded-full p-0 hover:bg-white/10">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-purple-600 text-white text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 bg-gray-900 border-gray-800">
        <SheetHeader>
          <SheetTitle className="text-white flex items-center gap-2">
            <User className="w-5 h-5" />
            Perfil do Usuário
          </SheetTitle>
          <SheetDescription className="text-gray-400">
            Gerencie sua conta e configurações
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-6 space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-800">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-purple-600 text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-white font-medium">{user.email}</p>
              <p className="text-gray-400 text-sm">Usuário</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair da conta
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default UserMenu;
