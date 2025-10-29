"""
シミュレーションエンジン
非線形遅延系の離散時間シミュレーション
"""
import numpy as np
from typing import Tuple
from ..models.material import MaterialModel


class DelaySimulator:
    """非線形遅延系シミュレータ"""
    
    def __init__(self, material: MaterialModel, dt: float = 0.01):
        self.material = material
        self.dt = dt
        self.num_layers = material.get_num_layers()
        
    def simulate(self, t: np.ndarray, u: np.ndarray) -> Tuple[np.ndarray, np.ndarray]:
        """
        シミュレーション実行
        
        dx_i/dt = -1/τ_i * x_i(t) + k_i * f(u(t))
        y(t) = Σ w_i * x_i(t)
        
        Args:
            t: 時間配列
            u: 入力刺激配列
            
        Returns:
            (y, x_states): 出力応答と内部状態
        """
        n_steps = len(t)
        
        # 内部状態初期化（各レイヤ）
        x = np.zeros((self.num_layers, n_steps))
        y = np.zeros(n_steps)
        
        # オイラー法で離散化
        for i in range(1, n_steps):
            # 非線形入力変換
            f_u = self.material.nonlinear_func(u[i-1])
            
            # 各レイヤの状態更新
            for layer in range(self.num_layers):
                tau = self.material.tau_list[layer]
                k = self.material.k_list[layer]
                
                dx = (-x[layer, i-1] / tau + k * f_u) * self.dt
                x[layer, i] = x[layer, i-1] + dx
            
            # 出力計算（重み付き和）
            y[i] = np.sum(self.material.w_list * x[:, i])
        
        return y, x


def analyze_memory(t: np.ndarray, y: np.ndarray, max_lag: int = 100) -> dict:
    """
    記憶保持解析（自己相関）
    
    Args:
        t: 時間配列
        y: 応答信号
        max_lag: 最大ラグ
        
    Returns:
        解析結果辞書
    """
    from scipy.signal import correlate
    from scipy.stats import entropy
    
    # 自己相関
    autocorr = correlate(y, y, mode='full')
    autocorr = autocorr[len(autocorr)//2:]  # 正のラグのみ
    autocorr = autocorr[:max_lag] / autocorr[0]  # 正規化
    
    # メモリ時定数（相関が1/eになる時間）
    memory_threshold = 1 / np.e
    try:
        memory_tau_idx = np.where(autocorr < memory_threshold)[0][0]
        memory_tau = t[min(memory_tau_idx, len(t)-1)]
    except IndexError:
        memory_tau = t[-1]  # 全区間で相関が高い
    
    # エントロピー（状態の情報量）
    hist, _ = np.histogram(y, bins=20, density=True)
    hist = hist[hist > 0]  # ゼロ除外
    signal_entropy = entropy(hist)
    
    # ピーク応答
    peak_response = np.max(np.abs(y))
    peak_time = t[np.argmax(np.abs(y))]
    
    return {
        "autocorrelation": autocorr.tolist(),
        "memory_tau": float(memory_tau),
        "entropy": float(signal_entropy),
        "peak_response": float(peak_response),
        "peak_time": float(peak_time),
        "decay_rate": float(-np.log(autocorr[min(10, len(autocorr)-1)]) / (t[min(10, len(t)-1)] - t[0]))
    }


def calculate_mutual_information(u: np.ndarray, y: np.ndarray, bins: int = 20) -> float:
    """
    相互情報量 I(u; y) を計算
    
    Args:
        u: 入力信号
        y: 出力信号
        bins: ビン数
        
    Returns:
        相互情報量（bits）
    """
    from scipy.stats import entropy
    
    # 2次元ヒストグラム
    hist_2d, _, _ = np.histogram2d(u, y, bins=bins, density=True)
    hist_u, _ = np.histogram(u, bins=bins, density=True)
    hist_y, _ = np.histogram(y, bins=bins, density=True)
    
    # ゼロ除外
    hist_2d = hist_2d[hist_2d > 0]
    hist_u = hist_u[hist_u > 0]
    hist_y = hist_y[hist_y > 0]
    
    # H(u), H(y), H(u,y)
    H_u = entropy(hist_u)
    H_y = entropy(hist_y)
    H_uy = entropy(hist_2d.flatten())
    
    # I(u;y) = H(u) + H(y) - H(u,y)
    mutual_info = H_u + H_y - H_uy
    
    return float(max(0, mutual_info))  # 負にならないように
