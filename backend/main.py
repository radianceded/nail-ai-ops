from pathlib import Path
import json

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Nail AI Ops Backend",
    description="Backend API for nail AI try-on and merchant operations MVP.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent
DATA_DIR = PROJECT_ROOT / "data"


def load_json(filename: str):
    file_path = DATA_DIR / filename

    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail=f"Data file not found: {filename}",
        )

    try:
        with file_path.open("r", encoding="utf-8") as f:
            return json.load(f)
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail=f"Invalid JSON file: {filename}",
        )

class CopyRequest(BaseModel):
    goal: str

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "nail-ai-ops-backend",
        "version": "0.1.0",
    }


@app.get("/api/styles")
def get_styles():
    data = load_json("nail_styles.json")

    if isinstance(data, dict) and "styles" in data:
        styles = data["styles"]
    elif isinstance(data, list):
        styles = data
    else:
        raise HTTPException(
            status_code=500,
            detail="Unexpected nail_styles.json structure",
        )

    return {
        "count": len(styles),
        "styles": styles,
    }


@app.get("/api/analysis")
def get_analysis():
    return load_json("mock_analysis.json")


@app.get("/api/goals")
def get_goals():
    return load_json("merchant_goals.json")


@app.get("/api/tag-system")
def get_tag_system():
    return load_json("tag_system.json")


@app.get("/api/recommendation-rules")
def get_recommendation_rules():
    return load_json("recommendation_rules.json")
@app.post("/api/generate-copy")
def generate_copy(request: CopyRequest):
    goal = request.goal

    mock_copy_map = {
        "increase_booking_conversion": {
            "xiaohongshu": "最近店里超火的通勤系裸粉法式来了，上手显白又百搭，学生党和上班族都很适合。",
            "moments": "本周主推通勤显白款，低调耐看，欢迎来店咨询。",
            "poster": "通勤百搭款 · 显白不挑手",
        },
        "promote_high_margin_styles": {
            "xiaohongshu": "高级感猫眼和渐变系列最近真的很出片，约会、聚会氛围感直接拉满。",
            "moments": "高质感猫眼系列上线，精致感直接提升。",
            "poster": "高质感猫眼系列 · 氛围感拉满",
        },
        "improve_repeat_purchase": {
            "xiaohongshu": "夏季轻透系列上新，适合长期做美甲用户，清爽又耐看。",
            "moments": "夏季轻透系列更新，欢迎老顾客返店体验。",
            "poster": "夏季轻透系列 · 清爽耐看",
        },
        "student_demo_goal": {
            "xiaohongshu": "学生党友好款推荐，自然不夸张，上课通勤都适合。",
            "moments": "学生党自然系美甲，本周热门。",
            "poster": "学生党自然款 · 清爽百搭",
        },
    }

    result = mock_copy_map.get(goal)

    if not result:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported goal: {goal}",
        )

    return {
        "goal": goal,
        "copy": result,
    }