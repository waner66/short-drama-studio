"""
通义万相 - AI 图片生成服务
"""

import os
import time
import json
import httpx
from typing import Optional

API_KEY = os.getenv("DASHSCOPE_API_KEY", "")
BASE_URL = "https://dashscope.aliyuncs.com/api/v1/services/aigc"


async def generate_image(prompt: str, negative_prompt: str = "", size: str = "1024*1024", n: int = 1) -> dict:
    """
    调用通义万相文生图 API
    返回: {"task_id": "...", "status": "PENDING"}
    """
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
        "X-DashScope-Async": "enable",
    }
    payload = {
        "model": "wanx2.0-t2i-turbo",
        "input": {
            "prompt": prompt,
            "negative_prompt": negative_prompt or "低质量, 模糊, 变形, 丑陋",
        },
        "parameters": {
            "size": size,
            "n": n,
        },
    }

    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(
            f"{BASE_URL}/text2image/generation",
            headers=headers,
            json=payload,
        )
        data = resp.json()

    if resp.status_code != 200:
        raise Exception(f"Wanxiang API error: {data.get('message', 'Unknown')}")

    return {
        "task_id": data["output"]["task_id"],
        "status": data["output"]["task_status"],
    }


async def get_task_result(task_id: str) -> Optional[dict]:
    """查询异步任务结果"""
    headers = {"Authorization": f"Bearer {API_KEY}"}

    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.get(
            f"{BASE_URL}/text2image/generation/{task_id}",
            headers=headers,
        )
        data = resp.json()

    status = data["output"]["task_status"]
    if status == "SUCCEEDED":
        return {
            "status": "SUCCEEDED",
            "images": [
                {"url": img["url"]} for img in data["output"]["results"]
            ],
        }
    elif status == "FAILED":
        return {"status": "FAILED", "message": data.get("message", "Unknown")}
    return None  # still processing


async def poll_until_complete(task_id: str, max_wait: int = 120, interval: int = 3) -> dict:
    """轮询直到任务完成"""
    elapsed = 0
    while elapsed < max_wait:
        await asyncio_sleep(interval)
        result = await get_task_result(task_id)
        if result:
            return result
        elapsed += interval
    
    raise TimeoutError(f"Task {task_id} timed out after {max_wait}s")


import asyncio as _asyncio

def asyncio_sleep(seconds: float):
    return _asyncio.sleep(seconds)
