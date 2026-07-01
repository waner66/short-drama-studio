"""
短剧工坊 - 视频生成服务
FastAPI + 通义万相 + CosyVoice + FFmpeg
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from routers import generation, tts, compose

app = FastAPI(title="Short Drama Video Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(generation.router, prefix="/api/video", tags=["generation"])
app.include_router(tts.router, prefix="/api/video", tags=["tts"])
app.include_router(compose.router, prefix="/api/video", tags=["compose"])


@app.get("/api/video/health")
async def health_check():
    return {"status": "ok", "service": "video-service"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
