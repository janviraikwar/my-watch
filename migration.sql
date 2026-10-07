-- 1. Create Payment Settings Table
CREATE TABLE IF NOT EXISTS public.payment_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    gateway TEXT NOT NULL UNIQUE,
    is_enabled BOOLEAN DEFAULT false,
    key_id TEXT,
    secret_key TEXT,
    mode TEXT DEFAULT 'test',
    additional_settings JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for Payment Settings (Only admins can read/write)
ALTER TABLE public.payment_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view payment settings" ON public.payment_settings FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins can insert payment settings" ON public.payment_settings FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update payment settings" ON public.payment_settings FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete payment settings" ON public.payment_settings FOR DELETE USING (public.is_admin());

-- Seed default gateways
INSERT INTO public.payment_settings (gateway, is_enabled) VALUES 
('razorpay', false),
('cashfree', false),
('cod', true)
ON CONFLICT (gateway) DO NOTHING;

-- 2. Update Enums for Payment and Order Status
-- PostgreSQL doesn't allow IF NOT EXISTS for ADD VALUE easily in older versions, 
-- so we'll just alter the order_status ENUM safely if possible, or add new columns as TEXT.
-- To avoid ENUM errors, we'll alter the orders table to use TEXT for statuses so we can be flexible.

ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS order_number TEXT,
ADD COLUMN IF NOT EXISTS customer_name TEXT,
ADD COLUMN IF NOT EXISTS customer_email TEXT,
ADD COLUMN IF NOT EXISTS customer_phone TEXT,
ADD COLUMN IF NOT EXISTS shipping_address TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS pincode TEXT,
ADD COLUMN IF NOT EXISTS subtotal DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS shipping_charge DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS cod_charge DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS payment_method TEXT,
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'Pending',
ADD COLUMN IF NOT EXISTS payment_gateway TEXT,
ADD COLUMN IF NOT EXISTS payment_order_id TEXT,
ADD COLUMN IF NOT EXISTS payment_transaction_id TEXT,
ADD COLUMN IF NOT EXISTS cancellation_reason TEXT,
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS shipped_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP WITH TIME ZONE;

-- Alter the status column in orders to be TEXT so we don't hit ENUM limitations
ALTER TABLE public.orders ALTER COLUMN status TYPE TEXT USING status::TEXT;
ALTER TABLE public.orders ALTER COLUMN status SET DEFAULT 'Pending';

-- 3. Payments Table
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    gateway TEXT NOT NULL,
    payment_method TEXT,
    gateway_order_id TEXT,
    gateway_payment_id TEXT,
    amount DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    status TEXT DEFAULT 'Pending',
    raw_metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for Payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own payments" ON public.payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all payments" ON public.payments FOR SELECT USING (public.is_admin());
-- System/API will handle inserts securely, bypassing RLS using service role.

-- 4. Update order_items (Add missing columns if needed)
ALTER TABLE public.order_items 
ADD COLUMN IF NOT EXISTS product_name TEXT,
ADD COLUMN IF NOT EXISTS product_image TEXT,
ADD COLUMN IF NOT EXISTS subtotal DECIMAL(10, 2) DEFAULT 0;

-- Adjust order_items policies if needed
-- (The existing policies allow users to view own items via order association)
