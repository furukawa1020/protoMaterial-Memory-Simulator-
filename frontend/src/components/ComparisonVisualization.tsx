/**
 * 比較結果可視化コンポーネント
 */
'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { SimulationResponse } from '@/lib/types';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface ComparisonVisualizationProps {
  data1: SimulationResponse;
  data2: SimulationResponse;
  label1: string;
  label2: string;
}

export default function ComparisonVisualization({
  data1,
  data2,
  label1,
  label2,
}: ComparisonVisualizationProps) {
  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-white mb-4">📊 応答比較</h3>
        
        <Plot
          data={[
            {
              x: data1.time,
              y: data1.response,
              type: 'scatter',
              mode: 'lines',
              name: label1,
              line: { color: '#3b82f6', width: 2 },
            },
            {
              x: data2.time,
              y: data2.response,
              type: 'scatter',
              mode: 'lines',
              name: label2,
              line: { color: '#10b981', width: 2 },
            },
          ]}
          layout={{
            title: '時間応答の比較',
            xaxis: { title: '時間 [s]', gridcolor: '#374151' },
            yaxis: { title: '応答', gridcolor: '#374151' },
            paper_bgcolor: 'rgba(17, 24, 39, 0.7)',
            plot_bgcolor: 'rgba(17, 24, 39, 0.5)',
            font: { color: '#d1d5db' },
            margin: { t: 50, b: 50, l: 60, r: 20 },
            height: 300,
          }}
          config={{ responsive: true }}
          style={{ width: '100%' }}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 条件A分析 */}
        <div className="glass-card p-4 border-l-4 border-blue-400">
          <h4 className="text-lg font-semibold text-blue-300 mb-3">{label1}</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">記憶時定数:</span>
              <span className="text-white font-mono">
                {data1.analysis.memory_tau.toFixed(3)}s
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">相互情報量:</span>
              <span className="text-white font-mono">
                {data1.analysis.mutual_information.toFixed(3)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">ピーク応答:</span>
              <span className="text-white font-mono">
                {data1.analysis.peak_response.toFixed(3)}
              </span>
            </div>
            {data1.analysis.lyapunov_exponent !== undefined && (
              <div className="flex justify-between">
                <span className="text-gray-400">Lyapunov指数:</span>
                <span className="text-white font-mono">
                  {data1.analysis.lyapunov_exponent.toFixed(4)}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* 条件B分析 */}
        <div className="glass-card p-4 border-l-4 border-green-400">
          <h4 className="text-lg font-semibold text-green-300 mb-3">{label2}</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">記憶時定数:</span>
              <span className="text-white font-mono">
                {data2.analysis.memory_tau.toFixed(3)}s
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">相互情報量:</span>
              <span className="text-white font-mono">
                {data2.analysis.mutual_information.toFixed(3)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">ピーク応答:</span>
              <span className="text-white font-mono">
                {data2.analysis.peak_response.toFixed(3)}
              </span>
            </div>
            {data2.analysis.lyapunov_exponent !== undefined && (
              <div className="flex justify-between">
                <span className="text-gray-400">Lyapunov指数:</span>
                <span className="text-white font-mono">
                  {data2.analysis.lyapunov_exponent.toFixed(4)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* 差分分析 */}
      <div className="glass-card p-4 bg-purple-900 bg-opacity-20 border border-purple-400">
        <h4 className="text-lg font-semibold text-purple-300 mb-3">📐 差分分析</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-gray-400 mb-1">記憶時定数の差</div>
            <div className="text-2xl font-bold text-white">
              {Math.abs(data1.analysis.memory_tau - data2.analysis.memory_tau).toFixed(3)}s
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {data1.analysis.memory_tau > data2.analysis.memory_tau 
                ? `${label1}の方が長い` 
                : `${label2}の方が長い`}
            </div>
          </div>
          
          <div>
            <div className="text-gray-400 mb-1">相互情報量の差</div>
            <div className="text-2xl font-bold text-white">
              {Math.abs(data1.analysis.mutual_information - data2.analysis.mutual_information).toFixed(3)}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {data1.analysis.mutual_information > data2.analysis.mutual_information
                ? `${label1}の方が高い`
                : `${label2}の方が高い`}
            </div>
          </div>
          
          <div>
            <div className="text-gray-400 mb-1">ピーク応答の比</div>
            <div className="text-2xl font-bold text-white">
              {(data1.analysis.peak_response / data2.analysis.peak_response).toFixed(2)}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {data1.analysis.peak_response > data2.analysis.peak_response
                ? `${label1}の方が強い`
                : `${label2}の方が強い`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
