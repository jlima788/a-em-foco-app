
-- Adicionar RLS policies para a tabela ganhos
ALTER TABLE public.ganhos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own ganhos" ON public.ganhos
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ganhos" ON public.ganhos
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ganhos" ON public.ganhos
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own ganhos" ON public.ganhos
FOR DELETE 
USING (auth.uid() = user_id);

-- Adicionar RLS policies para a tabela cartoes_credito
ALTER TABLE public.cartoes_credito ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cartoes" ON public.cartoes_credito
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cartoes" ON public.cartoes_credito
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cartoes" ON public.cartoes_credito
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own cartoes" ON public.cartoes_credito
FOR DELETE 
USING (auth.uid() = user_id);

-- Adicionar RLS policies para outras tabelas se necessário
ALTER TABLE public.dividas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own dividas" ON public.dividas
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own dividas" ON public.dividas
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own dividas" ON public.dividas
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own dividas" ON public.dividas
FOR DELETE 
USING (auth.uid() = user_id);

ALTER TABLE public.investimentos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own investimentos" ON public.investimentos
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own investimentos" ON public.investimentos
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own investimentos" ON public.investimentos
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own investimentos" ON public.investimentos
FOR DELETE 
USING (auth.uid() = user_id);

ALTER TABLE public.mural_sonhos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sonhos" ON public.mural_sonhos
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sonhos" ON public.mural_sonhos
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sonhos" ON public.mural_sonhos
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own sonhos" ON public.mural_sonhos
FOR DELETE 
USING (auth.uid() = user_id);
