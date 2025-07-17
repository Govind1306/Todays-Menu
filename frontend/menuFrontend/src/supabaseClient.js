import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://rowosmwaxnzgwnlugtag.supabase.co"; // from Supabase dashboard
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvd29zbXdheG56Z3dubHVndGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0Nzc3NTIsImV4cCI6MjA2ODA1Mzc1Mn0.OYVJZc8oGmu8P9faSgKZXnvKDyM3sroct-vQABtGPfI"; // from Supabase → Project Settings → API

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
