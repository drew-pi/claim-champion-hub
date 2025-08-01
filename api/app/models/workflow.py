from pydantic import BaseModel

class WorkflowInput(BaseModel):
    claim_id: str
    context: str
    analysis: str
    markdown: str