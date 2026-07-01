"""
FFmpeg - 视频合成服务
将图片序列 + 配音 + 字幕合成为视频
"""

import os
import subprocess
import tempfile
import json
from pathlib import Path
from typing import Optional

OUTPUT_DIR = Path(os.getenv("OUTPUT_DIR", "/app/output"))
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def compose_video(
    images: list[str],
    audio_urls: list[str],
    subtitles: list[dict],
    output_name: str = "output",
    width: int = 1080,
    height: int = 1920,
    fps: int = 24,
    bgm_url: Optional[str] = None,
) -> str:
    """
    合成视频
    
    Args:
        images: 分镜图片文件路径列表
        audio_urls: 配音文件路径列表 (与 images 一一对应)
        subtitles: 字幕列表 [{"text": "...", "start": 0, "end": 5}, ...]
        output_name: 输出文件名
        width, height: 视频分辨率
        fps: 帧率
        bgm_url: 背景音乐文件路径
    
    Returns:
        输出文件路径
    """
    output_path = OUTPUT_DIR / f"{output_name}.mp4"
    
    if len(images) != len(audio_urls):
        raise ValueError("images and audio_urls must have same length")

    # 1. 生成图片序列输入文件
    input_file = tempfile.NamedTemporaryFile(suffix=".txt", delete=False, mode="w")
    durations = [subtitles[i]["end"] - subtitles[i]["start"] for i in range(len(images))]
    
    for i, img in enumerate(images):
        dur = durations[i]
        input_file.write(f"file '{img}'\n")
        input_file.write(f"duration {dur}\n")
    input_file.write(f"file '{images[-1]}'\n")  # last frame
    input_file.close()

    # 2. 生成字幕文件 (ASS格式)
    ass_path = tempfile.NamedTemporaryFile(suffix=".ass", delete=False, mode="w")
    _generate_ass(ass_path, subtitles, width, height)
    ass_path.close()

    # 3. 合成音频：拼接配音
    audio_filter = _build_audio_filter(audio_urls, durations, bgm_url)

    # 4. FFmpeg 命令
    cmd = [
        "ffmpeg", "-y",
        "-f", "concat", "-safe", "0", "-i", input_file.name,
        "-f", "lavfi", "-i", f"color=c=black:s={width}x{height}:d={sum(durations)}",
        "-filter_complex",
        ";".join([
            # 图片缩放适配
            f"[0:v]scale={width}:{height}:force_original_aspect_ratio=decrease,pad={width}:{height}:(ow-iw)/2:(oh-ih)/2,setsar=1[v]",
            # 背景
            f"[1:v]setsar=1[bg]",
            # 叠加图片到背景
            f"[bg][v]overlay=(W-w)/2:(H-h)/2[outv]",
        ]),
        "-map", "[outv]",
        *audio_filter,
        "-c:v", "libx264", "-preset", "fast", "-crf", "23",
        "-c:a", "aac", "-b:a", "128k",
        "-pix_fmt", "yuv420p",
        "-r", str(fps),
        "-shortest",
        str(output_path),
    ]

    subprocess.run(cmd, check=True, capture_output=True)

    # 5. 烧录字幕
    burned_path = OUTPUT_DIR / f"{output_name}_subtitled.mp4"
    sub_cmd = [
        "ffmpeg", "-y",
        "-i", str(output_path),
        "-vf", f"ass={ass_path.name}",
        "-c:a", "copy",
        str(burned_path),
    ]
    subprocess.run(sub_cmd, check=True, capture_output=True)

    # 清理临时文件
    os.unlink(input_file.name)
    os.unlink(ass_path.name)

    return str(burned_path)


def _build_audio_filter(audio_urls: list[str], durations: list[float], bgm: Optional[str]) -> list[str]:
    """构建音频滤镜"""
    inputs = []
    filter_parts = []

    # 拼接配音
    for i, audio in enumerate(audio_urls):
        inputs.extend(["-i", audio])
        filter_parts.append(f"[{i + 2}:a]atrim=duration={durations[i]}[a{i}]")

    # 拼接所有配音段
    concat_inputs = "".join(f"[a{i}]" for i in range(len(audio_urls)))
    filter_parts.append(f"{concat_inputs}concat=n={len(audio_urls)}:v=0:a=1[voice]")

    # 混合背景音乐
    if bgm:
        inputs.extend(["-i", bgm])
        bgm_idx = len(audio_urls) + 2
        filter_parts.append(f"[{bgm_idx}:a]volume=0.3[bgm_vol]")
        filter_parts.append("[voice][bgm_vol]amix=inputs=2:duration=first[outa]")
        map_audio = ["-map", "[outa]"]
    else:
        map_audio = ["-map", "[voice]"]

    return inputs + ["-filter_complex", ";".join(filter_parts)] + map_audio


def _generate_ass(file, subtitles: list[dict], width: int, height: int):
    """生成 ASS 字幕文件"""
    font_size = int(height * 0.04)
    file.write(f"""[Script Info]
Title: Short Drama Subtitles
ScriptType: v4.00+
PlayResX: {width}
PlayResY: {height}

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Noto Sans SC,{font_size},&H00FFFFFF,&H000000FF,&H00000000,&H80000000,0,0,0,0,100,100,0,0,0,3,{int(font_size * 0.3)},2,{int(height * 0.08)},{int(width * 0.05)},{int(width * 0.05)},{int(height * 0.06)},1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
""")

    for sub in subtitles:
        start = _format_time(sub["start"])
        end = _format_time(sub["end"])
        text = sub["text"].replace("\n", "\\N")
        file.write(f"Dialogue: 0,{start},{end},Default,,0,0,0,,{text}\n")


def _format_time(seconds: float) -> str:
    """秒转 ASS 时间格式 H:MM:SS.cc"""
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = seconds % 60
    return f"{h}:{m:02d}:{s:05.2f}"
