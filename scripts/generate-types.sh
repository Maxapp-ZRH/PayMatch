#!/bin/bash

# PayMatch TypeScript Types Generation Script
# Generates TypeScript types from Supabase database schema

set -e

echo "🚀 Generating TypeScript types from Supabase database..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed. Please install it first:"
    echo "   npm install -g supabase"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "supabase/config.toml" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Generate types from local database
echo "📊 Generating types from local Supabase database..."

# Start Supabase if not running
if ! supabase status &> /dev/null; then
    echo "🔄 Starting Supabase local development environment..."
    supabase start
fi

# Generate types
echo "🔧 Running type generation..."
supabase gen types typescript --local > src/types/database.ts

# Check if generation was successful
if [ $? -eq 0 ]; then
    echo "✅ TypeScript types generated successfully!"
    echo "📁 Types saved to: src/types/database.ts"
    
    # Count lines in generated file
    line_count=$(wc -l < src/types/database.ts)
    echo "📊 Generated $line_count lines of TypeScript types"
    
    # Show file size
    file_size=$(du -h src/types/database.ts | cut -f1)
    echo "💾 File size: $file_size"
    
    echo ""
    echo "🎉 Type generation complete!"
    echo "💡 You can now use these types in your application:"
    echo "   import type { Database } from '@/types/database'"
    echo "   type Invoice = Database['public']['Tables']['invoices']['Row']"
    
else
    echo "❌ Type generation failed!"
    echo "🔍 Please check your Supabase configuration and try again"
    exit 1
fi
