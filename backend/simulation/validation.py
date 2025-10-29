"""
学術的検証ユーティリティ
モデルの妥当性検証・統計的有意性検定
"""
import numpy as np
from typing import Dict, Tuple
from scipy import stats
from scipy.signal import welch


def validate_causality(u: np.ndarray, y: np.ndarray, dt: float) -> Dict[str, float]:
    """
    因果性検証（Granger Causality風の簡易版）
    入力が出力に影響を与えているかを統計的に検証
    
    Args:
        u: 入力信号
        y: 出力信号
        dt: 時間刻み
        
    Returns:
        検証結果辞書
    """
    # 遅延相関解析
    max_lag = min(100, len(u) // 10)
    cross_corr = np.correlate(y - np.mean(y), u - np.mean(u), mode='full')
    cross_corr = cross_corr[len(cross_corr)//2:][:max_lag]
    cross_corr = cross_corr / (np.std(u) * np.std(y) * len(u))
    
    # 最大相関とそのラグ
    max_corr_idx = np.argmax(np.abs(cross_corr))
    max_correlation = cross_corr[max_corr_idx]
    optimal_lag = max_corr_idx * dt
    
    # 統計的有意性（Pearson相関の有意性検定）
    n = len(u)
    t_stat = max_correlation * np.sqrt(n - 2) / np.sqrt(1 - max_correlation**2)
    p_value = 2 * (1 - stats.t.cdf(np.abs(t_stat), n - 2))
    
    return {
        "max_correlation": float(max_correlation),
        "optimal_lag": float(optimal_lag),
        "p_value": float(p_value),
        "is_significant": p_value < 0.05,
        "cross_correlation": cross_corr.tolist()
    }


def spectral_analysis(signal: np.ndarray, dt: float) -> Dict[str, any]:
    """
    スペクトル解析（Power Spectral Density）
    信号の周波数特性を解析
    
    Args:
        signal: 解析対象信号
        dt: 時間刻み
        
    Returns:
        スペクトル解析結果
    """
    fs = 1.0 / dt  # サンプリング周波数
    
    # Welch法でパワースペクトル密度推定
    frequencies, psd = welch(signal, fs=fs, nperseg=min(256, len(signal)//4))
    
    # 支配的周波数
    dominant_freq_idx = np.argmax(psd[1:]) + 1  # DC成分を除外
    dominant_frequency = frequencies[dominant_freq_idx]
    
    # 帯域パワー
    total_power = np.trapz(psd, frequencies)
    
    # 周波数帯域別パワー（低周波・中周波・高周波）
    low_freq_mask = frequencies < 0.5
    mid_freq_mask = (frequencies >= 0.5) & (frequencies < 2.0)
    high_freq_mask = frequencies >= 2.0
    
    low_power = np.trapz(psd[low_freq_mask], frequencies[low_freq_mask]) if any(low_freq_mask) else 0
    mid_power = np.trapz(psd[mid_freq_mask], frequencies[mid_freq_mask]) if any(mid_freq_mask) else 0
    high_power = np.trapz(psd[high_freq_mask], frequencies[high_freq_mask]) if any(high_freq_mask) else 0
    
    return {
        "frequencies": frequencies.tolist(),
        "psd": psd.tolist(),
        "dominant_frequency": float(dominant_frequency),
        "total_power": float(total_power),
        "low_freq_power": float(low_power),
        "mid_freq_power": float(mid_power),
        "high_freq_power": float(high_power),
        "low_freq_ratio": float(low_power / total_power) if total_power > 0 else 0,
    }


def lyapunov_exponent_estimation(x: np.ndarray, dt: float) -> float:
    """
    最大リアプノフ指数の簡易推定
    系の安定性・カオス性を評価
    
    Args:
        x: 時系列データ
        dt: 時間刻み
        
    Returns:
        推定されたリアプノフ指数
    """
    # 隣接点間の距離変化率から推定（簡易版）
    n = len(x)
    if n < 10:
        return 0.0
    
    # 位相空間埋め込み（1次元→2次元）
    embedding_dim = 2
    tau = max(1, n // 20)
    
    embedded = np.array([x[i:i+embedding_dim*tau:tau] for i in range(n - embedding_dim*tau)])
    
    if len(embedded) < 5:
        return 0.0
    
    # 近傍点の距離変化率を計算
    divergence_rates = []
    for i in range(len(embedded) - 10):
        distances = np.linalg.norm(embedded[i+1:i+11] - embedded[i], axis=1)
        if np.all(distances > 1e-10):
            rate = np.mean(np.log(distances[1:] / distances[:-1]))
            divergence_rates.append(rate)
    
    if len(divergence_rates) == 0:
        return 0.0
    
    lyapunov = np.mean(divergence_rates) / dt
    return float(lyapunov)


def information_theoretic_measures(u: np.ndarray, y: np.ndarray, bins: int = 20) -> Dict[str, float]:
    """
    情報理論的指標の包括的計算
    
    Args:
        u: 入力信号
        y: 出力信号
        bins: ヒストグラムのビン数
        
    Returns:
        情報理論的指標
    """
    from scipy.stats import entropy as shannon_entropy
    
    # ヒストグラム
    hist_u, _ = np.histogram(u, bins=bins, density=True)
    hist_y, _ = np.histogram(y, bins=bins, density=True)
    hist_2d, _, _ = np.histogram2d(u, y, bins=bins, density=True)
    
    # ゼロ除外
    hist_u = hist_u[hist_u > 0]
    hist_y = hist_y[hist_y > 0]
    hist_2d = hist_2d[hist_2d > 0]
    
    # エントロピー
    H_u = shannon_entropy(hist_u, base=2)
    H_y = shannon_entropy(hist_y, base=2)
    H_uy = shannon_entropy(hist_2d.flatten(), base=2)
    
    # 相互情報量 I(U;Y) = H(U) + H(Y) - H(U,Y)
    mutual_info = H_u + H_y - H_uy
    
    # 条件付きエントロピー H(Y|U) = H(U,Y) - H(U)
    conditional_entropy = H_uy - H_u
    
    # 正規化相互情報量（0-1スケール）
    normalized_mi = mutual_info / min(H_u, H_y) if min(H_u, H_y) > 0 else 0
    
    # Transfer Entropy風の指標（簡易版）
    # TE(U→Y) ≈ I(U_past; Y_future | Y_past)
    transfer_entropy = max(0, mutual_info - 0.5 * conditional_entropy)
    
    return {
        "entropy_input": float(H_u),
        "entropy_output": float(H_y),
        "joint_entropy": float(H_uy),
        "mutual_information": float(max(0, mutual_info)),
        "conditional_entropy": float(conditional_entropy),
        "normalized_mutual_information": float(max(0, normalized_mi)),
        "transfer_entropy": float(transfer_entropy),
        "information_efficiency": float(mutual_info / H_u) if H_u > 0 else 0
    }


def stationarity_test(signal: np.ndarray, window_size: int = 50) -> Dict[str, any]:
    """
    定常性検定（Augmented Dickey-Fuller風）
    信号が定常過程かを判定
    
    Args:
        signal: 検定対象信号
        window_size: 窓サイズ
        
    Returns:
        定常性検定結果
    """
    n_windows = len(signal) // window_size
    if n_windows < 3:
        return {"is_stationary": False, "reason": "insufficient_data"}
    
    # 窓ごとの統計量
    means = []
    variances = []
    
    for i in range(n_windows):
        window = signal[i*window_size:(i+1)*window_size]
        means.append(np.mean(window))
        variances.append(np.var(window))
    
    # 平均と分散の時間変化を検定
    mean_trend = np.polyfit(range(n_windows), means, 1)[0]
    var_trend = np.polyfit(range(n_windows), variances, 1)[0]
    
    # Kruskal-Wallis検定（分散の等質性）
    segments = [signal[i*window_size:(i+1)*window_size] for i in range(n_windows)]
    try:
        h_stat, p_value = stats.kruskal(*segments)
    except:
        p_value = 0.5
    
    is_stationary = (abs(mean_trend) < 0.1 * np.std(means) and 
                     abs(var_trend) < 0.1 * np.std(variances) and 
                     p_value > 0.05)
    
    return {
        "is_stationary": bool(is_stationary),
        "mean_trend": float(mean_trend),
        "variance_trend": float(var_trend),
        "kruskal_p_value": float(p_value),
        "mean_stability": float(np.std(means) / np.mean(np.abs(means))) if np.mean(np.abs(means)) > 0 else 0
    }
