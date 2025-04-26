# Supabase Setup Guide

This guide will help you set up Supabase for the CampusSync application.

## Getting Started

1. Create a Supabase account at [https://supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon/public key from the API settings

## Database Setup

1. Go to the SQL Editor in your Supabase dashboard
2. Copy the contents of the `setup.sql` file in this directory
3. Paste it into the SQL Editor and run it

This will create the following tables:
- `profiles`: User profiles with personal information
- `posts`: User posts/status updates
- `post_tags`: Tags associated with posts
- `likes`: Post likes by users
- `comments`: Comments on posts
- `followers`: User follow relationships

It will also set up:
- Row Level Security (RLS) policies for each table
- Triggers for updating timestamps
- A trigger to automatically create a profile when a user signs up

## Authentication Setup

1. Go to Authentication > Settings in your Supabase dashboard
2. Under "Email Auth", make sure "Enable Email Signup" is turned on
3. Optionally, you can customize the email templates under "Email Templates"

## Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Replace the values with your actual Supabase project URL and anon key.

## Testing

To test that everything is working:

1. Start your development server with `npm run dev`
2. Try to sign up for a new account
3. Check the Supabase dashboard to see if a new user was created in the Auth section
4. Check if a corresponding profile was created in the `profiles` table

## Troubleshooting

If you encounter issues:

1. Check the browser console for error messages
2. Verify that your environment variables are correctly set
3. Make sure the SQL setup script ran successfully
4. Check the Supabase logs for any errors

For more help, refer to the [Supabase documentation](https://supabase.com/docs).