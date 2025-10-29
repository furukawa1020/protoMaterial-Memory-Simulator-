"""
素材モデル定義
各素材の非線形応答特性と時定数を定義
"""
from typing import List, Callable
import numpy as np


class MaterialModel:
    """素材の非線形遅延特性モデル"""
    
    def __init__(
        self,
        name: str,
        tau_list: List[float],  # 時定数リスト（複数レイヤの記憶）
        k_list: List[float],    # 各レイヤの結合係数
        w_list: List[float],    # 各レイヤの重み
        nonlinear_func: Callable[[float], float]  # 非線形関数
    ):
        self.name = name
        self.tau_list = np.array(tau_list)
        self.k_list = np.array(k_list)
        self.w_list = np.array(w_list)
        self.nonlinear_func = nonlinear_func
        
    def get_num_layers(self) -> int:
        """レイヤ数を取得"""
        return len(self.tau_list)


# 非線形関数定義
def tanh_nonlinear(k: float = 1.0) -> Callable:
    """飽和型非線形（木材向け）"""
    return lambda u: np.tanh(k * u)


def linear_nonlinear(k: float = 1.0) -> Callable:
    """線形応答（金属向け）"""
    return lambda u: k * u


def sigmoid_nonlinear(k: float = 1.0, threshold: float = 0.5) -> Callable:
    """閾値型非線形（布向け）"""
    return lambda u: 1 / (1 + np.exp(-k * (u - threshold)))


def exp_decay_nonlinear(k: float = 1.0) -> Callable:
    """指数減衰型（土向け）"""
    return lambda u: np.exp(-k * np.abs(u))


def resonance_nonlinear(omega: float = 2.0, k: float = 1.0) -> Callable:
    """共鳴型（水向け）- 時間依存性を考慮"""
    return lambda u: k * u  # 簡易版、後でシミュレーション側で処理


# プリセット素材定義
MATERIAL_PRESETS = {
    "wood": MaterialModel(
        name="木材（Wood）",
        tau_list=[0.5, 2.0, 8.0],  # 短期・中期・長期記憶
        k_list=[1.0, 0.8, 0.3],
        w_list=[0.5, 0.3, 0.2],
        nonlinear_func=tanh_nonlinear(k=1.5)
    ),
    "metal": MaterialModel(
        name="金属（Metal）",
        tau_list=[0.1, 0.5],  # 高速応答、記憶短い
        k_list=[2.0, 1.0],
        w_list=[0.7, 0.3],
        nonlinear_func=linear_nonlinear(k=1.0)
    ),
    "cloth": MaterialModel(
        name="布（Cloth）",
        tau_list=[1.0, 5.0, 15.0],  # 閾値超えたらゆっくり変形
        k_list=[0.5, 1.0, 0.4],
        w_list=[0.4, 0.4, 0.2],
        nonlinear_func=sigmoid_nonlinear(k=3.0, threshold=0.3)
    ),
    "soil": MaterialModel(
        name="土（Soil）",
        tau_list=[3.0, 10.0, 30.0],  # 粘性、回復遅い
        k_list=[0.8, 0.5, 0.2],
        w_list=[0.3, 0.4, 0.3],
        nonlinear_func=exp_decay_nonlinear(k=0.8)
    ),
    "water": MaterialModel(
        name="水（Water）",
        tau_list=[0.2, 1.0, 4.0],  # 共鳴的ゆらぎ
        k_list=[1.5, 1.0, 0.5],
        w_list=[0.5, 0.3, 0.2],
        nonlinear_func=resonance_nonlinear(omega=3.0, k=1.2)
    ),
}


def get_material(material_type: str) -> MaterialModel:
    """素材モデルを取得"""
    if material_type not in MATERIAL_PRESETS:
        raise ValueError(f"Unknown material: {material_type}")
    return MATERIAL_PRESETS[material_type]
