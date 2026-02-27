"""
Supabase client configuration.
Loads environment variables and initialises the Supabase client
used by every route handler.
"""

import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")

# Public client (uses anon key – respects RLS)
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Admin client (uses service-role key – bypasses RLS)
supabase_admin: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
