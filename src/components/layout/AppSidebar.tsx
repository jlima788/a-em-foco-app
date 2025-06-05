
import { Home, CreditCard, TrendingUp, PiggyBank, Target, AlertTriangle, DollarSign } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
    color: "text-purple-400",
  },
  {
    title: "Contas Fixas",
    url: "/contas-fixas",
    icon: CreditCard,
    color: "text-blue-400",
  },
  {
    title: "Ganhos",
    url: "/ganhos",
    icon: TrendingUp,
    color: "text-green-400",
  },
  {
    title: "Cartões de Crédito",
    url: "/cartoes-credito",
    icon: CreditCard,
    color: "text-orange-400",
  },
  {
    title: "Mural dos Sonhos",
    url: "/mural-sonhos",
    icon: Target,
    color: "text-pink-400",
  },
  {
    title: "Dívidas",
    url: "/dividas",
    icon: AlertTriangle,
    color: "text-red-400",
  },
  {
    title: "Investimentos",
    url: "/investimentos",
    icon: DollarSign,
    color: "text-emerald-400",
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r border-gray-800">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">FinanceApp</h1>
            <p className="text-sm text-gray-400">Controle Financeiro</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-400 text-xs uppercase tracking-wider">
            Menu Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className={`
                      group hover:bg-white/10 transition-all duration-200
                      ${location.pathname === item.url ? 'bg-white/10 text-white' : 'text-gray-300'}
                    `}
                  >
                    <Link to={item.url} className="flex items-center gap-3 p-3 rounded-lg">
                      <item.icon className={`w-5 h-5 ${item.color} group-hover:scale-110 transition-transform`} />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
