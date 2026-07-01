"""
TTS 语音合成路由
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from services import cosyvoice

router = APIRouter()


class TTSRequest(BaseModel):
    text: str
    voice: str = "female_sweet"
    speed: float = 1.0
    volume: int = 50


class BatchTTSRequest(BaseModel):
    lines: list[dict]
    voice: str = "female_sweet"


@router.post("/tts")
async def synthesize(req: TTSRequest):
    """合成单段配音"""
    try:
        result = await cosyvoice.synthesize_speech(
            text=req.text,
            voice=req.voice,
            speed=req.speed,
            volume=req.volume,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/tts/batch")
async def batch_synthesize(req: BatchTTSRequest):
    """批量合成配音"""
    results = await cosyvoice.batch_synthesize(req.lines, req.voice)
    return {"results": results}
