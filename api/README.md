## API routes

### claims

`GET /claims` is the endpoint to get all claims in the database

`GET /claims/{claim_id}` using unique claim id fetch all info on the claim

### contexts

`GET /contexts` get all contexts in the database (all rows)

`GET /contexts/{claim_id}` get a context based on its unique claim id

`POST /contexts/push` push a new context into the database

- input must be a json with the following string fields
  ```
  class ClaimContextInput(BaseModel):
      claim_id: str
      context: str
  ```

### workflows

`GET /workflows` get all workflows in the database (all rows)

`GET /workflows/{claim_id}` get a workflow based on its unique claim id

`POST /workflows/push` push a new workflow into the database

- input must be a json with the following string fields
  ```
  class WorkflowInput(BaseModel):
      claim_id: str
      context: str
      analysis: str
      markdown: str
  ```
