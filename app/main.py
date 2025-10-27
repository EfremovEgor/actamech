from typing import Union

from fastapi import FastAPI
import uvicorn

from app.api.v1 import api_router as api_v1_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
        CORSMiddleware,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        allow_origins=["*"]
    )

app.include_router(api_v1_router,prefix="/api/v1")

if __name__ == '__main__':
    uvicorn.run("app.main:app", port=8080, host='0.0.0.0', reload=True)
