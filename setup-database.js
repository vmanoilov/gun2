#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://jkoqrwobfzysfwfvobup.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imprb3Fyd29iZnp5c2Z3ZnZvYnVwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDQzMzU4NiwiZXhwIjoyMDgwMDA5NTg2fQ.P1D8BRQ4-xuZeN6QcMEmd_qDrmaaubqjAzV6tfKduaM';

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
