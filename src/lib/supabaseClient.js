import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qyhwqvlayrrifxvfdnkm.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5aHdxdmxheXJyaWZ4dmZkbmttIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODA4MzE3NDcsImV4cCI6MTk5NjQwNzc0N30.f2sZdvNzXq2IL-BVU1z11IjYwcNK0BAk0zYh9zoGUH8";
export const supabase = createClient(supabaseUrl, supabaseKey);
