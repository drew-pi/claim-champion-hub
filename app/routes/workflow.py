from fastapi import APIRouter, HTTPException
from app.models.workflow import WorkflowInput
from app.db import supabase

router = APIRouter()

table_name = 'workflow'

@router.get("/workflows")
def get_workflow_table():
    response = supabase.table(table_name).select("*").execute()
    return response.data

@router.get("/workflows/{claim_uuid}")
def get_workflow(claim_uuid : str):
    response = supabase.table(table_name).select("*").eq("claim_id", claim_uuid).execute()
    return response.data

@router.post("/workflows/push")
def post_context(data: WorkflowInput):
    # Check if a context for this claim already exists
    existing = supabase.table(table_name).select("*").eq("claim_id", data.claim_id).execute()
    if existing.data:
        raise HTTPException(status_code=409, detail="Context already exists for this claim")

    # Insert new context
    try:
        insert = supabase.table(table_name).insert({
            "claim_id": data.claim_id,
            "context": data.context,
            "analysis": data.analysis,
            "markdown": data.markdown,
        }).execute()
        return {"message": "Context added", "data": insert.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))