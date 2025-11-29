-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Model Providers table
CREATE TABLE IF NOT EXISTS model_providers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  api_base_url TEXT,
  api_key_alias TEXT NOT NULL,
  is_shared BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Personas table
CREATE TABLE IF NOT EXISTS personas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  system_prompt TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Arenas table
CREATE TABLE IF NOT EXISTS arenas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Arena Runs table
CREATE TABLE IF NOT EXISTS arena_runs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  arena_id UUID REFERENCES arenas(id) ON DELETE CASCADE NOT NULL,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  input_prompt TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'running', 'completed', 'failed')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Arena Run Participants table
CREATE TABLE IF NOT EXISTS arena_run_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  run_id UUID REFERENCES arena_runs(id) ON DELETE CASCADE NOT NULL,
  provider_id UUID REFERENCES model_providers(id) ON DELETE SET NULL,
  persona_id UUID REFERENCES personas(id) ON DELETE SET NULL,
  role TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Arena Run Rounds table
CREATE TABLE IF NOT EXISTS arena_run_rounds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  run_id UUID REFERENCES arena_runs(id) ON DELETE CASCADE NOT NULL,
  round_number INTEGER NOT NULL,
  phase TEXT CHECK (phase IN ('initial', 'critique', 'defense', 'fusion')) NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Arena Run Messages table
CREATE TABLE IF NOT EXISTS arena_run_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  round_id UUID REFERENCES arena_run_rounds(id) ON DELETE CASCADE NOT NULL,
  participant_id UUID REFERENCES arena_run_participants(id) ON DELETE SET NULL,
  role TEXT CHECK (role IN ('system', 'assistant', 'user', 'critic', 'judge')) NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fused Outputs table
CREATE TABLE IF NOT EXISTS fused_outputs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  run_id UUID REFERENCES arena_runs(id) ON DELETE CASCADE NOT NULL,
  fused_answer TEXT NOT NULL,
  reasoning_summary TEXT,
  export_json JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Model Providers policies
CREATE POLICY "Users can view own providers" ON model_providers
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can view shared providers" ON model_providers
  FOR SELECT USING (is_shared = true);

CREATE POLICY "Users can create providers" ON model_providers
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own providers" ON model_providers
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete own providers" ON model_providers
  FOR DELETE USING (auth.uid() = owner_id);

-- Personas policies
CREATE POLICY "Users can view own personas" ON personas
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can create personas" ON personas
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own personas" ON personas
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete own personas" ON personas
  FOR DELETE USING (auth.uid() = owner_id);

-- Arenas policies
CREATE POLICY "Users can view own arenas" ON arenas
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can create arenas" ON arenas
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own arenas" ON arenas
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete own arenas" ON arenas
  FOR DELETE USING (auth.uid() = owner_id);

-- Arena Runs policies
CREATE POLICY "Users can view own runs" ON arena_runs
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can create runs" ON arena_runs
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own runs" ON arena_runs
  FOR UPDATE USING (auth.uid() = owner_id);

-- Arena Run Participants policies
CREATE POLICY "Users can view participants of own runs" ON arena_run_participants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM arena_runs 
      WHERE arena_runs.id = arena_run_participants.run_id 
      AND arena_runs.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage participants of own runs" ON arena_run_participants
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM arena_runs 
      WHERE arena_runs.id = arena_run_participants.run_id 
      AND arena_runs.owner_id = auth.uid()
    )
  );

-- Arena Run Rounds policies
CREATE POLICY "Users can view rounds of own runs" ON arena_run_rounds
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM arena_runs 
      WHERE arena_runs.id = arena_run_rounds.run_id 
      AND arena_runs.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage rounds of own runs" ON arena_run_rounds
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM arena_runs 
      WHERE arena_runs.id = arena_run_rounds.run_id 
      AND arena_runs.owner_id = auth.uid()
    )
  );

-- Arena Run Messages policies
CREATE POLICY "Users can view messages of own runs" ON arena_run_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM arena_run_rounds atr
      JOIN arena_runs ar ON ar.id = atr.run_id
      WHERE atr.id = arena_run_messages.round_id 
      AND ar.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage messages of own runs" ON arena_run_messages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM arena_run_rounds atr
      JOIN arena_runs ar ON ar.id = atr.run_id
      WHERE atr.id = arena_run_messages.round_id 
      AND ar.owner_id = auth.uid()
    )
  );

-- Fused Outputs policies
CREATE POLICY "Users can view fused outputs of own runs" ON fused_outputs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM arena_runs 
      WHERE arena_runs.id = fused_outputs.run_id 
      AND arena_runs.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage fused outputs of own runs" ON fused_outputs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM arena_runs 
      WHERE arena_runs.id = fused_outputs.run_id 
      AND arena_runs.owner_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_model_providers_owner_id ON model_providers(owner_id);
CREATE INDEX IF NOT EXISTS idx_personas_owner_id ON personas(owner_id);
CREATE INDEX IF NOT EXISTS idx_arenas_owner_id ON arenas(owner_id);
CREATE INDEX IF NOT EXISTS idx_arena_runs_owner_id ON arena_runs(owner_id);
CREATE INDEX IF NOT EXISTS idx_arena_runs_arena_id ON arena_runs(arena_id);
CREATE INDEX IF NOT EXISTS idx_arena_run_participants_run_id ON arena_run_participants(run_id);
CREATE INDEX IF NOT EXISTS idx_arena_run_rounds_run_id ON arena_run_rounds(run_id);
CREATE INDEX IF NOT EXISTS idx_arena_run_messages_round_id ON arena_run_messages(round_id);
CREATE INDEX IF NOT EXISTS idx_fused_outputs_run_id ON fused_outputs(run_id);

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, avatar_url)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call function on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
