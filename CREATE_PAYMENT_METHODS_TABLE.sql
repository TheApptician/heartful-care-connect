-- HEEMS - CLIENT PAYMENT METHODS TABLE
CREATE TABLE IF NOT EXISTS public.client_payment_methods (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    stripe_payment_method_id TEXT, -- Optional, for real Stripe integration
    brand TEXT NOT NULL, -- e.g., 'Visa', 'Mastercard'
    last4 TEXT NOT NULL,
    exp_month INTEGER NOT NULL,
    exp_year INTEGER NOT NULL,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.client_payment_methods ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Clients can view their own payment methods." ON public.client_payment_methods;
CREATE POLICY "Clients can view their own payment methods." 
ON public.client_payment_methods FOR SELECT 
TO authenticated 
USING (auth.uid() = client_id);

DROP POLICY IF EXISTS "Clients can insert their own payment methods." ON public.client_payment_methods;
CREATE POLICY "Clients can insert their own payment methods." 
ON public.client_payment_methods FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = client_id);

DROP POLICY IF EXISTS "Clients can delete their own payment methods." ON public.client_payment_methods;
CREATE POLICY "Clients can delete their own payment methods." 
ON public.client_payment_methods FOR DELETE 
TO authenticated 
USING (auth.uid() = client_id);

-- Ensure only one default per client
CREATE OR REPLACE FUNCTION public.set_single_default_payment_method()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_default THEN
        UPDATE public.client_payment_methods 
        SET is_default = false 
        WHERE client_id = NEW.client_id AND id != NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_payment_method_default
BEFORE INSERT OR UPDATE OF is_default ON public.client_payment_methods
FOR EACH ROW
WHEN (NEW.is_default = true)
EXECUTE FUNCTION public.set_single_default_payment_method();
