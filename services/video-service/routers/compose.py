"""
视频合成路由
"""

import httpx
from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import Optional
from services import ffmpeg

router = APIRouter()

# 简单内存任务状态存储 (生产环境应使用 Redis)
task_store: dict[str, dict] = {}


class ComposeRequest(BaseModel):
    images: list[str]   # 图片URL列表
    audios: list[str]   # 音频URL列表
    subtitles: list[dict]  # [{"text": "", "start": 0, "end": 5}, ...]
    output_name: str = "output"
    width: int = 1080
    height: int = 1920
    fps: int = 24
    bgm_url: Optional[str] = None


@router.post("/compose")
async def compose_video(req: ComposeRequest, background_tasks: BackgroundTasks):
    """合成视频 (异步执行)"""
    import time
    import uuid

    task_id = f"compose_{int(time.time())}_{uuid.uuid4().hex[:6]}"
    task_store[task_id] = {"status": "PENDING", "progress": 0}

    background_tasks.add_task(
        _run_compose,
        task_id,
        req.images,
        req.audios,
        req.subtitles,
        req.output_name,
        req.width,
        req.height,
        req.fps,
        req.bgm_url,
    )

    return {"task_id": task_id, "status": "PENDING"}


async def _run_compose(task_id, images, audios, subtitles, name, w, h, fps, bgm):
    """后台合成任务"""
    import asyncio

    try:
        task_store[task_id]["status"] = "DOWNLOADING"
        task_store[task_id]["progress"] = 10

        # 下载图片和音频到本地
        img_paths = await _download_files(images, "images")
        task_store[task_id]["progress"] = 30

        audio_paths = await _download_files(audios, "audio")
        task_store[task_id]["progress"] = 50

        task_store[task_id]["status"] = "COMPOSING"
        task_store[task_id]["progress"] = 60

        # 合成视频
        output = await asyncio.to_thread(
            ffmpeg.compose_video,
            img_paths, audio_paths, subtitles, name, w, h, fps,
            bgm,
        )
        task_store[task_id]["status"] = "SUCCEEDED"
        task_store[task_id]["progress"] = 100
        task_store[task_id]["output"] = output

    except Exception as e:
        task_store[task_id]["status"] = "FAILED"
        task_store[task_id]["error"] = str(e)


async def _download_files(urls: list[str], prefix: str) -> list[str]:
    """下载文件到临时目录"""
    import tempfile
    import os

    tmpdir = tempfile.mkdtemp(prefix=prefix)
    paths = []

    async with httpx.AsyncClient(timeout=120) as client:
        for i, url in enumerate(urls):
            try:
                ext = url.split("?")[0].split(".")[-1] or "jpg"
                fpath = os.path.join(tmpdir, f"{i:04d}.{ext}")
                resp = await client.get(url)
                with open(fpath, "wb") as f:
                    f.write(resp.content)
                paths.append(fpath)
            except Exception:
                paths.append("")

    return paths


@router.get("/compose/{task_id}")
async def get_compose_status(task_id: str):
    """查询合成任务状态"""
    if task_id not in task_store:
        raise HTTPException(status_code=404, detail="Task not found")
    return task_store[task_id]
