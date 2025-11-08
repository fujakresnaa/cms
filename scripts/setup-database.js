const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupDatabase() {
  console.log('Setting up database tables...')

  try {
    // Check if contact_messages table exists
    const { data: contactTable, error: contactError } = await supabase
      .from('contact_messages')
      .select('*')
      .limit(1)

    if (contactError && contactError.code === 'PGRST116') {
      console.log('contact_messages table does not exist. Please run the SQL setup script in Supabase.')
    } else {
      console.log('✓ contact_messages table exists')
    }

    // Check if cms_hero table exists
    const { data: heroTable, error: heroError } = await supabase
      .from('cms_hero')
      .select('*')
      .limit(1)

    if (heroError && heroError.code === 'PGRST116') {
      console.log('cms_hero table does not exist. Please run the SQL setup script in Supabase.')
    } else {
      console.log('✓ cms_hero table exists')
    }

    // Check if cms_contact table exists
    const { data: cmsContactTable, error: cmsContactError } = await supabase
      .from('cms_contact')
      .select('*')
      .limit(1)

    if (cmsContactError && cmsContactError.code === 'PGRST116') {
      console.log('cms_contact table does not exist. Please run the SQL setup script in Supabase.')
    } else {
      console.log('✓ cms_contact table exists')
    }

    console.log('\nDatabase setup check completed!')
    console.log('\nIf any tables are missing, please:')
    console.log('1. Go to your Supabase dashboard')
    console.log('2. Navigate to SQL Editor')
    console.log('3. Run the SQL script from scripts/setup-database.sql')

  } catch (error) {
    console.error('Error checking database:', error)
  }
}

setupDatabase()