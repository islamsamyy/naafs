-- Allow users to update their own profile
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Allow users to read all profiles (public)
DROP POLICY IF EXISTS "Public profiles readable" ON profiles;

CREATE POLICY "Public profiles readable"
  ON profiles
  FOR SELECT
  USING (true);

-- Allow users to insert their own profile (during signup)
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);
