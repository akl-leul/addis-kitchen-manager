// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://kuddmuijxhjgcaulmcgf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1ZGRtdWlqeGhqZ2NhdWxtY2dmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0NTQ1ODQsImV4cCI6MjA2NTAzMDU4NH0.orVusNr_VvwYlhw6JVVVBjFM7WenbtT9Rbr-YgksAps";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);