
import { createClient } from '@supabase/supabase-js';

/**
 * ⚠️ CRITICAL CONFIGURATION ERROR ⚠️
 * 
 * Your current key 'sb_publishable_...' is a STRIPE KEY. 
 * IT WILL NOT WORK WITH SUPABASE.
 * 
 * TO FIX:
 * 1. Go to your Supabase Dashboard -> Project Settings -> API.
 * 2. Copy the 'anon' public key (starts with 'eyJ...').
 * 3. Replace the string below.
 */

const supabaseUrl = 'https://imteofluibebcrdxnmkl.supabase.co'; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltdGVvZmx1aWJlYmNyZHhubWtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4Mzk3NzIsImV4cCI6MjA4NDQxNTc3Mn0.xRBLVSEn176fmHok2-sCK_t-U-wzdAkeDoWhy3PXCtc'; // <--- CHANGE THIS TO YOUR SUPABASE ANON KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
