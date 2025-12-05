-- Supabase Products Table Migration
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- This script creates a products table for dealers to manage their products

-- Create products table for dealers
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  dealer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  image TEXT,
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on products for faster lookups
CREATE INDEX IF NOT EXISTS idx_products_dealer_id ON products(dealer_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies for products table
-- Dealers can view all products (for now, can be restricted later)
CREATE POLICY "Anyone can view products" ON products
  FOR SELECT USING (true);

-- Dealers can insert their own products
CREATE POLICY "Dealers can insert own products" ON products
  FOR INSERT WITH CHECK (auth.uid() = dealer_id);

-- Dealers can update their own products
CREATE POLICY "Dealers can update own products" ON products
  FOR UPDATE USING (auth.uid() = dealer_id) WITH CHECK (auth.uid() = dealer_id);

-- Dealers can delete their own products
CREATE POLICY "Dealers can delete own products" ON products
  FOR DELETE USING (auth.uid() = dealer_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on products table
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

