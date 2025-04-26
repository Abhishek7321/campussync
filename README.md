# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/478fea3c-2858-4c23-9a0d-58d346e44590

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/478fea3c-2858-4c23-9a0d-58d346e44590) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (Authentication and Database)

## Supabase Integration

This project uses Supabase for authentication and database functionality. To set up Supabase:

1. Create a new Supabase project at [https://app.supabase.io](https://app.supabase.io)
2. Set up the database schema:
   - Go to the SQL Editor in your Supabase project
   - Copy the contents of the `supabase/setup.sql` file
   - Paste it into the SQL Editor and run it
3. Copy `.env.local.example` to `.env.local` and update with your Supabase credentials:
   - `VITE_SUPABASE_URL`: Your Supabase project URL (e.g., https://your-project-id.supabase.co)
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase project anon/public key
4. Restart the development server

For detailed instructions, see the [Supabase setup guide](./supabase/README.md).

### Database Schema

The application uses the following tables:

- `profiles`: User profiles with personal information
- `posts`: User posts/status updates
- `post_tags`: Tags associated with posts
- `likes`: Post likes by users
- `comments`: Comments on posts
- `followers`: User follow relationships

### Troubleshooting

If you encounter issues with account creation:

1. Make sure you've run the SQL setup script in the Supabase SQL Editor
2. Check that your Supabase credentials are correctly set in `.env.local`
3. Look for error messages in the browser console for more details

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/478fea3c-2858-4c23-9a0d-58d346e44590) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
