import { supabase } from "../../config/supabaseClient";

export const getSession = async () => {
    const { data, error } = await supabase.auth.getSession();
  
    if (error) {
      console.error('Error fetching session:', error.message);
      return null;
    }
  
    if (data.session) {
      console.log('Current session:', data.session);
      return data.session;
    } else {
      console.log('No active session found.');
      return null;
    }
};