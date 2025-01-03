-- First drop the CHECK constraints that are causing issues
ALTER TABLE public.transactions
  DROP CONSTRAINT transactions_positive_quantity,
  DROP CONSTRAINT transactions_positive_price;

-- Now update the column types
ALTER TABLE public.transactions
  ALTER COLUMN price TYPE varchar(50) USING price::varchar(50),
  ALTER COLUMN quantity TYPE varchar(50) USING quantity::varchar(50);

-- Add new CHECK constraints to ensure valid decimal string format and positive values
ALTER TABLE public.transactions
  ADD CONSTRAINT transactions_valid_quantity 
    CHECK (quantity ~ '^[0-9]+\.?[0-9]*$' AND CAST(quantity AS numeric) > 0),
  ADD CONSTRAINT transactions_valid_price 
    CHECK (price ~ '^[0-9]+\.?[0-9]*$' AND CAST(price AS numeric) > 0);