import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL and Anon Key must be provided in your .env file to connect.')
}

// Create a single supabase client for interacting with your database
const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder')

// Attach it to the window object so your existing Vanilla JS (app.js) can use it without needing to be converted to ES modules
window.supabaseClient = supabase;
console.log('Supabase client initialized');
