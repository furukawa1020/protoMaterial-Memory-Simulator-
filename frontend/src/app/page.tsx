'use client';

import React, { useState } from 'react';
import ControlPanel from '@/components/ControlPanel';
import Visualization from '@/components/Visualization';
import AcademicAnalysis from '@/components/AcademicAnalysis';
import ExportPanel from '@/components/ExportPanel';
import ComparisonPanel from '@/components/ComparisonPanel';
import ComparisonVisualization from '@/components/ComparisonVisualization';
import { runSimulation } from '@/lib/api';
import { SimulationResponse, MaterialType, StimulusType } from '@/lib/types';
import { playMaterialSound, initAudio } from '@/lib/audio';

const materialNames: Record<MaterialType, string> = {
  wood: '木材',
  metal: '金属',
  cloth: '布',
  soil: '土',
  water: '水',
};

export default function Home() {
  const [mode, setMode] = useState<'single' | 'compare'>('single');
  const [result, setResult] = useState<SimulationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState<string>('');
  const [currentMaterialType, setCurrentMaterialType] = useState<MaterialType>('wood');
  const [currentStimulusType, setCurrentStimulusType] = useState<StimulusType>('heat');
  const [error, setError] = useState<string | null>(null);
  
  // 比較モード用
  const [comparisonResult, setComparisonResult] = useState<{
    simulation1: SimulationResponse;
    simulation2: SimulationResponse;
  } | null>(null);

  const handleSimulate = async (params: {
    material: MaterialType;
    stimulus: StimulusType;
    duration: number;
    intensity: number;
    frequency: number;
  }) => {
    setIsLoading(true);
    setError(null);
    
    // 音響初期化（初回のみ）
    try {
      await initAudio();
    } catch (e) {
      console.warn('Audio init failed:', e);
    }
    
    try {
      const response = await runSimulation({
        material_type: params.material,
        stimulus_type: params.stimulus,
        duration: params.duration,
        intensity: params.intensity,
        frequency: params.frequency,
        dt: 0.01,
      });
      
      setResult(response);
      setCurrentMaterial(materialNames[params.material]);
      setCurrentMaterialType(params.material);
      setCurrentStimulusType(params.stimulus);
      
      // シミュレーション成功時に音を鳴らす
      try {
        await playMaterialSound(params.material, response, 2);
      } catch (e) {
        console.warn('Audio playback failed:', e);
      }
    } catch (err) {
      setError('シミュレーションに失敗しました。バックエンドが起動しているか確認してください。');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            🌿 Material Memory Simulator
          </h1>
          <p className="text-xl text-gray-200">
            自然素材の非線形遅延特性を体験・分析する
          </p>
          <p className="text-sm text-gray-300 mt-2">
            素材が刺激に対して「記憶」し「余韻」を残す様子を情報理論で可視化
          </p>
          
          {/* モード切替 */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => setMode('single')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                mode === 'single'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              🎯 単一シミュレーション
            </button>
            <button
              onClick={() => setMode('compare')}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                mode === 'compare'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              🔀 比較モード
            </button>
          </div>
        </header>

        {/* エラー表示 */}
        {error && (
          <div className="glass-card p-4 mb-6 bg-red-500 bg-opacity-20 border-red-400">
            <p className="text-white">⚠️ {error}</p>
          </div>
        )}

        {/* メインコンテンツ */}
        {mode === 'single' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 左サイド：コントロールパネル */}
            <div className="lg:col-span-1">
              <ControlPanel onSimulate={handleSimulate} isLoading={isLoading} />
            </div>

            {/* 右サイド:可視化エリア */}
            <div className="lg:col-span-2 space-y-6">
              <Visualization data={result} materialName={currentMaterial} />
              {result && <AcademicAnalysis data={result} materialName={currentMaterial} />}
              {result && (
                <ExportPanel
                  data={result}
                  materialType={currentMaterialType}
                  stimulusType={currentStimulusType}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <ComparisonPanel onCompare={setComparisonResult} />
            {comparisonResult && (
              <ComparisonVisualization
                data1={comparisonResult.simulation1}
                data2={comparisonResult.simulation2}
                label1="条件A"
                label2="条件B"
              />
            )}
          </div>
        )}

        {/* フッター */}
        <footer className="mt-12 text-center text-gray-300 text-sm">
          <p>
            💡 このシミュレーションは、素材が持つ「時間的な記憶」を非線形遅延系としてモデル化しています
          </p>
          <p className="mt-2">
            🔬 研究目的：情報理論×自然素材の体験的探究
          </p>
        </footer>
      </div>
    </div>
  );
}
