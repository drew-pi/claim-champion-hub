from fastapi import FastAPI
from app.routes import claims, context, workflow

app = FastAPI()

app.include_router(claims.router)
app.include_router(context.router)
app.include_router(workflow.router)

