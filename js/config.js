// Database Client Configuration Engine
const SUPABASE_URL = "https://qzqbzhzlurticorzpotw.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6cWJ6aHpsdXJ0aWNvcnpwb3R3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMwMDAzMzcsImV4cCI6MjA5ODU3NjMzN30.TP5yJemsMUoJYivTr79UXSgQJAbFDFf1gv5vQcyR5Mg";

// Exported standard connection object
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);