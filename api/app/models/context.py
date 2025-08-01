from pydantic import BaseModel

class ClaimContextInput(BaseModel):
    claim_id: str
    context: str