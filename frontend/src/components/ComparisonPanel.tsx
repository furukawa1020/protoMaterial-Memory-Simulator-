/**
 * 比較モードコンポーネント
 * 2つのシミュレーションを並行実行して結果を比較
 */
'use client';

import React, { useState } from 'react';
import { MaterialType, StimulusType, SimulationResponse } from '@/lib/types';
import { compareSimulations } from '@/lib/api';

interface ComparisonResult {
  simulation1: SimulationResponse;
  simulation2: SimulationResponse;
}

interface ComparisonPanelProps {
  onCompare: (result: ComparisonResult) => void;
}

export default function ComparisonPanel({ onCompare }: ComparisonPanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  // シミュレーション1のパラメータ
  const [material1, setMaterial1] = useState<MaterialType>('wood');
  const [stimulus1, setStimulus1] = useState<StimulusType>('heat');
  const [intensity1, setIntensity1] = useState(1.0);
  
  // シミュレーション2のパラメータ
  const [material2, setMaterial2] = useState<MaterialType>('metal');
  const [stimulus2, setStimulus2] = useState<StimulusType>('pressure');
  const [intensity2, setIntensity2] = useState(1.0);
  
  const handleCompare = async () => {
    setIsLoading(true);
    try {
      const results = await compareSimulations([
        {
          material_type: material1,
          stimulus_type: stimulus1,
          duration: 10,
          intensity: intensity1,
          frequency: 1.0,
          dt: 0.01,
        },
        {
          material_type: material2,
          stimulus_type: stimulus2,
          duration: 10,
          intensity: intensity2,
          frequency: 1.0,
          dt: 0.01,
        },
      ]);
      
      onCompare({
        simulation1: results[0],
        simulation2: results[1],
      });
    } catch (err) {
      console.error('Comparison failed:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="glass-card p-6">
      <h2 className="text-2xl font-bold text-white mb-4">🔀 比較モード</h2>
      <p className="text-gray-300 mb-6 text-sm">
        2つの条件を同時にシミュレーションして、素材・刺激の違いによる記憶特性を比較します
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* シミュレーション1 */}
        <div className="border border-blue-400 rounded-lg p-4 bg-blue-900 bg-opacity-20">
          <h3 className="text-lg font-semibold text-blue-300 mb-3">条件A</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-300 mb-1">素材</label>
              <select
                value={material1}
                onChange={(e) => setMaterial1(e.target.value as MaterialType)}
                className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-600"
              >
                <option value="wood">🌳 木材</option>
                <option value="metal">⚙️ 金属</option>
                <option value="cloth">🧵 布</option>
                <option value="soil">🌍 土</option>
                <option value="water">💧 水</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-300 mb-1">刺激</label>
              <select
                value={stimulus1}
                onChange={(e) => setStimulus1(e.target.value as StimulusType)}
                className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-600"
              >
                <option value="heat">🔥 熱</option>
                <option value="pressure">👊 圧力</option>
                <option value="sound">🔊 音</option>
                <option value="light">💡 光</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                強度: {intensity1.toFixed(2)}
              </label>
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={intensity1}
                onChange={(e) => setIntensity1(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>
        
        {/* シミュレーション2 */}
        <div className="border border-green-400 rounded-lg p-4 bg-green-900 bg-opacity-20">
          <h3 className="text-lg font-semibold text-green-300 mb-3">条件B</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-300 mb-1">素材</label>
              <select
                value={material2}
                onChange={(e) => setMaterial2(e.target.value as MaterialType)}
                className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-600"
              >
                <option value="wood">🌳 木材</option>
                <option value="metal">⚙️ 金属</option>
                <option value="cloth">🧵 布</option>
                <option value="soil">🌍 土</option>
                <option value="water">💧 水</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-300 mb-1">刺激</label>
              <select
                value={stimulus2}
                onChange={(e) => setStimulus2(e.target.value as StimulusType)}
                className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-600"
              >
                <option value="heat">🔥 熱</option>
                <option value="pressure">👊 圧力</option>
                <option value="sound">🔊 音</option>
                <option value="light">💡 光</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                強度: {intensity2.toFixed(2)}
              </label>
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={intensity2}
                onChange={(e) => setIntensity2(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
      
      <button
        onClick={handleCompare}
        disabled={isLoading}
        className="w-full btn-primary py-3 text-lg font-semibold"
      >
        {isLoading ? '⏳ 比較実行中...' : '▶️ 比較シミュレーション実行'}
      </button>
    </div>
  );
}
