# 🔧 GauntletFuse Database Setup Instructions

## Current Status
- ✅ **App Running**: http://localhost:3000
- ✅ **Code Ready**: All database services implemented
- ⚠️ **Database Setup**: Schema needs to be applied to Supabase

## 🎯 Quick Setup Options

### Option 1: Supabase Dashboard (Recommended)
1. Go to [supabase.com](https://supabase.com/dashboard)
2. Sign in and navigate to your project: `jkoqrwobfzysfwfvobup`
3. Go to **SQL Editor**
4. Copy and paste the contents of `supabase-schema.sql`
5. Click **Run** to execute the schema

### Option 2: Supabase CLI (Advanced)
```bash
# Install Supabase CLI
npm install -g @supabase/cli

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref jkoqrwobfzysfwfvobup

# Apply the schema
supabase db push
```

### Option 3: Direct PostgreSQL Connection
```bash
# Using psql with connection string
psql "postgresql://postgres:[password]@db.jkoqrwobfzysfwfvobup.supabase.co:5432/postgres" -f supabase-schema.sql
```

## 📋 What the Schema Creates

The `supabase-schema.sql` file will create:

### **Tables**
- `profiles` - User profiles linked to auth.users
- `model_providers` - AI provider configurations
- `personas` - Debate persona definitions  
- `arenas` - Arena configurations
- `arena_runs` - Individual debate runs
- `arena_run_participants` - Run participants
- `arena_run_rounds` - Structured debate rounds
- `arena_run_messages` - Individual messages
- `fused_outputs` - Final fused answers

### **Security**
- Row Level Security (RLS) enabled on all tables
- User-based data access policies
- Secure API key handling

### **Performance**
- Database indexes on foreign keys
- Optimized query patterns

## 🚀 After Setup

Once the schema is applied:
1. **Test Providers**: Visit http://localhost:3000/providers
2. **Test Personas**: Visit http://localhost:3000/personas  
3. **Test Dashboard**: Visit http://localhost:3000/dashboard
4. **Build Arena**: Visit http://localhost:3000/arenas/build

## 🔍 Verification

You should see:
- ✅ No more "table not found" errors
- ✅ Providers and personas loading (empty initially)
- ✅ Ability to create new providers/personas
- ✅ Dashboard showing runs (empty initially)

## 🆘 Troubleshooting

### Error: "relation does not exist"
- ✅ Schema hasn't been applied yet
- **Solution**: Apply `supabase-schema.sql` in Supabase dashboard

### Error: "JWT failed verification" 
- ✅ Normal when trying API calls without authentication
- **Solution**: This is expected - the app handles this gracefully

### Error: "permission denied"
- ✅ RLS policies working correctly
- **Solution**: Create a user account or adjust RLS policies

## 📞 Need Help?

The database setup is the final step to make your app fully functional. All the code is ready - we just need to create the database tables!

Choose Option 1 (Supabase Dashboard) for the quickest setup.
