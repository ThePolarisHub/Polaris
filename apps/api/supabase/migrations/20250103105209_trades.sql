-------------------------------------------------------------------------------
-- 1) CREATE ENUM TYPE
-------------------------------------------------------------------------------

CREATE TYPE public.transaction_type_enum AS ENUM (
  'buy',
  'sell'
);

-------------------------------------------------------------------------------
-- 2) CREATE TABLES
-------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.trades (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  journal_id uuid NOT NULL,
  symbol varchar(20) NOT NULL,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS public.transactions (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  trade_id uuid NOT NULL,
  type public.transaction_type_enum NOT NULL,
  timestamp timestamptz NOT NULL,
  quantity numeric(20,8) NOT NULL,
  price numeric(20,8) NOT NULL,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-------------------------------------------------------------------------------
-- 3) ADD PRIMARY KEYS & OTHER CONSTRAINTS
-------------------------------------------------------------------------------

ALTER TABLE ONLY public.trades
  ADD CONSTRAINT trades_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.transactions
  ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);

ALTER TABLE public.transactions
  ADD CONSTRAINT transactions_positive_quantity CHECK (quantity > 0);

ALTER TABLE public.transactions
  ADD CONSTRAINT transactions_positive_price CHECK (price > 0);

-------------------------------------------------------------------------------
-- 4) CREATE INDEXES
-------------------------------------------------------------------------------

-- Index for foreign key lookups and journal filtering
CREATE INDEX idx_trades_journal_id ON public.trades USING btree (journal_id);
-- Index for symbol lookups within a journal
CREATE INDEX idx_trades_journal_symbol ON public.trades USING btree (journal_id, symbol);

-- Index for foreign key lookups and trade filtering
CREATE INDEX idx_transactions_trade_id ON public.transactions USING btree (trade_id);
-- Index for timestamp-based queries within a trade
CREATE INDEX idx_transactions_timestamp ON public.transactions USING btree (trade_id, timestamp);

CREATE INDEX idx_trades_journal_symbol_created_at ON public.trades (journal_id, symbol, created_at DESC);

-------------------------------------------------------------------------------
-- 5) CREATE TRIGGERS
-------------------------------------------------------------------------------

CREATE OR REPLACE TRIGGER update_trades_updated_at
  BEFORE UPDATE ON public.trades
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE OR REPLACE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-------------------------------------------------------------------------------
-- 6) ADD FOREIGN KEYS
-------------------------------------------------------------------------------

ALTER TABLE ONLY public.trades
  ADD CONSTRAINT trades_journal_id_fkey
  FOREIGN KEY (journal_id) REFERENCES public.journals(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.transactions
  ADD CONSTRAINT transactions_trade_id_fkey
  FOREIGN KEY (trade_id) REFERENCES public.trades(id) ON DELETE CASCADE;

-------------------------------------------------------------------------------
-- 7) ENABLE ROW LEVEL SECURITY + CREATE POLICIES
-------------------------------------------------------------------------------

ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Trades policies
CREATE POLICY read_trades_policy ON public.trades
  FOR SELECT USING (public.is_journal_member(journal_id));

CREATE POLICY insert_trades_policy ON public.trades
  FOR INSERT WITH CHECK (public.is_journal_owner(journal_id));

CREATE POLICY update_trades_policy ON public.trades
  FOR UPDATE USING (public.is_journal_owner(journal_id));

CREATE POLICY delete_trades_policy ON public.trades
  FOR DELETE USING (public.is_journal_owner(journal_id));

-- Transactions policies
CREATE POLICY read_transactions_policy ON public.transactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.trades
      WHERE id = trade_id
      AND public.is_journal_member(journal_id)
    )
  );

CREATE POLICY insert_transactions_policy ON public.transactions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.trades
      WHERE id = trade_id
      AND public.is_journal_owner(journal_id)
    )
  );

CREATE POLICY update_transactions_policy ON public.transactions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.trades
      WHERE id = trade_id
      AND public.is_journal_owner(journal_id)
    )
  );

CREATE POLICY delete_transactions_policy ON public.transactions
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.trades
      WHERE id = trade_id
      AND public.is_journal_owner(journal_id)
    )
  );