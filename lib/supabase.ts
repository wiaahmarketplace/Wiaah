import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Category = {
  id: string;
  name: string;
  slug: string;
  icon_url: string | null;
  created_at: string;
};

export type Image = {
  id: string;
  title: string;
  image_url: string;
  description: string | null;
  category_id: string | null;
  user_id: string | null;
  views: number;
  created_at: string;
};
