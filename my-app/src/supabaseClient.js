import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://fhxfnaaajsnlvxejrwwt.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZoeGZuYWFhanNubHZ4ZWpyd3d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5MDE4MjMsImV4cCI6MjA1NzQ3NzgyM30.j0pLTouiR_nyuD1mXCLJRqZFUpHNYWU7BUa4sdCzgwg";  // Replace with Service Role Key from Supabase settings
export const supabase = createClient(supabaseUrl, supabaseKey);
