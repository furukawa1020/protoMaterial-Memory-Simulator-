'use client';

import React from 'react';
import { SimulationResponse } from '@/lib/types';

interface AcademicAnalysisProps {
  data: SimulationResponse;
  materialName: string;
}

export default function AcademicAnalysis({ data, materialName }: AcademicAnalysisProps) {
  const { analysis } = data;
  const causality = analysis.causality || {};
  const spectral = analysis.spectral || {};
  const infoTheory = analysis.information_theory || {};
  const stationarity = analysis.stationarity || {};

  return (
    <div className="glass-card p-6 space-y-6">
      <h3 className="text-2xl font-bold text-white mb-4">
        🔬 学術的解析結果
      </h3>

      {/* 因果性解析 */}
      <div className="bg-white bg-opacity-10 p-4 rounded-lg">
        <h4 className="text-lg font-bold text-white mb-3">
          📊 因果性解析（Causality Analysis）
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-gray-300 text-sm">最大相関係数</div>
            <div className="text-white text-xl font-bold">
              r = {causality.max_correlation?.toFixed(4) || 'N/A'}
            </div>
          </div>
          <div>
            <div className="text-gray-300 text-sm">最適ラグ</div>
            <div className="text-white text-xl font-bold">
              {causality.optimal_lag?.toFixed(3) || 'N/A'} s
            </div>
          </div>
          <div>
            <div className="text-gray-300 text-sm">P値</div>
            <div className={`text-xl font-bold ${
              causality.p_value < 0.05 ? 'text-green-400' : 'text-yellow-400'
            }`}>
              p = {causality.p_value?.toFixed(6) || 'N/A'}
            </div>
          </div>
          <div>
            <div className="text-gray-300 text-sm">統計的有意性</div>
            <div className={`text-xl font-bold ${
              causality.is_significant ? 'text-green-400' : 'text-red-400'
            }`}>
              {causality.is_significant ? '✓ 有意' : '✗ 非有意'}
            </div>
          </div>
        </div>
        <p className="text-gray-300 text-sm mt-3">
          {causality.is_significant
            ? '✅ 刺激と応答の間に統計的に有意な因果関係が検出されました（p < 0.05）'
            : '⚠️ 統計的に有意な因果関係は検出されませんでした'}
        </p>
      </div>

      {/* 情報理論的指標 */}
      <div className="bg-white bg-opacity-10 p-4 rounded-lg">
        <h4 className="text-lg font-bold text-white mb-3">
          📡 情報理論的指標（Information Theory）
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <div className="text-gray-300 text-sm">相互情報量</div>
            <div className="text-white text-xl font-bold">
              {infoTheory.mutual_information?.toFixed(4) || 'N/A'} bits
            </div>
          </div>
          <div>
            <div className="text-gray-300 text-sm">転送エントロピー</div>
            <div className="text-white text-xl font-bold">
              {infoTheory.transfer_entropy?.toFixed(4) || 'N/A'} bits
            </div>
          </div>
          <div>
            <div className="text-gray-300 text-sm">情報効率</div>
            <div className="text-white text-xl font-bold">
              {((infoTheory.information_efficiency || 0) * 100).toFixed(1)}%
            </div>
          </div>
          <div>
            <div className="text-gray-300 text-sm">入力エントロピー</div>
            <div className="text-white text-xl font-bold">
              {infoTheory.entropy_input?.toFixed(4) || 'N/A'} bits
            </div>
          </div>
          <div>
            <div className="text-gray-300 text-sm">出力エントロピー</div>
            <div className="text-white text-xl font-bold">
              {infoTheory.entropy_output?.toFixed(4) || 'N/A'} bits
            </div>
          </div>
          <div>
            <div className="text-gray-300 text-sm">正規化MI</div>
            <div className="text-white text-xl font-bold">
              {infoTheory.normalized_mutual_information?.toFixed(4) || 'N/A'}
            </div>
          </div>
        </div>
      </div>

      {/* スペクトル解析 */}
      <div className="bg-white bg-opacity-10 p-4 rounded-lg">
        <h4 className="text-lg font-bold text-white mb-3">
          🌊 スペクトル解析（Spectral Analysis）
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-gray-300 text-sm">支配的周波数</div>
            <div className="text-white text-xl font-bold">
              {spectral.dominant_frequency?.toFixed(3) || 'N/A'} Hz
            </div>
          </div>
          <div>
            <div className="text-gray-300 text-sm">総パワー</div>
            <div className="text-white text-xl font-bold">
              {spectral.total_power?.toFixed(4) || 'N/A'}
            </div>
          </div>
          <div>
            <div className="text-gray-300 text-sm">低周波比率</div>
            <div className="text-white text-xl font-bold">
              {((spectral.low_freq_ratio || 0) * 100).toFixed(1)}%
            </div>
          </div>
          <div>
            <div className="text-gray-300 text-sm">中周波パワー</div>
            <div className="text-white text-xl font-bold">
              {spectral.mid_freq_power?.toFixed(4) || 'N/A'}
            </div>
          </div>
        </div>
      </div>

      {/* 系の安定性 */}
      <div className="bg-white bg-opacity-10 p-4 rounded-lg">
        <h4 className="text-lg font-bold text-white mb-3">
          ⚖️ 系の安定性（System Stability）
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-gray-300 text-sm">リアプノフ指数</div>
            <div className={`text-xl font-bold ${
              analysis.lyapunov_exponent < 0 ? 'text-green-400' :
              analysis.lyapunov_exponent > 0.1 ? 'text-red-400' : 'text-yellow-400'
            }`}>
              λ = {analysis.lyapunov_exponent?.toFixed(4) || 'N/A'}
            </div>
          </div>
          <div>
            <div className="text-gray-300 text-sm">安定性評価</div>
            <div className={`text-xl font-bold ${
              analysis.system_stability === 'stable' ? 'text-green-400' :
              analysis.system_stability === 'unstable' ? 'text-red-400' : 'text-yellow-400'
            }`}>
              {analysis.system_stability === 'stable' ? '✓ 安定' :
               analysis.system_stability === 'unstable' ? '✗ 不安定' : '△ 準安定'}
            </div>
          </div>
          <div>
            <div className="text-gray-300 text-sm">定常性</div>
            <div className={`text-xl font-bold ${
              stationarity.is_stationary ? 'text-green-400' : 'text-yellow-400'
            }`}>
              {stationarity.is_stationary ? '✓ 定常' : '✗ 非定常'}
            </div>
          </div>
          <div>
            <div className="text-gray-300 text-sm">平均安定度</div>
            <div className="text-white text-xl font-bold">
              {stationarity.mean_stability?.toFixed(4) || 'N/A'}
            </div>
          </div>
        </div>
        <p className="text-gray-300 text-sm mt-3">
          {analysis.system_stability === 'stable'
            ? '✅ システムは動力学的に安定です（負のリアプノフ指数）'
            : analysis.system_stability === 'unstable'
            ? '⚠️ システムはカオス的傾向を示します（正のリアプノフ指数）'
            : '⚠️ システムは準安定状態です'}
        </p>
      </div>

      {/* 論文引用形式の解釈 */}
      <div className="bg-indigo-900 bg-opacity-30 p-4 rounded-lg border border-indigo-500">
        <h4 className="text-lg font-bold text-white mb-2">
          📝 学術的解釈（Academic Interpretation）
        </h4>
        <div className="text-gray-200 text-sm space-y-2">
          <p>
            <strong>{materialName}</strong>は、
            記憶時定数τ = {analysis.memory_tau?.toFixed(3)}秒の
            {analysis.memory_tau > 5 ? '長期記憶型' : '短期記憶型'}
            応答特性を示した。
          </p>
          <p>
            刺激-応答間の相互情報量は{infoTheory.mutual_information?.toFixed(3)} bitsであり、
            情報伝達効率は{((infoTheory.information_efficiency || 0) * 100).toFixed(1)}%であった。
            {(infoTheory.information_efficiency || 0) > 0.7
              ? 'これは高効率な情報チャネルを示唆する。'
              : 'ノイズや非線形性による情報損失が観測された。'}
          </p>
          <p>
            因果性解析により、最大相関係数r = {causality.max_correlation?.toFixed(3)}、
            p = {causality.p_value?.toFixed(4)}が得られ、
            {causality.is_significant
              ? '統計的に有意な因果関係が確認された（p < 0.05）。'
              : '有意な因果関係は検出されなかった。'}
          </p>
          <p>
            リアプノフ指数λ = {analysis.lyapunov_exponent?.toFixed(4)}は、
            系が{analysis.system_stability === 'stable' ? '安定' :
                  analysis.system_stability === 'unstable' ? 'カオス的' : '準安定'}
            であることを示している。
          </p>
        </div>
      </div>
    </div>
  );
}
