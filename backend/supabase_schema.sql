-- 在 Supabase 的 SQL Editor 執行以下語句來建立 users 資料表

CREATE TABLE public.users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  avatar text DEFAULT 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png',
  status text DEFAULT 'Online',
  is_online boolean DEFAULT true
);

-- 若您未來希望保護這張表，可以加上 RLS (Row Level Security)
-- 由於我們是在後端透過 Service Role / Anon Key 直接控制，簡單建表即可。
