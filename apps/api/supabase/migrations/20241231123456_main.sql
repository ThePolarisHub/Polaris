-- 1) CREATE ENUM TYPE
CREATE TYPE public.journal_role_enum AS ENUM (
  'owner',
  'member'
);

-------------------------------------------------------------------------------
-- 2) CREATE TABLES
-------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.journals (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  name varchar(255) NOT NULL,
  logo_url text,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
  CONSTRAINT journals_logo_url_check CHECK (
    logo_url ~ '^http://.*$' OR logo_url ~ '^https://.*$'
  )
);

CREATE TABLE IF NOT EXISTS public.journal_members (
  user_id uuid NOT NULL,
  journal_id uuid NOT NULL,
  role public.journal_role_enum NOT NULL,
  created_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NOT NULL,
  id uuid DEFAULT gen_random_uuid() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL,
  email text,
  display_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  journal_id uuid
);

-------------------------------------------------------------------------------
-- 3) ADD PRIMARY KEYS & OTHER CONSTRAINTS
-------------------------------------------------------------------------------

ALTER TABLE ONLY public.journal_members
  ADD CONSTRAINT journal_members_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.journal_members
  ADD CONSTRAINT journal_members_user_journal_unique UNIQUE (user_id, journal_id);

ALTER TABLE ONLY public.journals
  ADD CONSTRAINT journals_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.profiles
  ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);

-------------------------------------------------------------------------------
-- 4) CREATE INDEXES
-------------------------------------------------------------------------------

CREATE INDEX idx_journal_members_journal_id ON public.journal_members USING btree (journal_id);
CREATE INDEX idx_journal_members_user_id    ON public.journal_members USING btree (user_id);

CREATE INDEX idx_journals_name ON public.journals USING btree (name);

CREATE INDEX idx_profiles_journal_id ON public.profiles USING btree (journal_id);

-------------------------------------------------------------------------------
-- 5) CREATE / REPLACE FUNCTIONS
-------------------------------------------------------------------------------
-- Note: We place functions after tables exist (so references succeed).

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION storage.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW; 
END;
$$;

-- These functions reference journal_members, journals, profiles 
-- so define them only after those tables have been created.

CREATE OR REPLACE FUNCTION public.create_journal(name varchar) 
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_journal_id uuid;
  current_user_id uuid;
BEGIN
  current_user_id := auth.uid();

  INSERT INTO journals (name) 
  VALUES (name) 
  RETURNING id INTO new_journal_id;
  
  INSERT INTO journal_members (user_id, journal_id, role)
  VALUES (current_user_id, new_journal_id, 'owner');
  
  UPDATE profiles 
  SET journal_id = new_journal_id 
  WHERE id = current_user_id;
  
  RETURN new_journal_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_auth_user_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO public.profiles (id, email)
    VALUES (
      NEW.id,
      NEW.email
    );
    RETURN NEW;
  ELSIF (TG_OP = 'UPDATE') THEN
    UPDATE public.profiles
    SET email = NEW.email,
        display_name = NEW.raw_user_meta_data->>'display_name'
    WHERE id = NEW.id;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$;



CREATE OR REPLACE FUNCTION public.is_journal_member(journal_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM journal_members
    WHERE journal_id = $1 
      AND user_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.is_journal_owner(journal_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM journal_members
    WHERE journal_id = $1 
      AND user_id = auth.uid() 
      AND role = 'owner'
  );
$$;

-------------------------------------------------------------------------------
-- 6) CREATE TRIGGERS THAT USE public.update_updated_at()
-------------------------------------------------------------------------------

CREATE OR REPLACE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE OR REPLACE TRIGGER update_journal_members_updated_at
  BEFORE UPDATE ON public.journal_members
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE OR REPLACE TRIGGER update_journals_updated_at
  BEFORE UPDATE ON public.journals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE OR REPLACE TRIGGER handle_auth_user_changes
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_auth_user_changes();

-------------------------------------------------------------------------------
-- 7) ADD FOREIGN KEYS
-------------------------------------------------------------------------------

ALTER TABLE ONLY public.journal_members
  ADD CONSTRAINT journal_members_journal_id_fkey
  FOREIGN KEY (journal_id) REFERENCES public.journals(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.journal_members
  ADD CONSTRAINT journal_members_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.profiles
  ADD CONSTRAINT profiles_id_fkey
  FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.profiles
  ADD CONSTRAINT profiles_journal_id_fkey
  FOREIGN KEY (journal_id) REFERENCES public.journals(id) ON DELETE SET NULL;

-------------------------------------------------------------------------------
-- 8) ENABLE ROW LEVEL SECURITY + CREATE POLICIES
-------------------------------------------------------------------------------

ALTER TABLE public.journal_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journals       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles       ENABLE ROW LEVEL SECURITY;

-- Journals
CREATE POLICY create_journal_policy ON public.journals
  FOR INSERT WITH CHECK (false);

CREATE POLICY delete_journal_policy ON public.journals
  FOR DELETE USING (public.is_journal_owner(id));

CREATE POLICY read_journal_policy ON public.journals
  FOR SELECT USING (public.is_journal_member(id));

CREATE POLICY update_journal_policy ON public.journals
  FOR UPDATE USING (public.is_journal_owner(id));

-- Journal Members
CREATE POLICY manage_journal_members_policy ON public.journal_members
  USING (public.is_journal_owner(journal_id));

-- Profiles
CREATE POLICY select_own_profile_policy ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY update_own_profile_policy ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Storage objects (journals / profiles)
CREATE POLICY delete_journal_logos_policy ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'journals'
    AND public.is_journal_owner((storage.foldername(name))[1]::uuid)
  );

CREATE POLICY delete_own_avatar_policy ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'profiles'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY insert_journal_logos_policy ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'journals'
    AND public.is_journal_owner((storage.foldername(name))[1]::uuid)
  );

CREATE POLICY insert_own_avatar_policy ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'profiles'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY update_journal_logos_policy ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'journals'
    AND public.is_journal_owner((storage.foldername(name))[1]::uuid)
  );

CREATE POLICY update_own_avatar_policy ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'profiles'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY view_journal_logos_policy ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'journals'
    AND public.is_journal_member((storage.foldername(name))[1]::uuid)
  );

CREATE POLICY view_own_avatar_policy ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'profiles'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-------------------------------------------------------------------------------
-- 9) INSERT INTO storage.buckets
-------------------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('profiles', 'profiles', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml']),
  ('journals', 'journals', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml']);
