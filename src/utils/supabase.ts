import { createClient } from '@supabase/supabase-js';

// IMPORTANT: Assumes these values are the public URL and Anon Key for Supabase.
// These are hardcoded as frontend code cannot access secrets or environment variables.
// Replace with your actual Supabase URL and Anon Key if different.
const supabaseUrl = 'YOUR_SUPABASE_URL'; // Placeholder - Will replace with actual value
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'; // Placeholder - Will replace with actual value

if (supabaseUrl === 'YOUR_SUPABASE_URL' || supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY') {
  console.warn('Supabase client is not configured. Please replace placeholders in ui/src/utils/supabase.ts');
  // Optionally throw an error or provide a dummy client to prevent crashes
  // throw new Error("Supabase client is not configured.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Example usage for realtime subscription (will be used in components):
/*
useEffect(() => {
  const channel = supabase
    .channel('any_channel_name')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'your_table' }, (payload) => {
      console.log('Change received!', payload);
      // Trigger data refresh here
    })
    .subscribe();

  // Cleanup subscription on unmount
  return () => {
    supabase.removeChannel(channel);
  };
}, []);
*/
