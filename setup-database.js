#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration - Load from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL');
  console.error('   SUPABASE_SERVICE_ROLE_KEY');
  console.error('Please set these in your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  try {
    console.log('🚀 Setting up GauntletFuse database...');
    
    // Read and execute the SQL schema
    const fs = require('fs');
    const path = require('path');
    
    const schemaPath = path.join(__dirname, 'supabase-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split the schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);
      
      try {
        const { data, error } = await supabase.rpc('exec_sql', { 
          query: statement + ';' 
        });
        
        if (error && !error.message.includes('already exists')) {
          console.error(`❌ Error in statement ${i + 1}:`, error.message);
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`);
        }
      } catch (err) {
        if (err.message.includes('already exists')) {
          console.log(`✅ Statement ${i + 1} - Object already exists (OK)`);
        } else {
          console.error(`❌ Error in statement ${i + 1}:`, err.message);
        }
      }
    }
    
    console.log('🎉 Database setup completed!');
    console.log('📊 You can now test the app at http://localhost:3000');
    
  } catch (error) {
    console.error('💥 Setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();
