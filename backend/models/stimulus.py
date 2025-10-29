"""
刺激入力生成
"""
import numpy as np
from typing import Literal


StimulusType = Literal["heat", "pressure", "sound", "light", "pulse", "sine", "noise"]


def generate_stimulus(
    stimulus_type: StimulusType,
    duration: float,
    intensity: float,
    frequency: float = 1.0,
    dt: float = 0.01
) -> tuple[np.ndarray, np.ndarray]:
    """
    刺激信号を生成
    
    Args:
        stimulus_type: 刺激タイプ
        duration: 持続時間（秒）
        intensity: 強度
        frequency: 周波数（Hz）
        dt: 時間刻み
        
    Returns:
        (time_array, stimulus_array)
    """
    t = np.arange(0, duration, dt)
    
    if stimulus_type == "pulse":
        # パルス刺激（矩形波）
        u = np.zeros_like(t)
        pulse_width = min(0.1 * duration, 1.0)
        u[t < pulse_width] = intensity
        
    elif stimulus_type == "sine":
        # 正弦波刺激
        u = intensity * np.sin(2 * np.pi * frequency * t)
        
    elif stimulus_type == "heat":
        # 熱刺激（ステップ→減衰）
        u = intensity * (1 - np.exp(-5 * t / duration))
        
    elif stimulus_type == "pressure":
        # 圧力刺激（ガウシアンパルス）
        center = duration / 4
        width = duration / 10
        u = intensity * np.exp(-((t - center) ** 2) / (2 * width ** 2))
        
    elif stimulus_type == "sound":
        # 音響刺激（減衰正弦波）
        envelope = np.exp(-3 * t / duration)
        u = intensity * envelope * np.sin(2 * np.pi * frequency * t)
        
    elif stimulus_type == "light":
        # 光刺激（複数フラッシュ）
        u = np.zeros_like(t)
        flash_times = [duration * 0.1, duration * 0.3, duration * 0.6]
        for flash_t in flash_times:
            u += intensity * np.exp(-((t - flash_t) ** 2) / 0.01)
            
    elif stimulus_type == "noise":
        # ノイズ刺激
        u = intensity * np.random.randn(len(t))
        
    else:
        raise ValueError(f"Unknown stimulus type: {stimulus_type}")
    
    return t, u
