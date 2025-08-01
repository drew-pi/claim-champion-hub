from fastapi import APIRouter, HTTPException
from app.models.context import ClaimContextInput
from app.db import supabase

router = APIRouter()


@router.get("/contexts")
def get_contexts_table():
    response = supabase.table("claim_contexts").select("*").execute()
    return response.data

@router.get("/contexts/{claim_uuid}")
def get_context(claim_uuid : str):
    response = supabase.table("claim_contexts").select("*").eq("claim_id", claim_uuid).execute()
    return response.data

@router.post("/contexts/push")
def post_context(data: ClaimContextInput):
    # Check if a context for this claim already exists
    existing = supabase.table("claim_contexts").select("*").eq("claim_id", data.claim_id).execute()
    if existing.data:
        raise HTTPException(status_code=409, detail="Context already exists for this claim")

    # Insert new context
    try:
        insert = supabase.table("claim_contexts").insert({
            "claim_id": data.claim_id,
            "context": data.context
        }).execute()
        return {"message": "Context added", "data": insert.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))