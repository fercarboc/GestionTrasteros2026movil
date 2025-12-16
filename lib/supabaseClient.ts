import { createClient } from '@supabase/supabase-js';

// Environment variables should be in a .env file in production
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL ||  'https://ewqnrcnsqtzkfavojeon.supabase.co';
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3cW5yY25zcXR6a2Zhdm9qZW9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwODA4NTksImV4cCI6MjA3NzY1Njg1OX0._A6uFllr5wzeVJoN7fVp7QRwj7rywDfFntL8BpUhF_s';


export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);