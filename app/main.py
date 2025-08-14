from typing import Union

from fastapi import FastAPI

from app.api.v1 import api_router as api_v1_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
        CORSMiddleware,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(api_v1_router,prefix="/api/v1")
