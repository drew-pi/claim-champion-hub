import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

assert SUPABASE_URL is not None, "SUPABASE_URL not set in environment"
assert SUPABASE_KEY is not None, "SUPABASE_KEY not set in environment"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)