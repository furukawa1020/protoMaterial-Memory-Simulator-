'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { SimulationResponse } from '@/lib/types';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface VisualizationProps {
  data: SimulationResponse | null;
  materialName: string;
}

export default function Visualization({ data, materialName }: VisualizationProps) {
  if (!data) {
    return (
      <div className="glass-card p-8 text-center">
        <div className="text-6xl mb-4">🌿</div>
        <p className="text-white text-lg">
          シミュレーションを実行すると、結果がここに表示されます
        </p>
      </div>
    );
  }

  const { time, stimulus, response, analysis } = data;

  // メインプロット（刺激と応答）
  const mainPlot = {
    data: [
      {
        x: time,
        y: stimulus,
        name: '刺激 (u)',
        type: 'scatter',
        mode: 'lines',
        line: { color: '#ff6b6b', width: 2 },
      },
      {
        x: time,
        y: response,
        name: '応答 (y)',
        type: 'scatter',
        mode: 'lines',
        line: { color: '#4ecdc4', width: 3 },
      },
    ],
    layout: {
      title: `${materialName} の時間応答`,
      xaxis: { title: '時間 (秒)', gridcolor: '#444' },
      yaxis: { title: '振幅', gridcolor: '#444' },
      paper_bgcolor: 'rgba(0,0,0,0.3)',
      plot_bgcolor: 'rgba(0,0,0,0.2)',
      font: { color: '#fff' },
      legend: { x: 0.7, y: 1 },
    },
  };

  // 相関プロファイル
  const correlationPlot = {
    data: [
      {
        x: Array.from({ length: analysis.autocorrelation.length }, (_, i) => i),
        y: analysis.autocorrelation,
        name: '自己相関',
        type: 'scatter',
        mode: 'lines',
        line: { color: '#feca57', width: 3 },
        fill: 'tozeroy',
      },
    ],
    layout: {
      title: '記憶保持プロファイル（自己相関）',
      xaxis: { title: 'ラグ', gridcolor: '#444' },
      yaxis: { title: '相関係数', gridcolor: '#444' },
      paper_bgcolor: 'rgba(0,0,0,0.3)',
      plot_bgcolor: 'rgba(0,0,0,0.2)',
      font: { color: '#fff' },
    },
  };

  return (
    <div className="space-y-6">
      {/* メイングラフ */}
      <div className="glass-card p-4">
        <Plot
          data={mainPlot.data as any}
          layout={mainPlot.layout as any}
          config={{ responsive: true }}
          style={{ width: '100%', height: '400px' }}
        />
      </div>

      {/* 相関グラフ */}
      <div className="glass-card p-4">
        <Plot
          data={correlationPlot.data as any}
          layout={correlationPlot.layout as any}
          config={{ responsive: true }}
          style={{ width: '100%', height: '300px' }}
        />
      </div>

      {/* 解析結果サマリー */}
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-white mb-4">📊 解析結果</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white bg-opacity-10 p-4 rounded-lg">
            <div className="text-gray-300 text-sm">記憶時定数</div>
            <div className="text-white text-2xl font-bold">
              {analysis.memory_tau.toFixed(2)}s
            </div>
          </div>
          <div className="bg-white bg-opacity-10 p-4 rounded-lg">
            <div className="text-gray-300 text-sm">ピーク応答</div>
            <div className="text-white text-2xl font-bold">
              {analysis.peak_response.toFixed(3)}
            </div>
          </div>
          <div className="bg-white bg-opacity-10 p-4 rounded-lg">
            <div className="text-gray-300 text-sm">エントロピー</div>
            <div className="text-white text-2xl font-bold">
              {analysis.entropy.toFixed(3)}
            </div>
          </div>
          <div className="bg-white bg-opacity-10 p-4 rounded-lg">
            <div className="text-gray-300 text-sm">相互情報量</div>
            <div className="text-white text-2xl font-bold">
              {analysis.mutual_information.toFixed(3)} bits
            </div>
          </div>
          <div className="bg-white bg-opacity-10 p-4 rounded-lg">
            <div className="text-gray-300 text-sm">減衰率</div>
            <div className="text-white text-2xl font-bold">
              {analysis.decay_rate.toFixed(3)}
            </div>
          </div>
          <div className="bg-white bg-opacity-10 p-4 rounded-lg">
            <div className="text-gray-300 text-sm">ピーク時刻</div>
            <div className="text-white text-2xl font-bold">
              {analysis.peak_time.toFixed(2)}s
            </div>
          </div>
        </div>

        {/* 解釈 */}
        <div className="mt-6 p-4 bg-indigo-900 bg-opacity-30 rounded-lg">
          <h4 className="text-white font-bold mb-2">💡 解釈</h4>
          <p className="text-gray-200 text-sm">
            {analysis.memory_tau > 5
              ? '⏰ この素材は長期記憶を保持します（粘性的）'
              : '⚡ この素材は短期記憶型です（高速応答）'}
          </p>
          <p className="text-gray-200 text-sm mt-1">
            {analysis.mutual_information > 1
              ? '📡 入力-出力の情報伝達効率が高いです'
              : '🔇 情報伝達にノイズや遅延が多く含まれます'}
          </p>
        </div>
      </div>
    </div>
  );
}
