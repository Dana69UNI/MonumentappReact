//Arxiu central que ens connecti amb supabase (més que res per usuaris)
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ndhaolftrgywuzadusxe.supabase.co'
const supabaseKey = import.meta.env.VITE_API_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)