export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      cartoes_credito: {
        Row: {
          ativo: boolean | null
          created_at: string
          id: string
          limite: number
          limite_usado: number | null
          melhor_dia_compra: number | null
          nome: string
          updated_at: string
          user_id: string
          vencimento_fatura: number | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string
          id?: string
          limite: number
          limite_usado?: number | null
          melhor_dia_compra?: number | null
          nome: string
          updated_at?: string
          user_id: string
          vencimento_fatura?: number | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string
          id?: string
          limite?: number
          limite_usado?: number | null
          melhor_dia_compra?: number | null
          nome?: string
          updated_at?: string
          user_id?: string
          vencimento_fatura?: number | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          color: string | null
          created_at: string
          icon: string | null
          id: string
          name: string
          type: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          name: string
          type: string
        }
        Update: {
          color?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          name?: string
          type?: string
        }
        Relationships: []
      }
      contas_fixas: {
        Row: {
          categoria_id: string | null
          created_at: string
          id: string
          nome: string
          observacoes: string | null
          status: string | null
          updated_at: string
          user_id: string
          valor: number
          vencimento: number
        }
        Insert: {
          categoria_id?: string | null
          created_at?: string
          id?: string
          nome: string
          observacoes?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
          valor: number
          vencimento: number
        }
        Update: {
          categoria_id?: string | null
          created_at?: string
          id?: string
          nome?: string
          observacoes?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
          valor?: number
          vencimento?: number
        }
        Relationships: [
          {
            foreignKeyName: "contas_fixas_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      contribuicoes_sonhos: {
        Row: {
          created_at: string
          data_contribuicao: string
          id: string
          observacoes: string | null
          sonho_id: string
          valor: number
        }
        Insert: {
          created_at?: string
          data_contribuicao?: string
          id?: string
          observacoes?: string | null
          sonho_id: string
          valor: number
        }
        Update: {
          created_at?: string
          data_contribuicao?: string
          id?: string
          observacoes?: string | null
          sonho_id?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "contribuicoes_sonhos_sonho_id_fkey"
            columns: ["sonho_id"]
            isOneToOne: false
            referencedRelation: "mural_sonhos"
            referencedColumns: ["id"]
          },
        ]
      }
      dividas: {
        Row: {
          created_at: string
          credor: string
          data_inicio: string
          data_vencimento: string | null
          id: string
          observacoes: string | null
          status: string | null
          taxa_juros: number | null
          updated_at: string
          user_id: string
          valor_pago: number | null
          valor_restante: number | null
          valor_total: number
        }
        Insert: {
          created_at?: string
          credor: string
          data_inicio: string
          data_vencimento?: string | null
          id?: string
          observacoes?: string | null
          status?: string | null
          taxa_juros?: number | null
          updated_at?: string
          user_id: string
          valor_pago?: number | null
          valor_restante?: number | null
          valor_total: number
        }
        Update: {
          created_at?: string
          credor?: string
          data_inicio?: string
          data_vencimento?: string | null
          id?: string
          observacoes?: string | null
          status?: string | null
          taxa_juros?: number | null
          updated_at?: string
          user_id?: string
          valor_pago?: number | null
          valor_restante?: number | null
          valor_total?: number
        }
        Relationships: []
      }
      ganhos: {
        Row: {
          categoria_id: string | null
          created_at: string
          data_recebimento: string
          descricao: string
          id: string
          observacoes: string | null
          recorrente: boolean | null
          updated_at: string
          user_id: string
          valor: number
        }
        Insert: {
          categoria_id?: string | null
          created_at?: string
          data_recebimento: string
          descricao: string
          id?: string
          observacoes?: string | null
          recorrente?: boolean | null
          updated_at?: string
          user_id: string
          valor: number
        }
        Update: {
          categoria_id?: string | null
          created_at?: string
          data_recebimento?: string
          descricao?: string
          id?: string
          observacoes?: string | null
          recorrente?: boolean | null
          updated_at?: string
          user_id?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "ganhos_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      gastos_cartao: {
        Row: {
          cartao_id: string
          categoria_id: string | null
          created_at: string
          data_compra: string
          descricao: string
          id: string
          observacoes: string | null
          parcela_atual: number | null
          parcelas: number | null
          valor: number
        }
        Insert: {
          cartao_id: string
          categoria_id?: string | null
          created_at?: string
          data_compra: string
          descricao: string
          id?: string
          observacoes?: string | null
          parcela_atual?: number | null
          parcelas?: number | null
          valor: number
        }
        Update: {
          cartao_id?: string
          categoria_id?: string | null
          created_at?: string
          data_compra?: string
          descricao?: string
          id?: string
          observacoes?: string | null
          parcela_atual?: number | null
          parcelas?: number | null
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "gastos_cartao_cartao_id_fkey"
            columns: ["cartao_id"]
            isOneToOne: false
            referencedRelation: "cartoes_credito"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gastos_cartao_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      investimentos: {
        Row: {
          created_at: string
          data_investimento: string
          id: string
          nome: string
          observacoes: string | null
          rentabilidade_esperada: number | null
          tipo: string
          updated_at: string
          user_id: string
          valor_atual: number | null
          valor_investido: number
          vencimento: string | null
        }
        Insert: {
          created_at?: string
          data_investimento: string
          id?: string
          nome: string
          observacoes?: string | null
          rentabilidade_esperada?: number | null
          tipo: string
          updated_at?: string
          user_id: string
          valor_atual?: number | null
          valor_investido: number
          vencimento?: string | null
        }
        Update: {
          created_at?: string
          data_investimento?: string
          id?: string
          nome?: string
          observacoes?: string | null
          rentabilidade_esperada?: number | null
          tipo?: string
          updated_at?: string
          user_id?: string
          valor_atual?: number | null
          valor_investido?: number
          vencimento?: string | null
        }
        Relationships: []
      }
      mural_sonhos: {
        Row: {
          categoria: string | null
          created_at: string
          data_meta: string | null
          descricao: string | null
          id: string
          imagem_url: string | null
          prioridade: string | null
          status: string | null
          titulo: string
          updated_at: string
          user_id: string
          valor_atual: number | null
          valor_meta: number
        }
        Insert: {
          categoria?: string | null
          created_at?: string
          data_meta?: string | null
          descricao?: string | null
          id?: string
          imagem_url?: string | null
          prioridade?: string | null
          status?: string | null
          titulo: string
          updated_at?: string
          user_id: string
          valor_atual?: number | null
          valor_meta: number
        }
        Update: {
          categoria?: string | null
          created_at?: string
          data_meta?: string | null
          descricao?: string | null
          id?: string
          imagem_url?: string | null
          prioridade?: string | null
          status?: string | null
          titulo?: string
          updated_at?: string
          user_id?: string
          valor_atual?: number | null
          valor_meta?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
