import { createClient } from "@supabase/supabase-js"

const supabaseURL = "https://wcqrhjburxsuaxfoltxk.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjcXJoamJ1cnhzdWF4Zm9sdHhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2MTY3OTUsImV4cCI6MjA1OTE5Mjc5NX0.XKMWi2y7DBKvWQg2Gb9qW32mSKcoUtk89SjmSYSLpCY"/* import.meta.env.VITE_SUPABASE_ANON_KEY as string; */

export const supabase = createClient(supabaseURL, supabaseAnonKey);