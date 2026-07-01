"""
图片生成路由
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from services import wanxiang

router = APIRouter()


class GenerateImageRequest(BaseModel):
    prompt: str
    negative_prompt: str = ""
    size: str = "1024*1024"
    n: int = 1


class BatchGenerateRequest(BaseModel):
    prompts: list[str]
    size: str = "1024*1024"


@router.post("/generate-image")
async def generate_image(req: GenerateImageRequest):
    """异步生成单张图片"""
    try:
        result = await wanxiang.generate_image(
            prompt=req.prompt,
            negative_prompt=req.negative_prompt,
            size=req.size,
            n=req.n,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/batch-generate")
async def batch_generate(req: BatchGenerateRequest):
    """批量生成分镜图片"""
    task_ids = []
    for prompt in req.prompts:
        try:
            result = await wanxiang.generate_image(prompt=prompt, size=req.size)
            task_ids.append({"prompt": prompt[:50], "task_id": result["task_id"]})
        except Exception as e:
            task_ids.append({"prompt": prompt[:50], "error": str(e)})
    return {"tasks": task_ids, "total": len(req.prompts)}


@router.get("/task/{task_id}")
async def get_task(task_id: str):
    """查询异步任务状态"""
    result = await wanxiang.get_task_result(task_id)
    if result is None:
        return {"task_id": task_id, "status": "PENDING"}
    return result
