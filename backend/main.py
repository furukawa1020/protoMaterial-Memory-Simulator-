"""
FastAPI メインアプリケーション
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Literal, List
import numpy as np

from models.material import get_material, MATERIAL_PRESETS
from models.stimulus import generate_stimulus, StimulusType
from simulation.engine import DelaySimulator, analyze_memory, calculate_mutual_information


app = FastAPI(
    title="Material Memory Simulator API",
    description="自然素材の非線形遅延特性シミュレーション",
    version="1.0.0"
)

# CORS設定（フロントエンドからのアクセスを許可）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# リクエスト・レスポンスモデル
class SimulationRequest(BaseModel):
    material_type: Literal["wood", "metal", "cloth", "soil", "water"]
    stimulus_type: StimulusType
    duration: float = 10.0
    intensity: float = 1.0
    frequency: float = 1.0
    dt: float = 0.01


class SimulationResponse(BaseModel):
    time: List[float]
    stimulus: List[float]
    response: List[float]
    internal_states: List[List[float]]
    analysis: dict


class MaterialInfo(BaseModel):
    name: str
    tau_list: List[float]
    k_list: List[float]
    w_list: List[float]


@app.get("/")
async def root():
    """ヘルスチェック"""
    return {
        "status": "ok",
        "message": "Material Memory Simulator API",
        "version": "1.0.0"
    }


@app.get("/materials")
async def get_materials():
    """利用可能な素材一覧を取得"""
    materials = {}
    for key, model in MATERIAL_PRESETS.items():
        materials[key] = MaterialInfo(
            name=model.name,
            tau_list=model.tau_list.tolist(),
            k_list=model.k_list.tolist(),
            w_list=model.w_list.tolist()
        )
    return materials


@app.post("/simulate", response_model=SimulationResponse)
async def simulate(request: SimulationRequest):
    """
    シミュレーション実行
    """
    try:
        # 素材モデル取得
        material = get_material(request.material_type)
        
        # 刺激生成
        t, u = generate_stimulus(
            stimulus_type=request.stimulus_type,
            duration=request.duration,
            intensity=request.intensity,
            frequency=request.frequency,
            dt=request.dt
        )
        
        # シミュレーション実行
        simulator = DelaySimulator(material, dt=request.dt)
        y, x_states = simulator.simulate(t, u)
        
        # 記憶解析
        analysis = analyze_memory(t, y)
        
        # 相互情報量
        mutual_info = calculate_mutual_information(u, y)
        analysis["mutual_information"] = mutual_info
        
        return SimulationResponse(
            time=t.tolist(),
            stimulus=u.tolist(),
            response=y.tolist(),
            internal_states=x_states.tolist(),
            analysis=analysis
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/compare")
async def compare_materials(requests: List[SimulationRequest]):
    """
    複数素材の比較シミュレーション
    """
    if len(requests) > 5:
        raise HTTPException(status_code=400, detail="最大5素材まで比較可能")
    
    results = []
    for req in requests:
        result = await simulate(req)
        results.append({
            "material_type": req.material_type,
            "data": result
        })
    
    return {"comparisons": results}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
