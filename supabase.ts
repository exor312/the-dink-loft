
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://imteofluibebcrdxnmkl.supabase.co'; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltdGVvZmx1aWJlYmNyZHhubWtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4Mzk3NzIsImV4cCI6MjA4NDQxNTc3Mn0.xRBLVSEn176fmHok2-sCK_t-U-wzdAkeDoWhy3PXCtc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
