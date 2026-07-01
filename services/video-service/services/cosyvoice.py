"""
CosyVoice - 语音合成 TTS 服务
"""

import os
import json
import httpx

API_KEY = os.getenv("DASHSCOPE_API_KEY", "")
BASE_URL = "https://dashscope.aliyuncs.com/api/v1/services/audio"


VOICE_MAP = {
    "male_deep": "longxiaochun",
    "male_young": "longxiaoxia",
    "female_sweet": "longyu",
    "female_gentle": "longxiaoxia_v2",
    "male_calm": "longlaotie",
    "female_bright": "longwusi",
}


async def synthesize_speech(
    text: str,
    voice: str = "female_sweet",
    speed: float = 1.0,
    volume: int = 50,
) -> dict:
    """
    调用 CosyVoice TTS API
    返回: {"audio_url": "...", "duration": ...}
    """
    voice_id = VOICE_MAP.get(voice, VOICE_MAP["female_sweet"])

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": "cosyvoice-v1",
        "input": {"text": text},
        "parameters": {
            "voice": voice_id,
            "format": "mp3",
            "sample_rate": 24000,
            "speech_rate": speed,
            "volume": volume,
        },
    }

    async with httpx.AsyncClient(timeout=60) as client:
        resp = await client.post(
            f"{BASE_URL}/speech-synthesizer/cosyvoice-v1",
            headers=headers,
            json=payload,
        )
        data = resp.json()

    if resp.status_code != 200:
        raise Exception(f"CosyVoice API error: {data.get('message', 'Unknown')}")

    return {
        "audio_url": data["output"]["audio"]["url"],
        "duration": data.get("usage", {}).get("duration", 0),
    }


async def batch_synthesize(lines: list[dict], voice: str = "female_sweet") -> list[dict]:
    """
    批量合成配音
    lines: [{"text": "...", "duration": 5.0}, ...]
    """
    results = []
    for i, line in enumerate(lines):
        try:
            result = await synthesize_speech(line["text"], voice)
            results.append({
                **result,
                "index": i,
                "target_duration": line.get("duration", 5.0),
            })
        except Exception as e:
            results.append({"index": i, "error": str(e)})
    return results
