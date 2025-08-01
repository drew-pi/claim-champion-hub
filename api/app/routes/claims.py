from fastapi import APIRouter, Query, HTTPException
from app.models.claims import Item
from app.db import supabase

router = APIRouter()

@router.get("/claims")
def get_claim_table():
    response = supabase.table("claims").select("*").execute()
    return response.data

@router.get("/claims/latest")
def get_latest_claim():
    """Get the most recently created claim"""
    try:
        response = supabase.table("claims").select("*").order("created_at", desc=True).limit(1).execute()
        
        if response.data and len(response.data) > 0:
            return response.data[0]  # Return single claim object, not array
        else:
            raise HTTPException(status_code=404, detail="No claims found in database")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch latest claim: {str(e)}")

@router.get("/claims/recent/{count}")
def get_recent_claims(count: int = 5):
    """Get the N most recent claims"""
    try:
        if count > 100:  # Prevent abuse
            count = 100
            
        response = supabase.table("claims").select("*").order("created_at", desc=True).limit(count).execute()
        return response.data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch recent claims: {str(e)}")

@router.get("/claims/{claim_uuid}")
def get_claim(claim_uuid: str):
    response = supabase.table("claims").select("*").eq("id", claim_uuid).execute()
    return response.data

@router.get("/item/{item}", response_model=Item)
def get_item(item: int):
    return {"id": item, "name": f"Item {item}", "price": 10.99}
