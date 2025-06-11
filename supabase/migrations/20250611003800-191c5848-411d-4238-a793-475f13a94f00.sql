
-- Corrigir a coluna valor_restante para ser calculada automaticamente
ALTER TABLE public.dividas DROP COLUMN IF EXISTS valor_restante;
ALTER TABLE public.dividas ADD COLUMN valor_restante numeric GENERATED ALWAYS AS (valor_total - valor_pago) STORED;

-- Corrigir os tipos permitidos para investimentos
ALTER TABLE public.investimentos DROP CONSTRAINT IF EXISTS investimentos_tipo_check;
ALTER TABLE public.investimentos ADD CONSTRAINT investimentos_tipo_check 
  CHECK (tipo IN ('Renda Fixa', 'Ações', 'Fundos', 'Criptomoedas'));
