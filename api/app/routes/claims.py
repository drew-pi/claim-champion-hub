from fastapi import APIRouter, Query
from app.models.claims import Item
from app.db import supabase

router = APIRouter()

@router.get("/claims")
def get_claim_table():
    response = supabase.table("claims").select("*").execute()
    return response.data

@router.get("/claims/{claim_uuid}")
def get_claim(claim_uuid: str):
    response = supabase.table("claims").select("*").eq("id", claim_uuid).execute()
    return response.data




@router.get("/item/{item}", response_model=Item)
def get_item(item: int):
    return {"id": item, "name": f"Item {item}", "price": 10.99}